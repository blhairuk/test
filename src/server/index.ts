import {Agent} from 'https'
import * as Koa from 'koa'
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

import AccountManager from '../client/account-manager/app'
import BundleEditor from '../client/bundle-editor/app'
import getBundleEditorInitialProps from '../client/bundle-editor/get-initial-props'
import getAccountManagerInitialProps from '../client/account-manager/get-initial-props'

const router = new Router()
router
  .get('/', home())
  .get('/customer/:customerHash/:page?', validateRequestSignature(), serveApp({
    assetName: 'account-manager',
    getInitialProps: getAccountManagerInitialProps,
    Component: AccountManager
  }))
  .get('/customer/:customerHash/bundle/:bundleId', validateRequestSignature(), serveApp({
    assetName: 'bundle-editor',
    getInitialProps: getBundleEditorInitialProps,
    Component: BundleEditor
  }))
  .get('/bundle', validateRequestSignature(), serveApp({
    assetName: 'bundle-editor',
    getInitialProps: getBundleEditorInitialProps,
    Component: BundleEditor
  }))
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
