/** Conteúdo institucional — alinhado à proposta comercial MSP Solution Play */

export const brand = {
  slogan: "Tecnologia que resolve. Soluções que impulsionam.",
  sloganAccent: "impulsionam",
  whatsapp: "5511937415034",
  whatsappDisplay: "(11) 93741-5034",
  siteDisplay: "www.solutionplay.com.br",
  siteUrl: "https://www.solutionplay.com.br",
  email: "solutiontech1016@gmail.com",
  cnpj: "49.821.819/0001-09",
} as const;

export const hero = {
  headlineLines: [
    { text: "Soluções de TI", variant: "solid" as const },
    { text: "completas para sua", variant: "outline" as const },
    { text: "empresa!", variant: "accent" as const },
  ],
  lead:
    "Suporte técnico, manutenção preventiva, monitoramento, servidores, Active Directory, segurança e consultoria para pequenas e médias empresas.",
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

/** Planos MSP — tabela e descrições (fonte única para Serviços e Contratos). */
export const mspPlans = [
  {
    id: "start",
    name: "START",
    price: "R$ 300/mês",
    scope: "Até 3 computadores",
    includes: [
      "Suporte remoto",
      "Manutenção preventiva",
      "Limpeza física e lógica",
      "Atualizações do Windows",
      "Até 2 chamados de serviço por mês",
    ],
  },
  {
    id: "essencial",
    name: "ESSENCIAL",
    price: "R$ 590/mês",
    scope: "Até 5 computadores",
    includes: [
      "Tudo do plano START",
      "Monitoramento proativo",
      "Backup básico",
      "Até 4 chamados de serviço por mês",
    ],
  },
  {
    id: "profissional",
    name: "PROFISSIONAL",
    price: "R$ 1.190/mês",
    scope: "Até 10 computadores",
    includes: [
      "Tudo do plano ESSENCIAL",
      "1 visita presencial por mês",
      "Gestão de usuários e permissões",
    ],
  },
  {
    id: "business",
    name: "BUSINESS",
    price: "R$ 2.490/mês",
    scope: "Até 20 computadores",
    includes: [
      "Tudo do plano PROFISSIONAL",
      "Active Directory",
      "Servidor de arquivos",
      "VPN",
      "Políticas de segurança",
    ],
  },
  {
    id: "enterprise",
    name: "ENTERPRISE",
    price: "Sob consulta",
    scope: "Ambientes complexos",
    includes: [
      "vCIO",
      "Microsoft 365",
      "Firewall",
      "Auditoria e conformidade",
      "Projetos sob medida",
    ],
  },
] as const;

export const oneOffServices = [
  { title: "Visita técnica presencial", price: "A partir de R$ 150" },
  { title: "Hora técnica especializada", price: "A partir de R$ 300" },
  { title: "Implantação de servidor", price: "A partir de R$ 1.500" },
  { title: "Configuração de Active Directory", price: "A partir de R$ 2.500" },
] as const;

export const differentiators = [
  "Atendimento remoto e presencial em São Paulo e região metropolitana.",
  "Contratos mensais flexíveis.",
  "Soluções sob medida para cada cliente.",
  "Suporte especializado e consultivo.",
] as const;

export const mspIntro = {
  eyebrow: "Nossos serviços",
  title: "Serviços gerenciados de TI (MSP)",
  lead:
    "A Solution Play oferece suporte técnico, manutenção preventiva, monitoramento, servidores, Active Directory, segurança e consultoria para pequenas e médias empresas.",
} as const;

export const commercial = {
  headline: "Contratos e valores",
  plansNote: "Planos flexíveis para empresas de todos os tamanhos.",
  note: "Investimento e escopo do plano ENTERPRISE são definidos sob consulta, conforme a complexidade do ambiente.",
  validityNote: "Proposta comercial válida por 15 dias.",
  paymentNote: "Pagamento mensal via PIX, boleto bancário ou transferência.",
  terms: ["6 meses", "1 ano", "2 anos"],
} as const;

export const contact = {
  badge: "Atendimento especializado",
  headline: "Próximo passo",
  lead: "Preencha o formulário ao lado. Retornamos com alinhamento de escopo e condições conforme a proposta vigente.",
  trustItems: [
    {
      id: "response",
      title: "Resposta em até 4h úteis",
      desc: "Seg–Sex, 8h–18h",
      icon: "clock",
    },
    {
      id: "area",
      title: "São Paulo e região metropolitana",
      desc: "Atendimento remoto e presencial",
      icon: "map",
    },
    {
      id: "cnpj",
      title: "CNPJ 49.821.819/0001-09",
      desc: "Empresa registrada",
      icon: "badge",
    },
    {
      id: "email",
      title: "solutiontech1016@gmail.com",
      desc: "Contato direto",
      icon: "mail",
    },
  ],
} as const;
