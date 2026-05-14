# Solution Play — Amostra front-end (Vercel)

> **Como usar este arquivo:** copie-o para a **pasta nova do projeto de demonstração** (fora do repo Wix) e renomeie para **`README.md`**. Abra essa pasta no Cursor e peça ao assistente: *“Leia o README.md e implemente conforme as instruções.”*

Este projeto **não** é o site Wix. É uma **amostra estática** (HTML / Astro / React / Vite) para o cliente **Solution Play** visualizar proposta de UI e conteúdo. Hospedagem sugerida: **Vercel** (URL grátis `*.vercel.app`, sem domínio do cliente).

---

## Instruções para o assistente (Cursor / outro agente)

**Leia isto primeiro** antes de criar arquivos.

### Contexto

- **Objetivo:** landing **bonita, didática e moderna** (área de tecnologia), focada em **leads** e **contratações**.
- **Stack:** preferir **Astro** (rápido para landings) ou **Vite + React** — HTML estático no build final é aceitável. Evitar backend próprio nesta fase; formulário pode abrir **WhatsApp** (`https://wa.me/...`) ou mailto, com texto pré-preenchido.
- **Dados de contato:** **não inventar** telefone, WhatsApp nem CNPJ reais. No demo use **placeholder** claro (ex.: “Número comercial: conforme site oficial”) ou botão WhatsApp com número **genérico de exemplo** e comentário no código `// TODO: substituir pelo número publicado no site do cliente`.
- **Escopo:** uma página principal com boa hierarquia visual; opcional segunda página “Serviços”. Responsivo (mobile primeiro).
- **Deploy:** preparar para **Vercel** (`vercel.json` se necessário, output estático em `dist/` ou `out/`). Documentar no final do README os comandos `npm run build` e `vercel` / import Git.
- **Separação:** esta pasta **não** deve depender do repositório **Solution-Play** (Wix). Nenhum código Velo (`$w`, `wix-`).

### O que entregar ao humano

1. Projeto **buildável** (`npm install` / `npm run build` sem erros).
2. **README** atualizado com comandos e aviso de que é amostra.
3. Lista do que o cliente deve **revisar** (textos legais, número WhatsApp, fotos).

---

## Briefing do cliente (fonte da verdade — copiado do projeto Wix)

Implementar a comunicação do site com base no texto abaixo. No **site oficial Wix**, telefone, WhatsApp e CNPJ **já existem** — no **demo Vercel**, não inventar dados reais; usar placeholders até o cliente confirmar.

### Objetivo

Site para **capturar leads** e **novas contratações**, focado em **prestação de serviços de TI e telecom**.

### Escopo de serviços (TI)

- Implantação de servidores  
- Active Directory  
- File Server  
- Proxy Web  
- Proxy Squid  
- Monitoramento (Zabbix, Grafana)  
- DNS **recursivo**  
- VPNs  

### Escopo de serviços (telecomunicações)

- Implantação de roteadores  
- Serviços de **camada 3**: roteamento **OSPF**, **BGP**, **MPLS**  
- Serviços em **switches camada 2**: VLANs de serviço e de **transporte**, **QinQ**, translation, entre outros  

### Comercial / contratos

- Contratos **mensais a partir de R$ 300,00** (valor a **consultar** conforme **quantidade de equipamentos** incluídos no contrato).  
- Prazos de contrato: **6 meses**, **1 ano** e **2 anos**.  

### Experiência / UI

- Interface **inovadora**, que **chame a atenção**, alinhada à **área de tecnologia**.  
- Transmitir **confiança** ao cliente.  

### Conteúdo institucional

- Demais informações (**número para contato**, **CNPJ**, etc.) seguem a **página atual** do site oficial — no demo, texto genérico ou “veja canais no site publicado”, sem dados inventados.

---

## Sugestão de UX (para o assistente implementar)

- **Hero** forte com proposta de valor (TI + telecom, leads/contratos).
- **Abas ou seções** distintas: **Empresas / TI** vs **Provedores / Telecom**, cada uma com cards alinhados aos escopos acima.
- **Bloco comercial** explícito: R$ 300 mensal, consulta por equipamentos, prazos 6 / 12 / 24 meses.
- **CTA** claro: formulário simples (nome, perfil, telefone, mensagem) → WhatsApp ou mensagem copiável.
- **Monitoramento:** menção visual a Zabbix/Grafana (logos apenas se licença de marca permitir; senão, texto).
- **Acessibilidade:** contraste, foco visível, `lang="pt-BR"`, headings em ordem.

---

## Comandos úteis (ajustar conforme o gerador escolhido)

Após o assistente criar o projeto:

```powershell
cd <pasta-do-demo>
npm install
npm run dev      # desenvolvimento local
npm run build    # gerar estático
```

**Vercel (conta do desenvolvedor):**

```powershell
npx vercel       # primeiro deploy, seguir prompts
npx vercel --prod
```

Ou conectar o repositório Git desta pasta ao dashboard Vercel (**Import Git Repository**).

---

## Relação com o repositório Wix `Solution-Play`

| Repositório / pasta | Uso |
|---------------------|-----|
| `Solution-Play` (Wix + Velo + CLI) | Site oficial do cliente na Wix |
| **Esta pasta** (demo) | Amostra visual no Vercel; código e deploy independentes |

Não mesclar os dois repositórios na mesma raiz sem alinhamento explícito.

---

## Links úteis

- [Vercel — documentação](https://vercel.com/docs)
- [Astro](https://docs.astro.build/)
- [Vite](https://vitejs.dev/)
