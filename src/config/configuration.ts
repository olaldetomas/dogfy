export default () => ({
  port: process.env.PORT,
  database: {
    uri: process.env.MONGODB_URI,
  },
  polling: {
    trackingNumber: process.env.TRACKING_NUMBER || 'TRACK123456',
  },
});
