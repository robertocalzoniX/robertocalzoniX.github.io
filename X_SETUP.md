# Collegamento a X

Il repository contiene `scripts/update_x_feed.py`.

Il comportamento previsto è:
- post originali: inclusi
- repost: inclusi
- reply: escluse
- quote post: esclusi
- massimo 30 elementi mostrati nel feed

## 1. Creare le credenziali X
Nel portale sviluppatori X crea un'app e recupera il Bearer Token.

## 2. Salvare i dati in GitHub
Nel repository apri:
Settings > Secrets and variables > Actions

Aggiungi:
- Repository variable: `X_USERNAME` = il tuo username X senza @
- Repository secret: `X_BEARER_TOKEN` = il Bearer Token dell'app X

Non inserire mai il Bearer Token nei file pubblici del repository.

## 3. Workflow
Crea il file `.github/workflows/update-x-feed.yml` con un workflow che:
1. esegue checkout del repository
2. configura Python 3.12
3. esegue `python scripts/update_x_feed.py` con le variabili X_USERNAME e X_BEARER_TOKEN
4. se `posts.json` cambia, esegue commit e push

Frequenza consigliata: ogni 2 ore.

## 4. Collegamento X nel sito
Una volta definito lo username X, sostituire la voce "X — da collegare" nella homepage con il link pubblico al profilo.
