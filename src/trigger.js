class TriggerHandler {
    constructor(game) {
        this.game = game
        
    }
    addTrigger(pos,size,options) {
        var boxTrigger = Matter.Bodies.rectangle(pos.x,pos.y,size.x,size.y),
            trig = new Trigger(this.game, boxTrigger, options)
        this.game.triggers.push(trig)
        return trig
    }
    updateTriggers() {
        for (let i = 0; i < this.game.triggers.length; i++) {
            const trigger = this.game.triggers[i];
            this.testTrigger(trigger)
        }
    }
    testTrigger(d) {
        let coll = d.testCollision()
        
        if (coll.length>0) {
            var playerBody = (coll[0].bodyB.player||coll[0].bodyB.isBlock)?coll[0].bodyB:coll[0].bodyA
            d.onIn(playerBody)
            d.playerInside = true
        } else {
            d.playerInside = false
        }

        if (d.playerInside && !d.prePlayerInside) {
            d.onEnter()
        }
        if (!d.playerInside && d.prePlayerInside) {
            d.onLeave()
        }

        d.prePlayerInside = d.playerInside

        //console.log(d)
    }
}
class Trigger {
    constructor(game, rect, options) {
        this.game = game
        options = {
            onEnter:()=>{},
            onLeave:()=>{},
            onIn:()=>{},
            ...options,
            
        }
        this.rect = rect
        this.onEnter = options.onEnter
        this.onLeave = options.onLeave
        this.onIn = options.onIn

        this.playerInside = false
        this.prePlayerInside = false
    }
    testCollision() {
        //console.log(Matter.Composite.allBodies(this.game.playerhandler.playerComp), this.rect)
        return Matter.Query.collides(this.rect, [...Matter.Composite.allBodies(this.game.playerhandler.playerComp).filter(a=>{return !a.player.dead}),...Matter.Composite.allBodies(this.game.blockHandler.comp)])
    }
}