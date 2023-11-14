import queryString from 'query-string'
import jsonServer from 'json-server'
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
    req.body.updatedAt = Date.now()
  } else if (req.method === 'PATCH') {
    req.body.updatedAt = Date.now();
  }
  // Continue to JSON Server router
  next()
})

// In this example, returned resources will be wrapped in a body property
// Custom output for LIST with pagination
router.render = (req, res) => {
  // Check GET with pagination
  // If yes, custom output
  const headers = res.getHeaders()

  const totalCountHeader = headers['x-total-count']
  if (req.method === 'GET' && totalCountHeader) {
    const { _limit, _page } = queryString.parse(req._parsedUrl.query);

    console.log(res['x-total-count']);

    const result = {
      data: res.locals.data,
      pagination: {
        _page: Number.parseInt(_page) || 1,
        _limit: Number.parseInt(_limit) || 10,
        _totalRows: Number.parseInt(totalCountHeader)
      }
    }

    return res.jsonp(result);
  }
  // Otherwise, keep default behavior

  res.jsonp({
    body: res.locals.data
  })
}

// Use default router
server.use('/api', router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})