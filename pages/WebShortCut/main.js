var req = new XMLHttpRequest()
let actions = []
req.open("GET", "./actions.json")
req.addEventListener('load', loadActions)
req.send()

async function loadActions() {
    actions = JSON.parse(req.responseText)
    document.getElementById('actions').replaceChildren()

    actions.forEach(async action => {

        var container = document.createElement('div')
        var title = document.createElement('h1')
        var description = document.createElement('p')

        var icon = document.createElement('img')


        container.classList.add("action")
        icon.classList.add("icon")


        icon.src = action.icon
        container.appendChild(icon)

        container.appendChild(title)
        container.appendChild(description)

        title.append(action.name)
        description.append(action.description)

        document.getElementById('actions').appendChild(container)

        if (self == top) {
            container.addEventListener('click', () => {
                switch (action.type) {
                    case "script":
                        var script = document.createElement('script')
                        script.src = action.url
                        document.head.appendChild(script)
                        break;
                    case "redirect":
                        window.location.replace(action.url)
                        break;
                }
            })
        } else {
            container.addEventListener('click', () => {
                window.parent.postMessage({
                    body: action,
                    action: "runAction"
                }, "*")
            })
        }
    });
}

