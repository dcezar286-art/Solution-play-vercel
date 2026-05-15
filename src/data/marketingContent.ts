/** Conteúdo institucional — banner Solution Play */

export const brand = {
  slogan: "Tecnologia que resolve. Soluções que impulsionam.",
  sloganAccent: "impulsionam",
  whatsapp: "5511937415034",
  whatsappDisplay: "(11) 93741-5034",
} as const;

export const hero = {
  /** Três linhas — sólido, contorno e gradiente (hero-mega). */
  headlineLines: [
    { text: "Soluções de TI", variant: "solid" as const },
    { text: "completas para sua", variant: "outline" as const },
    { text: "empresa!", variant: "accent" as const },
  ],
  lead:
    "Do suporte básico à infraestrutura avançada, cuidamos da tecnologia para você focar no que realmente importa: o seu negócio.",
  priceLabel: "Contrato mensal a partir de",
  priceValue: "R$ 300,00",
  priceSuffix: "mensais",
} as const;

export const benefits = [
  {
    title: "Mais segurança",
    desc: "Para seus dados e sistemas",
    icon: "shield",
  },
  {
    title: "Mais produtividade",
    desc: "E menos tempo parado",
    icon: "chart",
  },
  {
    title: "Suporte rápido",
    desc: "Atendimento especializado",
    icon: "headset",
  },
  {
    title: "Tecnologia ativa",
    desc: "Sempre funcionando para o seu negócio",
    icon: "gear",
  },
] as const;

export const basicServices = [
  {
    title: "Manutenção de computadores e notebooks",
    desc: "Diagnóstico, limpeza, otimização e prevenção de problemas.",
  },
  {
    title: "Limpeza e higienização",
    desc: "Remoção de sujeira, poeira e resíduos que causam superaquecimento e lentidão.",
  },
  {
    title: "Instalação e configuração",
    desc: "Windows, drivers, programas, impressoras e periféricos.",
  },
  {
    title: "Atualizações e segurança",
    desc: "Atualizações do sistema, antivírus, backup e proteção de dados.",
  },
  {
    title: "Suporte técnico",
    desc: "Atendimento remoto e presencial com agilidade e eficiência.",
  },
] as const;

export const advancedServices = [
  {
    title: "Implantação de servidores de arquivos",
    desc: "Organização centralizada de dados com segurança, backup e alta disponibilidade.",
  },
  {
    title: "Gestão de acesso (AD)",
    desc: "Administração de usuários, grupos, permissões e políticas no Active Directory.",
  },
  {
    title: "Segurança e controle",
    desc: "Políticas de acesso, auditoria, proteção de dados e conformidade.",
  },
  {
    title: "Backup e recuperação de dados",
    desc: "Soluções de backup local e em nuvem para garantir a continuidade do seu negócio.",
  },
  {
    title: "Infraestrutura e redes",
    desc: "Planejamento, implantação e manutenção de redes cabeadas e Wi‑Fi corporativo.",
  },
] as const;

export const commercial = {
  headline: "Comercial",
  priceLabel: "Contrato mensal a partir de",
  priceValue: "R$ 300,00",
  priceSuffix: "mensais",
  note: "Valor indicativo — consulte conforme a quantidade de equipamentos e o escopo incluídos no contrato.",
  terms: ["6 meses", "1 ano", "2 anos"],
  plansNote: "Planos flexíveis para empresas de todos os tamanhos!",
} as const;

export const contact = {
  headline: "Próximo passo",
  lead: "Preencha o formulário ao lado. Planos flexíveis para empresas de todos os tamanhos.",
} as const;
