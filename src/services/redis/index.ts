import {createClient, BasicClientSideCache} from 'redis'

const cache = new BasicClientSideCache({
    ttl: 0,
    maxEntries: 0,
    evictPolicy: 'LRU'
})

const client = createClient({url: process.env.REDIS_URL, RESP: 3,
    clientSideCache: cache
})
client.on('error', err => console.log('Redis client error', err))
await client.connect()

export default client