import { brand } from "./content";

export const siteSeo = {
  siteUrl: brand.siteUrl,
  siteName: brand.name,
  // title: ~60 caracteres · description: 140 a 160 caracteres
  defaultTitle: "Solution Play | TI, Segurança Eletrônica e Sistemas – SP e Brasil",
  defaultDescription:
    "Suporte de TI, segurança eletrônica (CFTV, alarmes e controle de acesso) e sistemas sob medida para empresas. Base em São Paulo, atendimento em todo o Brasil.",
  locale: "pt_BR",
  twitterCard: "summary_large_image" as const,
};
