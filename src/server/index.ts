import * as Koa from "koa"
import * as bodyParser from "koa-bodyparser"
import * as logger from "koa-logger"
import * as mount from "koa-mount"
import * as Router from "koa-router"
import * as send from "koa-send"
import {join} from "path"
import * as Raven from "raven"

import redirectAll from "./middlewares/redirect-all"
import setCacheHeaders from "./middlewares/set-cache-headers"
import validateRequestSignature from "./middlewares/validate-request-signature"
import serveApp from "./serve-app"

import home from "./routes"
import install from "./routes/install"
import confirmInstall from "./routes/install/confirm"

import cancelBundle from "./routes/bundles/cancel"
import reactivateBundle from "./routes/bundles/reactivate"
import toggleSkipCharge from "./routes/bundles/toggle-skip-charge"
import updateBundle from "./routes/bundles/update"

import updateAddress from "./routes/addresses/update"
import updateBundleAddress from "./routes/bundles/update-address"

import updateCreditCard from "./routes/credit-cards/update"

const creditCardsRouter = new Router()
creditCardsRouter
  .put("/", bodyParser(), updateCreditCard())

const bundlesRouter = new Router()
bundlesRouter
  .get("/:bundleId", serveApp("bundle-editor"))
  .put("/:bundleId", bodyParser(), updateBundle())
  .put("/:bundleId/update-address", bodyParser(), updateBundleAddress())
  .delete("/:bundleId", bodyParser(), cancelBundle())
  .post("/:bundleId", bodyParser(), reactivateBundle())
  .post("/:bundleId/toggle-skip-charge", bodyParser(), toggleSkipCharge())

const addressesRouter = new Router()
  .put("/:addressId", bodyParser(), updateAddress())

const accountManagerRouter = new Router()
accountManagerRouter
  .use("/bundles", bundlesRouter.routes(), bundlesRouter.allowedMethods())
  .use("/addresses", addressesRouter.routes(), addressesRouter.allowedMethods())
  .use("/cards", creditCardsRouter.routes(), creditCardsRouter.allowedMethods())
  .get("/:page?/:id?", serveApp("account-manager"))

const router = new Router()
router
  .get("/", home())
  .get("/install", install())
  .get("/install/confirm", confirmInstall())
  .use(validateRequestSignature())
  .get("/bundle/:bundleId?", redirectAll(process.env.REDIRECT_BUNDLE_EDITOR_URL), serveApp("bundle-editor"))
  .use("/account/:shopifyCustomerId", accountManagerRouter.routes(), accountManagerRouter.allowedMethods())

const serveStatic = (path) => (ctx) => (
  send(ctx, ctx.path, {root: join(__dirname, path)})
)

const app = new Koa()
app
  .use(logger())
  .use(setCacheHeaders(60))
  .use(mount("/static", serveStatic("../../dist/public")))
  .use(mount("/images", serveStatic("../../images")))
  .use(router.routes())
  .use(router.allowedMethods())

if (process.env.SENTRY_PROJECT_URL) {
  Raven.config(process.env.SENTRY_PROJECT_URL).install()

  app.on("error", (err) => {
    Raven.captureException(err)
  })
}

const server = app.listen(process.env.PORT || 3000)
server.setTimeout(300 * 100)
