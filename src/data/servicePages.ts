/**
 * Páginas de serviço: /suporte-ti/, /seguranca-eletronica/ e /noc-provedores/.
 * Cada página usa o mesmo modelo (src/components/site/ServicePage.astro).
 * Para mudar textos, edite aqui. Mantenha o title entre 50 e 60 caracteres
 * e a description entre 140 e 160 (é o que o Google mostra na busca).
 */

export type ServicePageData = {
  slug: string;
  /** Nome curto usado no menu e no caminho "Início / ..." */
  name: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  serviceType: string;
  whatsappMessage: string;
  /** Ficha rápida mostrada ao lado do título. */
  facts: { label: string; value: string }[];
  items: { title: string; desc: string }[];
  audience: string[];
  steps: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
};

export const servicePages: Record<"ti" | "seguranca" | "noc", ServicePageData> = {
  ti: {
    slug: "/suporte-ti/",
    name: "Suporte de TI",
    title: "Suporte de TI e Infraestrutura em São Paulo | Solution Play",
    description:
      "Suporte de TI remoto e presencial em São Paulo: Active Directory, servidores, redes, backup, Microsoft 365 e manutenção de computadores para empresas.",
    h1: "Suporte de TI e infraestrutura para empresas em São Paulo",
    lead: "Cuidamos dos computadores, servidores, rede e usuários da sua empresa, com atendimento remoto e presencial e manutenção que evita parada.",
    serviceType: "Suporte de TI e infraestrutura",
    whatsappMessage: "Olá! Vim pela página de Suporte de TI e quero falar com um especialista.",
    facts: [
      { label: "Atendimento", value: "Remoto e presencial" },
      { label: "Região", value: "São Paulo e região metropolitana" },
      { label: "Contratação", value: "Contrato mensal ou avulso" },
      { label: "Primeira resposta", value: "Até 4 horas úteis" },
    ],
    items: [
      { title: "Active Directory e servidores", desc: "Usuários, grupos e políticas organizados, servidor de arquivos e acesso por setor." },
      { title: "Suporte remoto e presencial", desc: "Resolvemos pelo acesso remoto e vamos até você quando o problema pede alguém no local." },
      { title: "Manutenção de computadores", desc: "Limpeza física e lógica, atualizações do Windows e troca de peças antes que a máquina pare." },
      { title: "Redes, Wi-Fi e VPN", desc: "Rede organizada, Wi-Fi que cobre o escritório e acesso seguro para quem trabalha de fora." },
      { title: "Backup e segurança de dados", desc: "Rotinas de backup testadas e políticas para proteger as informações da empresa." },
      { title: "Microsoft 365 e e-mail", desc: "Contas, licenças, e-mail corporativo, Teams e permissões de compartilhamento." },
    ],
    audience: [
      "Escritórios e empresas que não têm equipe de TI própria",
      "Empresas com TI interna que precisam de reforço em projetos",
      "Negócios em crescimento que precisam organizar servidores, acessos e backup",
    ],
    steps: [
      { title: "Diagnóstico", desc: "Levantamos computadores, servidores, rede e os pontos de risco." },
      { title: "Proposta", desc: "Definimos o escopo e o formato: contrato mensal ou avulso." },
      { title: "Organização", desc: "Resolvemos o urgente e padronizamos acessos, backup e atualizações." },
      { title: "Acompanhamento", desc: "Suporte contínuo e manutenção preventiva programada." },
    ],
    faq: [
      { q: "Vocês atendem presencialmente?", a: "Sim. Atendemos de forma remota e com visitas presenciais em São Paulo e região metropolitana." },
      { q: "Preciso assinar um contrato mensal?", a: "Não. Você pode contratar atendimento avulso, como visita ou hora técnica, ou um contrato mensal com manutenção preventiva." },
      { q: "Vocês usam software pirata?", a: "Não. Trabalhamos apenas com software original e licenciado e orientamos a regularização quando for preciso." },
      { q: "Quanto custa?", a: "Depende do número de computadores, servidores e visitas. Chame no WhatsApp para receber uma proposta para o seu caso." },
    ],
  },

  seguranca: {
    slug: "/seguranca-eletronica/",
    name: "Segurança eletrônica",
    title: "Segurança Eletrônica e CFTV em São Paulo | Solution Play",
    description:
      "CFTV em alta resolução, centrais de alarme, proteção perimetral e controle de acesso para empresas e condomínios em São Paulo. Projeto e instalação.",
    h1: "Segurança eletrônica para empresas e condomínios em São Paulo",
    lead: "Projetamos, instalamos e mantemos CFTV, alarmes e controle de acesso, integrados à rede e com as imagens ao seu alcance.",
    serviceType: "Segurança eletrônica",
    whatsappMessage: "Olá! Vim pela página de Segurança Eletrônica e quero um orçamento.",
    facts: [
      { label: "Para", value: "Empresas e condomínios" },
      { label: "Região", value: "São Paulo e região metropolitana" },
      { label: "Inclui", value: "Projeto, instalação e manutenção" },
      { label: "Primeira resposta", value: "Até 4 horas úteis" },
    ],
    items: [
      { title: "CFTV em alta resolução", desc: "Câmeras e gravadores posicionados para cobrir entradas, caixas e áreas comuns." },
      { title: "Imagens pelo celular", desc: "Acesso remoto configurado com segurança para ver ao vivo e rever gravações." },
      { title: "Centrais de alarme", desc: "Sensores de presença e de abertura, com aviso quando algo dispara." },
      { title: "Proteção perimetral", desc: "Sensores e barreiras no perímetro para avisar antes de alguém entrar." },
      { title: "Controle de acesso", desc: "Cartão, biometria ou QR Code em portas e catracas, com registro de entradas." },
      { title: "Integração de sistemas", desc: "Câmeras, alarme e acesso trabalhando juntos e ligados à rede com segurança." },
    ],
    audience: [
      "Empresas, lojas e escritórios",
      "Condomínios residenciais e comerciais",
      "Galpões e áreas com perímetro grande",
    ],
    steps: [
      { title: "Visita técnica", desc: "Avaliamos o local, os pontos vulneráveis e o que precisa ser coberto." },
      { title: "Projeto", desc: "Definimos câmeras, sensores e acessos, com posição de cada equipamento." },
      { title: "Instalação", desc: "Instalação organizada, configuração e teste de tudo funcionando." },
      { title: "Manutenção", desc: "Revisões periódicas e suporte quando algo falhar." },
    ],
    faq: [
      { q: "Vocês atendem condomínios?", a: "Sim. Atendemos condomínios residenciais e comerciais, além de empresas, lojas e galpões." },
      { q: "Dá para ver as câmeras pelo celular?", a: "Sim. Configuramos o acesso remoto com segurança para você acompanhar ao vivo e consultar as gravações." },
      { q: "Vocês mexem em sistemas instalados por outra empresa?", a: "Sim. Avaliamos o que já existe, aproveitamos o que estiver em bom estado e corrigimos o que for preciso." },
      { q: "Quanto custa?", a: "Depende do tamanho do local e da quantidade de câmeras, sensores e acessos. Chame no WhatsApp para agendar a visita técnica." },
    ],
  },

  noc: {
    slug: "/noc-provedores/",
    name: "NOC para provedores",
    title: "NOC e Redes para Provedores em São Paulo | Solution Play",
    description:
      "NOC 24/7 e engenharia de redes para provedores de internet em São Paulo: BGP, OSPF, MPLS, engenharia de tráfego, core de rede e gestão de ativos.",
    h1: "NOC e engenharia de redes para provedores de internet",
    lead: "Monitoramento 24/7, roteamento e engenharia de tráfego para o seu provedor ficar no ar e crescer com estabilidade.",
    serviceType: "NOC e engenharia de redes",
    whatsappMessage: "Olá! Vim pela página de NOC para Provedores e quero falar com um especialista.",
    facts: [
      { label: "Para", value: "Provedores (ISPs) e operadoras" },
      { label: "Monitoramento", value: "24 horas, 7 dias por semana" },
      { label: "Contratação", value: "NOC contínuo ou projeto pontual" },
      { label: "Base", value: "São Paulo, atendimento remoto" },
    ],
    items: [
      { title: "Monitoramento 24/7", desc: "Links, concentradores e equipamentos de core acompanhados o tempo todo, com alertas." },
      { title: "BGP e trânsito IP", desc: "Sessões com operadoras e PTT, políticas de rota e anúncio de prefixos." },
      { title: "OSPF e MPLS", desc: "Roteamento interno estável, redundância e serviços sobre MPLS para clientes corporativos." },
      { title: "Engenharia de tráfego", desc: "Balanceamento entre links e ajustes para aproveitar melhor a banda contratada." },
      { title: "Core de rede", desc: "Projeto, revisão e documentação do core para crescer sem gargalos." },
      { title: "Gestão de ativos", desc: "Inventário de equipamentos, firmwares e configurações sob controle." },
    ],
    audience: [
      "Provedores regionais de internet",
      "Operadoras e empresas com rede própria",
      "Provedores em crescimento que precisam de NOC sem montar equipe",
    ],
    steps: [
      { title: "Levantamento", desc: "Mapeamos topologia, links, equipamentos e pontos de falha." },
      { title: "Plano", desc: "Priorizamos as melhorias de roteamento, redundância e monitoramento." },
      { title: "Implantação", desc: "Aplicamos as mudanças em janelas combinadas, com documentação." },
      { title: "Operação", desc: "NOC contínuo, com alertas e acionamento conforme o contrato." },
    ],
    faq: [
      { q: "O monitoramento funciona 24 horas?", a: "Sim. O monitoramento é 24/7, com alertas e acionamento conforme o que for combinado em contrato." },
      { q: "Posso contratar só um projeto pontual?", a: "Sim. Fazemos projetos como implantação de BGP, revisão de core e engenharia de tráfego, sem contrato de NOC." },
      { q: "Vocês atendem provedores fora de São Paulo?", a: "Sim. Grande parte do trabalho de NOC e engenharia é remoto, então atendemos provedores de outras regiões." },
      { q: "Quanto custa?", a: "Depende do tamanho da rede e do nível de acompanhamento. Chame no WhatsApp para conversar sobre o seu provedor." },
    ],
  },
};
