const ngrok = require('ngrok')

ngrok.connect({
  addr: 3000,
  subdomain: process.env.NGROK_SUBDOMAIN,
})
