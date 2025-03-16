# Descriptions des captures d'écran pour l'IA

Ce fichier contient les descriptions détaillées des captures d'écran utilisées dans la documentation de l'extension Directus Translations Context.

## 1. directus-extension-display-translations-context-table.png

Cette image montre l'interface de Directus avec la collection "Pages" ouverte. On peut voir une liste de pages avec différentes langues et pays. La colonne "Title" affiche les traductions dans différentes langues pour chaque page (À propos, Accueil, Applicazioni Aziendali, etc.). La colonne "Country Code" indique le pays associé à chaque page (United States, France, Italia, Deutschland, España, etc.).

On peut voir que l'extension permet d'afficher les traductions appropriées pour chaque entrée en fonction du pays. Par exemple, pour la page "About" (États-Unis), on voit les traductions "À propos, About, Über uns, Chi siamo, Sobre nosotros" dans la colonne Title.

L'interface montre également un menu déroulant de sélection de langue pour l'entrée "Développement Mobile", avec des options comme "it-IT Sviluppo Mobile", "es-ES Desarrollo Móvil", "fr-FR Développement Mobile", "de-DE Mobile Entwicklung", et "en-US Mobile Development".

Cette capture illustre parfaitement la fonctionnalité principale de l'extension : afficher les traductions contextuelles en fonction des pays et permettre de basculer entre les différentes langues disponibles.

## 2. directus-extension-display-translations-context-translations-collection.png

Cette image montre la section "Translations" dans les paramètres de Directus. On peut voir une liste de traductions système avec la clé "TABLE_TITLE" traduite dans différentes langues :

- it-IT : "Titolo"
- de-DE : "Titel"
- es-ES : "Título"
- fr-FR : "Titre"
- en-US : "Title"

Cette capture illustre comment Directus gère les traductions système qui peuvent être utilisées dans l'extension Translations Context via la syntaxe `[[TABLE_TITLE]]`. Ces traductions système sont essentielles pour l'extension car elles permettent d'afficher des éléments d'interface dans la langue appropriée en fonction du contexte.

## 3. directus-extension-display-translations-context-show-menu.png

Cette image montre l'option "Show Language Menu" dans les paramètres de configuration de l'extension. On peut voir une case à cocher "Enabled" qui est activée, avec une description en dessous indiquant "Enable or disable the language selection menu" (Activer ou désactiver le menu de sélection de langue).

Cette option permet de contrôler l'affichage du menu déroulant de sélection de langue dans l'interface. Lorsqu'elle est activée, les utilisateurs peuvent voir et sélectionner les différentes traductions disponibles pour chaque entrée directement depuis l'interface de Directus.

## 4. directus-extension-display-translations-context-parameters.png

Cette image montre l'interface complète de configuration de l'extension "Translations Context" dans Directus. On peut voir tous les paramètres disponibles pour configurer l'affichage des traductions :

1. En haut, on voit que l'extension est configurée pour la collection "Base (pages)" avec l'interface "Languages".
2. Les paramètres principaux sont :
   - **Display Field** : Configuré avec `{{title}}` pour afficher le champ "title" des traductions.
   - **Language Field** : Configuré avec `languages_code` pour identifier le champ contenant le code de langue.
   - **Default Language Selector** : Configuré avec `{{pages_id.country_code.defaultLanguage}}` pour sélectionner dynamiquement la langue en fonction du pays associé à la page.
   - **Country to Language Mapping** : Un objet JSON qui mappe les codes pays (FR, DE, ES, IT, EN, US, GB, UK) aux codes de langue correspondants (fr-FR, de-DE, es-ES, etc.).
   - **Show Language Menu** : Option activée pour afficher le menu de sélection de langue.

Chaque paramètre est accompagné d'une description explicative qui aide l'utilisateur à comprendre son utilité. Cette capture d'écran est essentielle pour comprendre comment configurer l'extension pour obtenir le comportement souhaité.

## 5. directus-extension-display-translations-context-pages-collection-fields.png

Cette image montre la configuration des champs de la collection "Pages" dans l'interface d'administration de Directus. On peut voir les champs principaux de cette collection :

