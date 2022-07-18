/**
if(window.trigger){window.trigger()}else{window.script=document.createElement('script');window.script.src="https://127.0.0.1:5500/popup.js";document.head.appendChild(window.script);}
*/

var elm = document.createElement('div')
var frame = document.createElement('iframe')

frame.style.width = '34vw'
frame.style.height = '34vh'
frame.style.left = '33vw'
frame.style.top = '33vh'
frame.style.position = 'fixed'

frame.src = "https://localhost/WebShortCut/index.html"

elm.style.width = '100vw'
elm.style.height = '100vh'
elm.style.left = '0px'
elm.style.top = '0px'
elm.style.position = 'fixed'
elm.style.background = 'rgb(0, 0, 0, 0.5)'

elm.style.display = 'none'

elm.appendChild(frame)
document.body.appendChild(elm)

function trigger() {
    elm.style.display = "block"

    window.addEventListener('message', (message) => {
        console.log(message)
        switch (message.data.action) {
            case "runAction":
                switch (message.data.body.type) {
                    case "script":
                        var script = document.createElement('script')
                        script.src = message.data.body.url
                        document.head.appendChild(script)
                        break;
                    case "redirect":
                        window.location.replace(message.data.body.url)
                        break;
                }
                break;
        }
    })
}

