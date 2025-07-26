export default () => ({
  nodeEnv: process.env.NODE_ENV,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  jwtAccessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  jwtRefreshTokenExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  fakePaymentProvider: process.env.FAKE_PAYMENT_PROVIDER,
  externalPaymentConsumerKey: process.env.FAKE_PAYMENT_KEY,
});
