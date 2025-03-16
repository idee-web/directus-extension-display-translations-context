# Schéma d'architecture - Directus Translations Context

## Architecture des collections

```
┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
│                     │      │                     │      │                     │
│     Languages       │◄────►│    Pages_Base       │◄────►│       Pages         │
│                     │      │                     │      │                     │
└─────────────────────┘      └─────────────────────┘      └─────────────────────┘
       ▲                            ▲                             ▲
       │                            │                             │
       │                            │                             │
       │                            │                             │
       │                            │                             │
       │                            │                             │
       │                            │                             │
       │                            │                             │
┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
│                     │      │                     │      │                     │
│  System Translations│      │  Country Mapping    │      │     Countries       │
│                     │      │                     │      │                     │
└─────────────────────┘      └─────────────────────┘      └─────────────────────┘
```

## Structure des données

### Collection Languages

- `code` : Code de langue (fr-FR, en-US, etc.)
- `name` : Nom de la langue
- `direction` : Direction d'écriture (LTR/RTL)
- `default` : Indique si c'est la langue par défaut

### Collection Countries

- `code` : Code pays à deux lettres (FR, US, etc.)
- `name` : Nom du pays
- `defaultLanguage` : Code de la langue par défaut pour ce pays

### Collection Pages

- `id` : Identifiant unique
- `status` : État de la page
- `base` : Relation vers les traductions (Pages_Base)
- `country_code` : Relation vers un pays

### Collection Pages_Base (Traductions)

- `id` : Identifiant unique
- `pages_id` : Relation vers la page parente
- `languages_code` : Relation vers la langue
- `title` : Titre traduit
- (autres champs de contenu traduit)

### System Translations

- `key` : Clé de traduction (ex: TABLE_TITLE)
- `language` : Code de langue
- `value` : Valeur traduite

## Flux de données

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    Interface Directus                           │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│               Extension Translations Context                    │
│                                                                 │
└───────────┬─────────────────────────────────────┬───────────────┘
            │                                     │
            ▼                                     ▼
┌───────────────────────────┐       ┌───────────────────────────┐
│                           │       │                           │
│  Sélection de langue      │       │  Affichage du contenu     │
│                           │       │                           │
└─────────────┬─────────────┘       └─────────────┬─────────────┘
              │                                   │
              ▼                                   ▼
┌───────────────────────────┐       ┌───────────────────────────┐
│                           │       │                           │
│  1. Langue statique       │       │  1. Champs de contenu     │
│  2. Langue dynamique      │       │  2. Traductions système   │
│  3. Mapping pays-langue   │       │  3. Formatage personnalisé│
│                           │       │                           │
└───────────────────────────┘       └───────────────────────────┘
```

## Processus de sélection de langue

```
┌─────────────────────┐
│                     │
│  Début du processus │
│                     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐     Non     ┌─────────────────────┐
│ Sélecteur dynamique?│────────────►│ Utiliser langue     │
│                     │             │ statique configurée  │
└──────────┬──────────┘             └─────────────────────┘
           │ Oui
           ▼
┌─────────────────────┐
│ Résoudre le chemin  │
│ dynamique           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐     Oui     ┌─────────────────────┐
│ Résultat est un     │────────────►│ Utiliser mapping    │
│ code pays?          │             │ pays-langue         │
└──────────┬──────────┘             └──────────┬──────────┘
           │ Non                               │
           ▼                                   ▼
┌─────────────────────┐                ┌─────────────────────┐
│ Utiliser le code    │                │ Utiliser le code    │
│ de langue obtenu    │                │ de langue mappé     │
└──────────┬──────────┘                └──────────┬──────────┘
           │                                      │
           └──────────────────┬──────────────────┘
                              │
                              ▼
┌─────────────────────┐     Non     ┌─────────────────────┐
│ Traduction          │────────────►│ Utiliser langue     │
│ disponible?         │             │ par défaut          │
└──────────┬──────────┘             └─────────────────────┘
           │ Oui
           ▼
┌─────────────────────┐
│ Afficher la         │
│ traduction          │
└─────────────────────┘
```

## Configuration de l'extension

### Paramètres principaux

1. **Display Field (templateDTC)**

   - Format: `[[SYSTEM_KEY]]→{{field}}`
   - Exemple: `[[TABLE_TITLE]]→{{title}}`

2. **Language Field (fieldDTC)**

   - Chemin vers le code de langue
   - Exemple: `languages_code`

3. **Default Language Selector (selectorDTC)**

   - Statique: `fr-FR`
   - Dynamique: `{{pages_id.country_code.defaultLanguage}}`

4. **Country to Language Mapping (mappingDTC)**

   - Format JSON: `{"FR": "fr-FR", "US": "en-US"}`

5. **Show Language Menu (menuDTC)**
   - Active/désactive le menu de sélection

## Exemple de flux complet

1. Un utilisateur accède à la liste des pages dans Directus
2. Pour chaque page:
   - L'extension récupère le pays associé (ex: "FR")
   - Elle obtient la langue par défaut pour ce pays (ex: "fr-FR")
   - Elle recherche la traduction correspondante dans Pages_Base
   - Elle applique le template d'affichage (ex: `[[TABLE_TITLE]]→{{title}}`)
   - Elle remplace `[[TABLE_TITLE]]` par la traduction système (ex: "Titre")
   - Elle remplace `{{title}}` par le contenu traduit (ex: "Accueil")
   - Elle affiche "Titre→Accueil" dans l'interface
3. Si l'utilisateur clique sur le menu de langue:
   - L'extension affiche toutes les traductions disponibles
   - L'utilisateur peut sélectionner une autre langue
   - L'affichage est mis à jour avec la traduction sélectionnée
