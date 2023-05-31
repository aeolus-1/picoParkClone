class LaserHandler {
    constructor(game, options) {
        this.game = game
    }
    updateLasers() {
        for (let i = 0; i < this.game.lasers.length; i++) {
            const laser = this.game.lasers[i];
            laser.updateLaser()
        }
    }
}
class Laser {
    constructor(game, pos, angle, options) {
        this.game = game
        this.pos = pos
        this.angle = angle

        this.enabled = true

        this.axis = angle%2?"y":"x"
        this.axisX = this.axis=="x"?angle-3:0
        this.axisY = this.axis=="y"?angle-2:0
        this.axisB = this.axis=="y"
        this.bound = Math.floor(((angle-1)/2)%2)?"min":"max"
        this.bound = this.axisB?this.bound=="min"?"max":"min":this.bound


        let width = 25,
            height = 100000
        this.trigger = this.game.triggerHandler.addTrigger(
            v(
                this.pos.x+(height/2)*this.axisX,
                this.pos.y+(height/2)*-this.axisY
            ), 
            this.axisB?v(width, height):v(height,width))
        
        this.trigger.norender = true
        this.killTrigger = this.game.triggerHandler.addTrigger(v(this.pos.x,this.pos.y), v(width,width),{
            onIn:(e)=>{
                console.log("ya")
                if (e.player&&this.enabled&&!e.player.dead&&(!window.clientConnection)) {
                    e.player.kill()
                }
            }
        })
        console.log(this.killTrigger)

        this.length = 10
    }
    setKillLength(len) {
        let height = this.killTrigger.rect.bounds.max[this.axis]-this.killTrigger.rect.bounds.min[this.axis],
            setScale = len/height


        Matter.Body.scale(this.killTrigger.rect, this.axisB?1:setScale, (!this.axisB)?1:setScale)
        Matter.Body.translate(this.killTrigger.rect, v(
            (this.pos.x-(this.killTrigger.rect.bounds[this.bound][this.axis]))*(this.axisX?1:0),
            (this.pos.y-(this.killTrigger.rect.bounds[this.bound][this.axis]))*(this.axisY?1:0)
            ))
        
    }
    updateLaser() {
        
        this.setKillLength(this.cal().dst)
    }
    
    cal() {
        let ray = Matter.Query.collides(this.trigger.rect, Matter.Composite.allBodies(this.game.matter.engine.world)).filter(a=>{
            return !(a.bodyA.player||a.bodyB.player)
        }),
            minDst = Infinity
        for (let i = 0; i < ray.length; i++) {
            const body = ray[i];
            var mainBody = body.bodyA.id==this.trigger.rect.id?body.bodyB:body.bodyA,
                dst = Math.abs(this.pos[this.axis]-mainBody.bounds[this.bound][this.axis])

            minDst = Math.min(dst, minDst)
        }

        if (minDst==Infinity) minDst = 10000
        //console.log(minDst)
        //this.killTrigger.rect.scale(1, )
        return {
            start:this.pos,
            end:v(this.pos.x+(minDst*this.axisX),this.pos.y+(minDst*-this.axisY)),
            dst:minDst,
        }
    }
}