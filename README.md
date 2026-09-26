# robertocalzoniX.github.io

Sito personale pubblicato con GitHub Pages.

## Struttura

- `index.html` — homepage
- `styles.css` — stile responsive
- `app.js` — rendering di aggiornamenti, articoli e citazioni
- `editor.html` — pannello editoriale
- `editor.js` — logica del pannello editoriale
- `posts.json` — aggiornamenti pubblicati manualmente
- `articles.json` — articoli pubblicati manualmente
- `quotes.json` — citazioni
- `assets/` — immagini del sito

## Gestione degli aggiornamenti

Gli aggiornamenti non vengono più importati automaticamente dalle API di X.

Il flusso previsto è:

1. aprire `editor.html`;
2. scegliere Post, Repost, Articolo o Citazione;
3. compilare i campi;
4. copiare il JSON generato;
5. aprire `posts.json`, `articles.json` o `quotes.json` su GitHub;
6. inserire il nuovo elemento e salvare con **Commit changes**.

GitHub Pages pubblicherà automaticamente la nuova versione del sito.

## Collegamenti social

Il sito contiene collegamenti diretti ai profili GitHub, X, Strava e Garmin Connect.

## Note

Non sono necessarie credenziali API X, workflow GitHub Actions o script di importazione automatica.
