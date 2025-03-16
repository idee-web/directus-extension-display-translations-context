# Schéma d'architecture visuel - Directus Translations Context

Ce document présente l'architecture de l'extension Directus Translations Context sous forme de diagrammes visuels utilisant la syntaxe Mermaid.

## Relations entre collections

```mermaid
erDiagram
    Languages ||--o{ Pages_Base : "traduit en"
    Pages_Base }o--|| Pages : "appartient à"
    Countries ||--o{ Pages : "associé à"
    Countries ||--o{ Languages : "langue par défaut"

    Languages {
        string code "fr-FR, en-US"
        string name "Français, English"
        string direction "LTR, RTL"
        boolean default "langue par défaut"
    }

    Countries {
        string code "FR, US"
        string name "France, United States"
        string defaultLanguage "fr-FR, en-US"
    }

    Pages {
        string id "identifiant unique"
        string status "publié, brouillon"
        relation base "traductions"
        relation country_code "pays associé"
    }

    Pages_Base {
        string id "identifiant unique"
        relation pages_id "page parente"
        relation languages_code "langue"
        string title "titre traduit"
        string description "description traduite"
    }

    SystemTranslations {
        string key "TABLE_TITLE"
        string language "fr-FR, en-US"
        string value "Titre, Title"
    }
```

## Flux de données

```mermaid
flowchart TD
    A[Interface Directus] --> B[Extension Translations Context]
    B --> C[Sélection de langue]
    B --> D[Affichage du contenu]

    C --> C1[Langue statique]
    C --> C2[Langue dynamique]
    C --> C3[Mapping pays-langue]

    D --> D1[Champs de contenu]
    D --> D2[Traductions système]
    D --> D3[Formatage personnalisé]

    C1 --> E[Traduction finale]
    C2 --> E
    C3 --> E

    D1 --> F[Affichage formaté]
    D2 --> F
    D3 --> F

    E --> G[Rendu dans l'interface]
    F --> G
```

## Processus de sélection de langue

```mermaid
flowchart TD
    A[Début du processus] --> B{Sélecteur dynamique?}

    B -->|Non| C[Utiliser langue statique configurée]
    B -->|Oui| D[Résoudre le chemin dynamique]

    D --> E{Résultat est un code pays?}

    E -->|Oui| F[Utiliser mapping pays-langue]
    E -->|Non| G[Utiliser le code de langue obtenu]

    F --> H{Traduction disponible?}
    G --> H

    H -->|Non| I[Utiliser langue par défaut]
    H -->|Oui| J[Afficher la traduction]

    C --> K[Traduction finale]
    I --> K
    J --> K
```

## Architecture technique

```mermaid
classDiagram
    class DirectusExtension {
        +id: string
        +name: string
        +icon: string
        +description: string
        +component: Vue
        +options: Object[]
        +types: string[]
        +handler(value, options): string
    }

    class TranslationsContextComponent {
        -value: Array
        -templateDTC: string
        -fieldDTC: string
        -selectorDTC: string
        -mappingDTC: Object
        -menuDTC: boolean
        +mounted()
        +computed.displayValue(): string
        +methods.getLanguageCode(): string
        +methods.formatTemplate(): string
        +methods.showLanguageMenu(): void
        +methods.selectLanguage(code): void
    }

    DirectusExtension <|-- TranslationsContextComponent
```

## Exemple de flux complet

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant D as Directus
    participant E as Extension
    participant A as API Directus

    U->>D: Accède à la liste des pages
    D->>E: Initialise l'extension pour chaque page

    loop Pour chaque page
        E->>A: Récupère le pays associé (ex: "FR")
        A->>E: Retourne les données du pays
        E->>A: Obtient la langue par défaut (ex: "fr-FR")
        A->>E: Retourne le code de langue
        E->>A: Recherche la traduction correspondante
        A->>E: Retourne les données traduites
        E->>E: Applique le template d'affichage
        E->>E: Remplace [[TABLE_TITLE]] par "Titre"
        E->>E: Remplace {{title}} par "Accueil"
        E->>D: Affiche "Titre→Accueil"
        D->>U: Montre l'interface avec traductions
    end

    U->>D: Clique sur le menu de langue
    D->>E: Demande les traductions disponibles
    E->>A: Récupère toutes les traductions
    A->>E: Retourne les données
    E->>D: Affiche le menu de sélection
    D->>U: Montre les options de langue
    U->>D: Sélectionne une autre langue (ex: "en-US")
    D->>E: Transmet la sélection
    E->>E: Filtre les traductions pour "en-US"
    E->>E: Applique le template d'affichage
    E->>E: Remplace [[TABLE_TITLE]] par "Title"
    E->>E: Remplace {{title}} par "Home"
    E->>D: Affiche "Title→Home"
    D->>U: Montre l'interface mise à jour
```

## Configuration de l'extension

```mermaid
graph TD
    A[Extension Translations Context] --> B[Display Field]
    A --> C[Language Field]
    A --> D[Default Language Selector]
    A --> E[Country to Language Mapping]
    A --> F[Show Language Menu]

    B --> B1["Format: [[SYSTEM_KEY]]→{{field}}"]
    B --> B2["Exemple: [[TABLE_TITLE]]→{{title}}"]

    C --> C1["Chemin vers le code de langue"]
    C --> C2["Exemple: languages_code"]

    D --> D1["Statique: fr-FR"]
    D --> D2["Dynamique: {{pages_id.country_code.defaultLanguage}}"]

    E --> E1["Format JSON: {'FR': 'fr-FR', 'US': 'en-US'}"]

    F --> F1["Active/désactive le menu de sélection"]
```
