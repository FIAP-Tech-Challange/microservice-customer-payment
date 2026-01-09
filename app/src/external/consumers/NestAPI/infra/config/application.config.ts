export default () => ({
  nodeEnv: process.env.NODE_ENV,
  apiKeySecretName: process.env.API_KEY_SECRET_NAME,
  apiKeyNameOrder: process.env.API_KEY_NAME_ORDER,
  orderServiceBaseUrlParam: process.env.ORDER_SERVICE_BASE_URL_PARAM,
  externalPaymentConsumerKey: process.env.EXTERNAL_PAYMENT_CONSUMER_KEY,
  jwtSecretName: process.env.JWT_SECRET_NAME,
  jwtAccessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
});
