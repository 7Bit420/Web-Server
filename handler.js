const process = require('process'),
    http = require('http'),
    uploadSessions = new Map(),
    loginSessinons = new Map(),
    settings = require('./settings.json')

process.on('message', (message) => {

})

const server = http.createServer(mypage)

server.listen(
    settings.port,
    settings.domain
)

function mypage(req, res) {
    var method = decodeURI(req.url).split('/')[1]
    req.url = decodeURI(req.url)
    switch (method) {
        case "login":
            if (req.method == "GET") {
                require('./genral').general(req, res, {
                    uploadSessions: uploadSessions,
                    loginSessinons: loginSessinons
                })
            } else {
                require('./login').login(req, res, {
                    uploadSessions: uploadSessions,
                    loginSessinons: loginSessinons
                })
            }
            break;
        case "user":
            require('./user').user(req, res, {
                uploadSessions: uploadSessions,
                loginSessinons: loginSessinons
            })
            break;
        default:
            require('./genral').general(req, res, {
                uploadSessions: uploadSessions,
                loginSessinons: loginSessinons
            })
            break;
    }
}

exports.mypage = mypage