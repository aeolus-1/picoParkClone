class Door {
    constructor(pos,options) {
        options = {

            
            ...options,


        }
        this.pos = pos

        this.nextLevel = options.nextLevel
        
        this.open = false
        this.prepped = options.players
        this.playerCount = options.playerCount

        
        this.onIn = (e)=>{
            let rect = this.trigger.rect.bounds,
                playerBody = e.bounds
            if (this.open) {
                if (
                    rect.min.x<playerBody.min.x && rect.max.x>playerBody.max.x &&
                    rect.min.y<playerBody.min.y && (rect.max.y+5)>playerBody.max.y 
                ) {
                    e.player.exitTimer -= e.player.game.deltaTime
                    if (e.player.exitTimer<=0) {
                        e.player.readyUp()
                        this.playerCount -= 1
                        if (this.playerCount <= 0) {
                            e.player.game.levelHandler.restartLevel()
                            e.player.game.levelHandler.loadLevel(levels[this.nextLevel])

                        }
                    }
                } else {
                    e.player.exitTimer = 60
                }
            }
        }
        


    }
    
}