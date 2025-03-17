<!--
Translations Context Display Component for Directus
This component handles the display and interaction of multilingual content.

Features:
- Dynamic language selection based on related collections
- Template-based content rendering with system translation support
- Interactive language selection menu
- Support for nested language fields and country code mapping
- Fallback mechanisms for missing translations

@author Alexandre Lapoux
@copyright 2025 IDEE-WEB
@license MIT
@website https://www.idee-web.com
-->

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useApi } from "@directus/extensions-sdk";

/**
 * Component Props Interface
 * Defines the configuration options for the language display
 */
interface Props {
  collection: string; // Collection name
  field: string; // Field name
  type: string; // Field type
  value?: Record<string, any>[]; // Translation values
  templateDTC?: string; // Display template with field tokens
  fieldDTC?: string; // Language code field path
  selectorDTC?: string; // Language selector path or static code
  mappingDTC?: string; // Country to language code mapping
  menuDTC?: boolean; // Show/hide language selection menu
}

// Default values for optional props
const props = withDefaults(defineProps<Props>(), {
  value: () => [],
  templateDTC: undefined,
  fieldDTC: "language_code",
  selectorDTC: undefined,
  mappingDTC: undefined,
  menuDTC: true,
});

// API client instance
const api = useApi();

// Component state
const targetLanguageCode = ref<string | undefined>(undefined);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Data management state
const translationItems = ref<Record<string, any>[]>([]);
const dataFetched = ref(false);

// System translations storage
const systemTranslations = ref<Record<string, Record<string, string>>>({});

/**
 * Determines if the language selector is static or dynamic
 * Static selectors are direct language codes, while dynamic ones are paths to related fields
 */
const isStaticSelector = computed(() => {
  return props.selectorDTC && !props.selectorDTC.includes(".");
});

/**
 * Parses a dynamic language selector path into its components
 * Expected format: collection.field.language_code_field
 */
const selectorInfo = computed(() => {
  if (!props.selectorDTC || isStaticSelector.value) return null;

  // Remove template markers if present
  let selector = props.selectorDTC;
  if (selector.startsWith("{{") && selector.endsWith("}}")) {
    selector = selector.slice(2, -2).trim();
  }

  const parts = selector.split(".");
  if (parts.length < 3) {
    console.error(
      `Invalid selector format: ${selector}. Expected format: collection.field.language_code_field`
    );
    error.value = `Invalid selector format: ${selector}. Expected format: collection.field.language_code_field`;
    return null;
  }

  return {
    relatedCollection: parts[0], // e.g., "pages_id"
    countryField: parts[1], // e.g., "country_code"
    languageCodeField: parts[2], // e.g., "defaultLanguage"
  };
});

// Extract language code from static selector
const staticLanguageCode = computed(() => {
  if (isStaticSelector.value) {
    // Remove {{ }} if present
    let selector = props.selectorDTC || "";
    if (selector.startsWith("{{") && selector.endsWith("}}")) {
      selector = selector.slice(2, -2).trim();
    }
    return selector;
  }
  return undefined;
});

