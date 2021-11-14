const process = require('process'),
    http = require('http'),
    uploadSessions = new Map(),
    loginSessinons = new Map(),
    settings = require('./settings.json')

process.on('message',(message)=>{

})

const server = http.createServer(mypage)

server.listen(
    settings.port,
    settings.domain
)

server.on('connect',(req,res)=>{
    var method = decodeURI(req.url).split('/')[1]
    switch (method) {
        case "login":
            require('./login').login(req, res, {
                uploadSessions: uploadSessions,
                loginSessinons: loginSessinons
            })
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
})

function mypage(req, res) {
    var method = decodeURI(req.url).split('/')[1]
    switch (method) {
        case "login":
            require('./login').login(req, res, {
                uploadSessions: uploadSessions,
                loginSessinons: loginSessinons
            })
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