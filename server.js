require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const micro =  require('micro')
const { send } =  require('micro')
const { router, get, redirect, redirectJsFile } =  require('./lib/router')
const next =  require('next')
require('isomorphic-fetch')

 

const app = next({ dev: process.env.NODE_ENV == 'dev' })
const handle = app.getRequestHandler()

const rule = (url, query) => get(url, (req, res) => {
  const q = typeof query == 'function' ? query(req) : query || {}
  return app.render(req, res, '/root', { ...req.params, ...req.query, ...q })
})


app.prepare().then(() => {

  const microHandler = router(

    get('/favicon.ico', (req, res) => app.serveStatic(req, res, `./static/favicon.ico`)),
    get('/robots.txt', (req, res) => app.serveStatic(req, res, `./static/robots.txt`)),

    // get('/', (req, res) => redirect('http://ready.very.soon')(req, res)),
    // get('/sdk.js', (req, res) => redirectJsFile('https://raw.githubusercontent.com/83x33/sdk.js/master/dist/index.umd.js')(req, res)),
    rule('/', { page: 'site' }), 
    rule('/home', { page: 'site' }),
    rule('/docs', { page: 'docs' }),
    rule('/explorer', { page: 'explorer' }),
    rule('/login/*', req => ({ page: 'app', jwt: req.params._ })),
    rule('/app', { page: 'app' }),
    rule('/app/:panel', { page: 'app' }),
    get('/app/invoices/:id', (req, res) => redirect('/app/invoices')(req, res)), // forward item to list page
    get('/app/wallets/:id', (req, res) => redirect('/app/wallets')(req, res)), // forward item to list page
    rule('/invoice/:id', { page: 'widget' }), // widget public route
    
    get('/*', (req, res) => handle(req, res))
  )

  const server = micro(microHandler)

  server.listen(process.env.PORT, (err) => {
    if (err) throw err
    console.log(`> app [${process.env.NODE_ENV}] port:${process.env.PORT}`)
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})

