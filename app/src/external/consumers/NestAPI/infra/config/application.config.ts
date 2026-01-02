export default () => ({
  nodeEnv: process.env.NODE_ENV,
  apiKey: process.env.API_KEY,
  apiKeyNameOrder: process.env.API_KEY_NAME_ORDER,
  orderServiceBaseUrlParam: process.env.ORDER_SERVICE_BASE_URL_PARAM,
  jwtSecret: process.env.JWT_SECRET,
  jwtAccessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  jwtRefreshTokenExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  externalPaymentConsumerKey: process.env.PAYMENT_EXTERNAL_API_WEB_HOOK_KEY,
});