// Optimized function to fetch all necessary data in a single request
const fetchAllData = async () => {
  // Reset state
  error.value = null;
  targetLanguageCode.value = undefined;

  console.log("Starting fetchAllData");
  console.log("Country selector:", props.selectorDTC);
  console.log("Is static selector:", isStaticSelector.value);

  // If using a static selector, set it directly
  if (isStaticSelector.value) {
    console.log("Using static selector:", staticLanguageCode.value);
    targetLanguageCode.value = staticLanguageCode.value;

    // If we already have the translation items, we don't need to fetch them again
    if (dataFetched.value) return;
  }

  if (!props.value || props.value.length === 0) {
    console.log("No translations available");
    return;
  }

  try {
    isLoading.value = true;

    // Check if the translations are just IDs (strings) instead of objects
    const isSimpleIds = props.value.every(
      (item) => typeof item === "string" || typeof item === "number"
    );

    if (!isSimpleIds) {
      // If translations are already objects, just use them
      translationItems.value = props.value;
      dataFetched.value = true;

      // If using a dynamic selector, process the data to extract the language code
      if (!isStaticSelector.value && selectorInfo.value) {
        processDataForDynamicSelector(props.value);
      }

      // Check if we need to fetch system translations (only if template contains [[...]])
      if (props.templateDTC && props.templateDTC.includes("[[")) {
        await fetchSystemTranslations();
      }

      return;
    }

    // Get the collection name for the translations
    const translationsCollection = props.field.endsWith("_translations")
      ? props.field
      : `${props.collection}_${props.field}`;

    console.log("Translations collection:", translationsCollection);

    // Determine which fields to fetch
    let fields = ["*"]; // Start with all direct fields

    // If we have a dynamic selector, we need to fetch the related collections too
    if (props.selectorDTC && !isStaticSelector.value && selectorInfo.value) {
      // Add the related collection fields
      fields.push(`${selectorInfo.value.relatedCollection}.*`);
      fields.push(
        `${selectorInfo.value.relatedCollection}.${selectorInfo.value.countryField}.*`
      );
    }

    // Fetch all translation items by their IDs in a single request
    const ids = props.value.join(",");
    const apiUrl = `/items/${translationsCollection}`;
    const apiParams = {
      filter: { id: { _in: ids } },
      fields: fields,
    };

    console.log("API request for translations:", {
      url: apiUrl,
      params: apiParams,
    });

    // Determine if we need to fetch system translations
    const needsSystemTranslations =
      props.templateDTC && props.templateDTC.includes("[[");

    // Prepare API requests
    const requests = [api.get(apiUrl, { params: apiParams })];

    // Add system translations request if needed
    if (needsSystemTranslations) {
      requests.push(
        api.get("/translations", {
          params: {
            limit: -1, // Get all translations
          },
        })
      );
    }

    // Execute all requests in parallel
    const responses = await Promise.all(requests);

    // Process translations response
    const translationsResponse = responses[0];
    if (translationsResponse.data && translationsResponse.data.data) {
      translationItems.value = translationsResponse.data.data;
      dataFetched.value = true;
      console.log("Fetched translation items:", translationItems.value);

      // If using a dynamic selector, process the data to extract the language code
      if (!isStaticSelector.value && selectorInfo.value) {
        processDataForDynamicSelector(translationsResponse.data.data);
      }
    } else {
      console.error(
        "Invalid API response format for translations",
        translationsResponse
      );
      error.value = "Failed to fetch translation items";
    }

    // Process system translations response if it exists
    if (needsSystemTranslations && responses.length > 1) {
      const systemResponse = responses[1];
      if (systemResponse.data && Array.isArray(systemResponse.data.data)) {
        // Organize translations by key and language
        const translations: Record<string, Record<string, string>> = {};

        systemResponse.data.data.forEach((translation: any) => {
          const key = translation.key;
          const language = translation.language;
          const value = translation.value;

          if (!translations[key]) {
            translations[key] = {};
          }

          translations[key][language] = value;
        });

        systemTranslations.value = translations;
        console.log("System translations loaded:", systemTranslations.value);
      }
    }
  } catch (err) {
    console.error("Error fetching data:", err);
    error.value = `API Error: ${
      err instanceof Error ? err.message : String(err)
    }`;
  } finally {
    isLoading.value = false;
  }
};

