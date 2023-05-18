class Door {
    constructor(pos,options) {
        options = {

            
            ...options,


        }
        this.pos = pos
        
        this.open = false
        this.prepped = options.players

        
        this.onIn = (e)=>{
            let rect = this.trigger.rect.bounds,
                playerBody = e.bounds
            if (this.open) {
                if (
                    rect.min.x<playerBody.min.x && rect.max.x>playerBody.max.x &&
                    rect.min.y<playerBody.min.y && (rect.max.y+5)>playerBody.max.y 
                ) {
                    e.player.readyUp()
                }
            }
        }
        


    }
    
}