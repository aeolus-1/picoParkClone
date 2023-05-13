var keys = {},preKeys = {}
document.addEventListener("keydown",(e)=>{keys[e.key.toLowerCase()]=true})
document.addEventListener("keyup",(e)=>{keys[e.key.toLowerCase()]=false})

function updateControls() {
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        var c = player.controls
        //if (c!=undefined) continue
        var walking = false
        
        if (keys[c[0]]) {
            player.moveHor(-1)
            walking = true
            
        }
        if (keys[c[1]]) {
            player.moveHor(1)
            walking = true
        }
        if (walking) {
            player.frame = "walking"+Math.max(Math.min(Math.ceil(((new Date()).getTime()*0.005)%2),2),1)

        } else if (player.onGround()) {
            player.frame = "idle"
        } else {
            player.frame = "jumping"
        }
        if (keys[c[2]]&&player.onGround()) player.jump()
        

    }

    preKeys = {...keys}
}