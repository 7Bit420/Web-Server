const process = require('process'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    crypto = require('crypto'),
    uploadSessions = new Map(),
    loginSessinons = new Map(),
    settings = require(__dirname + '/settings.json')

process.stdin.on('data', (message) => {
    process.exit()
})

const server = http.createServer(mypage)

server.listen(
    settings.port
)

const httpsServer = https.createServer({
    key: fs.readFileSync(__dirname + '/config/certs/CODEX CA.pem'),
    cert: fs.readFileSync(__dirname + '/config/certs/CODEX CA.pem'),
}, mypage)

httpsServer.listen(
    443
)

function mypage(req, res) {
    var method = decodeURI(req.url).split('/')[1]
    req.url = decodeURI(req.url)
    switch (method) {
        case "login":
            if (req.method == "GET") {
                require(__dirname + '/handlers/genral').general(req, res, {
                    uploadSessions: uploadSessions,
                    loginSessinons: loginSessinons
                })
            } else {
                require(__dirname + '/handlers/login').login(req, res, {
                    uploadSessions: uploadSessions,
                    loginSessinons: loginSessinons
                })
            }
            break;
        case "user":
            require(__dirname + '/handlers/user').user(req, res, {
                uploadSessions: uploadSessions,
                loginSessinons: loginSessinons
            })
            break;
        default:
            require(__dirname + '/handlers/genral').general(req, res, {
                uploadSessions: uploadSessions,
                loginSessinons: loginSessinons
            })
            break;
    }
}

exports.mypage = mypage