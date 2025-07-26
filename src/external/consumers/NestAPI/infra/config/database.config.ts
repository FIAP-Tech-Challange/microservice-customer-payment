export default () => ({
  dbHost: process.env.DB_PG_HOST,
  dbPort: process.env.DB_PG_PORT,
  dbUser: process.env.DB_PG_USER,
  dbPassword: process.env.DB_PG_PASSWORD,
  dbName: process.env.DB_PG_NAME,
  dbLog: process.env.DB_PG_LOGGING,
});
