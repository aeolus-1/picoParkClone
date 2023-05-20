class PlayerHandler {
    constructor(game) {
        this.game = game
        this.playerComp = Matter.Composite.create()
        Matter.Composite.add(this.game.matter.engine.world, this.playerComp)

    }
    addPlayer(options) {
        var newPlayer = new Player(this.game, options)
        this.game.players.push(newPlayer)
        return newPlayer
    }
    updateControls() {
        var players = this.game.players,
            readyPlayers = this.game.players.length
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            this.updatePlayerControls(player)
            
            
        }
        updateControls()

    }
    updatePlayers() {
        var players = this.game.players,
            readyPlayers = this.game.players.length
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            this.updatePlayer(player)
            if (player.ready) {
                readyPlayers-=1
            }
            
        }
        

    }
    updatePlayer(player) {
        player.updatePlayerParts()
        player.testFalling()
        
    }
    updatePlayerControls(player) {
        var c = player.controls,
            keys = player.keys
        if (window.clientConnection) if(window.clientConnection.mainPlayer.body.id==player.body.id) return true

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

        this.exitTimer = 60
        
        this.constraintVel = v()

        this.direction = 1
        this.scale = 1
        console.log(this.game)

        this.body = this.game.matter.addBody(v(200,this.game.players.length*50),v(40,46),{
            ...options.bodyOptions,
            inertia:Infinity,
            
            isStatic:false,render:{visible:debug}}, this.game.playerhandler.playerComp)
        this.body.player = this
        this.onlinePlayer = false
        this.blockingDirection = 0

        this.ready = false

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
    readyUp() {
        this.ready = true
        Matter.Body.setPosition(this.body, v(-1000,-10000))
    }
    restart() {
        this.ready = false
        this.exitTimer = 60
        Matter.Body.setPosition(this.body, v(
            100,
            -this.game.renderer.offset.y-20,
            ))
            Matter.Body.setVelocity(this.body, v(
                0,0
                ))
            this.setScale(1)
    }
    updateKeys(keys) {
        this.keys = {...keys}
    }
    testFalling() {
        if (this.body.position.y>=window.innerHeight*3) Matter.Body.setPosition(this.body, v(
            100,
            -this.game.renderer.offset.y-20,
            ))
       
            

        var falling = !this.onGround()
        if (falling) {
            this.frame = (Math.sign(this.body.velocity.y)>0)?"falling":"leaping"
        } else if (this.preFalling) {
            this.frame = "idle"
        }

        this.preFalling = falling
    }

    onGround() {
        
        return Matter.Query.collides(this.groundDetector, Matter.Composite.allBodies(this.game.matter.engine.world).filter((a)=>{return a.id!=this.body.id&&a.id!=this.groundDetector.id})).length>0
    }

    moveHor(dir, multi=false) {
        var speed = 2.75*this.game.deltaTime
        Matter.Body.setPosition(this.body, v(this.body.position.x+(dir*speed),this.body.position.y))
        if (this.testPlayerCollision()) {
            
            Matter.Body.setPosition(this.body, v(this.body.position.x-(dir*speed),this.body.position.y))
        }
        if (dir!=this.blockingDirection) {
            var playersOnTop = this.findPlayerGroundDectors()
            for (let i = 0; i < playersOnTop.length; i++) {
                var bodyIs = (playersOnTop[i].bodyA.label!="Rectangle Body")?"bodyA":"bodyB"
                var player = playersOnTop[i][bodyIs].player;
                //player.frame = "walking"
                player.moveHor(dir, true)
                //player.moveHor(dir*diff)
            }
        }
        
        //Matter.Body.setVelocity(this.body, v((dir*speed)+this.body.velocity.x,this.body.velocity.y))
        if (!multi) this.direction = Math.sign(dir)
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
    testPlayerBlockCollision() {
        Matter.Body.scale(this.body, 1.25,0.5)

        var ret = Matter.Query.collides(this.body, Matter.Composite.allBodies(this.game.matter.engine.world).filter((a)=>{
            return (
                a.id!=this.body.id)
        }))
        Matter.Body.scale(this.body, 1/1.25,2)
        this.blockingDirection = 0
        if (true) ret.forEach(a=>{
            var altBlock = (a.bodyA.id==this.body.id)?a.bodyB:a.bodyA
            if (altBlock.block) {

                altBlock.block.pressing[this.body.id] = true
                this.blockingDirection = Math.sign(altBlock.position.x-this.body.position.x)
            } else {
                
            }
        })
    }
    testPlayerCollision() {
        Matter.Body.scale(this.body, 1,0.5)
        let onground = this.onGround()
        var ret = Matter.Query.collides(this.body, Matter.Composite.allBodies(this.game.matter.engine.world).filter((a)=>{
            return (
                a.id!=this.body.id&&
                ((a.isBlock)?!a.block.locked():true))
        }))
        Matter.Body.scale(this.body, 1,2)
        
        
        
        return ret.length>0
    }
    jump() {
        Matter.Body.setVelocity(this.body, v(this.body.velocity.x,-13))
        //this.updatePlayerParts()
    }

    updatePlayerParts() {
        this.testPlayerBlockCollision(true)
        Matter.Body.setAngle(this.body, 0)
        Matter.Body.setAngularVelocity(this.body, 0)
        Matter.Common.set(this.body, "anglePrev", 0)
        Matter.Common.set(this.body, "angularSpeed", 0)

        Matter.Common.set(this.body, "mass", 1)
        Matter.Body.setPosition(this.body, v(
            this.body.position.x+this.constraintVel.x,
            this.body.position.y,
        ))
        this.constraintVel.x *= Math.pow(0.98, this.game.deltaTime)

        
        Matter.Body.setPosition(this.groundDetector, v(this.body.position.x,this.body.position.y+(spriteSize.y*0.5*this.scale)))
        Matter.Body.setVelocity(this.body, v(this.body.velocity.x*0,this.body.velocity.y))

        this.lastXPosition = this.body.position.x
        
    }
    setScale(targetScale) {
        var scaleFactor = targetScale/this.scale
        Matter.Body.scale(this.body, scaleFactor,scaleFactor)
        Matter.Body.scale(this.groundDetector, scaleFactor,scaleFactor)

        this.scale = targetScale
    }

  
}



