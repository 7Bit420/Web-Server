const https = require('https')
const fs = require('fs')

var output = [];

process.stdin.on('data', () => process.exit())

    ;[
        "application.csv",
        "audio.csv",
        "font.csv",
        "image.csv",
        "message.csv",
        "model.csv",
        "text.csv",
        "video.csv",
        // "example.csv", Not Officaly Added
    ].forEach(t => {
        var req = https.request({
            path: "/assignments/media-types/" + t,
            method: "GET",
            host: "www.iana.org",
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15'
            }
        })
            .on('response', (res) => {
                var buffer = ''

                res.on('data', (data) => {
                    buffer += data.toString()
                })

                res.on('end', () => {
                    var rows = buffer.split('\n')
                    var headers = rows.slice(0, 1)[0].trim().split(',')

                    console.log(req.path);

                    for (let row of rows) {
                        var s = row.trim().split(',')
                        var obj = {}
                        for (let i in s) {
                            obj[headers[i]] = s[i]
                        }
                        output.push(obj)
                    }
                })

                res.on('end', () => {
                    fs.writeFileSync('./protacls.json', JSON.stringify(
                        output.filter(t => {
                            for (const i in t) {
                                if (!t[i]) { return false } else return true
                            }
                        })
                    ))
                })

            }).end()
    })