// Process data for dynamic selector to extract the language code
const processDataForDynamicSelector = (data: Record<string, any>[]) => {
  if (!selectorInfo.value || data.length === 0) return;

  console.log("Processing data for dynamic selector");
  console.log("Selector info:", selectorInfo.value);

  // Get the first item to extract the related collection ID
  const firstItem = data[0];
  console.log("First translation item:", firstItem);

  // Extract the related collection ID from the first item
  const relatedCollectionField = selectorInfo.value.relatedCollection;
  console.log("Related collection field:", relatedCollectionField);

  // Check if the related collection field exists in the item
  if (!(relatedCollectionField in firstItem)) {
    console.error(
      `Field ${relatedCollectionField} not found in item`,
      firstItem
    );
    console.log("Available fields:", Object.keys(firstItem));
    error.value = `Field ${relatedCollectionField} not found`;
    return;
  }

  const relatedItem = firstItem[relatedCollectionField];
  console.log("Related item:", relatedItem);

  if (!relatedItem) {
    error.value = `No related item found for ${relatedCollectionField}`;
    return;
  }

  // Now we need to follow the path to get the language code
  // For example, if the selector is "pages_id.country_code.defaultLanguage"
  // We need to get pages_id, then country_code, then defaultLanguage

  // First, check if the country_code field exists in the related item
  const countryField = selectorInfo.value.countryField;
  if (!(countryField in relatedItem)) {
    console.error(
      `Field ${countryField} not found in related item`,
      relatedItem
    );
    console.log("Available fields in related item:", Object.keys(relatedItem));
    error.value = `Field ${countryField} not found in related item`;
    return;
  }

  // Log the country item for debugging
  const countryItem = relatedItem[countryField];
  console.log("Country item:", countryItem);

  if (!countryItem) {
    error.value = `No country item found for ${countryField}`;
    return;
  }

  // Instead of trying to fetch the country item directly (which might cause 403 errors),
  // we'll use a fallback approach:

  // 1. First, check if the country item is already an object with the language code field
  const languageCodeField = selectorInfo.value.languageCodeField;

  if (
    typeof countryItem === "object" &&
    countryItem !== null &&
    languageCodeField in countryItem
  ) {
    // Great! We already have the language code
    const langCode = countryItem[languageCodeField];
    console.log(`Found language code directly in country object: ${langCode}`);
    targetLanguageCode.value = langCode;
    return;
  }

  // 2. If the country item is just an ID or doesn't have the language code field,
  // we'll use the configurable mapping as a fallback

  // Default mapping of country codes to language codes
  // This is used when:
  // 1. The country item is just a string (country code) instead of an object
  // 2. The user hasn't provided a custom mapping
  // 3. There's an error parsing the custom mapping
  const defaultMapping: Record<string, string> = {
    DE: "de-DE",
    FR: "fr-FR",
    ES: "es-ES",
    IT: "it-IT",
    EN: "en-US",
    US: "en-US",
    GB: "en-GB",
    UK: "en-GB",
  };

  // Try to parse the custom mapping if provided
  let countryToLanguageMap: Record<string, string> = defaultMapping;

  if (props.mappingDTC) {
    try {
      const customMapping = JSON.parse(props.mappingDTC);
      if (customMapping && typeof customMapping === "object") {
        // Merge with default mapping to ensure we have fallbacks
        countryToLanguageMap = { ...defaultMapping, ...customMapping };
        console.log("Using custom country mapping:", countryToLanguageMap);
      }
    } catch (err) {
      console.error("Error parsing country mapping:", err);
      console.log("Using default country mapping instead");
    }
  } else {
    console.log(
      "No custom mapping provided, using default mapping:",
      defaultMapping
    );
  }

  // If the country item is a string, use it as a key in the mapping
  if (typeof countryItem === "string") {
    const countryCode = countryItem.toUpperCase();
    if (countryCode in countryToLanguageMap) {
      const langCode = countryToLanguageMap[countryCode];
      console.log(
        `Using fallback language code for country ${countryCode}: ${langCode}`
      );
      targetLanguageCode.value = langCode;
      return;
    }
  }

  // 3. If all else fails, try to use the country code directly as the language code
  if (typeof countryItem === "string") {
    console.log(`Using country code directly as language code: ${countryItem}`);
    targetLanguageCode.value = countryItem;
    return;
  }

  // If we get here, we couldn't determine the language code
  console.error(
    "Could not determine language code from country item:",
    countryItem
  );
  error.value = "Could not determine language code";
};

// Watch for changes in the value or selector
watch(
  () => [props.value, props.selectorDTC],
  () => {
    // Reset the dataFetched flag when the value or selector changes
    dataFetched.value = false;
    fetchAllData();
  },
  { immediate: true }
);

