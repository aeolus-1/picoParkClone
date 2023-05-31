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
        player.testFalling()
        player.updatePlayerParts()

        
    }
    updatePlayerControls(player) {
        var c = player.controls,
            keys = player.keys
        //if (window.clientConnection) if(window.clientConnection.mainPlayer.body.id==player.body.id) return true

        var walking = false
        if (!player.dead) {
        if (keys[c[0]]) {
            player.moveHor(-1)
            walking = true
            
        }
        if (keys[c[1]]) {
            player.moveHor(1)
            walking = true
        }
        if (walking) {
            if (!player.dead) player.frame = !player.blockingDirection?"walking":"pushing"
            

        } else if (player.onGround()) {
            if (!player.dead) player.frame = "idle"
        } else {
            if (!player.dead) player.frame = "falling"
        }
        if (keys[c[2]]) player.jump()
    }
        

    }

   
}

class Player {
    constructor(game, options) {
        this.game = game
        options = {
            color:this.game.fetchColor(),
            controls:["arrowleft","arrowright","arrowup","arrowdown"],
            bodyOptions:{},
            hasShield:3,
            ...options,
        }
        this.options = options
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

        this.body = this.game.matter.addBody(v(30,(this.game.players.length*50)),v(40,46),{
            ...options.bodyOptions,
            inertia:Infinity,
            
            isStatic:false,render:{visible:debug}}, this.game.playerhandler.playerComp)
        this.body.player = this
        this.onlinePlayer = false
        this.blockingDirection = 0

        this.ready = false

        this.hasShield = {
            1:false,
            2:false,
            3:false,
            4:false,
        }
        this.preHasShield = {
            1:false,
            2:false,
            3:false,
            4:false,
        }
        this.laserShields = []

        

        

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
    unload() {
        this.unloading = true
        Matter.Composite.remove(this.game.playerhandler.playerComp, this.body)
    }
    testForShield() {
        let a = [1,2,3,4]
        for (let i = 0; i < a.length; i++) {
            const num = a[i];
            if (this.hasShield[num]&&!this.preHasShield[num]) {

                this.giveShield(num)
            } else if (this.preHasShield[num]&&!this.hasShield[num]) {
                console.log(this.laserShields)
                if (this.laserShields[num]!=undefined) {
                    Matter.Composite.remove(this.game.matter.engine.world,this.laserShields[num])
                    this.laserShields[num] = undefined
                }
            }
        }

        
        this.preHasShield = {...this.hasShield}
    }
    giveShield(angle) {
        let axis = (angle%2),
            laserShield = Matter.Bodies.rectangle(this.body.position.x,this.body.position.y, axis?65:10,(!axis)?65:10,{
            noGravity:false,
            collisionFilter:{
                group:-1,
                catagory:2,
                mask:0,
            },
        })
        laserShield.shield = true
        laserShield.shieldAngle = angle
        laserShield.laserShieldPos = rotate(0,0, -50,0,angle*Math.PI*0.5)
        Matter.Composite.add(this.game.matter.engine.world, laserShield)
        this.laserShields[angle] =(laserShield)
        console.log(this.laserShields)
    
    }
    removeShield() {
        this.hasShield = {
            1:false,
            2:false,
            3:false,
            4:false,
        }
        
    }
    readyUp(pos) {
        this.ready = true
        this.unreadyPos = pos
        this.body.isStatic = true
        Matter.Body.setPosition(this.body, v(-1000,-100000000))
    }
    unReady() {
        if (this.unreadyPos) Matter.Body.setPosition(this.body, v(this.unreadyPos.x,this.unreadyPos.y))
        this.body.isStatic = false
        this.ready = false

    }
    kill() {
        this.dead = true
        this.frame = "dead"
        
        Matter.Body.setVelocity(this.body, v(this.body.velocity.x,-10))

    }
    restart(i=0) {
        this.dead = false
        this.ready = false
        this.body.isStatic = false
        
       

        Matter.Body.setPosition(this.body, v(
            150,
            (-this.game.renderer.offset.y+-20+(-i*50))-400,
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
        if (this.body.position.y>=window.innerHeight*3) {
            this.restart()

                Matter.Body.setPosition(this.body, v(
                    100,
                    -60,
                ))
                Matter.Body.setVelocity(this.body, v(
                    this.body.velocity.x*0.3,
                    this.body.velocity.y*0.3,
                ))
            
        }
       
        let ground = this.getGround()
       if (ground!=undefined) {

           if (ground.bodyA.jumppad||ground.bodyB.jumppad) {
               this.jump(2)
           }

       }
       if (this.dead&&!this.preDead) {
        this.body.collisionFilter = {
            mask:0,
            group:1,
            mask:-1,
        }
       } else if (!this.dead&&this.preDead) {
        this.body.collisionFilter = {
            category: 1,
            group: 0,
            mask: 4294967295
        }
       }
       this.preDead = this.dead

        
        

       if (!this.dead) {
            var falling = !this.onGround()
            if (falling) {
                this.frame = (Math.sign(this.body.velocity.y)>0)?"falling":"leaping"
            } else if (this.preFalling) {
                this.frame = "idle"
            }

            this.preFalling = falling
        }
    }

    onGround() {
        
        return Matter.Query.collides(this.groundDetector, Matter.Composite.allBodies(this.game.matter.engine.world).filter((a)=>{return a.id!=this.body.id&&a.id!=this.groundDetector.id&&!a.shield})).length>0
    }
    getGround() {
        return Matter.Query.collides(this.groundDetector, Matter.Composite.allBodies(this.game.matter.engine.world).filter((a)=>{return a.id!=this.body.id&&a.id!=this.groundDetector.id&&!a.shield}))[0]
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
                if (!multi) player.moveHor(dir, true)
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
        var ret = Matter.Query.collides(this.body, Matter.Composite.allBodies(this.game.matter.engine.world).filter((a)=>{
            return (
                a.id!=this.body.id&&
                ((a.isBlock)?!a.block.locked():true))&&
                !a.shield
        }))
        Matter.Body.scale(this.body, 1,2)
        
        
        
        return ret.length>0
    }
    jump(str=1) {
        if (this.ready) {
            this.unReady()
        } else if (this.onGround()) Matter.Body.setVelocity(this.body, v(this.body.velocity.x,-13*str))
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

        this.testForShield()

        
        Matter.Body.setPosition(this.groundDetector, v(this.body.position.x,this.body.position.y+(spriteSize.y*0.5*this.scale)))
        if (this.laserShields.length>0) {
            for (let i = 0; i < this.laserShields.length; i++) {
                const sh = this.laserShields[i];
                //console.log(sh)
                if (sh!=undefined) {
                    Matter.Body.setPosition(sh, v(this.body.position.x+sh.laserShieldPos.x,this.body.position.y+sh.laserShieldPos.y))
                    Matter.Body.setVelocity(sh, v(0,0))
                }
            }
            
        }
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



