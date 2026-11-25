import { brand } from "./content";

export const siteSeo = {
  siteUrl: brand.siteUrl,
  siteName: brand.name,
  // title: 50 a 60 caracteres · description: 140 a 160 caracteres
  defaultTitle: "Solution Play: TI, Segurança e Sistemas em São Paulo",
  defaultDescription:
    "Suporte de TI, segurança eletrônica (CFTV, alarmes e controle de acesso), NOC para provedores e sistemas em Python para empresas em São Paulo e região.",
  locale: "pt_BR",
  twitterCard: "summary_large_image" as const,
};