// Helper function to safely get a property from an object
const getProperty = (obj: any, prop: string | undefined): any => {
  if (!prop) return undefined;

  // Remove {{ }} if present
  let cleanProp = prop;
  if (cleanProp.startsWith("{{") && cleanProp.endsWith("}}")) {
    cleanProp = cleanProp.slice(2, -2).trim();
  }

  return obj && typeof obj === "object" ? obj[cleanProp] : undefined;
};

// Function to fetch system translations
const fetchSystemTranslations = async () => {
  try {
    console.log("Fetching system translations");
    const response = await api.get("/translations", {
      params: {
        limit: -1, // Get all translations
      },
    });

    if (response.data && Array.isArray(response.data.data)) {
      // Organize translations by key and language
      const translations: Record<string, Record<string, string>> = {};

      response.data.data.forEach((translation: any) => {
        const key = translation.key;
        const language = translation.language;
        const value = translation.value;

        if (!translations[key]) {
          translations[key] = {};
        }

        translations[key][language] = value;
      });

      systemTranslations.value = translations;
      console.log("System translations loaded:", systemTranslations.value);
    }
  } catch (err) {
    console.error("Error fetching system translations:", err);
    // Don't set error.value here to avoid disrupting the main functionality
  }
};

// Function to get a system translation
const getSystemTranslation = (
  key: string,
  language: string
): string | undefined => {
  if (
    systemTranslations.value[key] &&
    systemTranslations.value[key][language]
  ) {
    return systemTranslations.value[key][language];
  }
  return undefined;
};

// Function to render a template with multiple fields
const renderTemplate = (
  item: Record<string, any>,
  template: string | undefined
): string => {
  if (!template) return item?.id || "-";

  let result = template;

  // First, replace all system translation keys with [[KEY]] format
  result = result.replace(/\[\[([A-Z0-9_]+)\]\]/g, (match, key) => {
    // If we have a target language, use it
    if (targetLanguageCode.value) {
      const translation = getSystemTranslation(key, targetLanguageCode.value);
      if (translation) return translation;
    }

    // Fallback: use the first available translation for this key
    if (systemTranslations.value[key]) {
      const languages = Object.keys(systemTranslations.value[key]);
      if (languages.length > 0) {
        return systemTranslations.value[key][languages[0]];
      }
    }

    // If no translation found, return the key itself
    return key;
  });

  // Then, replace all field values with {{field}} format
  result = result.replace(/{{([^{}]+)}}/g, (match, field) => {
    const fieldName = field.trim();
    const value = getProperty(item, fieldName);
    return value !== undefined ? String(value) : "-";
  });

  return result;
};

