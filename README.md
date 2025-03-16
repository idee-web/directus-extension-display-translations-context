![Démonstration de l'extension](docs/screenshots/directus-extension-display-translations-context-table.png)

# Directus Display Translations Context

L'extension "Directus Translations Context Display" est une extension d'affichage optimisée pour le contenu multilingue dans Directus. Elle permet d'afficher automatiquement le contenu traduit dans l'interface d'administration de Directus en fonction de critères de sélection de langue avancés.

Cette extension est particulièrement utile pour les projets multilingues où le contenu est traduit dans plusieurs langues et où vous souhaitez afficher automatiquement la traduction correspondant à un pays ou une langue spécifique en provenance d'une autre collection.

![Extension installée](docs/screenshots/directus-extension-display-translations-context-extensions.png)

## Table des matières

- [Fonctionnalités principales](#fonctionnalités-principales)
- [Installation](#installation)
  - [Étapes d'installation](#étapes-dinstallation)
  - [Arborescence des dossiers](#arborescence-des-dossiers)
- [Configuration](#configuration)
  - [Options principales](#options-principales)
- [Prérequis](#prérequis)
  - [Collection Languages](#1-collection-languages)
  - [Collection Countries](#2-collection-countries)
  - [Votre collection exemple Pages](#4-collection-pages)
  - [Votre collection exemple Pages_translations || Pages_Base](#3-collection-pages_base)
  - [Directus setting translation](#5-collection-de-traductions)
- [Utilisation](#utilisation)
  - [Cas d'utilisation typique](#cas-dutilisation-typique)
  - [Personnalisation de l'affichage](#personnalisation-de-laffichage)
  - [Exemples de configuration](#exemples-de-configuration)
- [Fonctionnement technique](#fonctionnement-technique)
  - [Architecture](#architecture)

## Fonctionnalités principales

- **Affichage intelligent des traductions** : Affiche automatiquement la traduction correspondant à la langue sélectionnée
- **Sélection de langue dynamique** : Permet de spécifier un chemin vers un champ de langue via une notation de type `collection.field.language_code_field`
- **Mapping pays-langue configurable** : Conversion automatique des codes pays en codes de langue
- **Menu de sélection de langue** : Interface utilisateur permettant de voir et sélectionner toutes les traductions disponibles
- **Support des templates** : Personnalisation de l'affichage avec des templates incluant des variables et des traductions système
- **Gestion des cas limites** : Mécanismes de fallback pour les traductions manquantes

## Installation

```bash
# Dans le dossier de votre projet Directus
npm install -g @directus/cli
cd extensions/directus-extension-display-translations-context
npm install
npm run build
```

Ensuite, copiez le dossier `dist` dans le dossier `extensions/displays/translations-context` de votre installation Directus.

### Étapes d'installation

1. Créez la structure de dossiers suivante dans votre répertoire "extensions" :

```
votre-projet-directus/
├── extensions/
│   │   └── display-translations-context/    # Nom du dossier de l'extension
│   │       └── dist/                        # Nom du dossier de distribution
│   │       │   └── index.js                 # Fichier compilé de l'extension
│   │       └── package.json                 # Fichier json
│   └── ... autres extensions
└── ... autres fichiers Directus
```

2. Copiez le fichier `dist/index.js` généré par le build dans le dossier `extensions/display-translations-context/dist/`
3. Copiez également le fichier `package.json` dans le même dossier
4. Redémarrez votre conteneur Directus pour que l'extension soit détectée

Cette structure est conforme à la façon dont Directus recherche les extensions dans un environnement Docker.

### Arborescence des dossiers

#### Environnement de développement

```
directus-extension-display-translations-context/
├── dist/                  # Dossier de build généré par le processus de build
│   └── index.js           # Fichier compilé de l'extension
├── src/                   # Code source
│   ├── index.ts           # Point d'entrée de l'extension
│   ├── translations-context.vue      # Composant Vue pour l'affichage des traductions
│   └── shims.d.ts         # Déclarations TypeScript
├── .gitignore             # Fichiers ignorés par Git
├── package.json           # Configuration npm et dépendances
├── README.md              # Documentation principale
└── tsconfig.json          # Configuration TypeScript
```

## Configuration

Lors de la configuration de l'extension dans l'interface Directus, vous disposez des options suivantes :

![Interface de configuration complète](docs/screenshots/directus-extension-display-translations-context-parameters.png)

### Options principales

1. **Display Field (templateDTC)**

   ![Option Display Field](docs/screenshots/directus-extension-display-translations-context-display-field.png)

   - Format d'affichage pour les traductions
   - Supporte les variables de champ avec la syntaxe `{{field}}`
   - Supporte les traductions système avec la syntaxe `[[SYSTEM_KEY]]`
   - Exemple : `[[TABLE_TITLE]]: {{title}}`

   **Exemple avancé avec traductions système :**

   Vous pouvez utiliser la syntaxe `[[TABLE_TITLE]]→{{title}}` pour afficher le nom du champ traduit suivi du contenu :

   ![Configuration avec traductions système](docs/screenshots/directus-extension-display-translations-context-system-translations-params.png)

   Ce qui donne un résultat comme celui-ci dans l'interface :

   ![Résultat avec traductions système](docs/screenshots/directus-extension-display-translations-context-system-translations.png)

   Cette configuration affiche le nom du champ dans la langue correspondante (Title, Titre, Titolo, etc.) suivi du contenu traduit, créant ainsi une interface entièrement localisée.

2. **Language Field (fieldDTC)**

   ![Option Language Field](docs/screenshots/directus-extension-display-translations-context-languages-field.png)

   - Champ contenant le code de langue dans les traductions
   - Valeur par défaut : `language_code`
   - Peut être un chemin imbriqué comme `languages_code.code`

3. **Default Language Selector (selectorDTC)**

   ![Option Default Language Selector](docs/screenshots/directus-extension-display-translations-context-default-language-selector.png)

   - Sélecteur de langue statique ou dynamique
   - Peut être un code de langue direct (ex: `fr-FR`)
   - Ou un chemin dynamique (ex: `{{pages_id.country_code.defaultLanguage}}`)

4. **Country to Language Mapping (mappingDTC)**

   ![Option Country Mapping](docs/screenshots/directus-extension-display-translations-context-country-mapping.png)

   - Mapping JSON pour convertir les codes pays en codes de langue
   - Utile lorsque le sélecteur renvoie un code pays au lieu d'un code de langue
   - Exemple : `{"FR": "fr-FR", "DE": "de-DE", ...}`

5. **Show Language Menu (menuDTC)**

   ![Option Show Menu](docs/screenshots/directus-extension-display-translations-context-show-menu.png)

   - Active/désactive le menu de sélection de langue
   - Permet aux utilisateurs de voir toutes les traductions disponibles

## Prérequis

Pour utiliser pleinement cette extension, vous devez configurer les collections suivantes dans votre projet Directus :

### 1. Collection Languages

Cette collection stocke les langues disponibles dans votre système.

![Collection de langues](docs/screenshots/directus-extension-display-translations-context-language-collection.png)

**Champs recommandés :**

- `code` : Code de langue (ex: fr-FR, en-US)
- `name` : Nom de la langue
- `active` : État d'activation

![Champs de la collection languages](docs/screenshots/directus-extension-display-translations-context-languages-collection-fields.png)

### 2. Collection Countries

Cette collection stocke les pays et leurs paramètres régionaux.

![Collection de pays](docs/screenshots/directus-extension-display-translations-context-country-collection.png)

**Champs recommandés :**

- `code` : Code du pays (ex: FR, US)
- `name` : Nom du pays
- `defaultLanguage` : Relation vers la langue par défaut pour ce pays

![Champs de la collection countries](docs/screenshots/directus-extension-display-translations-context-countries-collection-fields.png)

### 4. Collection Pages

Cette collection contient les pages avec leurs traductions.

![Collection de pages](docs/screenshots/directus-extension-display-translations-context-pages-collection-fields.png)

**Champs recommandés :**

- `translations` : Champ de type "translations" lié à la collection de traductions
- Autres champs spécifiques à votre contenu

### 3. Collection Pages_Base

Cette collection sert de modèle pour les pages traduisibles.

![Champs de la collection pages_base](docs/screenshots/directus-extension-display-translations-context-pages_base-collection-fields.png)

**Champs recommandés :**

- `country_code` : Relation vers un pays
- Autres champs spécifiques à votre contenu

### 5. Collection de traductions

Cette collection stocke les traductions pour chaque élément traduisible.

![Collection de traductions](docs/screenshots/directus-extension-display-translations-context-translations-collection.png)

**Champs recommandés :**

- `languages_code` : Relation vers une langue
- `title`, `description`, etc. : Champs contenant le contenu traduit

## Utilisation

### Cas d'utilisation typique

1. Créez une collection avec un champ de type "translations"
2. Configurez l'affichage du champ pour utiliser l'extension "Translations Context"
3. Définissez le template d'affichage (ex: `{{title}}`)
4. Spécifiez le champ de langue (ex: `language_code`)
5. Configurez le sélecteur de langue (ex: `{{pages_id.country_code.defaultLanguage}}`)

### Personnalisation de l'affichage

Vous pouvez personnaliser l'affichage des colonnes dans l'interface Directus :

![Modification du nom de colonne](docs/screenshots/directus-extension-display-translations-context-change-column-name.png)

Ce qui donne un résultat comme celui-ci :

![Nom de colonne personnalisé](docs/screenshots/directus-extension-display-translations-context-column-name.png)

### Exemples de configuration

#### Affichage simple avec langue statique

```
Display Field: {{title}}
Language Field: language_code
Default Language Selector: en-US
Show Language Menu: true
```

#### Affichage avancé avec sélection dynamique

```
Display Field: [[ITEM_TITLE]]: {{title}} ({{description}})
Language Field: languages_code.code
Default Language Selector: {{pages_id.country_code.defaultLanguage}}
Country to Language Mapping: {"FR": "fr-FR", "DE": "de-DE", "US": "en-US"}
Show Language Menu: true
```

## Fonctionnement technique

### Architecture

L'extension est composée de deux fichiers principaux :

1. **index.ts** : Point d'entrée de l'extension qui définit :

   - Les métadonnées de l'extension (id, nom, description, icône)
   - Le gestionnaire de rendu côté serveur
   - Les options de configuration
   - Les types de champs supportés

2. **translations-context.vue** : Composant Vue qui gère :
   - L'affichage des traductions
   - La logique de sélection de langue
   - Le menu de sélection interactif
   - La récupération des données via l'API Directus

### Flux de données

1. Directus passe les valeurs de traduction au gestionnaire de l'extension
2. Le gestionnaire analyse les options et détermine si une sélection statique ou dynamique est nécessaire
3. Pour les sélecteurs statiques, le gestionnaire filtre directement les traductions
4. Pour les sélecteurs dynamiques, le composant Vue effectue des requêtes API pour résoudre le chemin
5. Le composant affiche la traduction correspondante et génère le menu de sélection

### Optimisations

- Minimisation des requêtes API en utilisant des requêtes combinées
- Mise en cache des résultats pour éviter les requêtes répétées
- Utilisation de computed properties pour optimiser les rendus
- Gestion intelligente des cas limites et des erreurs

## Compatibilité

Cette extension a été testé avec Directus 11.5.1.

## Dépannage

### Problèmes courants

1. **Traduction non affichée**

   - Vérifiez que le champ de langue est correctement configuré
   - Assurez-vous que le sélecteur de langue pointe vers un champ valide
   - Vérifiez que les traductions contiennent bien le code de langue attendu

2. **Erreur de chargement**

   - Vérifiez les permissions d'accès aux collections référencées
   - Assurez-vous que les chemins de sélection sont correctement formatés

3. **Mapping pays-langue non fonctionnel**

   - Vérifiez que le JSON est correctement formaté
   - Assurez-vous que les codes pays sont en majuscules

## Conclusion

L'extension "Directus Translations Context Display" offre une solution flexible et puissante pour gérer l'affichage des contenus multilingues dans Directus. Grâce à ses fonctionnalités avancées de sélection de langue et son interface utilisateur intuitive, elle simplifie considérablement la gestion des traductions dans les projets multilingues.

## Licence

Cette extension est distribuée sous licence MIT.
