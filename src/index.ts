/**
 * Translations Context Display Extension for Directus
 *
 * This extension provides an advanced display interface for multilingual content in Directus.
 * It supports both static and dynamic language selection, with features including:
 * - Template-based content display with system translation support
 * - Dynamic language selection based on related collections
 * - Country code to language code mapping
 * - Interactive language selection menu
 * - Support for nested language fields
 *
 * @author Alexandre Lapoux <contact@idee-web.com>
 * @copyright 2025 IDEE-WEB
 * @license MIT
 * @website https://www.idee-web.com
 */

import { defineDisplay } from "@directus/extensions";
import translationsContext from "./translations-context.vue";

export default defineDisplay({
  id: "translations-context",
  name: "Translations Context",
  description: "Display translations based on context and language selection",
  icon: "translate",
  component: translationsContext,
  handler: (values, options, { collection, field }) => {
    console.log("Translations Context Display handler called");
    console.log("Collection:", collection);
    console.log("Field:", field);
    console.log("Options:", options);
    console.log("Values:", values);

    // Create a clean copy of options without template markers
    const cleanOptions = { ...options };

    // Clean up the language field path from template markers
    if (
      cleanOptions.fieldDTC &&
      cleanOptions.fieldDTC.startsWith("{{") &&
      cleanOptions.fieldDTC.endsWith("}}")
    ) {
      cleanOptions.fieldDTC = cleanOptions.fieldDTC.slice(2, -2).trim();
    }

    // Clean up the selector path from template markers
    if (
      cleanOptions.selectorDTC &&
      cleanOptions.selectorDTC.startsWith("{{") &&
      cleanOptions.selectorDTC.endsWith("}}")
    ) {
      cleanOptions.selectorDTC = cleanOptions.selectorDTC.slice(2, -2).trim();
    }

    // Validate required inputs
    if (
      !field ||
      !collection ||
      !Array.isArray(values) ||
      values.length === 0
    ) {
      console.log("Invalid input, returning values as is");
      return values;
    }

    // Handle static language selector (direct language code)
    if (cleanOptions.selectorDTC && !cleanOptions.selectorDTC.includes(".")) {
      const staticLanguageCode = cleanOptions.selectorDTC.trim();
      console.log("Using static language code:", staticLanguageCode);

      // Find translation matching the static language code
      const langField = cleanOptions.fieldDTC || "language_code";
      console.log("Language field:", langField);

      const matchedItem = values.find((item) => {
        console.log("Checking item:", item);
        console.log("Item language code:", item[langField]);
        return item[langField] === staticLanguageCode;
      });

      console.log("Matched item:", matchedItem);

      // Return matched item or fallback to first item
      return matchedItem || values[0];
    }

    // For dynamic selectors (containing dots), pass all values to component
    // The component will handle the API calls and selection logic
    console.log("Using dynamic selector, passing values to component");
    return values;
  },
  options: ({ relations }) => {
    // Default mapping for common country codes to language codes
    const defaultMapping = {
      FR: "fr-FR",
      DE: "de-DE",
      ES: "es-ES",
      IT: "it-IT",
      EN: "en-US",
      US: "en-US",
      GB: "en-GB",
      UK: "en-GB",
    };

    const defaultMappingString = JSON.stringify(defaultMapping, null, 2);

    // Configuration options for the display
    return [
      {
        field: "templateDTC",
        name: "Display Field",
        meta: {
          interface: "input",
          width: "half",
          options: {
            placeholder: "[[TABLE_TITLE]]: {{title}}",
          },
          note: "Use {{field}} for item fields and [[SYSTEM_KEY]] for system translations. Ex: '[[TABLE_TITLE]]: {{title}}'",
          required: true,
          validate: {
            _regex: {
              pattern: "{{([^{}]+)}}",
              message:
                "Format must include at least one field between curly braces {{field}}",
            },
          },
        },
      },
      {
        field: "fieldDTC",
        name: "Language Field",
        meta: {
          interface: "input",
          width: "half",
          options: {
            placeholder: "languages_code",
          },
          note: "Champ dans la collection de traductions contenant le code de langue. Peut être un chemin direct (ex: language_code) ou imbriqué (ex: languages_code.code) pour les relations M2O.",
        },
      },
      {
        field: "selectorDTC",
        name: "Default Language Selector",
        meta: {
          interface: "input",
          width: "full",
          options: {
            placeholder: "fr-FR or {{pages_id.country_code.defaultLanguage}}",
          },
          note: "Code de langue statique (ex: fr-FR) ou chemin dynamique vers n'importe quelle collection liée (ex: {{pages_id.country_code.defaultLanguage}}, {{user_created.language_preference}}, {{organization_id.settings.language_code}})",
        },
      },
      {
        field: "mappingDTC",
        name: "Country to Language Mapping",
        type: "json",
        meta: {
          width: "full",
          interface: "input-code",
          options: {
            language: "json",
            template: defaultMappingString,
          },
          note: "Mécanisme de secours utilisé lorsqu'un code pays est trouvé au lieu d'un objet complet avec les informations de langue. Solution alternative en cas de problèmes d'accès aux données ou de restrictions de permissions.",
        },
        schema: {
          default_value: defaultMappingString,
        },
      },
      {
        field: "menuDTC",
        name: "Show Language Menu",
        type: "boolean",
        schema: {
          default_value: true,
        },
        meta: {
          interface: "boolean",
          width: "half",
          note: "Enable or disable the language selection menu",
        },
      },
    ];
  },
  types: ["alias"],
  localTypes: ["translations"],
});
