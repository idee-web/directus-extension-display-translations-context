# Directus Translations Display

Une extension d'affichage optimisée pour le contenu multilingue dans Directus.

## Description

Cette extension est une adaptation de l'extension officielle de traduction de Directus. Elle permet d'afficher le contenu traduit dans l'interface d'administration de Directus.

## Installation

```bash
# Dans le dossier de votre projet Directus
npm install -g @directus/cli
cd extensions/ld
npm install
npm run build
```

Ensuite, copiez le dossier `dist` dans le dossier `extensions/displays/ld` de votre installation Directus.

## Utilisation

Cette extension ajoute un nouveau type d'affichage "Translations" qui peut être utilisé pour les champs de type "translations" dans Directus.

## Configuration

L'extension prend en charge les options suivantes :

- **Template** : Le modèle d'affichage pour les traductions.
- **Language Field** : Le champ qui contient la langue de la traduction.
- **Default Language** : La langue par défaut à afficher.
- **User Language** : Activer pour afficher la traduction dans la langue de l'utilisateur.

## Compatibilité

Cette extension est compatible avec Directus 11.5.1.

## Licence

MIT
