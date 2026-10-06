# Solution Play 3D Cinematic Redesign Spec

**Goal:** transformar a pagina publica da Solution Play em uma experiencia visual de alto nivel, com sensacao tridimensional e apresentacao cinematica, preservando 100% do conteudo escrito e a logo oficial.

**Reference Level:** inspiracao de presenca, profundidade, fluidez e acabamento visual equivalente a sites como `https://www.8bit.ai`, sem copiar layout, textos, ativos, modelos ou identidade visual de terceiros.

**Approved Direction:** hibrido B+C: jornada em capitulos com cena 3D full-bleed persistente, conteudo editorial limpo em HTML por cima, precos no bloco final de decisao.

---

## Non-Negotiables

- Preservar 100% dos textos existentes em `src/data/marketingContent.ts`.
- Preservar a logo oficial como imagem intacta, usando os arquivos em `LOGO/`, especialmente `LOGO/SolutionPlay.png` e variantes quando necessario.
- Manter os planos e valores no final da narrativa, com leitura clara e comparavel.
- Remover a dependencia visual dos videos atuais como elemento principal da experiencia.
- Manter o site leve o suficiente para desktop e mobile, com fallback visual para dispositivos sem WebGL ou com preferencia de movimento reduzido.
- Nao transformar o site em copia do `8bit.ai`; a referencia e de nivel de acabamento, nao de identidade.
- Manter o conteudo comercial em HTML sem depender do canvas para leitura.
- Preservar formulario, WhatsApp, e-mail, dados de confianca, CNPJ e SEO estruturado.

## Current Project Context

- Framework: Astro.
- Styling: Tailwind CSS v4 e CSS global existente.
- Motion/scroll: GSAP e Lenis ja presentes.
- 3D: Three.js ja presente.
- Conteudo fonte: `src/data/marketingContent.ts`.
- Home atual: `src/pages/index.astro`, com quatro slides principais.
- Logo atual: `src/components/BrandLogo.astro`, usando `LOGO/SolutionPlay.png`.
- Videos atuais: `public/media/background-inicio.mp4`, `public/media/background-servico.mp4`, `public/media/background-contratos.mp4`.

## Desired Experience

A pagina deve parecer uma apresentacao premium de tecnologia, com profundidade, luz, camadas, movimento e uma narrativa clara. A sensacao deve ser de entrar em um ambiente digital da Solution Play: primeiro a marca, depois a infraestrutura de TI, depois servicos e beneficios, depois contratos e valores, e finalmente contato.

O canvas 3D deve funcionar como uma atmosfera persistente. Ele nao deve competir com o texto. O conteudo escrito continua sendo o protagonista funcional; a cena tridimensional da autoridade, ritmo e memorabilidade.

## Narrative Structure

### Chapter 1: Marca e Promessa

Conteudo:
- Logo oficial.
- Slogan: "Tecnologia que resolve. Solucoes que impulsionam."
- Headline: "Solucoes de TI completas para sua empresa!"
- Lead institucional.
- Beneficios principais.
- CTAs para formulario e servicos.

Visual:
- Logo oficial em primeiro plano, intacta.
- Ao fundo, nucleo 3D abstrato inspirado em infraestrutura: linhas, placas, luzes e conexoes.
- Entrada cinematica com profundidade leve, sem exagero.

### Chapter 2: Servicos Gerenciados

Conteudo:
- `mspIntro`.
- `differentiators`.
- Servicos principais e explicacoes ja presentes no site.

Visual:
- Camadas 3D que sugerem rede, suporte, monitoramento e seguranca.
- Transicao por profundidade, como se a camera avancasse por uma estrutura tecnica.

### Chapter 3: Beneficios e Confianca

Conteudo:
- Beneficios: mais seguranca, mais produtividade, suporte rapido, tecnologia ativa.
- Diferenciais de atendimento e consultoria.

Visual:
- Paineis leves em profundidade, com linhas de conexao e microinteracoes.
- Movimento mais calmo para reforcar confianca.

### Chapter 4: Contratos, Planos e Valores

Conteudo:
- Titulo "Contratos e valores".
- Todos os planos MSP:
  - START, R$ 300/mes.
  - ESSENCIAL, R$ 590/mes.
  - PROFISSIONAL, R$ 1.190/mes.
  - BUSINESS, R$ 2.490/mes.
  - ENTERPRISE, Sob consulta.
- Escopos e inclusoes de cada plano.
- Servicos avulsos.
- Garantias e licenciamento.
- Observacoes comerciais.

