const http = require('http')
const fs = require('fs')
const process = require('process')
const URL = require('url')
const path = '.'

const protacals = [
    { "extension": "png", "protacal": "image/png" },
    { "extension": "jpg", "protacal": "image/jpg" },
    { "extension": "svg", "protacal": "image/svg+xml" },
    { "extension": "js", "protacal": "text/javascript" },
    { "extension": "css", "protacal": "text/css" },
    { "extension": "html", "protacal": "text/html" },
    { "extension": "txt", "protacal": "text/plain" },
    { "extension": "php", "protacal": "text/php" },
    { "extension": "docx", "protacal": "text/docx" },
    { "extension": "mp3", "protacal": "audio/mp3" },
    { "extension": "flac", "protacal": "audio/flac" },
    { "extension": "json", "protacal": "application/json" },
    { "extension": "jpeg", "protacal": "image/jpeg" },
    { "extension": "txt", "protacal": "text/plain" },
    { "extension": "", "protacal": "text/plain" }
].map(e => e);
console.clear()
console.log('This server will create the required files to opperate.\nAre you sure you  wnat to continue? Respond with y to continue\n')

process.stdin.once('data', (d) => {
    var data = d.toString('ascii')
    if (data != "y\n") {
        process.exit()
    };

    console.clear()
    console.log('Started Server')

    ;[
        { type:"dir", path:"pages"},
        { type:"file", path:"Log.txt"},
        { type:"file", path:"Robots.txt"},
        { type:"file", path:"pages/home.html"},
        { type:"file", path:"pages/404.html"}
    ].forEach(f=>{
        if (!fs.existsSync(`${path}/${f.path}`)) {
            if (f.type=="dir") {
                fs.mkdirSync(`${path}/${f.path}`)
            } else {
                fs.writeFileSync(`${path}/${f.path}`,'')
            }
        }
    })

    const server = http.createServer({}, (req, res) => {
        const url = URL.parse(req.url);
        var pathname = url.pathname

        switch (req.method) {
            case 'HEAD':
                if (req.url = '/robots.txt') {
                    fs.appendFileSync(path+'/Log.txt', `\n${Date()} | ${res.socket.remoteAddress} | ROBOT`)
                }
                res.end()
                break;
            case 'GET':
                while (pathname.includes('%20')) { pathname = pathname.replace('%20', ' ') }
                if (pathname == '/') {
                    fs.appendFileSync(path+'/Log.txt', `\n${Date()} | ${res.socket.remoteAddress} | ${pathname} | GET`)
                    res.writeHead(404, { 'Content-Type': 'text/html' })
                    res.write(fs.readFileSync(path+'/pages/home.html'))
                    res.end()
                } else if (fs.existsSync(`./pages${pathname}.html`)) {
                    fs.appendFileSync(path+'/Log.txt', `\n${Date()} | ${res.socket.remoteAddress} | ${pathname} | GET`)
                    fs.readFile(`./pages${pathname + '.html'}`, (err, file) => {
                        if (err && err.code == 'ENOENT') {
                            res.writeHead(404, { 'Content-Type': 'text/html' })
                            res.write(fs.readFileSync(path+'/pages/404.html'))
                            res.end()
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' })
                            res.write(file)
                            res.end()
                        }
                    })
                } else if (fs.existsSync(`./pages${pathname}`) && pathname.endsWith('.html')) {
                    fs.appendFileSync(path+'/Log.txt', `\n${Date()} | ${res.socket.remoteAddress} | ${pathname} | GET`)
                    fs.readFile(`./pages${pathname}`, (err, file) => {
                        if (err && err.code == 'ENOENT') {
                            res.writeHead(404, { 'Content-Type': 'text/html' })
                            res.write(fs.readFileSync(path+'/pages/home.html'))
                            res.end()
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' })
                            res.write(file)
                            res.end()
                        }
                    })
                } else {
                    if (pathname.split('.')[1] == undefined) {
                        res.writeHead(404, { 'Content-Type': 'text/html' })
                        res.write(fs.readFileSync(path+'/pages/404.html'))
                        res.end()
                        return
                    }
                    fs.readFile(`.${pathname}`, (err, file) => {
                        if (err && err.code == 'ENOENT') {
                            res.writeHead(404, { 'Content-Type': 'text/html' })
                            res.write(fs.readFileSync(path+'/pages/404.html'))
                            res.end()
                        } else {
                            var protacal = pathname.split('.')[pathname.split('.').length - 1]
                            res.writeHead(200, { 'Content-Type': protacals.get(protacal) || 'text/plain' })
                            res.write(file)
                            res.end()
                        }
                    })
                }
                break;
            default:
                console.log(req);
                res.end()
                break;
        }
    })

    server.listen(80);

})