// Find the translation item to display
const displayItem = computed(() => {
  if (translationItems.value.length === 0) {
    if (!props.value || props.value.length === 0) {
      console.log("No translations available");
      return {};
    }

    // If we haven't fetched the translation items yet, return a simple object with the ID
    const isSimpleIds = props.value.every(
      (item) => typeof item === "string" || typeof item === "number"
    );
    if (isSimpleIds) {
      console.log("Using first ID as fallback:", props.value[0]);
      return { id: props.value[0] };
    }

    // If translations are already objects, use the first one
    console.log("Using first item as fallback:", props.value[0]);
    return props.value[0] || {};
  }

  console.log("All translation items:", translationItems.value);
  console.log("Template field:", props.templateDTC);
  console.log("Language field:", props.fieldDTC);
  console.log("Country selector:", props.selectorDTC);

  // Parse the language field path
  const langFieldPath = (props.fieldDTC || "languages_code").split(".");
  const primaryLangField = langFieldPath[0]; // e.g., "languages_code"

  // If we have a target language, use it
  if (targetLanguageCode.value) {
    console.log(
      `Looking for translation with language code = ${targetLanguageCode.value}`
    );

    // Log all available translations with their language codes and template values
    if (process.env.NODE_ENV !== "production") {
      console.log("Available translations:");
      translationItems.value.forEach((val, index) => {
        // Get the language code value
        let languageCode: any;

        // Check if the language field is a nested path or a direct field
        if (langFieldPath.length > 1) {
          // For nested paths like "languages_code.code"
          // First get the primary field value
          const primaryFieldValue = val[primaryLangField];

          // If it's a string, it's already the language code (no need for nested access)
          if (typeof primaryFieldValue === "string") {
            languageCode = primaryFieldValue;
          }
          // If it's an object, try to access the nested property
          else if (primaryFieldValue && typeof primaryFieldValue === "object") {
            // Get the nested field (e.g., "code")
            const nestedField = langFieldPath[1];
            languageCode = primaryFieldValue[nestedField];
          }
        } else {
          // Direct field (e.g., "languages_code")
          languageCode = val[primaryLangField];
        }

        console.log(`Translation ${index}:`, {
          languageCode,
          templateValue: getProperty(val, props.templateDTC),
          fullItem: val,
        });
      });
    }

    // Find a translation that matches the target language code
    const matchedItem = translationItems.value.find((val) => {
      // Get the language code value
      let languageCode: any;

      // Check if the language field is a nested path or a direct field
      if (langFieldPath.length > 1) {
        // For nested paths like "languages_code.code"
        // First get the primary field value
        const primaryFieldValue = val[primaryLangField];

        // If it's a string, it's already the language code (no need for nested access)
        if (typeof primaryFieldValue === "string") {
          languageCode = primaryFieldValue;
        }
        // If it's an object, try to access the nested property
        else if (primaryFieldValue && typeof primaryFieldValue === "object") {
          // Get the nested field (e.g., "code")
          const nestedField = langFieldPath[1];
          languageCode = primaryFieldValue[nestedField];
        }
      } else {
        // Direct field (e.g., "languages_code")
        languageCode = val[primaryLangField];
      }

      return languageCode === targetLanguageCode.value;
    });

    if (matchedItem) {
      console.log("Found matching translation:", matchedItem);
      return matchedItem;
    } else {
      console.log("No matching translation found, using fallback");
    }
  } else {
    console.log("No target language code available, using fallback");
  }

  // Fallback to the first item
  console.log("Using first item as fallback:", translationItems.value[0]);
  return translationItems.value[0] || {};
});

// Get all available translations for the dropdown
const translations = computed(() => {
  if (translationItems.value.length === 0) {
    if (!props.value) return [];

    // If we haven't fetched the translation items yet, create simple items for the dropdown
    const isSimpleIds = props.value.every(
      (item) => typeof item === "string" || typeof item === "number"
    );
    if (isSimpleIds) {
      return props.value.map((id) => {
        return {
          id,
          lang: "ID",
          item: { id },
        };
      });
    }

    // If translations are already objects, use them
    const langFieldPath = (props.fieldDTC || "languages_code").split(".");
    const primaryLangField = langFieldPath[0]; // e.g., "languages_code"

    return props.value.map((item) => {
      // Get the language code value
      let lang: any;

      // Check if the language field is a nested path or a direct field
      if (langFieldPath.length > 1) {
        // For nested paths like "languages_code.code"
        // First get the primary field value
        const primaryFieldValue = item[primaryLangField];

        // If it's a string, it's already the language code (no need for nested access)
        if (typeof primaryFieldValue === "string") {
          lang = primaryFieldValue;
        }
        // If it's an object, try to access the nested property
        else if (primaryFieldValue && typeof primaryFieldValue === "object") {
          // Get the nested field (e.g., "code")
          const nestedField = langFieldPath[1];
          lang = primaryFieldValue[nestedField];
        }
      } else {
        // Direct field (e.g., "languages_code")
        lang = item[primaryLangField];
      }

      return {
        id: item?.id || item?.["id"],
        lang,
        item,
      };
    });
  }

  // Parse the language field path
  const langFieldPath = (props.fieldDTC || "languages_code").split(".");
  const primaryLangField = langFieldPath[0]; // e.g., "languages_code"

  return translationItems.value.map((item) => {
    // Get the language code value
    let lang: any;

    // Check if the language field is a nested path or a direct field
    if (langFieldPath.length > 1) {
      // For nested paths like "languages_code.code"
      // First get the primary field value
      const primaryFieldValue = item[primaryLangField];

      // If it's a string, it's already the language code (no need for nested access)
      if (typeof primaryFieldValue === "string") {
        lang = primaryFieldValue;
      }
      // If it's an object, try to access the nested property
      else if (primaryFieldValue && typeof primaryFieldValue === "object") {
        // Get the nested field (e.g., "code")
        const nestedField = langFieldPath[1];
        lang = primaryFieldValue[nestedField];
      }
    } else {
      // Direct field (e.g., "languages_code")
      lang = item[primaryLangField];
    }

    return {
      id: item?.id || item?.["id"],
      lang,
      item,
    };
  });
});

