const fs = require('fs')
const URL = require('url')
const http = require('http')
const path = require('path')

const rootPath = path.parse(__dirname).dir

const config = require(rootPath + '/settings.json')

function general(req = new http.IncomingMessage(), res = new http.ServerResponse(), {
    uploadSessions, loginSessinons
}) {
    req.url = decodeURI(req.url)

    const requrl = req.url.substr(1),
        protacals = require(rootPath + '/protacls.json')

    if (config.blacklist.includes(req.socket.remoteAddress)) {
        return res.end()
    }

    if (
        fs.existsSync(`${rootPath}/pages/${requrl}`) &&
        fs.lstatSync(`${rootPath}/pages/${requrl}`).isFile()
    ) {
        res.writeHead(200, '', { 
            'Content-Type': protacals.find(t=>requrl.endsWith(t.ext))?.mime || 'text/plain' 
        })
        res.write(
            fs.readFileSync(`${rootPath}/pages/${requrl}`)
        )
        res.end()
    } else if (
        fs.existsSync(`${rootPath}/pages/${requrl}.html`) &&
        fs.lstatSync(`${rootPath}/pages/${requrl}.html`).isFile()
    ) {
        res.writeHead(200, '', { 'Content-Type': 'text/html' })
        res.write(
            fs.readFileSync(`${rootPath}/pages/${requrl}.html`)
        )
        res.end()
    } else {
        var redirect = config.redirects.find(r => r.path == req.url)
        if (redirect) {
            res.writeHead(301, { 'location': redirect.location })
            res.end()
        } else {
            res.writeHead(301, { 'location': '/404' })
            res.end()
        }
    }

}
exports.general = general

