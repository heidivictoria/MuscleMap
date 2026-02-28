# 💪 MuscleMap

**Visualiser fremgangen din.**

MuscleMap er en treningsapp som kartlegger hvilke muskler du trener, sporer balansen din over tid, og hjelper deg med å trene smartere. Se kroppen din lyse opp etter hvert som du trener – og oppdag raskt hvilke muskelgrupper som trenger mer oppmerksomhet.

## Funksjoner

### 📋 Treningsprogram
- 7 ferdiglagde programmer (Push, Pull, Bein, Overkropp, Underkropp, Fullkropp, Core)
- Rediger og tilpass eksisterende programmer
- Bygg helt egne treningsøkter

### 🔍 Øvelsesbibliotek
- 51 øvelser med beskrivelser
- Søk og filtrer på muskelgruppe og utstyrstype
- Hver øvelse har primær- og sekundærmuskelgrupper

### 💪 Muskelkart
- Interaktiv SVG-kroppsfigur (forfra og bakfra)
- **All-time visning**: Fargenivåer basert på totalt treningsvolum over tid
- **Ukentlig visning**: Se hvilke muskler du har truffet denne uken

### 📊 Ukeoversikt
- Balansescore som måler hvor jevnt du trener
- Kondisjonsbar med justerbart ukemål
- Streak per muskelgruppe (uker på rad)
- Intelligente anbefalinger for neste økt

### ⏱️ Timer
- Stoppeklokke og nedtelling
- Forhåndsinnstilte intervaller (30s, 45s, 60s, 90s, 120s)

### 📝 Automatisk loggføring
- Fullførte økter logges med muskeldata
- Muskelkartet oppdateres automatisk
- All data lagres lokalt i nettleseren

## Kom i gang

### Forutsetninger
- [Node.js](https://nodejs.org/) (versjon 18 eller nyere)
- npm (følger med Node.js)

### Installasjon

```bash
# Klon repoet
git clone https://github.com/DITT-BRUKERNAVN/musclemap.git
cd musclemap

# Installer avhengigheter
npm install

# Start utviklingsserver
npm run dev
```

Appen åpnes på `http://localhost:5173`

### Bygg for produksjon

```bash
npm run build
```

Bygget havner i `dist/`-mappen.

## Teknologi

- **React 18** – UI-bibliotek
- **Vite** – Byggverktøy og utviklingsserver
- **localStorage** – Lokal datalagring
- **SVG** – Interaktivt muskelkart

## Prosjektstruktur

```
musclemap/
├── public/
├── src/
│   ├── App.jsx          # Hovedkomponenten med all logikk
│   ├── main.jsx         # Entry point
│   └── storage.js       # Storage-abstraksjon
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Lisens

MIT
