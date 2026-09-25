# robertocalzoniX.github.io

Sito personale pubblicato con GitHub Pages.

## Struttura
- `index.html` — homepage
- `styles.css` — stile responsive
- `app.js` — rendering del feed
- `posts.json` — sorgente dati degli aggiornamenti

## Feed X
Il sito è predisposto per ricevere dati da X sostituendo il contenuto di `posts.json`.
Il formato atteso è:

```json
{
  "source": "x",
  "updated_at": "ISO-8601",
  "posts": [
    {
      "id": "123",
      "date": "25 settembre 2026",
      "category": "X",
      "title": "Titolo ricavato dal post",
      "text": "Testo del post",
      "url": "https://x.com/.../status/..."
    }
  ]
}
```

Il passo successivo è aggiungere un workflow GitHub Actions che interroghi X con credenziali salvate nei repository secrets e aggiorni questo file.
