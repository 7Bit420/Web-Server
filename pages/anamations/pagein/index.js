
var target = document.getElementById('target')
document.getElementById('button').addEventListener('click',playanamtion)

function playanamtion() {
    target.style.width = '100%'
    setTimeout(()=>{
        target.style.width = '0%'
    },3000)
}