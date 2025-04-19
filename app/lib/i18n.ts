export interface I18nLocale {
  language: string;
  country: string;
  pathPrefix: string;
}

/**
 * A simplified i18n utility that extracts locale information from the URL
 * 
 * @param request - The incoming request
 * @returns An object with locale information
 */
export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const firstPathPart = url.pathname.split('/')[1]?.toUpperCase() ?? '';

  let pathPrefix = '';
  let language = 'EN';
  let country = 'US';

  // Check if the first path part matches a locale pattern (e.g., EN-US)
  if (/^[A-Z]{2}-[A-Z]{2}$/i.test(firstPathPart)) {
    pathPrefix = '/' + firstPathPart;
    const parts = firstPathPart.split('-');
    language = parts[0];
    country = parts[1];
  }

  return { language, country, pathPrefix };
}
