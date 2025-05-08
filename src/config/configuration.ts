export default () => ({
  port: process.env.PORT,
  database: {
    uri: process.env.MONGODB_URI,
  },
});
