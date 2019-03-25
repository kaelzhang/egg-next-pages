const ssr = require('./ssr')
const memoryGuardian = require('./guard/memory')

module.exports = ssr
module.exports.memoryGuardian = memoryGuardian
