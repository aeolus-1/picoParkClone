class Game {
    constructor(options) {
        options = {
            ...options,
        }

        this.mobile = []
        this.players = []
        this.constraints = []
        this.playersBinded = false
        this.buttons = []
        this.doors = []
        this.blocks = []
        this.lasers = []
        this.jumppads = []

        this.triggers = []

        this.entities = []

        this.matter = new MatterHandler(this)
        this.triggerHandler = new TriggerHandler(this)
        this.playerhandler = new PlayerHandler(this)
        this.blockHandler = new BlockHandler(this)
        this.laserHandler = new LaserHandler(this)
        this.jumppadHandler = new JumppadHandler(this)

        this.levelHandler = new LevelHandler(this)
        this.renderer = new Renderer(this)
        this.constraintHandler = new ConstraintHandler(this)

        this.entityHandler = new EntityHandler(this)
        this.particleHandler = new ParticleHandler(this)

        

        this.updateMobiles = function(self){
            self.updateDelta()
            

            self.playerhandler.updateControls()
            self.blockHandler.updateBlocks()
            self.laserHandler.updateLasers()
            self.jumppadHandler.updateJumppads()

            self.playerhandler.updatePlayers()
            

            self.constraintHandler.updateConstraints()
            self.triggerHandler.updateTriggers()
            
            self.updateEntities()


        }
        this.afterUpdateMobiles = function(self) {
            for (let i = 0; i < self.players.length; i++) {
                const player = self.players[i];
                player.updatePlayerParts()
            }
        }

        this.currentColor = randInt(0,7)
        this.lastDelta = 0
        this.deltaTime = 0
    }
    updateDelta() {
        this.deltaTime = Math.min(((new Date()).getTime()-this.lastDelta)/(1000/60), 10)
        this.lastDelta = (new Date()).getTime()

    }
    

    async initRender() {
        this.renderer.init()
        await this.renderer.wait(700)
        await this.renderer.showTitle(`-- ${this.runTemp?"untitled level":"one"} --`, 500)
        await this.renderer.setFade(0, 1000)
    }
    initPhysics() {
        this.matter.init()
        Matter.Events.on(this.matter.engine, "beforeUpdate", ()=>{this.updateMobiles(this)})
        Matter.Events.on(this.matter.engine, "afterUpdate", ()=>{this.afterUpdateMobiles(this)})

    }

    fetchColor() {
        var colors = Object.keys(colorMods)
        this.currentColor+=1
        return colors[this.currentColor%colors.length]
    }
    updateEntities() {
        for (let i = 0; i < this.entities.length; i++) {
            const ent = this.entities[i];
            ent.update()
            if (ent.unload) this.entities.splice(i, 1)
        }
    }

    testInit() {
        this.initPhysics()
            //addBody(v(0,500),v(2000,50),{isStatic:true,render:levelRender})
        
        
        
        
        

       
        /*
        
        this.playerhandler.addPlayer({
            controls:["a","d","w","s"],
            color:"orange",
        }) 
    
        this.playerhandler.addPlayer({
            
            color:"pink",
        }) 
        this.playerhandler.addPlayer({
            color:"purple",
        }) 
        this.playerhandler.addPlayer({
            color:"gray",
        }) 
        
        this.playerhandler.addPlayer({
            color:"blue",
        }) 
        this.playerhandler.addPlayer({
            color:"yellow",
        }) */

        if (this.runTemp) {
            this.levelHandler.loadLevel(levels.tempLevel, "tempLevel")
        } else {
            this.levelHandler.setLevel("one")
        }

        
    }

    bindPlayers(players) {
        players = players.sort((a,b)=>{
            return Math.sign((a.color).hashCode()-(b.color).hashCode())
        })
        for (let i = 0; i < players.length-1; i++) {
            const player = players[i];
            this.constraintHandler.addConstraint({
                bodyA:players[i],
                bodyB:players[i+1],
            })
            this.constraintHandler.addConstraint({
                bodyB:players[i],
                bodyA:players[i+1],
            })
        }
        this.playersBinded = true
        
                
    }
}