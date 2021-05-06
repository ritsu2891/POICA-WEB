import colors from 'vuetify/es5/util/colors';

const appName = 'POICA(α)';
const appUrl = process.env.SELF_URL;

export default {
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: 'POICA',
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: `${appName}はオリジナルの電子ポイントカードを作成できるサービスです` },
      { hid: 'og:site_name', property: 'og:site_name', content: appName },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:url', property: 'og:url', content: appUrl },
      { hid: 'og:title', property: 'og:title', content: appName },
      { hid: 'og:description', property: 'og:description', content: `${appName}はオリジナルの電子ポイントカードを作成できるサービスです` },
      { hid: 'og:image', property: 'og:image', content: `${appUrl}/ogp-common.jpg` },
      { hid: 'twitter:card', property: 'twitter:card', content: 'summary' },
      { hid: 'fb:app_id', property: 'fb:app_id', content: process.env.FB_APP_ID },
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/EventHub.js' },
    { src: '@/plugins/AxiosInstance.js' },
    { src: '@/plugins/Auth.js' },
    { src: '@/plugins/repos/UserRepo.js' },
    { src: '@/plugins/repos/CardRepo.js' },
    { src: '@/plugins/repos/CardMasterRepo.js' },
    { src: '@/plugins/repos/PointRepo.js' },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    'cookie-universal-nuxt',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    // customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    babel:{
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }]
      ]
    }
    /*
    extend (config, ctx) {
    }
    */
  }
}
