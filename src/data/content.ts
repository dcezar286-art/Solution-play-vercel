/**
 * Conteúdo do site Solution Play — fonte única.
 * Para mudar textos, serviços ou o número do WhatsApp, edite apenas este arquivo.
 */

/** Cidades com atendimento presencial. Mude aqui e o site inteiro acompanha. */
export const presencialCities = ["São Paulo (capital)", "Região do ABC", "Guarulhos", "Osasco", "Barueri"];
export const presencialText = "São Paulo (capital), região do ABC, Guarulhos, Osasco e Barueri";

/** Endereço da sede. Só aparece no site e no Google quando preenchido. */
export type BrandAddress = {
  /** Rua, número e complemento. Ex.: "Rua Exemplo, 123, sala 4 – Bairro" */
  streetAddress: string;
  /** Cidade. Ex.: "São Paulo" */
  addressLocality: string;
  /** Sigla do estado. Ex.: "SP" */
  addressRegion: string;
  /** CEP. Ex.: "01000-000" */
  postalCode: string;
  /** Coordenadas do local (Google Maps → clique com o botão direito no ponto). */
  geo?: { latitude: number; longitude: number };
  /** Link do perfil da empresa no Google Maps, se houver. */
  mapsUrl?: string;
};

/**
 * Conversão "Solicitar orçamento" do Google Ads: o send_to completo, no formato "AW-18440985753/RÓTULO".
 * Onde achar: Google Ads → Metas → Conversões → Solicitar orçamento → Configuração da tag →
 * "Instalar a tag você mesmo" → linha send_to do snippet do evento.
 * Vazio = o site não envia nenhuma conversão (o restante da medição continua funcionando).
 */
const conversaoOrcamento = "" as string;

export const brand = {
  name: "Solution Play",
  tagline: "TI para empresas em movimento",
  slogan: "Tecnologia que resolve. Seu negócio vai além.",
  whatsapp: "5511937415034",
  whatsappDisplay: "(11) 93741-5034",
  /** Botão "Ligar" (formato internacional, sem espaços). */
  phone: "+5511937415034",
  phoneDisplay: "(11) 93741-5034",
  /** Troque aqui quando o e-mail @solutionplay.com.br estiver ativo. É o único lugar a mudar. */
  email: "solutiontech1016@gmail.com",
  cnpj: "49.821.819/0001-09",
  siteUrl: "https://www.solutionplay.com.br",
  siteDisplay: "www.solutionplay.com.br",
  area: presencialText,
  hours: "Segunda a sexta, das 8h às 18h",
  /** Endereço da sede. Deixe null enquanto não quiser publicar. */
  address: null as BrandAddress | null,

  /* ---- Medição (Google Analytics 4 e Google Ads) ----
     Vazio = o site não carrega nenhum script do Google nem mostra o aviso de cookies. */
  /** ID do GA4. Ex.: "G-ABC123XYZ9" (GA4 → Administrador → Fluxos de dados). */
  ga4Id: "G-9BF37VJ9XX" as string,
  /** ID da conta do Google Ads. Ex.: "AW-123456789" (Ads → Metas → Conversões → Configurar tag). */
  adsId: "AW-18440985753" as string,
  /** Conversões do Google Ads por canal (send_to completo), enviadas só com o consentimento aceito.
      WhatsApp (botões e formulário) e telefone contam como a mesma conversão de contato; e-mail não conta. */
  adsConversions: {
    whatsapp: conversaoOrcamento,
    phone: conversaoOrcamento,
    email: "" as string,
  },
} as const;

