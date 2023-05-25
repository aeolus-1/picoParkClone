var keys = {},preKeys = {}
document.addEventListener("keydown",(e)=>{
    if(e.code=="F1")mainGame.renderer.debug = !mainGame.renderer.debug
    keys[e.key.toLowerCase()]=true})
document.addEventListener("keyup",(e)=>{keys[e.key.toLowerCase()]=false})

function updateControls() {
    if (window.clientConnection) {
        let playerControls = mainGame.players[0].controls
        var fu = (n)=>{
            if (keys[playerControls[n]]&&!preKeys[playerControls[n]]) {
                clientConnection.updateKey(playerControls[n], true)
            }
            if (!keys[playerControls[n]]&&preKeys[playerControls[n]]) {
                clientConnection.updateKey(playerControls[n], false)
            }
        }

        fu(0)
        fu(1)
        fu(2)
        fu(3)
        
    }

    preKeys = {...keys}
}