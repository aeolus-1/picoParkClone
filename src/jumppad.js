class JumppadHandler {
    constructor(game) {
        this.game = game
        this.comp = Matter.Composite.create()
        Matter.Composite.add(this.game.matter.engine.world, this.comp)
    }
    updateJumppads() {
        
        for (let i = 0; i < this.game.jumppads.length; i++) {
            const jp = this.game.jumppads[i];
            let height = (
                Math.sin((((new Date()).getTime()+jp.id)/50))*25
            )
            jp.setHeight(height)
        }
    }
}
class Jumppad {
    constructor(game, pos, options) {
        this.game = game
        
        options = {
            ...options,
        }
        this.pos = pos

        this.id = Math.random()*500


        this.heightDiff = 0
        this.makeJump

        this.rect = this.game.matter.addBody(v(pos.x*50,pos.y*50), v(50, 50), {}, this.game.jumppadHandler.comp)
        this.rect.isStatic = true
        this.rect.jumppad = true

        
    }

    setHeight(heightChange=this.heightDiff) {
        var height = this.rect.bounds.max.y-this.rect.bounds.min.y,
            targetHeight = 50+heightChange,
            scale = targetHeight/height,

            offset = (height*scale)-height




            Matter.Body.scale(this.rect, 1, scale)
        Matter.Body.translate(this.rect, v(0, -offset*0.5))
        this.heightDiff = offset
    }
}