- **id** : Un champ de type "Input" (entrée texte) qui sert d'identifiant unique.
- **status** : Un champ de type "Dropdown" (menu déroulant) marqué comme obligatoire (\*).
- **base** : Un champ de type "Translations" (traductions) marqué comme obligatoire (\*).
- **country_code** : Un champ de type "Many to One" (relation plusieurs à un) qui établit une relation avec la collection des pays.

Cette structure est essentielle pour le fonctionnement de l'extension car elle montre comment les pages sont liées à la fois à des traductions (champ "base") et à des pays (champ "country_code"). Cette relation permet à l'extension de déterminer quelle traduction afficher en fonction du pays associé à la page.

## 6. directus-extension-display-translations-context-pages_base-collection-fields.png

Cette image montre la configuration des champs de la collection "Pages Base" dans l'interface d'administration de Directus. On peut voir les champs principaux de cette collection :

- **id** : Un champ de type "Input" (entrée texte) qui sert d'identifiant unique.
- **pages_id** : Un champ qui établit une relation avec la collection "Pages".
- **languages_code** : Un champ de type "Many to One" (relation plusieurs à un) qui établit une relation avec la collection des langues.
- **title** : Un champ de type "Input" (entrée texte) marqué comme obligatoire (\*) qui contient le titre traduit.

Cette collection "Pages Base" est fondamentale pour le système de traduction car elle stocke les traductions spécifiques à chaque langue pour les pages. Chaque entrée dans cette collection représente une traduction d'une page dans une langue spécifique. La relation avec "languages_code" permet d'identifier la langue de la traduction, tandis que la relation avec "pages_id" permet de lier la traduction à la page correspondante.

## 7. directus-extension-display-translations-context-languages-field.png

Cette image montre le paramètre "Language Field" dans la configuration de l'extension Translations Context. On peut voir un champ de saisie contenant la valeur "languages_code" avec une description en dessous indiquant "Field containing the language code (with or without {{ }})" (Champ contenant le code de langue, avec ou sans {{ }}).

Ce paramètre est crucial pour le fonctionnement de l'extension car il spécifie quel champ dans la collection de traductions contient l'information sur la langue. Dans ce cas, "languages_code" fait référence au champ qui établit une relation avec la collection des langues, permettant à l'extension d'identifier la langue de chaque traduction. Cette configuration permet à l'extension de filtrer et d'afficher les traductions dans la langue appropriée en fonction du contexte.

## 8. directus-extension-display-translations-context-languages-collection-fields.png

Cette image montre la configuration des champs de la collection "Languages" dans l'interface d'administration de Directus. On peut voir les champs principaux de cette collection :

- **code** : Un champ de type "Input" (entrée texte) marqué comme obligatoire (\*) qui contient le code de langue (comme fr-FR, en-US, etc.).
- **name** : Un champ de type "Input" (entrée texte) marqué comme obligatoire (\*) qui contient le nom de la langue.
- **direction** : Un champ de type "Dropdown" (menu déroulant) marqué comme obligatoire (\*) qui indique probablement la direction d'écriture de la langue (LTR pour left-to-right ou RTL pour right-to-left).

Cette collection est fondamentale pour le système de traduction car elle définit les langues disponibles dans le système. Chaque entrée représente une langue avec son code unique, son nom et sa direction d'écriture. L'extension Translations Context utilise cette collection pour identifier les langues disponibles et afficher les traductions correspondantes. La relation établie via le champ "languages_code" dans la collection "Pages Base" fait référence à cette collection "Languages".

## 9. directus-extension-display-translations-context-language-collection.png

Cette image montre la vue en liste de la collection "Languages" dans l'interface d'administration de Directus. On peut voir les différentes langues configurées dans le système avec leurs propriétés :

- **Status** : Indique si la langue est active (point coloré).
- **Default** : Indique quelle langue est définie comme langue par défaut (coche pour le français, croix pour les autres).
- **Code** : Affiche le code de langue standardisé (fr-FR, en-US, es-ES, de-DE, it-IT).
- **Name** : Affiche le nom de la langue dans sa langue native (Français, English, Español, Deutsch, Italia).
- **Direction** : Indique la direction d'écriture de la langue (ltr pour left-to-right dans tous les cas montrés).

Cette vue montre que le français (fr-FR) est configuré comme langue par défaut du système. Cette configuration est importante pour l'extension Translations Context car elle peut utiliser cette information pour déterminer quelle traduction afficher lorsqu'aucune langue spécifique n'est sélectionnée ou lorsque la langue demandée n'est pas disponible.

