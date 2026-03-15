import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/destinations': {
      en: '/destinations',
      ar: '/الوجهات'
    }
  }
});

export type Locale = (typeof routing.locales)[number];