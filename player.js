class PlayerHandler {
    constructor(game) {
        this.game = game

    }
    addPlayer(options) {
        var newPlayer = new Player(this.game, options)
        this.game.players.push(newPlayer)
        return newPlayer
    }
    updatePlayers() {
        var players = this.game.players
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            this.updatePlayerControls(player)
            this.updatePlayer(player)
            
        }
        updateControls()

    }
    updatePlayer(player) {
        player.updatePlayerParts()
        player.testFalling()
        
    }
    updatePlayerControls(player) {
        var c = player.controls

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
            player.frame = "walking"

        } else if (player.onGround()) {
            player.frame = "idle"
        } else {
            player.frame = "falling"
        }
        if (keys[c[2]]&&player.onGround()) player.jump()
        

    }

   
}

class Player {
    constructor(game, options) {
        this.game = game
        options = {
            color:"red",
            controls:["N","N","N","N"],
            ...options,
        }
        this.color = options.color
        this.colorTag = {
            "red":"#f00",
            "blue":"#00f",
            "blue":"#ff0",
        }[this.color]

        this.controls = options.controls
        this.keys = {}

        let debug = 0

        this.direction = 1

        this.body = this.game.matter.addBody(v(200,-(Math.random()*800)),v(40,46),{isStatic:false,render:{visible:debug}})
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
        
    }
    testFalling() {
        Matter.Body.setPosition(this.body, v(
            this.body.position.x,
            this.body.position.y%window.innerHeight,
            ))
            

        var falling = !this.onGround()
        if (falling) {
            this.frame = "falling"
        } else if (this.preFalling) {
            this.frame = "idle"
        }

        this.preFalling = falling
    }

    onGround() {
        
        return Matter.Query.collides(this.groundDetector, Matter.Composite.allBodies(this.game.matter.engine.world).filter((a)=>{return a.id!=this.body.id&&a.id!=this.groundDetector.id})).length>0
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



