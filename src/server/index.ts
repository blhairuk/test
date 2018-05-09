import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as logger from 'koa-logger'
import * as mount from 'koa-mount'
import * as Router from 'koa-router'
import * as send from 'koa-send'
import {join} from 'path'

import serveApp from './serve-app'
import setCacheHeaders from './set-cache-headers'
import validateRequestSignature from './validate-request-signature'

import home from './routes'
import install from './routes/install'
import confirmInstall from './routes/install/confirm'

import cancelBundle from './routes/bundles/cancel'
import reactivateBundle from './routes/bundles/reactivate'
import updateBundle from './routes/bundles/update'

const accountManagerRouter = new Router()
accountManagerRouter
  .get('/:page?', serveApp('account-manager'))
  .get('/bundles/:bundleId', serveApp('bundle-editor'))
  .put('/bundles/:bundleId', bodyParser(), updateBundle())
  .delete('/bundles/:bundleId', bodyParser(), cancelBundle())
  .post('/bundles/:bundleId', bodyParser(), reactivateBundle())

const router = new Router()
router
  .get('/', home())
  .use(validateRequestSignature())
  .use('/customer/:customerHash', accountManagerRouter.routes(), accountManagerRouter.allowedMethods())
  .get('/bundle/:bundleId?', serveApp('bundle-editor'))
  .get('/install', install())
  .get('/install/confirm', confirmInstall())

const serveStatic = () => ctx => (
  send(ctx, ctx.path, {root: join(__dirname, '../../dist/public')})
)

const app = new Koa()
app
  .use(logger())
  .use(setCacheHeaders(60))
  .use(mount('/static', serveStatic()))
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(process.env.PORT || 3000)
