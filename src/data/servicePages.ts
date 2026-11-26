/**
 * Páginas de serviço e subpáginas de SEO. Todas usam o mesmo modelo
 * (src/components/site/ServicePage.astro); as seções opcionais só aparecem quando preenchidas.
 * Para mudar textos, edite aqui. Mantenha o title entre 50 e 60 caracteres
 * e a description entre 140 e 160 (é o que o Google mostra na busca).
 */

// Cidades com atendimento presencial: a lista fica em content.ts e vale para o site inteiro.
import { presencialCities as presencial, presencialText as presencialTexto } from "./content";

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
  /** Serviço da página: destaca o menu, filtra depoimentos e vai nos eventos de medição. */
  service: "ti" | "seguranca" | "noc";
  /** Subpáginas: página "mãe" no caminho Início / Mãe / Página. */
  parent?: { name: string; href: string };
  /** Área atendida informada ao Google (JSON-LD). Padrão: estado de São Paulo. */
  areaServed?: { "@type": "Country" | "State"; name: string };
  /** Ficha rápida mostrada ao lado do título. */
  facts: { label: string; value: string }[];
  /** Texto de abertura, logo depois do topo. */
  intro?: { title: string; paragraphs: string[] };
  problems?: { title: string; desc: string }[];
  itemsTitle?: string;
  items: { title: string; desc: string }[];
  /** Links para as subpáginas (aparece nas páginas "mãe"). */
  children?: { href: string; name: string; desc: string }[];
  /** Tabela comparativa de duas colunas. */
  compare?: { title: string; intro?: string; columns: [string, string]; rows: { label: string; a: string; b: string }[] };
  checklist?: { title: string; intro?: string; list: string[] };
  audience?: string[];
  stepsTitle?: string;
  steps: { title: string; desc: string }[];
  contract?: { intro: string; points: { title: string; desc: string }[] };
  regions?: { intro: string; list: string[]; note?: string };
  faq: { q: string; a: string }[];
};

