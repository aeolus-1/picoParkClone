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


        this.syncHandler = new SyncHandler(this)

        

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
                if (player.unloading) {
                    self.players.splice(i, 1)
                } else {
                    player.updatePlayerParts()
                }
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
        
        
        this.syncHandler.addControl("keys", ()=>{
            let es = []
            for (let i = 0; i < this.entities.length; i++) {
                const e = this.entities[i];
                es.push( {
                    pos:e.pos,
                    vel:e.vel,
                    id:e.id,
                } )
            }
            return es
            
        }, (d)=>{
            
            var check = (id) => {
                for (let i = 0; i < this.entities.length; i++) {
                    const ent = this.entities[i];
                    if (ent.id==id) {
                        return ent
                    }
                }; return false
            }
            let key = d
            
            let foundEnt = check(key.id)
            if (foundEnt) {
                let ent = foundEnt
                ent.pos = key.pos
                ent.vel = key.vel
            } else {
                console.log("create keys")
                var newKey = new Key(this, v(key.pos.x,key.pos.y), {})
                newKey.id = key.id
                this.entities.push(newKey)
            }


            
        })
        this.syncHandler.addControl("doors", ()=>{
            let es = []
            for (let i = 0; i < this.doors.length; i++) {
                const e = this.doors[i];
                es.push( {
                    open:e.open,
                    pos:e.pos,
                    id:e.id,
                } )
            }
            return es
            
        }, (d)=>{
            
            var check = (id) => {
                for (let i = 0; i < this.doors.length; i++) {
                    const ent = this.doors[i];
                    if (ent.id==id) {
                        return ent
                    }
                }; return false
            }
            let key = d
            
            let foundEnt = check(key.id)
            if (foundEnt) {
                let ent = foundEnt
                ent.open = key.open
                
            } else {
                console.log("create door")
                let cellsize = v(50,50)
                let dor = new Door(key.pos, {
                    nextLevel: "one",
                    open: key.open,
                  })
                  dor.trigger = this.triggerHandler.addTrigger(v((dor.pos.x-0.5)*cellsize.x,(dor.pos.y-1.5)*cellsize.y),v(cellsize.x*2,cellsize.y*2))
                dor.id = key.id
                this.doors.push(dor)
                dor.game = this
                
            }


            
        })
        this.syncHandler.addControl("blocks", ()=>{
            let es = []
            for (let i = 0; i < this.blocks.length; i++) {
                const e = this.blocks[i];
                es.push( {
                    pos:e.rect.position,
                    gridPos:e.pos,
                    size:e.size,
                    id:e.id,
                    options:e.options,
                } )
            }
            return es
            
        }, (d)=>{
            
            var check = (id) => {
                for (let i = 0; i < this.blocks.length; i++) {
                    const ent = this.blocks[i];
                    if (ent.id==id) {
                        return ent
                    }
                }; return false
            }
            let key = d
            
            let foundEnt = check(key.id)

            if (foundEnt) {
                let ent = foundEnt
                Matter.Body.setPosition(ent.rect, key.pos)
                
            } else {
                console.log("create block", key)
                let block = this.blockHandler.addBlock(v(key.gridPos.x,key.gridPos.y), key.size, key.options)
                block.id = key.id

                
            }


            
        })

        
        

       
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

        this.running = true

        
    }

    bindPlayers(players) {
        let pla = players.sort((a,b)=>{
            return Math.sign((a.color).hashCode()-(b.color).hashCode())
        })
        console.log(pla)
        for (let i = 0; i < pla.length; i++) {
            let bodyB = pla[(i+1)%pla.length]
            this.constraintHandler.addConstraint({
                bodyA:pla[i],
                bodyB:bodyB,
            })
            this.constraintHandler.addConstraint({
                bodyB:pla[i],
                bodyA:bodyB,
            })
        }
        this.playersBinded = true
        
                
    }
}