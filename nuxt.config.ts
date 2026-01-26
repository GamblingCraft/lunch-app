// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/icon'
  ],

  runtimeConfig: {
    public: {
      telegramBotName: process.env.NUXT_PUBLIC_TELEGRAM_BOT_NAME || 'et_lunch_web_bot',
      telegramBotToken: process.env.NUXT_PUBLIC_TELEGRAM_BOT_TOKEN || '8208807830:AAFz6ESQXnZx-rQWslr5tFh9X-m-E0gom3g',
      accessCode: process.env.NUXT_PUBLIC_ACCESS_CODE || '503344',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'https://et-obed.ru'
    }
  },

  app: {
    head: {
      title: 'ET ОБЕД - Заказ обедов для сотрудников',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: 'noindex, nofollow' }
      ],
      script: [
        {
          src: 'https://telegram.org/js/telegram-widget.js?22',
          async: true
        }
      ]
    }
  },

  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' https://telegram.org",
            "frame-src https://telegram.org https://oauth.telegram.org",
            "img-src 'self' https://telegram.org data:",
            "connect-src 'self' https://telegram.org",
            "style-src 'self' 'unsafe-inline'"
          ].join('; ')
        }
      }
    }
  },

  devtools: { enabled: true }
})
