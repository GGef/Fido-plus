import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import i18nextIntegration from 'astro-i18next';

export default defineConfig({
  output: 'static',
  integrations: [
    tailwind(),
    i18nextIntegration({
      defaultLocale: 'fr',
      locales: ['fr', 'en', 'ar'],
      i18next: {
        // options i18next → fichiers de traductions
        fallbackLng: 'fr',
        debug: true,
      },
    }),
  ],
  trailingSlash: 'always',
});