## 10. directus-extension-display-translations-context-extensions.png

Cette image montre la section "Extensions" dans les paramètres de Directus. On peut voir que l'extension "directus-extension-display-languages" en version 1.0.0 est installée et activée dans le système.

Cette capture d'écran est importante car elle montre comment vérifier que l'extension est correctement installée et activée dans Directus. L'extension apparaît dans la catégorie "Displays" (Affichages), ce qui correspond à son rôle d'extension d'affichage pour les traductions. Le statut "Enabled" (Activé) indique que l'extension est prête à être utilisée dans les interfaces de Directus.

## 11. directus-extension-display-translations-context-display-field.png

Cette image montre le paramètre "Display Field" dans la configuration de l'extension Translations Context. On peut voir un champ de saisie contenant la valeur "{{title}}" avec une description en dessous indiquant "Use {{field}} for item fields and [[SYSTEM_KEY]] for system translations. Ex: '[[TABLE_TITLE]]: {{title}}'" (Utilisez {{field}} pour les champs d'élément et [[SYSTEM_KEY]] pour les traductions système. Ex: '[[TABLE_TITLE]]: {{title}}').

Ce paramètre est essentiel car il définit le format d'affichage des traductions dans l'interface. La syntaxe utilise des doubles accolades {{field}} pour insérer des valeurs de champs spécifiques de l'élément traduit (comme le titre, la description, etc.) et des doubles crochets [[SYSTEM_KEY]] pour insérer des traductions système (comme les titres de table, les étiquettes d'interface, etc.).

Dans l'exemple montré, la valeur "{{title}}" indique que l'extension affichera simplement le contenu du champ "title" de la traduction correspondante. Cette configuration permet une grande flexibilité dans la façon dont les traductions sont présentées aux utilisateurs.

## 12. directus-extension-display-translations-context-default-language-selector.png

Cette image montre le paramètre "Default Language Selector" dans la configuration de l'extension Translations Context. On peut voir un champ de saisie contenant la valeur "{{pages_id.country_code.defaultLanguage}}" avec une description en dessous indiquant "Static language code (e.g., fr-FR) or dynamic path (e.g., {{pages_id.country_code.defaultLanguage}})" (Code de langue statique (ex: fr-FR) ou chemin dynamique (ex: {{pages_id.country_code.defaultLanguage}})).

Ce paramètre est crucial car il détermine comment l'extension sélectionne la langue à afficher par défaut. Il offre deux approches :

1. **Sélection statique** : En spécifiant directement un code de langue (comme "fr-FR"), l'extension affichera toujours la traduction dans cette langue spécifique si elle est disponible.

