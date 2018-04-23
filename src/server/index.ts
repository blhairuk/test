import {Agent} from 'https'
import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as mount from 'koa-mount'
import * as Router from 'koa-router'
import * as send from 'koa-send'
import {join} from 'path'

import serveApp from './serve-app'
import validateRequestSignature from './validate-request-signature'

import home from './routes'
import install from './routes/install'
import confirmInstall from './routes/install/confirm'

const router = new Router()
router
  .get('/', home())
  .get('/bundle-editor', serveApp('bundle-editor'))
  .get('/install', install())
  .get('/install/confirm', confirmInstall())

const serveStatic = () => ctx => (
  send(ctx, ctx.path, {root: join(__dirname, '../../dist/client')})
)

const app = new Koa()
app
  .use(logger())
  .use(mount('/static', serveStatic()))
  .use(validateRequestSignature())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)
