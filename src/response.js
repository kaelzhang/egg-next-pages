const symbol = s => Symbol(`egg-ssr-pages:${s}`)

const HEADERS = symbol('headers')
const SET_HEADER = symbol('set-header')
const STATUS_CODE = symbol('status-code')
const STATUS_EXPLICIT_SET = symbol('status-code-explicit')

function fakeSetHeader (name, value) {
  this[HEADERS][name] = value
}

// The vanilla response must be handled:
const handle = res => {
  // Koa will set `res.statusCode` as 404
  //   which causes that we don't know whether a certain
  //   next page exists or not.
  // If a request arrived here, which indicates that the request
  //   matches the router,
  //   so that we can simply set `res.statusCode` as 200
  //   before `next.renderToHTML`
  // If the corresponding component is not found, `next` will set the
  //   statusCode as 404
  res[STATUS_CODE] = 200
  res[STATUS_EXPLICIT_SET] = false

  Object.defineProperty(res, 'statusCode', {
    set (code) {
      this[STATUS_EXPLICIT_SET] = true
      this[STATUS_CODE] = code
    },

    get () {
      return this[STATUS_CODE]
    }
  })

  res[SET_HEADER] = res.setHeader
  res[HEADERS] = Object.create(null)

  // Lifecycle methods of guardians might changes the headers,
  //   so `res.headerSent` might be true to prevent status being set
  res.setHeader = fakeSetHeader
}

module.exports = {
  handle,
  HEADERS,
  SET_HEADER,
  STATUS_EXPLICIT_SET
}
