import {Agent} from 'https'
import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as Router from 'koa-router'

import validateRequestSignature from './validate-request-signature'

import home from './routes'
import install from './routes/install'
import confirmInstall from './routes/install/confirm'

const router = new Router()
router
  .get('/', home())
  .get('/install', install())
  .get('/install/confirm', confirmInstall())

const app = new Koa()
app
  .use(logger())
  .use(validateRequestSignature())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)
