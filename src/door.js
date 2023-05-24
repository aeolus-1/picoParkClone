class Door {
    constructor(pos,options) {
        options = {

            open:false,
            ...options,


        }
        this.options = options
        this.pos = pos

        this.nextLevel = options.nextLevel
        
        this.open = options.open
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
                    if (e.player.keys[e.player.controls[3]]) {
                        e.player.readyUp(this.trigger.rect.position)
                        this.playerCount -= 1
                        if (this.playerCount <= 0 && !window.clientConnection) {
                            e.player.game.renderer.levelTransistion(this.nextLevel)
                            if (window.hostConnection) {
                                this.playerCount = this.options.playerCount
                                hostConnection.broadcast(JSON.stringify({
                                    setLevel:this.nextLevel,
                                }))
                            }
    
                        }
                    }

                    
                }
                
            }

        }

    }
    
}