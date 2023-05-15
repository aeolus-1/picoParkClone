var keys = {},preKeys = {}
document.addEventListener("keydown",(e)=>{keys[e.key.toLowerCase()]=true})
document.addEventListener("keyup",(e)=>{keys[e.key.toLowerCase()]=false})

function updateControls() {
    

    preKeys = {...keys}
}