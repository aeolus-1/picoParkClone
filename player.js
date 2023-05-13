class Player {
    constructor(options) {
        options = {
            color:"#f00",
            controls:["N","N","N","N"],
            ...options,
        }
        this.color = options.color
        this.controls = options.controls

        let debug = 0

        this.direction = 1

        this.body = addBody(v(200,0),v(40,46),{isStatic:false,render:{visible:debug}})
        this.body.player = this

        this.frame = "idle"
        this.preFalling = false
        this.groundDetector = Matter.Bodies.circle(this.body.position.x,this.body.position.y+(spriteSize.x*0.5), spriteSize.x*0.25,{
            collisionFilter:{
                group:-1,
                catagory:2,
                mask:0,
            },
            noGravity:true,
            render:{visible:debug}
        })
        Matter.Body.scale(this.groundDetector, 1.75,0.5)
        Matter.Composite.add(engine.world, this.groundDetector)
    }
    testFalling() {
        

        var falling = !this.onGround()
        if (falling) {
            this.frame = "jumping"
        } else if (this.preFalling) {
            this.frame = "idle"
        }

        this.preFalling = falling
    }

    onGround() {
        
        return Matter.Query.collides(this.groundDetector, Matter.Composite.allBodies(engine.world).filter((a)=>{return a.id!=this.body.id&&a.id!=this.groundDetector.id})).length>0
    }

    moveHor(dir) {
        Matter.Body.setPosition(this.body, v(this.body.position.x+(dir*3),this.body.position.y))
        this.direction = Math.sign(dir)
        this.updatePlayerParts()
    }
    jump() {
        Matter.Body.setVelocity(this.body, v(this.body.velocity.x,-13))
        this.updatePlayerParts()
    }

    updatePlayerParts() {
        Matter.Body.setPosition(this.groundDetector, v(this.body.position.x,this.body.position.y+(spriteSize.y*0.5)))
        Matter.Body.setVelocity(this.body, v(0,this.body.velocity.y))

    }
}

var players = []
function addPlayer(options) {
    var newPlayer = new Player(options)
    players.push(newPlayer)
    return newPlayer
}

