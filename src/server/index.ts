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
  .get("/:page?", serveApp("account-manager"))
  .use("/bundles", bundlesRouter.routes(), bundlesRouter.allowedMethods())

const router = new Router()
router
  .get("/", home())
  .use(validateRequestSignature())
  .get("/bundle/:bundleId?", serveApp("bundle-editor"))
  .get("/install", install())
  .get("/install/confirm", confirmInstall())
  .use("/customer/:customerHash", accountManagerRouter.routes(), accountManagerRouter.allowedMethods())

const serveStatic = () => (ctx) => (
  send(ctx, ctx.path, {root: join(__dirname, "../../dist/public")})
)

const app = new Koa()
app
  .use(logger())
  .use(setCacheHeaders(60))
  .use(mount("/static", serveStatic()))
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(process.env.PORT || 3000)
