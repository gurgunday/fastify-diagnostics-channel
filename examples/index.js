const fastify = require('fastify')({ logger: true, connectionTimeout: 2000 })
const dc = require('diagnostics_channel')

const channels = [
  dc.channel('http.fastify.onRoute'),
  dc.channel('http.fastify.onTimeout'),
  dc.channel('http.fastify.onError'),
  dc.channel('http.fastify.onResponse')
]

channels.forEach(channel => {
  channel.subscribe((message, name) => {
    console.info('Triggered:', name, message)
  })
})

fastify.register(require('../lib/index'))

fastify.get('/', (_request, reply) => {
  reply.send({})
})

fastify.get('/error', (_request, _reply) => {
  throw new Error('error example')
})

fastify.get('/timeout', async (_request, _reply) => {
  await new Promise((resolve) => setTimeout(resolve, 5000))
})

fastify.listen(3000, '0.0.0.0', (err) => {
  if (err) throw err
})
