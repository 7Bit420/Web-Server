const fs = require('fs'),
    URL = require('url'),
    http = require('http');

const redirects = require('./settings.json').redirects

function general(req = new http.IncomingMessage(), res = new http.ServerResponse(), {
    uploadSessions, loginSessinons
}) {
    req.url = decodeURI(req.url)

    const requrl = req.url.substr(1),
        protacals = require('../protacls.json')

    if (
        requrl.startsWith('resource') &&
        fs.existsSync(`./${requrl}`) &&
        fs.lstatSync(`./${requrl}`).isFile()
    ) {
        res.writeHead(200, {
            'Content-Type': protacals.find(p => requrl.endsWith(p.extension)).protacal
        })
        res.write(
            fs.readFileSync(`./${requrl}`)
        )
        return res.end()
    }

    if (
        fs.existsSync(`./pages/${requrl}`) &&
        fs.lstatSync(`./pages/${requrl}`).isDirectory() &&
        fs.existsSync(`./pages/${requrl}/index.html`)
    ) {
        res.writeHead(200, '', { 'Content-Type': 'text/html' })
        res.write(
            fs.readFileSync(`./pages/${requrl}/index.html`)
        )
        res.end()
    } else if (
        req.headers.referer &&
        fs.existsSync(`./pages${new URL.URL(req.headers.referer).pathname}`) &&
        fs.lstatSync(`./pages${new URL.URL(req.headers.referer).pathname}`).isDirectory() &&
        fs.existsSync(`./pages${new URL.URL(req.headers.referer).pathname}/${requrl}`)
    ) {
        const url = new URL.URL(req.headers.referer)
        if (
            !fs.existsSync(`./pages${url.pathname}/${requrl}`)
        ) return res.end()
        res.writeHead(200,
            { 'Content-type': protacals.find(protcal => requrl.endsWith(protcal.extension)).protacal }
        )
        res.write(
            fs.readFileSync(`./pages${url.pathname}/${requrl}`)
        )
        res.end()
    } else {
        var redirect = redirects.find(r => r.path == req.url)
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

