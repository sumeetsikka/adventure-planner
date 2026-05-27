/**
 * Minimal i18n scaffold.
 *
 * Why so light? Full localisation of a 21-tab app is multi-session work. The
 * goal of this file is to PLANT THE FOUNDATION so adding a language is just
 * "fill in the strings" — no architectural rework. Today, only English is
 * registered. The plumbing (language picker, persistence, lookup helper) is
 * here and wired into a couple of high-visibility surfaces as a proof.
 *
 * To add a language:
 *   1. Add an entry to `STRINGS` keyed by ISO code (e.g. 'es', 'ja', 'zh').
 *   2. Translate every key — fall back to English for any missing.
 *   3. Add the language to `AVAILABLE_LANGUAGES` so it shows up in the picker.
 */

const STORAGE_KEY = 'adventure-planner:lang';

export type LangCode = 'en' | 'es' | 'ja' | 'zh-CN' | 'fr' | 'de';

export interface LanguageMeta {
  code: LangCode;
  label: string;     // native name, e.g. "Español"
  flag: string;      // emoji
}

/** Languages currently exposed in the picker. Add entries here as STRINGS
 *  coverage is built up. */
export const AVAILABLE_LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  // Templates below — uncomment once their STRINGS block is populated.
  // { code: 'es', label: 'Español', flag: '🇪🇸' },
  // { code: 'ja', label: '日本語', flag: '🇯🇵' },
  // { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
];

/** Translation keys and their English source strings. Source-of-truth for what
 *  is i18n-aware in the UI. */
export const STRINGS: Record<LangCode, Partial<Record<string, string>>> = {
  en: {
    'wizard.where_to_next': 'Where to next?',
    'wizard.choose_destination': 'Choose your destination',
    'wizard.subhead': 'Twenty-nine countries, four hundred destinations — one perfectly crafted journey, built just for you.',
    'wizard.search_country': 'Search a country…',
    'wizard.inspire_me': '✦ Inspire me',
    'wizard.my_trips': 'My trips',
    'wizard.wishlist': '★ Wishlist',
    'common.continue': 'Continue',
    'common.back': '← Back',
    'common.next': 'Next →',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'mode.standard': 'Standard',
    'mode.family': 'Family',
    'mode.senior': 'Senior',
    'mode.accessibility': 'Accessibility',
  },
  es: {},
  ja: {},
  'zh-CN': {},
  fr: {},
  de: {},
};

function getLang(): LangCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (stored && AVAILABLE_LANGUAGES.some(l => l.code === stored)) return stored;
  } catch { /* ignore */ }
  return 'en';
}

export function setLang(code: LangCode): void {
  try { localStorage.setItem(STORAGE_KEY, code); }
  catch { /* ignore */ }
  // Dispatch a window event so listening components can re-render.
  try { window.dispatchEvent(new CustomEvent('adventure-planner:lang-changed', { detail: code })); }
  catch { /* ignore */ }
}

/** Lookup a string by key, falling back through: current lang → English → key.
 *  Always returns a non-empty string. */
export function t(key: string): string {
  const lang = getLang();
  const localised = STRINGS[lang]?.[key];
  if (localised) return localised;
  const english = STRINGS.en?.[key];
  if (english) return english;
  // Last resort: return the key itself so missing strings are visible during
  // development rather than silently empty.
  return key;
}

/** Current language code — for components that need to render differently
 *  per language (e.g. RTL, date format). */
export function currentLang(): LangCode {
  return getLang();
}