Visual:
- Ambiente mais claro e comparativo.
- Cards ou linhas de planos com profundidade sutil, sem esconder informacao.
- Destaque visual para planos, mas sem alterar textos ou valores.

### Chapter 5: Proximo Passo

Conteudo:
- Contato.
- Formulario.
- WhatsApp.
- E-mail.
- CNPJ.
- Itens de confianca.

Visual:
- Cena desacelera.
- Conexoes convergem para uma acao clara.
- Formulario deve ser direto, legivel e sem interferencia do canvas.

## Visual System

### Palette

Usar a identidade atual como base, mas evoluir para um visual mais premium. Evitar que a pagina vire uma tela escura generica. A paleta deve combinar:

- Fundo profundo neutro.
- Branco e cinzas para legibilidade.
- Tons da marca preservados conforme os assets atuais.
- Acentos luminosos controlados em botoes, linhas e estados ativos.
- Contraste WCAG AA em textos essenciais.

### Typography

- Manter hierarquia editorial forte.
- Hero com tipografia grande, mas sem quebras instaveis.
- Planos e valores com leitura rapida.
- Sem letter-spacing negativo.
- Sem fonte escalando diretamente com viewport width.

### 3D Language

- Three.js full-bleed, nao dentro de card.
- Geometria procedural prioritariamente, para evitar dependencia de modelos 3D externos.
- Particulas, linhas, planos e malhas leves para sugerir infraestrutura.
- Camera com movimento sutil por capitulo.
- Logo oficial sempre renderizada como imagem HTML ou textura intacta, sem distorcer proporcao.

### Motion

- Scroll guiado por capitulos, mas sem prender o usuario de forma frustrante.
- GSAP para timeline de transicoes.
- Lenis para suavidade, respeitando `prefers-reduced-motion`.
- Movimentos curtos, premium e claros.
- Evitar excesso de brilho, tremor ou movimento constante em textos.

## Technical Architecture

### Components

- `CinematicScene.astro`: monta o container do canvas e fallback.
- `cinematicSceneBoot.ts`: inicializa Three.js, renderer, camera, cenas, resize e loop.
- `cinematicTimeline.ts`: conecta scroll/capitulo com camera, materiais e intensidade visual.
- `contentChapters.ts`: define metadados dos capitulos sem duplicar o conteudo comercial.
- `CinematicChapter.astro`: layout de capitulo para conteudo HTML.
- `PricingFinale.astro`: apresentacao final dos planos e valores usando `mspPlans` e `oneOffServices`.
- `motionPreference.ts`: leitura de dispositivo, WebGL e `prefers-reduced-motion`.

### Data Rules

- `src/data/marketingContent.ts` permanece como fonte unica dos textos.
- Nenhum texto comercial deve ser duplicado manualmente nos componentes novos.
- Se for necessario enfatizar texto, usar a string original importada e envolver trechos visualmente sem mudar o conteudo.

### Fallbacks

- Sem WebGL: exibir fundo estatico procedural em CSS e todo o conteudo HTML normalmente.
- Mobile fraco: reduzir DPR, particulas, efeitos de pos-processamento e intensidade de scroll.
- `prefers-reduced-motion`: desativar timeline cinematica e usar transicoes simples.

### Performance Targets

- Remover videos da experiencia principal.
- Canvas nao deve bloquear leitura do conteudo.
- Limitar DPR em mobile e telas muito grandes.
- Evitar modelos pesados na primeira versao.
- Build Astro deve continuar passando.
- O primeiro viewport deve carregar rapido com logo, headline e CTA visiveis.

## Acceptance Criteria

- A home apresenta uma experiencia premium com sensacao tridimensional full-bleed.
- Logo oficial aparece intacta no primeiro viewport.
- Todo o conteudo de `src/data/marketingContent.ts` continua presente e acessivel.
- Os planos e valores aparecem no capitulo final de decisao.
- Os videos existentes nao sao usados como fundo principal da narrativa.
- Site funciona em desktop e mobile.
- Site respeita `prefers-reduced-motion`.
- Formulario, WhatsApp e e-mail continuam funcionando.
- `npm run build` passa.
- QA visual deve verificar no minimo desktop 1440x900 e mobile 390x844.

## Implementation Preference

Implementar em fases pequenas, sempre mantendo o site funcional. A primeira versao deve priorizar a experiencia 3D procedural, reorganizacao narrativa e remocao da dependencia visual dos videos. Refinamentos de shader, microinteracoes e polimento devem vir depois que a estrutura estiver aprovada em navegador.
