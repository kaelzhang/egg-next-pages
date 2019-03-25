const symbol = s => Symbol(`egg-ssr-pages:${s}`)

const HEADERS = symbol('headers')
const SET_HEADER = symbol('set-header')

function fakeSetHeader (name, value) {
  this[HEADERS][name] = value
}

// The vanilla response must be handled:
const handle = res => {
  // Koa will set `res.statusCode` as 404
  //   which causes that we don't know whether a certain
  //   next page exists.
  // If a request arrived here, which indicates that the request
  //   matches the router,
  //   so that we can simply set `res.statusCode` as 200
  //   before `next.renderToHTML`
  // If the corresponding component is not found, `next` will set the
  //   statusCode as 404
  res.statusCode = 200

  res[SET_HEADER] = res.setHeader
  res[HEADERS] = Object.create(null)

  // Lifecycle methods of guardians might changes the headers,
  //   so `res.headerSent` might be true to prevent
  res.setHeader = fakeSetHeader
}

module.exports = {
  handle,
  HEADERS,
  SET_HEADER
}
