const fs = require('fs')
const http = require('http')
const uuid = require('uuid')
const protcals = require('../protacls.json')
const userTemp = require('./users/usertemp.json')

exports.user = function user(req = new http.IncomingMessage(), res = new http.ServerResponse(), {
    uploadSessions,
    loginSessinons
}) {
    req.url = decodeURI(req.url)

    const userdb = JSON.parse(fs.readFileSync('./users/index.json'))
    const cookies = new Map()
    var userSession;

    if (!req.url.endsWith('create')) {
        if (req.headers["cookie"]) {
            req.headers["cookie"].split(';').forEach(element => {
                const cookie = element.split('=')
                cookies.set(cookie[0], cookie[1])
            });
        }

        if (!(cookies.get('sessionId') && loginSessinons.get(cookies.get('sessionId')))) {
            return res.end()
        }

        userSession = loginSessinons.get(cookies.get('sessionId'))
    }
    const path = decodeURI(req.url).split('/')
    path.splice(0, 2)

    switch (path[0]) {
        case 'create':
            if (req.method !== "POST") {
                return res.end()
            }

            req.on('data', (data) => {
                const form = new Map();

                data.toString('ascii').split('&').forEach(data => {
                    var data = data.split('=');
                    form.set(decodeURIComponent(data[0]), decodeURIComponent(data[1]))
                })

                var tokens = JSON.parse(fs.readFileSync('./users/tokens.json'))

                if (
                    (
                        (
                            typeof form.get('username') ||
                            typeof form.get('password') ||
                            typeof form.get('email') ||
                            typeof form.get('auth')
                        )
                        !== "string"
                    ) ||
                    !tokens.includes(form.get('auth'))
                ) {
                    return res.end()
                }

                tokens.forEach((val, x) => {
                    if (val == form.get("auth")) {
                        tokens.splice(x, 1)
                    }
                })

                fs.writeFileSync('./users/tokens.json', JSON.stringify(tokens))

                const id = uuid.v4()

                fs.mkdirSync(`./users/${id}`)
                fs.mkdirSync(`./users/${id}/files`)
                fs.mkdirSync(`./users/${id}/user`)

                fs.writeFileSync(`./users/${id}/bg.png`,'')
                fs.writeFileSync(`./users/${id}/user.json`, JSON.stringify({
                    "username": form.get('username'),
                    "password": form.get('password'),
                    "email": form.get('email'),
                    "permitions": [],
                    "id": id
                }))

                const userdb = JSON.parse(fs.readFileSync('./users/index.json'))

                userdb.push({
                    "username": form.get('username'),
                    "password": form.get('password'),
                    "id": id
                })

                fs.writeFileSync('./users/index.json', JSON.stringify(userdb))

                res.writeHead(301,{ 'Location': '/login' })
                return res.end()
            })
            break;
        case 'get':
            path.splice(0, 1)
            if (fs.existsSync(`./users/${userSession.user}/user/${path.join('/')}`)) {
                res.write(fs.readFileSync(`./users/${userSession.user}/user/${path.join('/')}`))
            }
            res.end()
            break;
        case 'fs':
            path.splice(0, 1)
            switch (req.method) {
                case 'PUT':
                    var fpath = `./users/${userSession.user}/files/${path.join('/')}`
                    if (
                        req.headers['dir'] == "true" &&
                        !fs.existsSync(fpath) &&
                        fs.existsSync(`./users/${userSession.user}/files/${path.splice(0, path.length - 1).join('/')}`)
                    ) {
                        fs.mkdirSync(fpath)
                        res.writeHead(201)
                        res.end()
                    } else if (
                        fs.existsSync(`./users/${userSession.user}/files/${path.splice(0, path.length - 1).join('/')}`)
                    ) {
                        if (fs.existsSync(fpath)) {
                            fs.writeFileSync(fpath, '')
                        }
                        req.on('data', (data) => {
                            fs.appendFileSync(fpath, data)
                        })
                        req.on('end', () => {
                            res.writeHead(201)
                            res.end()
                        })
                    } else {
                        res.end()
                    }
                    break;
                case 'DELETE':
                    var filePath = `./users/${userSession.user}/files/${path.join('/')}`
                    if (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory()) {
                        fs.unlinkSync(filePath)
                        fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()
                        res.writeHead(200)
                    } else if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
                        fs.rmSync(filePath, { recursive: true, force: true })
                        fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()
                    } else {
                        fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()
                    }
                    res.end()
                    break;
                case 'GET':
                    var filePath = `./users/${userSession.user}/files/${path.join('/')}`
                    if (fs.existsSync(filePath)) {
                        if (fs.lstatSync(filePath).isDirectory()) {
                            res.writeHead(200, {
                                'isDirectoty': true,
                                'Content-Type': 'text/plain'
                            })
                            var childFiles = []
                            fs.readdirSync(filePath).forEach((file, x) => {
                                childFiles[x] = {
                                    'fn': file,
                                    'ft': protcals.find(p => file.endsWith(p.extension)).protacal || ''
                                }
                                if (fs.lstatSync(filePath + '/' + file).isDirectory()) {
                                    childFiles[x].ft = 'directory'
                                }
                            })
                            res.write(JSON.stringify({
                                "childFiles": childFiles
                            }))
                        } else if (fs.existsSync) {
                            res.writeHead(200, {
                                'isDirectoty': false,
                                'Content-Type': (
                                    protcals.find(protcal => path.join('/').endsWith(protcal.extension))
                                    || { extension: 'text/plain' }
                                ).extension
                            })
                            res.write(fs.readFileSync(filePath))
                        }
                    }
                    res.end()
                    break;
                default:
                    res.end()
                    break;
            }
            break;
        case 'set':
            path.splice(0,1)
            if (req.method != 'POST') return res.end()
            if (
                req.headers["type"]=="file" &&
                fs.existsSync(`./users/${userSession.user}/user/${path.join('/')}`)
                ) {
                fs.writeFileSync(`./users/${userSession.user}/user/${path.join('/')}`,'')
                req.on('data',(data)=>{
                    fs.appendFileSync(`./users/${userSession.user}/user/${path.join('/')}`,data)
                })
            } else if (req.headers["type"]=="string") {
                req.on('data', (d) => {
                    var data = JSON.parse(d), user = userdb.find(user => user.id = userSession.user)
                    Object.getOwnPropertyNames(data).forEach((v) => {
                        if (typeof data[v] == userTemp[v]) {
                            user[v] = data[v]
                        }
                    })
                    fs.writeFileSync(`./users/${userSession.user}/user.json`, JSON.stringify(user))
                })
            }
            req.on('end', () => {
                res.end()
            })
            break;
        default:
            res.write(fs.readFileSync(`./users/${userSession.user}/user.json`))
            res.end()
            break;
    }
}