export const servicePages: Record<"ti" | "seguranca" | "noc", ServicePageData> = {
  ti: {
    slug: "/suporte-ti/",
    name: "Suporte de TI",
    service: "ti",
    title: "Suporte de TI e Infraestrutura em São Paulo | Solution Play",
    description:
      "Suporte de TI remoto e presencial em São Paulo: Active Directory, servidores, redes, backup, Microsoft 365 e manutenção de computadores para empresas.",
    h1: "Suporte de TI e infraestrutura para empresas em São Paulo",
    lead: "Cuidamos dos computadores, servidores, rede e usuários da sua empresa, com atendimento remoto e presencial e manutenção que evita parada.",
    serviceType: "Suporte de TI e infraestrutura",
    whatsappMessage: "Olá! Vim pela página de Suporte de TI e quero falar com um especialista.",
    facts: [
      { label: "Atendimento", value: "Remoto e presencial" },
      { label: "Presencial em", value: "SP capital, ABC, Guarulhos, Osasco e Barueri" },
      { label: "Contrato", value: "6 meses, 1 ano ou 2 anos, ou avulso" },
      { label: "Primeira resposta", value: "Até 4 horas úteis" },
    ],
    intro: {
      title: "TI que funciona sem você precisar pensar nela",
      paragraphs: [
        "Quando a TI depende de alguém que “entende de computador” ou de um técnico chamado só quando algo quebra, os problemas se repetem: máquinas lentas, senhas espalhadas, backup que ninguém testou e um servidor que ninguém sabe configurar. A Solution Play assume esse cuidado de forma contínua, com atendimento remoto para o dia a dia e visitas presenciais quando o problema pede alguém no local.",
        "O trabalho começa com um diagnóstico do que existe hoje: computadores, servidores, rede, contas de e-mail e rotinas de backup. A partir dele, organizamos os acessos, padronizamos as atualizações e definimos uma rotina de manutenção preventiva, para que os chamados urgentes fiquem cada vez mais raros.",
      ],
    },
    problems: [
      { title: "Computadores lentos e travando", desc: "Limpeza física e lógica, atualização do sistema e troca de peças como SSD e memória quando vale a pena, com orientação clara quando é hora de substituir a máquina." },
      { title: "Internet e Wi-Fi que caem", desc: "Revisão de roteadores, cabos e pontos de acesso, rede separada para visitantes e ajustes para o sinal cobrir todo o escritório." },
      { title: "Arquivos perdidos e backup sem teste", desc: "Rotina de backup automática e testes de restauração, para ter certeza de que o arquivo volta quando você precisar." },
      { title: "Acessos desorganizados", desc: "Cada pessoa com o próprio usuário e só com o acesso de que precisa. Quem sai da empresa perde o acesso no mesmo dia." },
      { title: "E-mail e Microsoft 365 com problemas", desc: "Caixas cheias, mensagens indo para o spam, licenças sobrando ou faltando e arquivos compartilhados sem controle." },
      { title: "Ninguém para chamar quando algo para", desc: "Um canal único para abrir chamados, com primeira resposta em até 4 horas úteis, de segunda a sexta." },
    ],
    items: [
      { title: "Active Directory e servidores", desc: "Usuários, grupos e políticas organizados, servidor de arquivos e acesso por setor." },
      { title: "Suporte remoto e presencial", desc: "Resolvemos pelo acesso remoto e vamos até você quando o problema pede alguém no local." },
      { title: "Manutenção de computadores", desc: "Limpeza física e lógica, atualizações do Windows e troca de peças antes que a máquina pare." },
      { title: "Redes, Wi-Fi e VPN", desc: "Rede organizada, Wi-Fi que cobre o escritório e acesso seguro para quem trabalha de fora." },
      { title: "Backup e segurança de dados", desc: "Rotinas de backup testadas e políticas para proteger as informações da empresa." },
      { title: "Microsoft 365 e e-mail", desc: "Contas, licenças, e-mail corporativo, Teams e permissões de compartilhamento." },
    ],
    children: [
      { href: "/suporte-ti/terceirizacao-de-ti/", name: "Terceirização de TI", desc: "Quando vale terceirizar, o que o contrato cobre e como é a transição." },
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
    contract: {
      intro: "O contrato mensal é montado para o tamanho do seu ambiente. O que entra no escopo, quantas visitas presenciais e quais rotinas de manutenção ficam definidos por escrito na proposta.",
      points: [
        { title: "6 meses, 1 ano ou 2 anos", desc: "Você escolhe o prazo. Para uma demanda pontual existe o atendimento avulso, como visita ou hora técnica, sem contrato." },
        { title: "Remoto e presencial", desc: "A maior parte dos chamados é resolvida por acesso remoto, com a sua autorização. Quando é preciso alguém no local, fazemos a visita." },
        { title: "Primeira resposta em até 4 horas úteis", desc: "Para chamados abertos de segunda a sexta, das 8h às 18h." },
        { title: "Manutenção preventiva e backup", desc: "Atualizações, limpeza, monitoramento e verificação do backup entram na rotina, e não só quando algo quebra." },
        { title: "Pagamento mensal", desc: "Via PIX, boleto bancário ou transferência, nas condições da proposta." },
        { title: "Só software original", desc: "Trabalhamos apenas com licenças originais e orientamos a regularização quando for preciso." },
      ],
    },
    regions: {
      intro: "O suporte remoto atende empresas de todo o Brasil. As visitas presenciais são feitas em:",
      list: presencial,
      note: "Fora dessas cidades, fale com a gente pelo WhatsApp e avaliamos o seu caso.",
    },
    faq: [
      { q: "Quanto custa o suporte de TI?", a: "O valor depende do escopo: quantidade de computadores e servidores, número de usuários, visitas presenciais e rotinas incluídas. Depois de um diagnóstico rápido, enviamos uma proposta por escrito. Chame no WhatsApp para começar." },
      { q: "Vocês atendem presencialmente?", a: `Sim. Fazemos visitas em ${presencialTexto}. O suporte remoto atende empresas de todo o Brasil.` },
      { q: "Qual é o prazo do contrato?", a: "O contrato mensal pode ser de 6 meses, 1 ano ou 2 anos. Se preferir, contrate atendimento avulso, como visita técnica ou hora técnica, sem contrato." },
      { q: "Em quanto tempo vocês respondem um chamado?", a: "A primeira resposta chega em até 4 horas úteis, de segunda a sexta, das 8h às 18h." },
      { q: "Vocês assumem a TI que outra empresa ou técnico montou?", a: "Sim. Fazemos um levantamento do que existe, aproveitamos o que está funcionando e corrigimos o que estiver fora do padrão." },
      { q: "Vocês usam software pirata?", a: "Não. Trabalhamos apenas com software original e licenciado e orientamos a regularização quando for preciso." },
      { q: "E se um computador ou equipamento quebrar?", a: "A garantia de hardware é do fabricante. Identificamos o defeito, orientamos e apoiamos na abertura do chamado de garantia junto a ele." },
      { q: "Como funciona o pagamento?", a: "Mensal, via PIX, boleto bancário ou transferência. Escopo e condições ficam definidos na proposta." },
    ],
  },

  seguranca: {
    slug: "/seguranca-eletronica/",
    name: "Segurança eletrônica",
    service: "seguranca",
    title: "Segurança Eletrônica e CFTV em São Paulo | Solution Play",
    description:
      "CFTV em alta resolução, centrais de alarme, proteção perimetral e controle de acesso para empresas e condomínios em São Paulo. Projeto e instalação.",
    h1: "Segurança eletrônica para empresas e condomínios em São Paulo",
    lead: "Projetamos, instalamos e mantemos CFTV, alarmes e controle de acesso, integrados à rede e com as imagens ao seu alcance.",
    serviceType: "Segurança eletrônica",
    whatsappMessage: "Olá! Vim pela página de Segurança Eletrônica e quero um orçamento.",
    facts: [
      { label: "Para", value: "Empresas e condomínios" },
      { label: "Presencial em", value: "SP capital, ABC, Guarulhos, Osasco e Barueri" },
      { label: "Inclui", value: "Projeto, instalação e manutenção" },
      { label: "Primeira resposta", value: "Até 4 horas úteis" },
    ],
    intro: {
      title: "Segurança que funciona quando você precisa dela",
      paragraphs: [
        "Câmera que não grava, alarme que dispara sozinho e ninguém conseguindo ver as imagens pelo celular: na maior parte das vezes, o problema não é o equipamento, e sim um projeto mal dimensionado ou a falta de manutenção. A Solution Play cuida da segurança eletrônica do começo ao fim: visita técnica, projeto, instalação, configuração do acesso remoto e manutenção.",
        "Como também trabalhamos com redes e TI, câmeras, gravador e controle de acesso ficam ligados à rede com segurança, com acesso remoto protegido e equipamentos atualizados. Também atendemos sistemas instalados por outra empresa: avaliamos o que existe, aproveitamos o que está em bom estado e corrigimos o resto.",
      ],
    },
    problems: [
      { title: "Câmeras sem imagem ou sem gravar", desc: "Diagnóstico do gravador, do disco, das fontes e do cabeamento para o sistema voltar a gravar todas as câmeras." },
      { title: "Imagem ruim à noite ou fora de foco", desc: "Ajuste de posição, foco e infravermelho, troca das câmeras que não atendem e reposicionamento para acabar com os pontos cegos." },
      { title: "Câmeras que não abrem no celular", desc: "Configuração do aplicativo e do acesso remoto com segurança, para ver ao vivo e rever gravações de onde estiver." },
      { title: "Alarme que dispara sozinho", desc: "Revisão de sensores, posicionamento e zonas para acabar com o falso alarme sem deixar áreas desprotegidas." },
      { title: "Sistema de outra empresa sem suporte", desc: "Assumimos sistemas instalados por terceiros: avaliamos e corrigimos o que for preciso, sem exigir trocar tudo." },
      { title: "Sem controle de quem entra e sai", desc: "Controle de acesso por cartão, biometria ou QR Code, com registro de cada entrada por pessoa e horário." },
    ],
    items: [
      { title: "CFTV em alta resolução", desc: "Câmeras e gravadores posicionados para cobrir entradas, caixas e áreas comuns." },
      { title: "Imagens pelo celular", desc: "Acesso remoto configurado com segurança para ver ao vivo e rever gravações." },
      { title: "Centrais de alarme", desc: "Sensores de presença e de abertura, com aviso quando algo dispara." },
      { title: "Proteção perimetral", desc: "Sensores e barreiras no perímetro para avisar antes de alguém entrar." },
      { title: "Controle de acesso", desc: "Cartão, biometria ou QR Code em portas e catracas, com registro de entradas." },
      { title: "Integração de sistemas", desc: "Câmeras, alarme e acesso trabalhando juntos e ligados à rede com segurança." },
    ],
    children: [
      { href: "/seguranca-eletronica/cftv-para-condominios/", name: "CFTV para condomínios", desc: "Portaria, garagem, áreas comuns e acesso às imagens pelo síndico." },
      { href: "/seguranca-eletronica/manutencao-de-cftv/", name: "Manutenção de CFTV", desc: "Câmera sem imagem, gravador que não grava e manutenção preventiva." },
      { href: "/seguranca-eletronica/controle-de-acesso/", name: "Controle de acesso", desc: "Cartão, biometria ou QR Code em portas e catracas." },
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
    contract: {
      intro: "A instalação é feita como projeto, com proposta por escrito para o seu local. Depois dela, ou para um sistema que já existe, a manutenção pode ser contratada de forma contínua.",
      points: [
        { title: "Manutenção por 6 meses, 1 ano ou 2 anos", desc: "Revisões preventivas periódicas e suporte quando algo falha, com escopo e frequência de visitas definidos na proposta." },
        { title: "Remoto e presencial", desc: "Configuração, acesso pelo celular e consulta de gravações costumam ser resolvidos a distância; troca de equipamentos, cabos e ajustes de câmera são feitos no local." },
        { title: "Primeira resposta em até 4 horas úteis", desc: "Para chamados abertos de segunda a sexta, das 8h às 18h." },
        { title: "Atendimento avulso", desc: "Precisa só de um reparo ou de uma visita técnica? Também atendemos sem contrato." },
        { title: "Garantia dos equipamentos", desc: "A garantia de câmeras, gravadores e sensores é do fabricante; apoiamos na abertura do chamado junto a ele." },
      ],
    },
    regions: {
      intro: "Instalação e manutenção presencial em:",
      list: presencial,
      note: "Para outras cidades, fale com a gente pelo WhatsApp e avaliamos o seu caso.",
    },
    faq: [
      { q: "Quanto custa instalar câmeras?", a: "Depende do local: quantidade de câmeras, distância e passagem dos cabos, tipo de câmera e quantos dias de gravação você precisa guardar. Por isso o orçamento é feito depois de uma visita técnica. Chame no WhatsApp para agendar." },
      { q: "Dá para ver as câmeras pelo celular?", a: "Sim. Configuramos o acesso remoto com segurança para você acompanhar ao vivo e consultar as gravações." },
      { q: "Vocês mexem em sistemas instalados por outra empresa?", a: "Sim. Avaliamos o que já existe, aproveitamos o que estiver em bom estado e corrigimos o que for preciso." },
      { q: "Vocês atendem condomínios?", a: "Sim. Atendemos condomínios residenciais e comerciais, além de empresas, lojas e galpões." },
      { q: "Por quanto tempo as imagens ficam gravadas?", a: "Depende do tamanho do disco do gravador, da quantidade de câmeras, da resolução e de a gravação ser contínua ou por movimento. Isso é dimensionado no projeto, de acordo com quantos dias você precisa guardar." },
      { q: "Vocês fazem manutenção preventiva?", a: "Sim. A manutenção pode ser contratada por 6 meses, 1 ano ou 2 anos, com revisões periódicas e suporte quando algo falhar." },
      { q: "Em quanto tempo vocês respondem?", a: "A primeira resposta chega em até 4 horas úteis, de segunda a sexta, das 8h às 18h." },
      { q: "Quais regiões vocês atendem?", a: `Instalação e manutenção presencial em ${presencialTexto}. Para outras cidades, fale com a gente.` },
    ],
  },

  noc: {
    slug: "/noc-provedores/",
    name: "NOC para provedores",
    service: "noc",
    title: "NOC e Redes para Provedores em Todo o Brasil | Solution Play",
    description:
      "NOC 24/7 e engenharia de redes para provedores de internet em todo o Brasil: BGP, OSPF, MPLS, engenharia de tráfego, core de rede e gestão de ativos.",
    h1: "NOC e engenharia de redes para provedores de internet",
    lead: "Monitoramento 24/7, roteamento e engenharia de tráfego para o seu provedor ficar no ar e crescer com estabilidade.",
    serviceType: "NOC e engenharia de redes",
    areaServed: { "@type": "Country", name: "Brasil" },
    whatsappMessage: "Olá! Vim pela página de NOC para Provedores e quero falar com um especialista.",
    facts: [
      { label: "Para", value: "Provedores (ISPs) e operadoras" },
      { label: "Monitoramento", value: "24 horas, 7 dias por semana" },
      { label: "Contratação", value: "NOC contínuo ou projeto pontual" },
      { label: "Atendimento", value: "Remoto, em todo o Brasil" },
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

const ti = { name: servicePages.ti.name, href: servicePages.ti.slug };
const seguranca = { name: servicePages.seguranca.name, href: servicePages.seguranca.slug };

/* ---------------------------------------------------------------- */
/* Subpáginas de SEO                                                 */
/* ---------------------------------------------------------------- */

export const subPages: Record<"terceirizacao" | "cftvCondominios" | "manutencaoCftv" | "controleAcesso", ServicePageData> = {
  terceirizacao: {
    slug: "/suporte-ti/terceirizacao-de-ti/",
    name: "Terceirização de TI",
    service: "ti",
    parent: ti,
    title: "Terceirização de TI para Empresas em SP | Solution Play",
    description:
      "Terceirização de TI para empresas em São Paulo: suporte remoto e presencial, servidores, rede, backup e Microsoft 365, com contrato de 6 meses a 2 anos.",
    h1: "Terceirização de TI para empresas em São Paulo",
    lead: "Uma equipe externa cuidando dos computadores, servidores, rede e usuários da sua empresa, com contrato mensal, rotina de manutenção e um só contato para tudo.",
    serviceType: "Terceirização de TI",
    whatsappMessage: "Olá! Vim pela página de Terceirização de TI e quero entender como funciona para a minha empresa.",
    facts: [
      { label: "Modelo", value: "Contrato mensal" },
      { label: "Prazo", value: "6 meses, 1 ano ou 2 anos" },
      { label: "Atendimento", value: "Remoto e presencial" },
      { label: "Primeira resposta", value: "Até 4 horas úteis" },
    ],
    intro: {
      title: "O que é terceirizar a TI",
      paragraphs: [
        "Terceirizar a TI é passar para uma empresa especializada o cuidado diário com a tecnologia: atender os chamados dos funcionários, manter computadores e servidores e cuidar da rede, do e-mail e do backup. Em vez de depender de uma pessoa só, a empresa passa a contar com uma equipe e com rotinas definidas em contrato.",
        "Para quem ainda não tem ninguém de TI, é a forma de sair do improviso. Para quem já tem um técnico interno, a terceirização pode cuidar só de uma parte, como servidores e backup, ou reforçar a equipe em férias e projetos maiores.",
      ],
    },
    compare: {
      title: "Terceirizar ou contratar um técnico?",
      intro: "As duas opções funcionam. A diferença está no que cada uma cobre:",
      columns: ["Técnico contratado", "TI terceirizada"],
      rows: [
        { label: "Conhecimento", a: "Depende da experiência de uma pessoa", b: "Equipe com experiência em servidores, redes, segurança e Microsoft 365" },
        { label: "Férias, folgas e desligamento", a: "O atendimento para junto com a pessoa", b: "O atendimento continua, porque o contrato não depende de um nome" },
        { label: "Custo", a: "Salário, encargos, benefícios e treinamento", b: "Valor mensal definido pelo escopo do contrato" },
        { label: "Organização", a: "O conhecimento costuma ficar com quem faz", b: "Rotinas e acessos organizados desde o diagnóstico" },
        { label: "Crescimento", a: "Mais demanda exige nova contratação", b: "O escopo do contrato acompanha o tamanho da empresa" },
      ],
    },
    itemsTitle: "O que a terceirização cobre",
    items: [
      { title: "Canal único de chamados", desc: "Um só contato para os funcionários pedirem ajuda, com primeira resposta em até 4 horas úteis." },
      { title: "Suporte remoto e visitas", desc: "Chamados resolvidos por acesso remoto e visitas presenciais conforme o contrato." },
      { title: "Servidores e Active Directory", desc: "Usuários, permissões, servidor de arquivos e políticas de acesso por setor." },
      { title: "Rede, Wi-Fi e VPN", desc: "Rede organizada e acesso seguro para quem trabalha fora do escritório." },
      { title: "Backup e segurança", desc: "Rotinas de backup testadas, atualizações em dia e políticas para proteger os dados." },
      { title: "Microsoft 365 e e-mail", desc: "Contas, licenças, e-mail corporativo, Teams e compartilhamento de arquivos." },
    ],
    stepsTitle: "Como é a transição",
    steps: [
      { title: "Diagnóstico", desc: "Levantamos computadores, servidores, rede, contas e o que o fornecedor ou técnico anterior deixou." },
      { title: "Proposta", desc: "Escopo, visitas e prazo de 6 meses, 1 ano ou 2 anos definidos por escrito." },
      { title: "Organização", desc: "Resolvemos o urgente e padronizamos acessos, atualizações e backup." },
      { title: "Rotina", desc: "Chamados, manutenção preventiva e acompanhamento contínuo." },
    ],
    faq: [
      { q: "Terceirizar a TI substitui o meu técnico interno?", a: "Não necessariamente. Podemos cuidar de toda a TI ou só de uma parte, como servidores, rede e backup, trabalhando junto com quem já está na empresa." },
      { q: "Vocês assumem a TI que outro fornecedor deixou?", a: "Sim. Começamos com um levantamento do que existe, aproveitamos o que está funcionando e corrigimos o que estiver fora do padrão." },
      { q: "Qual é o prazo do contrato?", a: "O contrato mensal pode ser de 6 meses, 1 ano ou 2 anos. Para uma demanda pontual existe o atendimento avulso, sem contrato." },
      { q: "Quanto custa terceirizar a TI?", a: "Depende do número de computadores, servidores e usuários, das visitas presenciais e das rotinas incluídas. Depois do diagnóstico enviamos a proposta. Chame no WhatsApp para começar." },
      { q: "O atendimento é presencial?", a: `Os chamados são resolvidos principalmente por acesso remoto. As visitas presenciais são feitas em ${presencialTexto}.` },
      { q: "Em quanto tempo vocês respondem?", a: "A primeira resposta chega em até 4 horas úteis, de segunda a sexta, das 8h às 18h." },
    ],
  },

  cftvCondominios: {
    slug: "/seguranca-eletronica/cftv-para-condominios/",
    name: "CFTV para condomínios",
    service: "seguranca",
    parent: seguranca,
    title: "CFTV para Condomínios em São Paulo | Solution Play",
    description:
      "Projeto, instalação e manutenção de CFTV para condomínios em São Paulo: portaria, garagem, elevadores, perímetro e acesso às imagens pelo celular.",
    h1: "CFTV para condomínios em São Paulo",
    lead: "Câmeras bem posicionadas na portaria, garagem, elevadores e perímetro, gravação confiável e acesso às imagens para o síndico e a portaria, com manutenção para o sistema continuar funcionando.",
    serviceType: "CFTV para condomínios",
    whatsappMessage: "Olá! Vim pela página de CFTV para Condomínios e quero agendar uma visita técnica.",
    facts: [
      { label: "Para", value: "Condomínios residenciais e comerciais" },
      { label: "Inclui", value: "Projeto, instalação e manutenção" },
      { label: "Imagens", value: "Pelo celular, com usuários separados" },
      { label: "Primeira resposta", value: "Até 4 horas úteis" },
    ],
    intro: {
      title: "O que um condomínio precisa do CFTV",
      paragraphs: [
        "Em condomínio, a câmera não serve só para gravar: ela ajuda a portaria a decidir quem entra, dá ao síndico uma resposta rápida quando um morador relata um problema e registra o que aconteceu nas áreas de uso comum. Para isso, o sistema precisa cobrir os pontos certos, gravar sem falhas e deixar as pessoas certas consultarem as imagens.",
        "O projeto começa com uma visita técnica, em que avaliamos acessos, garagem, perímetro, iluminação e o que já está instalado. Se o condomínio já tem câmeras de outra empresa, aproveitamos o que estiver em bom estado.",
      ],
    },
    itemsTitle: "Onde as câmeras fazem diferença",
    items: [
      { title: "Portaria e entrada de pedestres", desc: "Imagem nítida do rosto de quem chega, para a portaria identificar quem está no portão." },
      { title: "Garagem e portões de veículos", desc: "Cobertura da entrada e da saída de carros e das vagas mais afastadas." },
      { title: "Elevadores e halls", desc: "Registro de quem circula pelas áreas internas de uso comum." },
      { title: "Perímetro e muros", desc: "Câmeras nos pontos de acesso mais vulneráveis, integradas ao alarme quando houver." },
      { title: "Áreas de lazer", desc: "Playground, piscina, salão e academia cobertos sem invadir a privacidade das unidades." },
      { title: "Encomendas", desc: "Registro da entrega e da retirada de pacotes na portaria." },
    ],
    checklist: {
      title: "Quem acessa as imagens, e como",
      intro: "Imagens de pessoas são dados pessoais pela LGPD. Por isso, o acesso precisa ser combinado e controlado. O que recomendamos e configuramos:",
      list: [
        "Usuários separados para síndico, portaria e administradora, cada um vendo o que precisa.",
        "Acesso pelo celular configurado com segurança.",
        "Câmeras apenas em áreas comuns, com aviso de área monitorada.",
        "Uma regra definida pelo condomínio para fornecer imagens a moradores e autoridades.",
        "Data e hora certas nas gravações, para a imagem servir como registro.",
      ],
    },
    stepsTitle: "Do orçamento à assembleia",
    steps: [
      { title: "Visita técnica", desc: "Avaliamos acessos, garagem, perímetro, iluminação e o sistema atual." },
      { title: "Projeto e proposta", desc: "Posição de cada câmera, gravação e acessos, numa proposta por escrito para levar ao conselho ou à assembleia." },
      { title: "Instalação", desc: "Instalação organizada e teste de todas as câmeras e gravações." },
      { title: "Treinamento e manutenção", desc: "Mostramos à portaria e ao síndico como consultar e exportar imagens, e seguimos com a manutenção." },
    ],
    faq: [
      { q: "Precisa de aprovação em assembleia para instalar câmeras?", a: "Depende da convenção e do valor da obra. Por isso entregamos a proposta por escrito, com a posição das câmeras e o escopo, para o síndico apresentar ao conselho ou à assembleia." },
      { q: "O síndico consegue ver as câmeras pelo celular?", a: "Sim. Configuramos o acesso remoto com segurança e usuários separados para síndico, portaria e administradora, cada um com as permissões combinadas." },
      { q: "Podemos aproveitar as câmeras que já existem?", a: "Sim. Avaliamos o sistema atual, inclusive se foi instalado por outra empresa, e aproveitamos o que estiver em bom estado." },
      { q: "Quantos dias de gravação o condomínio precisa?", a: "Não há um número fixo: o condomínio define o período de acordo com a forma como usa as imagens. O tempo de gravação depende do disco, da quantidade de câmeras e da resolução, e é dimensionado no projeto." },
      { q: "Câmera no condomínio precisa seguir a LGPD?", a: "Sim. Imagens de pessoas são dados pessoais. O recomendado é filmar apenas áreas comuns, sinalizar as áreas monitoradas, limitar quem acessa as gravações e ter uma regra para fornecer imagens." },
      { q: "Vocês fazem a manutenção depois?", a: "Sim. A manutenção pode ser contratada por 6 meses, 1 ano ou 2 anos, com revisões periódicas e primeira resposta em até 4 horas úteis." },
    ],
  },

  manutencaoCftv: {
    slug: "/seguranca-eletronica/manutencao-de-cftv/",
    name: "Manutenção de CFTV",
    service: "seguranca",
    parent: seguranca,
    title: "Manutenção de CFTV e Câmeras em São Paulo | Solution Play",
    description:
      "Manutenção preventiva e corretiva de CFTV em São Paulo: câmera sem imagem, gravador que não grava, disco, acesso pelo celular e sistemas de outras empresas.",
    h1: "Manutenção de CFTV em São Paulo",
    lead: "Câmera sem imagem, gravador que parou de gravar ou acesso pelo celular que não abre? Fazemos a manutenção corretiva e preventiva do seu CFTV, inclusive de sistemas instalados por outra empresa.",
    serviceType: "Manutenção de CFTV",
    whatsappMessage: "Olá! Vim pela página de Manutenção de CFTV e preciso de ajuda com as câmeras.",
    facts: [
      { label: "Tipo", value: "Corretiva e preventiva" },
      { label: "Sistemas", value: "Inclusive instalados por outra empresa" },
      { label: "Contratação", value: "Avulsa ou contrato de 6 meses a 2 anos" },
      { label: "Primeira resposta", value: "Até 4 horas úteis" },
    ],
    intro: {
      title: "Por que o CFTV para de funcionar",
      paragraphs: [
        "A maioria das falhas aparece aos poucos: um disco que começa a dar erro, uma fonte que esquenta, um conector que oxida com a chuva, uma câmera que perde o foco. Como ninguém assiste às gravações todos os dias, o problema só é descoberto quando alguém precisa de uma imagem e ela não existe.",
        "A manutenção preventiva serve justamente para encontrar essas falhas antes. E quando algo já parou, a manutenção corretiva encontra a causa e coloca o sistema para gravar de novo.",
      ],
    },
    checklist: {
      title: "Sinais de que o CFTV precisa de manutenção",
      list: [
        "Câmera com imagem preta, chuviscada ou sem sinal.",
        "Gravador que não grava, reinicia sozinho ou mostra aviso de disco.",
        "Imagem noturna escura, estourada ou com reflexo.",
        "Lente suja, embaçada ou com teia de aranha.",
        "Data e hora erradas nas gravações.",
        "Acesso pelo celular que parou de funcionar.",
        "Ninguém sabe a senha do gravador.",
      ],
    },
    compare: {
      title: "Corretiva ou preventiva?",
      columns: ["Manutenção corretiva", "Manutenção preventiva"],
      rows: [
        { label: "Quando", a: "Depois que algo parou de funcionar", b: "Em visitas periódicas, antes da falha" },
        { label: "Objetivo", a: "Encontrar a causa e voltar a gravar", b: "Evitar que câmeras e gravador parem" },
        { label: "Contratação", a: "Atendimento avulso", b: "Contrato de 6 meses, 1 ano ou 2 anos" },
        { label: "Indicada para", a: "Quem precisa resolver um problema agora", b: "Quem não pode ficar sem imagem" },
      ],
    },
    itemsTitle: "O que verificamos na manutenção",
    items: [
      { title: "Gravador e disco", desc: "Gravação de todas as câmeras, saúde do disco e quantos dias de gravação cabem nele." },
      { title: "Câmeras e lentes", desc: "Limpeza, foco, ângulo e funcionamento do infravermelho à noite." },
      { title: "Cabos, conectores e fontes", desc: "Conexões oxidadas, fontes fracas e cabos danificados, que causam falhas na imagem." },
      { title: "Energia", desc: "Nobreak e proteção elétrica, quando houver, para o sistema não desligar com quedas de energia." },
      { title: "Data, hora e firmware", desc: "Relógio certo nas gravações e firmware atualizado para corrigir falhas e brechas." },
      { title: "Acesso remoto", desc: "Aplicativo do celular funcionando e acesso remoto configurado com segurança." },
    ],
    steps: [
      { title: "Contato", desc: "Você conta o que está acontecendo pelo WhatsApp. Se puder, mande uma foto da tela do gravador." },
      { title: "Diagnóstico", desc: "Verificamos a distância o que for possível e agendamos a visita quando precisa de alguém no local." },
      { title: "Reparo", desc: "Corrigimos a causa e testamos a gravação de todas as câmeras." },
      { title: "Prevenção", desc: "Se fizer sentido, montamos um plano de manutenção preventiva para não voltar a acontecer." },
    ],
    faq: [
      { q: "Vocês fazem manutenção em CFTV instalado por outra empresa?", a: "Sim. Avaliamos o sistema, aproveitamos o que estiver em bom estado e corrigimos o que for preciso, sem exigir trocar tudo." },
      { q: "Quanto custa a manutenção de CFTV?", a: "Depende da quantidade de câmeras, do tipo de problema e de ser um atendimento avulso ou um contrato de manutenção preventiva. Chame no WhatsApp e conte o que está acontecendo." },
      { q: "De quanto em quanto tempo fazer manutenção preventiva?", a: "Depende do tamanho do sistema e do ambiente: câmeras externas, expostas a chuva, sol e poeira, pedem revisões mais frequentes. A frequência é definida no contrato." },
      { q: "O gravador parou de gravar. Perdi as imagens?", a: "Nem sempre. Se o problema estiver na configuração ou no disco, parte das gravações às vezes ainda pode ser recuperada. Por isso, evite formatar ou reconfigurar o gravador antes do diagnóstico." },
      { q: "Vocês configuram o acesso às câmeras pelo celular?", a: "Sim. Configuramos o aplicativo e o acesso remoto com segurança, para ver ao vivo e rever gravações de onde estiver." },
      { q: "Em quanto tempo vocês respondem?", a: "A primeira resposta chega em até 4 horas úteis, de segunda a sexta, das 8h às 18h." },
    ],
  },

  controleAcesso: {
    slug: "/seguranca-eletronica/controle-de-acesso/",
    name: "Controle de acesso",
    service: "seguranca",
    parent: seguranca,
    title: "Controle de Acesso para Empresas em SP | Solution Play",
    description:
      "Controle de acesso por cartão, biometria ou QR Code para empresas e condomínios em São Paulo: portas, catracas, registro de entradas e integração com CFTV.",
    h1: "Controle de acesso para empresas e condomínios em São Paulo",
    lead: "Quem entra, por onde e em que horário: controle de acesso por cartão, biometria ou QR Code em portas e catracas, com registro de cada passagem e integração com as câmeras.",
    serviceType: "Controle de acesso",
    whatsappMessage: "Olá! Vim pela página de Controle de Acesso e quero um orçamento.",
    facts: [
      { label: "Credenciais", value: "Cartão, biometria ou QR Code" },
      { label: "Onde", value: "Portas e catracas" },
      { label: "Para", value: "Empresas e condomínios" },
      { label: "Primeira resposta", value: "Até 4 horas úteis" },
    ],
    intro: {
      title: "Por que trocar a chave por controle de acesso",
      paragraphs: [
        "Chave se copia, se perde e não diz quem abriu a porta. Com controle de acesso, cada pessoa tem a própria credencial, o acesso pode ser limitado por área e horário e, quando alguém sai da empresa ou do condomínio, basta desativar o cadastro, sem trocar fechaduras.",
        "Cada passagem fica registrada com nome, porta e horário. Integrado ao CFTV, esse registro ajuda a conferir a imagem do momento exato de uma entrada.",
      ],
    },
    compare: {
      title: "Cartão, biometria ou QR Code?",
      intro: "Cada credencial tem um uso melhor, e muitos locais combinam mais de uma:",
      columns: ["Vantagens", "Pontos de atenção"],
      rows: [
        { label: "Cartão ou tag", a: "Rápido, barato e fácil de entregar e recolher", b: "Pode ser emprestado ou perdido; precisa de bloqueio rápido" },
        { label: "Biometria", a: "Não se perde nem se empresta", b: "Exige cadastro presencial e é dado sensível pela LGPD" },
        { label: "QR Code", a: "Prático para visitantes e prestadores, com validade definida", b: "Depende do celular da pessoa e de quem gera o código" },
      ],
    },
    itemsTitle: "O que entra no projeto",
    items: [
      { title: "Leitores e fechaduras", desc: "Leitores de cartão, biometria ou QR Code e fechaduras adequadas a cada porta." },
      { title: "Catracas", desc: "Controle do fluxo de pessoas em recepções e entradas de funcionários." },
      { title: "Cadastro e permissões", desc: "Pessoas, áreas e horários permitidos, com bloqueio imediato de quem sai." },
      { title: "Visitantes e prestadores", desc: "Acesso temporário, com validade definida, sem entregar chave." },
      { title: "Registro de passagens", desc: "Relatório de quem passou, por qual porta e em que horário." },
      { title: "Integração com CFTV", desc: "Registro de acesso e imagem do mesmo momento, para conferência rápida." },
    ],
    checklist: {
      title: "O que avaliamos antes de instalar",
      list: [
        "Quantas portas e catracas precisam de controle.",
        "Quantas pessoas e visitantes passam por dia.",
        "Como cada porta deve se comportar se faltar energia: abrir ou continuar trancada.",
        "Necessidade de nobreak para o sistema seguir funcionando numa queda de energia.",
        "Rotas de fuga e saídas de emergência sempre liberadas.",
        "Integração com as câmeras, o alarme e a rede que já existem.",
      ],
    },
    steps: [
      { title: "Visita técnica", desc: "Avaliamos portas, fluxo de pessoas, energia e o que já está instalado." },
      { title: "Projeto", desc: "Tipo de credencial, equipamentos e permissões definidos com você." },
      { title: "Instalação", desc: "Instalamos, configuramos as regras de acesso e ajudamos no cadastro inicial." },
      { title: "Treinamento e suporte", desc: "Mostramos como cadastrar, bloquear e consultar registros, e seguimos com o suporte." },
    ],
    faq: [
      { q: "Qual é melhor: cartão, biometria ou QR Code?", a: "Depende do uso. Biometria evita o empréstimo da credencial, o cartão é mais prático para muita gente e o QR Code funciona bem para visitantes. Muitos projetos combinam dois tipos." },
      { q: "O que acontece com a porta se faltar energia?", a: "Isso é definido no projeto. Saídas de emergência devem abrir; outras portas podem continuar trancadas. Com nobreak, o sistema segue funcionando durante a queda." },
      { q: "Dá para integrar o controle de acesso às câmeras?", a: "Sim. Integramos o controle de acesso ao CFTV para conferir a imagem do momento de cada passagem." },
      { q: "Como fica o acesso de visitantes e prestadores?", a: "Eles podem receber acesso temporário, por QR Code ou cartão de visitante, com validade definida e registro da passagem." },
      { q: "Controle de acesso funciona em condomínio?", a: "Sim. Atendemos condomínios residenciais e comerciais, em portarias e áreas comuns." },
      { q: "Biometria precisa de cuidado com a LGPD?", a: "Sim. Biometria é dado pessoal sensível. As pessoas precisam ser informadas, a biometria deve ser usada só para o controle de acesso e o cadastro precisa ficar protegido." },
      { q: "Vocês atendem sistemas instalados por outra empresa?", a: "Sim. Avaliamos o que existe e corrigimos o que for preciso, aproveitando os equipamentos em bom estado." },
    ],
  },
};
