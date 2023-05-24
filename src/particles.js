class ParticleHandler {
    constructor(game, options) {
        this.game = game

        this.comp = Matter.Composite.create()
        Matter.Composite.add(this.game.matter.engine.world, this.comp)
        this.particles = []
        
    }
    spawnParticle(pos, options) {
        let newPart = new Particle(this,pos,options)
        this.particles.push(newPart)
        return newPart
    }
    explodeParticles(pos, options) {
        options = {
            force:10,
            num:20,
        }

        for (let i = 0; i < options.num; i++) {
            this.spawnParticle(pos, {
                vel:v(
                    Math.cos((i/options.num)*Math.PI*2)*options.force,
                    Math.sin((i/options.num)*Math.PI*2)*options.force,
                    ),
                image:{
                    img:levelAtlas,
                    pos:v(115,514),
                    size:v(159,215)
                }
            })            
        }
    }
    
}
class Particle {
    constructor(handler, pos, options) {
        this.handler = handler
        options = {
            vel:v(),
            image:{
                at:levelAtlas,
                pos:v(),
                size:v(),
            },

            ...options,
        }
        this.image = options.image
        
        let randSize = v(randInt(100,800),randInt(100,800))
        let maxX = this.image.size.x-randSize.x,
            maxY = this.image.size.y-randSize.y

        let targetPos = v(
            randInt(0, maxX),
            randInt(0, maxY)
        )

        this.image.pos = targetPos
        this.image.size = randSize

        console.log(this.image)

        this.options = options

        let size = 5
        this.body = Matter.Bodies.rectangle(pos.x,pos.y,size,size,{

        })

        Matter.Body.setVelocity(this.body,options.vel)

        Matter.Composite.add(this.handler.comp, this.body)
    }
}