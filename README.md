# Solution Play — Amostra Vercel

Landing estática (**Astro**) para o cliente visualizar proposta de UI e conteúdo (TI + telecom, leads e contratos). **Não** é o site Wix oficial; não há backend nem Velo.

## Rodar localmente

```powershell
cd D:\SolutionPlay-vercel
npm install
npm run dev
```

Build de produção (saída em `dist/`):

```powershell
npm run build
npm run preview
```

## Deploy na Vercel

Com o repositório já conectado ao GitHub, cada `git push` na branch configurada (ex.: `main`) dispara um deploy automático.

Definições usuais no painel da Vercel:

- **Framework Preset:** Astro
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

Deploy manual (alternativa):

```powershell
npx vercel
npx vercel --prod
```

## O que o cliente deve revisar antes de ir ao ar

- Textos legais, política de privacidade e termos (se aplicável).
- **WhatsApp:** no código, substituir o número de exemplo (`LeadForm.astro`, constante `WHATSAPP_E164`) pelo número publicado no site oficial.
- **CNPJ, telefone fixo e demais dados institucionais:** conferir com o site publicado; esta amostra usa placeholders explícitos.
- Fotos, logotipos e menção a marcas de terceiros (ex.: Zabbix/Grafana) conforme licença.

## Documentação original do briefing

Ver `README.vercel-demo.md` (instruções completas do demo).
