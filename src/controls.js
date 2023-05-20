var keys = {},preKeys = {}
document.addEventListener("keydown",(e)=>{
    if(e.code=="F1")mainGame.renderer.debug = !mainGame.renderer.debug
    keys[e.key.toLowerCase()]=true})
document.addEventListener("keyup",(e)=>{keys[e.key.toLowerCase()]=false})

function updateControls() {
    

    preKeys = {...keys}
}