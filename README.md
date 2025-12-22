# Vaccination Management

Application Vue 3 + TypeScript pour suivre les patients d'une campagne Rabique / VZV / Hépatite B.

## Installation

```bash
npm install
```

## Scripts disponibles

| Commande            | Description                                             |
| ------------------- | ------------------------------------------------------- |
| `npm run server`    | Lance l'API Express locale sur `http://localhost:3001`. |
| `npm run serve`     | Démarre le front (Vue CLI) sur `http://localhost:8080`. |
| `npm run test:unit` | Exécute les tests unitaires Jest + Vue Test Utils.      |

Dans un second terminal, exécutez l'API avant de lancer le front :

```bash
npm run server
# nouveau terminal
npm run serve
```

## Configuration API

Par défaut, le front consomme l'API locale (`http://localhost:3001`). Pour pointer vers une autre URL, créez un fichier `.env.local` à la racine :

```dotenv
VUE_APP_API_URL=http://mon-api:3001
```

## Tests & couverture

```bash
npm run test:unit -- --coverage
```

Le rapport de couverture est généré dans `coverage/`.
