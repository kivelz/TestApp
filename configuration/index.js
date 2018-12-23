module.exports = {
    JWT_SECRET: 'codeworkrauthentication',
    oauth: {
      facebook: {
        clientID: process.env.facebookID,
        clientSecret: process.env.facebookSecret
      }
    }
  };