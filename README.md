# ⚗️ Fenrhold — Laboratorio Alchemico

App PWA per la gestione dell'alchimia in una campagna D&D 5e nel mondo di Fenrhold.

## Funzionalità

- Database di 100 piante/ingredienti alchemici dal PDF di campagna
- Selezione fino a 5 erbe + 1 stabilizzatore
- Analisi coerenza della miscela in tempo reale (4 livelli)
- Generazione pozione via AI (Claude claude-sonnet-4-5)
- Scheda pozione con effetti meccanici D&D 5e
- PWA installabile su Android

---

## Come pubblicare su Vercel (passo per passo)

### 1. Crea il repository GitHub

1. Vai su [github.com](https://github.com) e accedi al tuo account
2. Clicca su **New repository**
3. Dai un nome (es. `fenrhold-alchemy`), scegli **Public** o **Private**, poi clicca **Create repository**
4. Nel tuo terminale locale, esegui:
   ```bash
   git init
   git add .
   git commit -m "Prima versione app Fenrhold"
   git branch -M main
   git remote add origin https://github.com/TUO-USERNAME/fenrhold-alchemy.git
   git push -u origin main
   ```

### 2. Crea la API Key Anthropic

1. Vai su [console.anthropic.com](https://console.anthropic.com)
2. Registrati o accedi
3. Vai su **API Keys** → **Create Key**
4. Copia la chiave (inizia con `sk-ant-...`) e salvala in un posto sicuro
5. **Non inserirla mai nel codice** — verrà impostata come variabile d'ambiente su Vercel

### 3. Importa il progetto su Vercel

1. Vai su [vercel.com](https://vercel.com) e accedi con il tuo account GitHub
2. Clicca **Add New → Project**
3. Seleziona il repository `fenrhold-alchemy` dall'elenco
4. Nella sezione **Environment Variables** aggiungi:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** la chiave copiata al passo precedente
5. Lascia tutte le altre impostazioni di default (Vercel rileva automaticamente Vite)
6. Clicca **Deploy**
7. In 2-3 minuti l'app sarà live su un URL tipo `fenrhold-alchemy.vercel.app`

### Installazione su Android

1. Apri l'URL dell'app in Chrome su Android
2. Apparirà il banner "Aggiungi alla schermata Home"
3. Oppure: menu Chrome → **Installa app**
4. L'app si aprirà in modalità standalone (senza barra del browser)

---

## Struttura del progetto

```
fenrhold-alchemy/
├── api/
│   └── generate-potion.js   # Serverless function Vercel (chiama Claude)
├── public/
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker
├── src/
│   ├── components/
│   │   ├── Cauldron.jsx      # Pannello calderone laterale
│   │   ├── PlantCard.jsx     # Card singola ingrediente
│   │   └── PotionModal.jsx   # Modale scheda pozione
│   ├── data/
│   │   └── plants.js         # Database 100 piante
│   ├── utils/
│   │   └── coherence.js      # Analisi coerenza miscela
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## Sviluppo locale

```bash
npm install
# Crea file .env nella root:
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
npm run dev
```

> Nota: per testare la funzione `/api/generate-potion` in locale usa `vercel dev` dopo aver installato la Vercel CLI (`npm i -g vercel`).