// Load the language code when the component is mounted
onMounted(() => {
  fetchAllData();
  fetchSystemTranslations();
});
</script>

<template>
  <div v-if="!value || value.length === 0" class="no-value">-</div>
  <div v-else-if="isLoading" class="loading">
    <v-progress-circular indeterminate small />
  </div>
  <div v-else-if="error" class="error">
    <v-tooltip>
      <template #activator="{ activate }">
        <v-icon name="error" small @click="activate" />
        <span class="error-text">Error loading translation</span>
      </template>
      {{ error }}
    </v-tooltip>
  </div>
  <div v-else class="display-language">
    <!-- Main translation display -->
    <div class="translation-value" :class="{ 'full-width': !menuDTC }">
      {{ renderTemplate(displayItem, templateDTC) || displayItem.id || "-" }}
    </div>
    <!-- Language selection menu -->
    <template v-if="menuDTC">
      <v-menu class="menu" show-arrow :disabled="value.length === 0">
        <template #activator="{ toggle, deactivate, active }">
          <v-icon
            small
            class="icon"
            :class="{ active }"
            name="translate"
            @click.stop="toggle"
            @focusout="deactivate"
          ></v-icon>
        </template>

        <v-list class="links">
          <v-list-item v-for="item in translations" :key="item.id">
            <v-list-item-content>
              <div class="header">
                <div class="lang">
                  <v-icon name="translate" small />
                  {{ item.lang }}
                </div>
                <div
                  v-if="item.lang === targetLanguageCode"
                  class="current-lang"
                >
                  <v-icon name="check" small />
                  Selected
                </div>
              </div>
              <div class="translation-value">
                {{
                  renderTemplate(item.item, templateDTC) || item.item.id || "-"
                }}
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.v-list {
  width: 300px;
}

.no-value,
.loading,
.error {
  color: var(--theme--foreground-subdued);
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.error {
  display: flex;
  align-items: center;
  color: var(--theme--danger);

  .v-icon {
    margin-right: 4px;
  }

  .error-text {
    font-size: 12px;
  }
}

.display-language {
  display: inline-flex;
  max-width: 100%;
  align-items: center;

  .icon {
    color: var(--theme--foreground-subdued);
    opacity: 0;
    transition: opacity var(--fast) var(--transition);
    margin-left: 4px;
  }

  &:hover .icon,
  .icon.active {
    opacity: 1;
  }
}

.header {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  color: var(--theme--foreground-subdued);
  font-size: 12px;

  .lang {
    font-weight: 600;
  }

  .current-lang {
    color: var(--theme--primary);
    font-size: 12px;
    display: flex;
    align-items: center;

    .v-icon {
      margin-right: 4px;
    }
  }

  .v-icon {
    margin-right: 4px;
  }
}

.translation-value {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.v-list-item-content {
  padding-top: 4px;
  padding-bottom: 2px;
}

.v-list-item:not(:first-child) {
  .header {
    padding-top: 8px;
    border-top: var(--theme--border-width) solid
      var(--theme--border-color-subdued);
  }
}
</style>
