# TP 1 — Tickets de maintenance (Vue 3 + Axios + JSON Server)

**Identité :** NOM Prénom — groupe ………

Application Vue.js qui consulte, recherche et filtre les tickets d'un support informatique à partir d'une API REST simulée (JSON Server).

## Prérequis
- Node.js 18 ou plus et npm (`node --version`, `npm --version`)

## Installation
```bash
npm install
```

## Lancement (2 terminaux, à garder actifs)
**Terminal 1 — API JSON Server (port 3000)**
```bash
npx json-server db.json --port 3000
```
(ou `npm run api`). Vérifier : http://localhost:3000/tickets doit afficher les 3 tickets en JSON.

**Terminal 2 — Application Vue**
```bash
npm run dev
```
Puis ouvrir http://localhost:5173

## Fonctionnalités réalisées
- Service `src/services/ticketService.js` : Axios avec URL de base et méthode `getTickets()`
- Composant `TicketList.vue` : titre, demandeur, priorité, statut, date
- Chargement avec `ref()`, `onMounted()` et `async/await`
- Message « Chargement… » pendant la requête ; message explicite si le serveur est arrêté, avec bouton « Réessayer »
- Recherche par titre (insensible à la casse et aux accents) + filtres statut et priorité avec `computed()`
- Compteur de tickets visibles et message si la liste filtrée est vide
- Badges de priorité et de statut accessibles (texte explicite + couleurs contrastées)

## Questions
**Quelle différence entre une API REST et le fichier db.json ?**
`db.json` est seulement un fichier de données (du texte JSON). Une API REST est un service accessible par des URL HTTP (`GET /tickets`, `POST /tickets`...) qui lit et modifie des données. Ici JSON Server transforme `db.json` en API REST : le client Vue ne lit jamais le fichier directement, il envoie des requêtes HTTP.

**Pourquoi utiliser `onMounted()` ?**
`onMounted()` exécute du code une fois que le composant est affiché dans la page. On y lance le chargement des tickets pour que la requête parte automatiquement à l'ouverture de la page, sans action de l'utilisateur et sans bloquer l'affichage.

**Quel est le rôle d'Axios ?**
Axios est un client HTTP : il envoie les requêtes (GET, POST...) vers l'API et renvoie directement les données JSON dans `reponse.data`. Il permet de définir une URL de base et un délai maximum (timeout) et facilite la gestion des erreurs (`e.response` si le serveur répond avec une erreur, absent si le serveur est injoignable).

**Quelle différence entre `ref()` et `computed()` ?**
`ref()` stocke une donnée réactive modifiable (`tickets`, `recherche`, `chargement`...). `computed()` calcule une valeur à partir d'autres données réactives (`ticketsFiltres`) : elle est recalculée automatiquement quand ces données changent, est mise en cache et ne se modifie pas directement.

## Difficultés rencontrées
- (à compléter avec tes propres difficultés)

## Captures d'écran (dossier `captures/`)
| N° | Contenu |
|---|---|
| 01 | Réponse JSON de `GET /tickets` dans le navigateur |
| 02 | Application Vue affichant les trois tickets |
| 03 | Résultat d'une recherche par titre |
| 04 | Filtrage combiné statut + priorité |
| 05 | Message d'erreur quand JSON Server est arrêté |
