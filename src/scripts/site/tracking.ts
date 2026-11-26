/**
 * Medição: Google Analytics 4 + Google Ads com Consent Mode v2.
 *
 * - Sem IDs em src/data/content.ts (brand.ga4Id / brand.adsId) → nada do Google é carregado.
 * - Com IDs: tudo começa "negado" e o gtag.js só é baixado depois que a página terminou de carregar.
 *   O aviso de cookies grava a escolha da pessoa (aceitar/recusar) e atualiza o consentimento.
 * - Eventos (só para o GA4): whatsapp_click, phone_click, email_click, form_submit_whatsapp,
 *   form_submit_email, com os parâmetros service, page e position.
 * - Conversões do Ads (brand.adsConversions): saem só depois que a pessoa aceita os cookies.
 * - O vinculador de conversões do Google (cookies _gcl_*, com o gclid do anúncio) vem com o
 *   config do Ads e só grava cookies com ad_storage aceito; com recusa, ads_data_redaction
 *   tira os identificadores de clique dos envios.
 * - Sem remarketing: personalização de anúncios desligada (ad_personalization sempre negado e
 *   allow_ad_personalization_signals false), mesmo para quem aceita.
 * - Origem da visita (gclid / utm_*) fica guardada na sessão do navegador e é anexada
 *   ao fim da mensagem do WhatsApp, para saber quais contatos vieram dos anúncios.
 */
import { brand } from "../../data/content";

type Params = Record<string, string>;
type Choice = "granted" | "denied";
type ConversionKey = keyof typeof brand.adsConversions;

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

const tagIds = [brand.ga4Id, brand.adsId].filter(Boolean);
export const trackingEnabled = tagIds.length > 0;

const CONSENT_KEY = "sp_consent";
const ORIGIN_KEY = "sp_origem";

/* ---------- Origem da visita ---------- */

type Origin = { clickId?: string; source?: string; medium?: string; campaign?: string };

const clean = (v: string | null) => {
  const out = v?.replace(/[^\p{L}\p{N} _\-.:|/+()]/gu, "").trim().slice(0, 80);
  return out || undefined;
};

function readOrigin(): Origin | null {
  try {
    const q = new URLSearchParams(location.search);
    const fresh: Origin = {
      clickId: clean(q.get("gclid") || q.get("gbraid") || q.get("wbraid")),
      source: clean(q.get("utm_source")),
      medium: clean(q.get("utm_medium")),
      campaign: clean(q.get("utm_campaign")),
    };
    if (fresh.clickId || fresh.source || fresh.campaign) {
      sessionStorage.setItem(ORIGIN_KEY, JSON.stringify(fresh));
      return fresh;
    }
    const saved = sessionStorage.getItem(ORIGIN_KEY);
    return saved ? (JSON.parse(saved) as Origin) : null;
  } catch {
    return null;
  }
}

const origin = readOrigin();

/** "(origem: Google Ads – campanha X)", ou "" quando a visita não veio de campanha. */
export function originNote(): string {
  if (!origin) return "";
  const paidGoogle = /^google$/i.test(origin.source ?? "") && /^(cpc|ppc|paid|paid_search|sem)$/i.test(origin.medium ?? "");
  const from = origin.clickId || paidGoogle ? "Google Ads" : origin.source;
  const campaign = origin.campaign ? `campanha ${origin.campaign}` : "";
  if (from) return `(origem: ${from}${campaign ? ` – ${campaign}` : ""})`;
  return campaign ? `(origem: ${campaign})` : "";
}

/** Acrescenta a origem da visita ao fim de uma mensagem. */
export function withOrigin(text: string): string {
  const note = originNote();
  return note && !text.includes("(origem:") ? `${text}\n\n${note}` : text;
}

function tagWhatsAppLinks() {
  if (!originNote()) return;
  document.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me/"]').forEach((a) => {
    try {
      const url = new URL(a.href);
      const text = withOrigin(url.searchParams.get("text") ?? "");
      a.href = `${url.origin}${url.pathname}?text=${encodeURIComponent(text)}`;
    } catch {
      /* link fora do padrão: fica como está */
    }
  });
}

/* ---------- gtag ---------- */

