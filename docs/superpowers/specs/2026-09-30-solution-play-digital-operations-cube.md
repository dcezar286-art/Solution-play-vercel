# Solution Play Digital Operations Cube Spec

**Goal:** refazer a direcao visual do site usando a Hubtown como referencia de linguagem: uma experiencia narrativa por cenas, com moldura premium, scroll cinematografico e um cubo 3D da Solution Play como protagonista.

**Reference:** `https://hubtown.co.in/`

**Approved Direction:** manter nome e logo oficial da Solution Play, mas mudar a identidade do site. O cubo da logo vira objeto 3D procedural central, animado por scroll e teclado.

## Non-Negotiables

- Nao fazer push nem publicar sem autorizacao do usuario.
- Manter o nome Solution Play.
- Manter a logo oficial intacta em UI/header.
- O cubo 3D pode ser uma representacao procedural inspirada na logo, mas nao substitui a logo oficial.
- Preservar o conteudo comercial existente como fonte principal.
- Criar uma experiencia no estilo Hubtown sem copiar assets, textos, marca, composicao exata ou tema imobiliario.
- Validar em localhost antes de qualquer publicacao.

## Visual Direction

Nome interno: **Digital Operations Cube**.

A Solution Play passa a ser apresentada como um ambiente de operacoes digitais. Um cubo modular luminoso ocupa o centro da cena, como nucleo da marca. A cada cena, o cubo muda de comportamento e os cards se reposicionam em torno dele.

## Scene Model

1. **Future / Inicio**
   - Cubo fechado, flutuando, rotacao lenta.
   - Conteudo hero e beneficios em volta como primeira apresentacao.

2. **Infrastructure / Servicos**
   - Cubo se abre levemente em camadas.
   - Cards de servicos entram como paineis tecnicos.

3. **Network / Beneficios**
   - Linhas e pontos saem do cubo.
   - Beneficios aparecem como modulos conectados.

4. **Protection / Garantias**
   - Cubo ganha uma camada visual de protecao.
   - Confianca, licenciamento e diferenciais ficam mais estaveis.

5. **Plans / Contratos**
   - Cubo vira referencia para uma grade de planos.
   - Planos entram como modulos comparativos.

6. **Contact / Proximo passo**
   - Cena converge para formulario e WhatsApp.
   - Movimento reduz e foco fica na conversao.

## Technical Direction

- Usar Three.js procedural, sem modelo externo nesta primeira versao.
- Construir o cubo a partir de pequenos blocos/tiles, com lacunas e profundidade para lembrar o cubo da logo.
- Controlar estado via `data-active-chapter` e CSS variables.
- Adicionar `data-motion-card` aos principais cards.
- Criar navegacao por teclado para avancar/voltar cenas.
- Usar GSAP apenas para DOM/card choreography, mantendo o canvas leve.
- Respeitar `prefers-reduced-motion`.

## Acceptance Criteria

- O cubo 3D modular aparece como protagonista na primeira tela.
- Scroll muda o estado do cubo e da cena.
- Setas do teclado avancam e voltam cenas.
- Cards se reposicionam/animam por cena.
- Conteudo principal continua legivel e acessivel.
- Logo oficial permanece intacta no header/hero.
- `npm run verify:cinematic` passa.
- `npm run build` passa.
