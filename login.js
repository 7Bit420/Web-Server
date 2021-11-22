const uuid = require("uuid");
const fs = require("fs");

function login(req, res, {
    uploadSessions,
    loginSessinons
}) {
    req.url = decodeURI(req.url)

    if (
        typeof req.headers.token == "undefined"
    ) {
        res.write('no token')
        return res.end()
    }

    const userdb = JSON.parse(fs.readFileSync('./users/index.json'))

    var encToken = req.headers.token.split('.')
    const token = {
        header: '',
        body: ''
    },
        cookies = new Map();
    try {
        token.body = JSON.parse(Buffer.from(encToken[1], 'base64').toString('ascii') || '{}')
        token.header = JSON.parse(Buffer.from(encToken[0], 'base64').toString('ascii'))
    } catch (error) {
        res.write(error.message)
        return res.end()
    }

    if (typeof req.headers["cookie"] == "string") {
        req.headers["cookie"].split(';').forEach(element => {
            var cookie = element.split('=')
            cookies.set(decodeURIComponent(cookie[0]),decodeURIComponent(cookie[1]))
        });
    }

    var user = userdb.find(user => (user.username == token.body.username && user.password == token.body.password))
        || userdb.find(user => user.id == token.header.id)

    if (token.body.logout&&cookies.get('sessionId')) {
        return loginSessinons.delete(cookies.get('sessionId'))
    }

    if (user) {
        if (loginSessinons.has(user.id)) {
            res.write('<h1>409 Conflict</h1><br>Client Already Logged In')
            res.writeHead(409)
            res.end()
        } else {

            var sessionId = uuid.v4(),
                expires = new Date()
            expires.setTime(Date.now() + 21600000)

            loginSessinons.set(sessionId, { 
                sessionId: sessionId, 
                expires: expires.getTime(), 
                user: user.id })

            res.writeHead(200, 'OK', {
                'Set-Cookie': `sessionId=${sessionId}; Expires=${expires.toUTCString()}; Path=/`,
                id: sessionId
            })

            res.end()
        }
    } else {
        res.write('incorrect details')
        res.end()
    }
}

exports.login = login