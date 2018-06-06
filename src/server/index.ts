import * as Koa from "koa"
import * as bodyParser from "koa-bodyparser"
import * as logger from "koa-logger"
import * as mount from "koa-mount"
import * as Router from "koa-router"
import * as send from "koa-send"
import {join} from "path"

import setCacheHeaders from "./middlewares/set-cache-headers"
import validateRequestSignature from "./middlewares/validate-request-signature"
import serveApp from "./serve-app"

import home from "./routes"
import install from "./routes/install"
import confirmInstall from "./routes/install/confirm"

import cancelBundle from "./routes/bundles/cancel"
import reactivateBundle from "./routes/bundles/reactivate"
import updateBundle from "./routes/bundles/update"

const bundlesRouter = new Router()
bundlesRouter
  .get("/:bundleId", serveApp("bundle-editor"))
  .put("/:bundleId", bodyParser(), updateBundle())
  .delete("/:bundleId", bodyParser(), cancelBundle())
  .post("/:bundleId", bodyParser(), reactivateBundle())

const accountManagerRouter = new Router()
accountManagerRouter
  .use("/bundles", bundlesRouter.routes(), bundlesRouter.allowedMethods())
  .get("/:page?/:id?", serveApp("account-manager"))

const router = new Router()
router
  .get("/", home())
  .get("/install", install())
  .get("/install/confirm", confirmInstall())
  .use(validateRequestSignature())
  .get("/bundle/:bundleId?", serveApp("bundle-editor"))
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

app.listen(process.env.PORT || 3000)
