import http from 'node:http'

export const getServer = (): http.Server =>
    http.createServer((req, res) => {
        if (req.method === 'GET' && req.url === '/hello') {
            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.end('hello world!')
            return
        }

        res.writeHead(404)
        res.end()
    })