2. **Sélection dynamique** : En utilisant un chemin avec la notation à accolades (comme montré dans l'image), l'extension peut déterminer la langue à afficher en fonction des relations entre les collections.

Dans l'exemple montré, "{{pages_id.country_code.defaultLanguage}}" indique que l'extension doit :

- Accéder à la relation "pages_id" (qui pointe vers la collection Pages)
- Puis accéder à la relation "country_code" de cette page (qui pointe vers la collection Countries)
- Enfin, récupérer la valeur du champ "defaultLanguage" de ce pays

Cette configuration dynamique permet d'afficher automatiquement les traductions dans la langue appropriée en fonction du pays associé à chaque page, ce qui est particulièrement utile pour les sites multilingues avec un contenu adapté par région.

## 13. directus-extension-display-translations-context-country-collection.png

Cette image montre la vue en liste de la collection "Countries" dans l'interface d'administration de Directus. On peut voir les différents pays configurés dans le système avec leurs propriétés :

- **Code** : Affiche le code du pays à deux lettres (DE, ES, FR, IT, US).
- **Name** : Affiche le nom du pays dans sa langue native (Deutschland, España, France, Italia, United States).
- **Default Language** : Indique la langue par défaut associée à chaque pays (de-DE, es-ES, fr-FR, it-IT, en-US).

Cette collection est essentielle pour le fonctionnement de l'extension car elle établit la relation entre les pays et leurs langues par défaut. Chaque entrée dans cette collection représente un pays avec son code unique et la langue qui lui est associée par défaut.

Cette configuration est particulièrement importante pour le sélecteur de langue dynamique de l'extension. Lorsque l'extension est configurée avec un sélecteur comme "{{pages_id.country_code.defaultLanguage}}", elle utilise cette collection pour déterminer quelle langue afficher en fonction du pays associé à la page. Par exemple, si une page est associée au pays "FR", l'extension affichera automatiquement la traduction en français (fr-FR) car c'est la langue par défaut définie pour ce pays.

## 14. directus-extension-display-translations-context-countries-collection-fields.png

Cette image montre la configuration des champs de la collection "Countries" dans l'interface d'administration de Directus. On peut voir les champs principaux de cette collection :

- **code** : Un champ de type "Input" (entrée texte) marqué comme obligatoire (\*) qui contient le code du pays à deux lettres (comme FR, US, DE, etc.).
- **name** : Un champ de type "Input" (entrée texte) marqué comme obligatoire (\*) qui contient le nom du pays.
- **defaultLanguage** : Un champ de type "Input" (entrée texte) marqué comme obligatoire (\*) qui contient le code de langue par défaut pour ce pays.

Cette structure est fondamentale pour le fonctionnement de l'extension car elle définit comment les pays sont liés aux langues par défaut. Le champ "defaultLanguage" est particulièrement important car il est utilisé par le sélecteur de langue dynamique de l'extension pour déterminer quelle traduction afficher en fonction du pays associé à une page.

Cette configuration permet une grande flexibilité dans la gestion des contenus multilingues, car elle permet d'associer automatiquement une langue spécifique à chaque pays. Par exemple, les pages associées à la France (FR) afficheront automatiquement le contenu en français (fr-FR), tandis que les pages associées aux États-Unis (US) afficheront le contenu en anglais américain (en-US).

## 15. directus-extension-display-translations-context-country-mapping.png

Cette image montre le paramètre "Country to Language Mapping" dans la configuration de l'extension Translations Context. On peut voir un éditeur de code JSON contenant un objet qui mappe les codes pays à deux lettres aux codes de langue correspondants :

```json
{
  "FR": "fr-FR",
  "DE": "de-DE",
  "ES": "es-ES",
  "IT": "it-IT",
  "EN": "en-US",
  "US": "en-US",
  "GB": "en-GB",
  "UK": "en-GB"
}
```

En dessous de l'éditeur, on peut voir une description indiquant "Fallback mapping used when a country code is found instead of a complete object with language information" (Mapping de secours utilisé lorsqu'un code pays est trouvé au lieu d'un objet complet avec des informations de langue).

Ce paramètre est crucial pour le fonctionnement de l'extension car il fournit un mécanisme de secours pour convertir les codes pays en codes de langue lorsque le système ne peut pas déterminer directement la langue à partir des relations entre collections. Par exemple, si l'extension trouve un code pays "FR" mais ne peut pas accéder à l'objet pays complet avec son champ "defaultLanguage", elle utilisera ce mapping pour déterminer que la langue correspondante est "fr-FR".

Cette configuration offre une couche supplémentaire de robustesse au système de traduction, en garantissant que l'extension peut toujours déterminer la langue appropriée même dans des scénarios où les relations entre collections ne sont pas complètement accessibles ou définies.

## 16. directus-extension-display-translations-context-column-name.png

Cette image montre la vue en liste de la collection "Pages" dans l'interface d'administration de Directus. On peut voir un extrait de la liste avec deux pages : "About" associée à "United States (US)" et "Accueil" associée à "France (FR)". La colonne "Title" affiche les traductions correspondantes : "À propos, About..." pour la première ligne et "Inicio, Accueil..." pour la seconde.

Cette capture d'écran illustre comment l'extension affiche les traductions dans l'interface de Directus en fonction du pays associé à chaque page. On peut voir que l'extension est configurée pour afficher les traductions dans la colonne "Title", ce qui permet aux utilisateurs de voir rapidement les différentes versions linguistiques du contenu sans avoir à ouvrir chaque entrée individuellement.

Cette fonctionnalité est particulièrement utile pour les administrateurs de contenu qui doivent gérer un site multilingue, car elle leur permet de visualiser facilement les traductions disponibles pour chaque page directement dans la vue en liste. Cela facilite la gestion et la vérification des contenus traduits, en offrant une vue d'ensemble claire et concise des différentes versions linguistiques.

## 17. directus-extension-display-translations-context-change-column-name.png

Cette image montre l'interface de configuration d'un champ dans la collection "Base (pages)" de Directus. On peut voir les options de configuration pour le champ "Base" qui utilise l'extension "Translations Context" comme interface d'affichage.

L'interface permet de personnaliser plusieurs aspects du champ, notamment :

- **Readonly** : Option pour désactiver l'édition de la valeur.
- **Required** : Option pour rendre le champ obligatoire (activée dans l'image).
- **Hidden** : Option pour masquer le champ dans la vue détaillée.
- **Note** : Champ pour ajouter une note explicative pour les utilisateurs.
- **Field Name Translations** : Section permettant de traduire le nom du champ dans différentes langues (on voit "[en-US] Title" dans l'image).

Cette capture d'écran est importante car elle montre comment personnaliser l'affichage et le comportement d'un champ utilisant l'extension Translations Context. La possibilité de traduire le nom du champ lui-même est particulièrement utile dans un contexte multilingue, car elle permet aux utilisateurs de voir l'interface dans leur langue préférée.

Cette configuration contribue à créer une expérience utilisateur cohérente et localisée, où non seulement le contenu mais aussi l'interface elle-même est adaptée aux préférences linguistiques des utilisateurs.

## 18. directus-extension-display-translations-context-system-translations.png

Cette image montre la vue en liste de la collection "Pages" dans l'interface d'administration de Directus. On peut voir une liste de pages avec leurs titres traduits dans différentes langues. Chaque ligne représente une page différente avec son titre affiché dans le format configuré par l'extension Translations Context :

- **Title→About** : Page "About" en anglais
- **Title→Accueil** : Page "Accueil" en français
- **Titolo→Applicazioni Aziendali** : Page "Applications d'entreprise" en italien
- **Titel→Audit & Performance** : Page "Audit & Performance" en allemand
- **Titre→Mentions Légales** : Page "Mentions Légales" en français
- **Título→Consultoría & Estrategia** : Page "Conseil & Stratégie" en espagnol

Cette capture d'écran illustre comment l'extension affiche les titres des pages dans leur langue respective directement dans la vue en liste. On peut voir que le format d'affichage inclut le nom du champ traduit (Title, Titre, Titolo, Titel, Título) suivi d'une flèche (→) et du contenu traduit.

Cette fonctionnalité est particulièrement utile pour les administrateurs de contenu multilingue, car elle leur permet d'identifier rapidement la langue de chaque entrée et de visualiser le contenu traduit sans avoir à ouvrir chaque page individuellement. L'affichage du nom du champ dans la langue correspondante (par exemple "Titre" pour le français, "Titolo" pour l'italien) renforce encore la clarté de l'interface et facilite la navigation dans un contexte multilingue.

## 19. directus-extension-display-translations-context-system-translations-params.png

Cette image montre le champ "Display Field" dans la configuration de l'extension Translations Context. On peut voir un champ de saisie contenant la valeur `[[TABLE_TITLE]]→{{title}}` avec une étiquette "Display Field \*" indiquant qu'il s'agit d'un champ obligatoire.

Cette capture d'écran illustre un exemple avancé de configuration du format d'affichage des traductions, combinant à la fois :

1. **Traductions système** : La partie `[[TABLE_TITLE]]` fait référence à une clé de traduction système. Directus traduira automatiquement cette clé dans la langue appropriée (par exemple, "Title" en anglais, "Titre" en français, "Titolo" en italien, etc.).

2. **Traductions de contenu** : La partie `{{title}}` fait référence au champ "title" de l'élément traduit, qui contient le contenu spécifique à chaque entrée.

3. **Séparateur personnalisé** : Le symbole `→` entre les deux éléments sert de séparateur visuel.

Cette configuration sophistiquée permet d'afficher non seulement le contenu traduit, mais aussi le nom du champ lui-même dans la langue appropriée, créant ainsi une interface entièrement localisée. Par exemple, pour une page en français, l'affichage pourrait être "Titre→Accueil", tandis que pour une page en italien, ce serait "Titolo→Applicazioni Aziendali".

Cette approche offre une expérience utilisateur cohérente et intuitive, où tous les éléments de l'interface sont présentés dans la langue correspondant au contenu, facilitant ainsi la navigation et la gestion des contenus multilingues.