/** Monta o link do WhatsApp já com a mensagem escrita. */
export function whatsappLink(message = "Olá! Vim pelo site da Solution Play e gostaria de falar com um especialista.") {
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const phoneLink = `tel:${brand.phone}`;

/* ---------------------------------------------------------------- */
/* Prova social — tudo começa vazio e a seção fica oculta.           */
/* Preencha só com dados reais e autorizados pelo cliente.           */
/* ---------------------------------------------------------------- */

export type ServiceKey = "ti" | "seguranca" | "noc" | "dev";
/** Página atual: destaca o item do menu e identifica o serviço nos eventos de medição. */
export type PageKey = "home" | ServiceKey | "blog" | "privacidade" | "outro";

export type Testimonial = {
  /** Texto do depoimento, nas palavras do cliente. */
  quote: string;
  name: string;
  /** Cargo. Ex.: "Síndico", "Gerente administrativo" */
  role?: string;
  company?: string;
  /** Página de serviço onde o depoimento aparece. Sem valor = aparece em todas. */
  service?: ServiceKey;
};
export const testimonials: Testimonial[] = [];

export type ClientLogo = {
  name: string;
  /** Arquivo em /public/clientes/. Ex.: "/clientes/empresa-x.svg" */
  src: string;
  width?: number;
  height?: number;
};
export const clientLogos: ClientLogo[] = [];

export type Stat = {
  /** Número já formatado. Ex.: "10+", "250" */
  value: string;
  /** O que o número significa. Ex.: "anos de experiência" */
  label: string;
};
export const stats: Stat[] = [];

export type Service = {
  id: ServiceKey;
  icon: "server" | "camera" | "network" | "code";
  title: string;
  /** Nome do serviço informado ao Google (JSON-LD). */
  schemaName: string;
  short: string;
  audience: string;
  summary: string;
  includes: string[];
  message: string;
  href?: string;
  isNew?: boolean;
};

export const services: Service[] = [
  {
    id: "ti",
    icon: "server",
    title: "Suporte de TI & Infraestrutura",
    schemaName: "Suporte de TI e infraestrutura",
    short: "TI & Infraestrutura",
    audience: "Empresas de todos os tamanhos",
    summary: "Soluções corporativas, manutenção e gestão completa do seu ambiente de TI.",
    includes: [
      "Administração de Active Directory e servidores",
      "Suporte técnico remoto e presencial",
      "Limpeza e manutenção de computadores e notebooks",
      "Redes, Wi-Fi e VPN",
      "Backup e segurança de dados",
      "Microsoft 365, usuários e permissões",
    ],
    message: "Olá! Vim pelo site e quero falar sobre Suporte de TI e Infraestrutura.",
    href: "/suporte-ti/",
  },
  {
    id: "seguranca",
    icon: "camera",
    title: "Segurança Eletrônica",
    schemaName: "Segurança eletrônica: CFTV, alarmes e controle de acesso",
    short: "Segurança Eletrônica",
    audience: "Empresas e condomínios",
    summary: "CFTV, alarmes e soluções de vigilância com proteção integral.",
    includes: [
      "Monitoramento de imagens CFTV em alta resolução",
      "Centrais de alarme e proteção perimetral",
      "Controle de acesso e integração de sistemas",
      "Projeto, instalação e manutenção",
    ],
    message: "Olá! Vim pelo site e quero falar sobre Segurança Eletrônica (CFTV, alarmes, controle de acesso).",
    href: "/seguranca-eletronica/",
  },
  {
    id: "noc",
    icon: "network",
    title: "NOC & Redes para Provedores",
    schemaName: "NOC e engenharia de redes para provedores",
    short: "NOC para Provedores",
    audience: "ISPs e operadoras",
    summary: "Gestão, monitoramento e alta disponibilidade para provedores de internet.",
    includes: [
      "BGP, OSPF, MPLS e roteamento avançado",
      "Monitoramento 24/7 e gestão de ativos",
      "Engenharia de tráfego e core de rede",
    ],
    message: "Olá! Vim pelo site e quero falar sobre NOC e Engenharia de Redes para provedor.",
    href: "/noc-provedores/",
  },
  {
    id: "dev",
    icon: "code",
    title: "Desenvolvimento de Sistemas",
    schemaName: "Desenvolvimento de sistemas sob medida",
    short: "Desenvolvimento",
    audience: "Sistemas sob medida em Python",
    summary: "Software feito para o jeito que a sua empresa trabalha.",
    includes: [
      "PDV e ERP",
      "Plataformas SaaS",
      "Controle de estoque",
      "Monitoria de links e servidores (Zabbix, Grafana)",
      "Agentes de IA",
    ],
    message: "Olá! Vim pelo site e quero falar sobre desenvolvimento de um sistema.",
    href: "/desenvolvimento/",
    isNew: true,
  },
];

export const trust = [
  { icon: "clock", text: "Primeira resposta em até 4 horas úteis, de segunda a sexta." },
  { icon: "map", text: `Atendimento presencial em ${presencialText}; remoto em todo o Brasil.` },
  { icon: "shield", text: "Só software original e licenciado. Nada de ativação pirata." },
  { icon: "badge", text: `Empresa registrada, CNPJ ${brand.cnpj}.` },
] as const;

export const differentiators = [
  "Um só contato para TI, segurança eletrônica, rede e sistemas.",
  "Contratos flexíveis, montados para o tamanho da sua empresa.",
  "Primeiro entendemos o seu negócio, depois propomos a solução.",
] as const;

/** Formas de atendimento — substitui a antiga tabela de planos (sem valores). */
export const engagement = [
  {
    id: "mensal",
    title: "Contrato mensal",
    tag: "Gestão contínua",
    desc: "Sua TI cuidada todo mês, com escopo dimensionado pelo tamanho do seu ambiente.",
    includes: [
      "Suporte remoto e visitas presenciais",
      "Manutenção preventiva programada",
      "Monitoramento proativo e backup",
      "Gestão de usuários e permissões",
      "Prazos de 6 meses, 1 ano ou 2 anos",
    ],
  },
  {
    id: "avulso",
    title: "Atendimento avulso",
    tag: "Quando você precisar",
    desc: "Resolva uma demanda pontual sem contrato.",
    includes: [
      "Visita técnica presencial",
      "Hora técnica especializada",
      "Implantação de servidor",
      "Configuração de Active Directory",
    ],
  },
  {
    id: "projeto",
    title: "Projeto sob medida",
    tag: "Do zero ao funcionamento",
    desc: "Planejamento, execução e entrega de um projeto completo.",
    includes: [
      "Infraestrutura e redes",
      "Segurança eletrônica",
      "NOC para provedores",
      "Desenvolvimento de sistemas",
    ],
  },
] as const;

export const policies = [
  {
    title: "Garantia de equipamentos",
    body: "A garantia de hardware e equipamentos de terceiros é do fabricante. Orientamos e apoiamos na abertura de chamados junto a ele.",
  },
  {
    title: "Software original e licenciado",
    body: "Trabalhamos apenas com licenças originais. Não fazemos ativação indevida, cracking ou qualquer burla de licenciamento.",
  },
  {
    title: "Pagamento",
    body: "Mensal via PIX, boleto bancário ou transferência. Escopo e condições definidos em proposta.",
  },
] as const;

/* ---------------------------------------------------------------- */
/* Página /desenvolvimento                                           */
/* ---------------------------------------------------------------- */

export const devSolutions = [
  {
    id: "pdv",
    tag: "Varejo",
    title: "PDV",
    desc: "Frente de caixa rápida, que funciona mesmo quando a internet cai.",
    features: ["Vendas, caixa e sangria", "Leitor de código de barras e balança", "Integração com emissor fiscal e TEF", "Funciona offline e sincroniza depois"],
  },
  {
    id: "erp",
    tag: "Gestão",
    title: "ERP",
    desc: "Financeiro, compras, vendas e cadastros num só lugar, do jeito do seu processo.",
    features: ["Financeiro e fluxo de caixa", "Compras, vendas e pedidos", "Permissões por usuário e setor", "Relatórios e painéis gerenciais"],
  },
  {
    id: "saas",
    tag: "Produto",
    title: "SaaS",
    desc: "Transformamos sua ideia em uma plataforma online com assinatura e vários clientes.",
    features: ["Multiempresa (multi-tenant)", "Login, planos e cobrança recorrente", "Painel administrativo", "API para integrações"],
  },
  {
    id: "estoque",
    tag: "Operação",
    title: "Controle de estoque",
    desc: "Saiba em tempo real o que entra, o que sai e o que está faltando.",
    features: ["Entradas, saídas e inventário", "Estoque mínimo e alertas de reposição", "Múltiplos depósitos e lotes", "Leitura por código de barras ou QR Code"],
  },
  {
    id: "monitoria",
    tag: "Infraestrutura",
    title: "Monitoria de links e servidores",
    desc: "Visibilidade total da rede: saiba do problema antes do cliente ligar.",
    features: ["Monitoramento de links, servidores e serviços", "Integração com Zabbix e painéis no Grafana", "Alertas por WhatsApp, Telegram ou e-mail", "Relatórios de disponibilidade (SLA)"],
  },
  {
    id: "ia",
    tag: "Inteligência artificial",
    title: "Agentes de IA",
    desc: "Assistentes que atendem, consultam seus sistemas e automatizam tarefas.",
    features: ["Atendimento no WhatsApp e no site", "Consulta a dados do seu ERP e estoque", "Automação de tarefas repetitivas", "Treinados com os documentos da sua empresa"],
  },
] as const;

export const devStack = [
  { group: "Linguagem principal", items: ["Python"], primary: true },
  { group: "Back-end e APIs", items: ["FastAPI", "Django", "Celery"] },
  { group: "Dados", items: ["PostgreSQL", "Redis", "SQLite"] },
  { group: "Interfaces", items: ["TypeScript", "React", "Astro"] },
  { group: "Infra e entrega", items: ["Docker", "Linux", "Nginx", "Git"] },
  { group: "Monitoramento", items: ["Zabbix", "Grafana", "Prometheus"] },
  { group: "IA", items: ["LLMs (Claude, GPT)", "RAG", "LangChain"] },
] as const;

export const devProcess = [
  { title: "Diagnóstico", desc: "Entendemos o processo, as dores e o que já existe." },
  { title: "Protótipo", desc: "Você vê e aprova as telas antes de qualquer código." },
  { title: "Desenvolvimento", desc: "Entregas em ciclos curtos, com validação a cada etapa." },
  { title: "Implantação", desc: "Colocamos no ar, migramos dados e treinamos a equipe." },
  { title: "Suporte e evolução", desc: "Acompanhamento contínuo e novas funções quando precisar." },
] as const;

export const devFaq = [
  {
    q: "Quanto tempo leva para desenvolver um sistema?",
    a: "Depende do escopo. Um módulo simples pode ficar pronto em poucas semanas; sistemas completos são entregues em etapas, para você já usar as primeiras partes enquanto o resto é construído.",
  },
  {
    q: "O sistema integra com o que eu já uso?",
    a: "Sim. Integramos com ERPs, planilhas, emissores fiscais, gateways de pagamento, Zabbix, WhatsApp e outras ferramentas por API ou banco de dados.",
  },
  {
    q: "Por que Python?",
    a: "Python é robusto, tem um ecossistema enorme para dados, automação e inteligência artificial, e facilita a manutenção do sistema ao longo dos anos.",
  },
  {
    q: "Vocês dão suporte depois da entrega?",
    a: "Sim. Oferecemos suporte, correções e novas funções. Como também cuidamos de infraestrutura, o servidor onde o sistema roda pode ficar com a gente.",
  },
] as const;
