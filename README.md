# Shopify Subscriptions App

## How to use

1. Install
1. Run `ngrok http 3000`
1. Paste the ngrok URL into:
  - The https://partners.shopify.com app:
    - App Information -> URLs
    - Extensions -> App proxy
    - `.env` file, `REDIRECT_URI`.
1. Run `npm run dev`.
1. Visit http://localhost:3000?shop=[shop]&scope=[scope].
1. Follow the steps to install the app.