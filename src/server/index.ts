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

const router = new Router()
router
  .get('/', home())
  .get('/customer/:customerHash/:page?', validateRequestSignature(), serveApp('account-manager'))
  .get('/customer/:customerHash/bundles/:bundleId', validateRequestSignature(), serveApp('bundle-editor'))
  .put('/customer/:customerHash/bundles/:bundleId', validateRequestSignature(), bodyParser(), updateBundle())
  .delete('/customer/:customerHash/bundles/:bundleId', validateRequestSignature(), bodyParser(), cancelBundle())
  .post('/customer/:customerHash/bundles/:bundleId', validateRequestSignature(), bodyParser(), reactivateBundle())
  .get('/bundle/:bundleId?', validateRequestSignature(), serveApp('bundle-editor'))
  .get('/install', install())
  .get('/install/confirm', validateRequestSignature(), confirmInstall())

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
