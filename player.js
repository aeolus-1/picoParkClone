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
        var c = player.controls,
            keys = player.keys

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
            controls:["arrowleft","arrowright","arrowup","arrowdown"],
            bodyOptions:{},
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

        this.body = this.game.matter.addBody(v(200,-(Math.random()*200)),v(40,46),{
            ...options.bodyOptions,
            inertia:Infinity,
            
            isStatic:false,render:{visible:debug}})
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
        this.groundDetector.player = this
        Matter.Body.scale(this.groundDetector, 1.45,0.5)
        
    }
    updateKeys(keys) {
        this.keys = {...keys}
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
        let speed = 3.5,
            diff = 1
        Matter.Body.setPosition(this.body, v(this.body.position.x+(dir*speed),this.body.position.y))
        if (this.testPlayerCollision()) {
            diff = 0
            Matter.Body.setPosition(this.body, v(this.body.position.x-(dir*speed),this.body.position.y))
        }
        var playersOnTop = this.findPlayerGroundDectors()
        for (let i = 0; i < playersOnTop.length; i++) {
            var bodyIs = (playersOnTop[i].bodyA.label!="Rectangle Body")?"bodyA":"bodyB"
            var player = playersOnTop[i][bodyIs].player;
            //player.frame = "walking"
            player.moveHor(dir)
            //player.moveHor(dir*diff)
        }
        
        //Matter.Body.setVelocity(this.body, v((dir*speed)+this.body.velocity.x,this.body.velocity.y))
        this.direction = Math.sign(dir)
        this.updatePlayerParts()
    }
    findPlayerGroundDectors() {
        var players = this.game.players,
            dectors = []
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (player.body.id!=this.body.id) dectors.push(player.groundDetector)
        }

        return Matter.Query.collides(this.body, dectors)
    }
    testPlayerCollision() {
        Matter.Body.scale(this.body, 1,0.5)
        var ret = Matter.Query.collides(this.body, Matter.Composite.allBodies(this.game.matter.engine.world).filter((a)=>{return a.id!=this.body.id&&a.isStatic}))
        Matter.Body.scale(this.body, 1,2)
        return ret.length>0
    }
    jump() {
        Matter.Body.setVelocity(this.body, v(this.body.velocity.x,-13))
        //this.updatePlayerParts()
    }

    updatePlayerParts() {
        Matter.Body.setAngle(this.body, 0)
        Matter.Body.setAngularVelocity(this.body, 0)
        Matter.Common.set(this.body, "anglePrev", 0)
        Matter.Common.set(this.body, "angularSpeed", 0)
        
        Matter.Body.setPosition(this.groundDetector, v(this.body.position.x,this.body.position.y+(spriteSize.y*0.5)))
        Matter.Body.setVelocity(this.body, v(this.body.velocity.x*0,this.body.velocity.y))

        
        
    }

  
}