// O gtag precisa receber o objeto "arguments", não um array.
function gtag(..._args: unknown[]) {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

// Remarketing desligado: ad_personalization fica sempre negado, mesmo para quem aceita.
const consentState = (c: Choice) => ({
  ad_storage: c,
  analytics_storage: c,
  ad_user_data: c,
  ad_personalization: "denied" as Choice,
});

/** Escolha atual da pessoa no aviso de cookies (null = ainda não respondeu). */
let consent: Choice | null = null;

/** Envia um evento ao GA4 e, se configurada e com consentimento aceito, a conversão do Google Ads. */
export function track(event: string, params: Params = {}, conversion?: ConversionKey) {
  if (!trackingEnabled) return;
  if (brand.ga4Id) gtag("event", event, { send_to: brand.ga4Id, page: location.pathname, ...params });
  const sendTo = conversion && brand.adsId && consent === "granted" ? brand.adsConversions[conversion] : "";
  if (sendTo) gtag("event", "conversion", { send_to: sendTo });
}

function readChoice(): Choice | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function clearGoogleCookies() {
  const host = location.hostname;
  const domains = ["", host, `.${host.replace(/^www\./, "")}`];
  document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((name) => /^(_ga|_gid|_gcl|_gac)/.test(name))
    .forEach((name) =>
      domains.forEach((d) => (document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`)),
    );
}

function setupConsentBanner(choice: Choice | null) {
  const banner = document.querySelector<HTMLElement>("[data-consent]");
  if (!banner) return;
  banner.querySelectorAll<HTMLButtonElement>("[data-consent-choice]").forEach((button) =>
    button.addEventListener("click", () => {
      const c: Choice = button.dataset.consentChoice === "granted" ? "granted" : "denied";
      try {
        localStorage.setItem(CONSENT_KEY, c);
      } catch {
        /* navegação privada: vale só para esta página */
      }
      consent = c;
      gtag("consent", "update", consentState(c));
      if (c === "denied") clearGoogleCookies();
      banner.hidden = true;
    }),
  );
  document.querySelectorAll<HTMLElement>("[data-consent-open]").forEach((el) =>
    el.addEventListener("click", () => {
      banner.hidden = false;
      banner.querySelector<HTMLButtonElement>("[data-consent-choice]")?.focus();
    }),
  );
  if (!choice) banner.hidden = false;
}

function startGoogleTag() {
  window.dataLayer = window.dataLayer || [];
  gtag("consent", "default", { ...consentState("denied"), wait_for_update: 500 });
  gtag("set", "ads_data_redaction", true);
  gtag("set", "allow_ad_personalization_signals", false);
  const choice = readChoice();
  consent = choice;
  if (choice === "granted") gtag("consent", "update", consentState("granted"));
  gtag("js", new Date());
  if (brand.ga4Id) gtag("config", brand.ga4Id);
  if (brand.adsId) gtag("config", brand.adsId);

  // Baixa o gtag.js só depois do carregamento, para não pesar na abertura da página.
  const load = () => {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tagIds[0])}`;
    document.head.appendChild(s);
  };
  const whenIdle = () =>
    "requestIdleCallback" in window ? requestIdleCallback(load, { timeout: 2500 }) : setTimeout(load, 1200);
  if (document.readyState === "complete") whenIdle();
  else window.addEventListener("load", whenIdle, { once: true });

  setupConsentBanner(choice);
}

/* ---------- Cliques em WhatsApp, telefone e e-mail ---------- */

/** position: de onde veio o clique (hero, barra_fixa, cta_final...). service: qual serviço. */
export function contextOf(el: Element): Params {
  return {
    position:
      (el as HTMLElement).dataset.trackPosition ||
      el.closest<HTMLElement>("[data-track-zone]")?.dataset.trackZone ||
      "outro",
    service:
      el.closest<HTMLElement>("[data-track-service]")?.dataset.trackService || document.body.dataset.service || "geral",
  };
}

function listenClicks() {
  document.addEventListener(
    "click",
    (e) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      const href = a.getAttribute("href") ?? "";
      if (href.includes("wa.me/")) track("whatsapp_click", contextOf(a), "whatsapp");
      else if (href.startsWith("tel:")) track("phone_click", contextOf(a), "phone");
      else if (href.startsWith("mailto:")) track("email_click", contextOf(a), "email");
    },
    { capture: true },
  );
}

tagWhatsAppLinks();
if (trackingEnabled) {
  startGoogleTag();
  listenClicks();
}
