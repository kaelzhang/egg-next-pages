[![Build Status](https://travis-ci.org/kaelzhang/egg-ssr-pages.svg?branch=master)](https://travis-ci.org/kaelzhang/egg-ssr-pages)
[![Coverage](https://codecov.io/gh/kaelzhang/egg-ssr-pages/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/egg-ssr-pages)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/egg-ssr-pages?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/egg-ssr-pages)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/egg-ssr-pages.svg)](http://badge.fury.io/js/egg-ssr-pages)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/egg-ssr-pages.svg)](https://www.npmjs.org/package/egg-ssr-pages)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/egg-ssr-pages.svg)](https://david-dm.org/kaelzhang/egg-ssr-pages)
-->

# egg-ssr-pages

Create [roe](https://github.com/kaelzhang/roe)/[egg](https://npmjs.org/package/egg) route definitions to host server-side rendered pages by using [next](https://npmjs.org/package/next)
or others.

By using `next`(the default renderer) as the renderer, your roe/egg application should has a `next` property on the instance.

## Install

```sh
$ npm i egg-ssr-pages
```

## Usage

app/router.js

```js
const ssrPages = require('egg-ssr-pages')
const pages = {
    // Then if we can access the pages/index.js by
    //   visiting the page http://localhost:8888/en-US
    '/:lang': 'index'
}

const config = {
  cache: {
    maxAge: 0
  },
  guard: ssrPages.memoryGuardian({
    max: 100
  }),

  // By default, it renders pages by using next
  // renderer: 'next'
}

module.exports = ssrPages(pages, config)
```

- **guard** guardian is used to validate the each result of server-side rendered pages, and fetch staled value from cache when the server fails to render the page to improves availability.

- **cache** to specify `max-age` of the cache-controll header.

### Override default `SSRConfig` for a certain pagePath

```js
module.exports = ssrPages({
  '/:lang': 'index',

  // We can override a certain property of `SSRConfig` by
  //   defining a new value in each `PageDef`
  '/about': {
    entry: 'about',
    cache: {
      // http://localhost:8888/about
      // -> max-age: 1h
      maxAge: 60 * 60 * 1000
    }
  }
}, {
  cache: {
    maxAge: 0
  }
})
```

### Custom middleware for a certain entry

```js
module.exports = ssrPages({
  '/:lang': {
    entry: 'index',
    middleware: [myCustomMiddleware]
  }
})
```

Or

```js
module.exports = ssrPages({
  '/:lang': [
    myCustomMiddleware,  // <- koa middleware
    // <- We can define more koa middlewares here
    'index'   // <- entry
  ]
})
```

### Different entries for desktop and mobile devices

```js
const diverge = (desktopEntry, mobileEntry) => ctx =>
  isMobileUserAgent(ctx.headers['user-agent'])
    ? mobileEntry
    : desktopEntry

module.exports = ssrPages({
  '/': diverge('index', 'mobile-index')
})
```

## ssrPages(pages, config: SSRConfig)

- **pages** `{[path: string]: PageDef}` pages
- **config** `SSRConfig` the default ssr configurations

Returns a roe/egg router function which accepts `app` as the only one parameter.

```ts
type EntryGetter = function (ctx): string

type PageDef =
  // Just an entry
  string
  | EntryGetter
  // An entry and koa middleware functions for the entry
  | [...Array<Function>, string]
  | ObjectPageDef
```


```ts
// So that we can override the default ssr configurations
interface ObjectPageDef extends OptionalSSRConfig {
  entry: string | EntryGetter
}
```

```ts
interface OptionalSSRConfig {
  // Disable CDN cache by setting to `false`,
  // Defaults to `false`
  cache?: CachePolicy | false
  // Set the `guard` to `false` to disable server-side guardians.
  // - GuardPolicy: your custom policy
  // - `false`(the default value): turn off the guardians
  guard?: GuardPolicy | false,

  // New in 1.1.0
  // Set one or more middlewares for all entries or for a certain entry.
  middleware?: Function | Array<Function>
}

// Preflight checker is used to make sure
//  if the prerequisites are installed or configured,
//  such as egg plugins and extentions
type PreflightChecker = (app): Object | undefined throws Error

interface SSRenderer {
  precheck: PreflightChecker
  async render (ctx, pagePath): string throws Error
}

interface SSRConfig extends OptionalSSRConfig {
  // Method to render the page
  // - SSRenderer: your custom renderer
  // - string: the name of built-in renderers: 'next'
  // Defaults to `'next'`
  renderer: SSRenderer | string = 'next'
}
```

```ts
interface CachePolicy {
  // max-age of cache-control in milliseconeds
  maxAge: number
}
```

```ts
interface GuardPolicy {
  // Preflight checking to see
  //   if the `app` (roe/egg instance) meets certain requirements.
  //   if not, an error could be thrown inside this function.
  // If the function returns an object,
  //   then the object will be used to extend the koa context object,
  //   so that we can access them from all methods below.
  precheck? (app): Object | undefined throws Error

  // Generates the cache key
  key (ctx): string

  // If this function is rejected or returns `false`
  // then it will goes into `fallback`
  async validateSSRResult? (ctx, key, html, time): boolean throws Error

  // If `render` method has been invoked and validated successfully,
  //    `onSuccess` will be called and skip all the following.
  // Most usually, all logic inside `onSuccess` should be catched,
  //   or if there is an error or rejection,
  //   it will goes to `fallback`
  async onSuccess? (ctx, key, html): void

  // If `fallback` succeeded to return a string,
  //   the string will be used instead of the return value of `render`
  async fallback (ctx, key, html, error): string throws Error
```

- **ctx** `KoaContext` the koa context, if `precheck` returns an object, then it will be the extended koa context which has the return value as its own properties
- **key** `string` the key generated by `GuardPolicy::key`
- **html** `string | undefined` the html content which rendered by `SSRConfig::render`
- **time** `number` the milliseconds how much the renderer takes to render the page
- **error** `Error | null`

### Built-in guardian `ssrPages.memoryGuardian(options)`

- **options** `Object` the options of [`lru-cache`](https://npmjs.org/package/lru-cache)

The built-in guardian to cache successfully rendered result in an LRU cache instance with `${hostname}/${pathname}` as the key, and try to return the cached value if the request fails to render in the future.

## License

MIT
