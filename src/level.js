var currentLevel = {}

class LevelHandler {
    constructor(game) {
        this.game = game
        this.levelComp = Matter.Composite.create()
        Matter.Composite.add(this.game.matter.engine.world, this.levelComp)
        
        this.currentLevel={}
        

    }
    setLevel(name) {
        this.game.levelHandler.restartLevel()
        this.game.levelHandler.loadLevel(levels[name], name)
    }
    restartLevel() {
        this.game.doors = []
        this.game.entities = []
        this.game.button = []
        this.game.triggers = []
        this.game.constraints = []
        this.playersBinded = false

        this.game.blocks = []
        this.game.lasers = []
        this.game.jumppads = []

        Matter.Composite.remove(this.game.matter.engine.world, this.levelComp)
        this.levelComp = Matter.Composite.create()
        Matter.Composite.add(this.game.matter.engine.world, this.levelComp)

        Matter.Composite.remove(this.game.matter.engine.world, this.game.jumppadHandler.comp)
        this.game.jumppadHandler.comp = Matter.Composite.create()
        Matter.Composite.add(this.game.matter.engine.world, this.game.jumppadHandler.comp)
        
        Matter.Composite.remove(this.game.matter.engine.world, this.game.blockHandler.comp)
        this.game.blockHandler.comp = Matter.Composite.create()
        Matter.Composite.add(this.game.matter.engine.world, this.game.blockHandler.comp)

        if (window.hostConnection) {
            window.hostConnection.broadcast(JSON.stringify({restartLevel:true}))
        }
        
    }
    loadLevel(dat, name) {
        var levelData = dat,
    
            cellsize = v(50,50),
            wallThickness = 30
    
            let levelMap = levelData.map
            this.currentLevel.data = levelMap
            this.currentLevel.cellsize = cellsize
            this.currentLevel.name = name
            this.game.buttons = levelData.buttons

        var width = levelMap[0].length*cellsize.x,
            height = levelMap.length*cellsize.y

        if (levelData.playersBinded) {
            this.game.bindPlayers(this.game.players)
        }
        for (let i = 0; i < this.game.players.length; i++) {
            const player = this.game.players[i];
            player.removeShield()
        }
        if (levelData.playersHaveShields&&!window.clientConnection) {
            for (let i = 0; i < levelData.playersHaveShields.length; i++) {
                const shield = levelData.playersHaveShields[i];
                this.game.players[i%this.game.players.length].hasShield[shield] = true
            }
        }
    
        this.game.renderer.offset = v(
            (cellsize.x*0.5)+(-width*0.5),
            (cellsize.y*0.5)+(-height*0.5),
        )
        this.game.renderer.levelBounds = {
            pos:v(-25,-25),
            size:v(
                width,
                height
            )
        }

        this.game.renderer.resizeCanvas()
        for (let i = 0; i < this.game.players.length; i++) {
            const player = this.game.players[i];
            player.restart(i)
        }

        let levelThickness = 0.7
        var makeParts = (dir)=>{

            let horizontalMap = new Array(),
                horizontalMapWidth = levelMap[0].length,
                horizontalMapHeight = levelMap.length
            
            
            for (let y = 1; y < horizontalMapWidth; y++) {
                horizontalMap[y-1] = new Array()
                for (let x = 0; x < horizontalMapHeight; x++) {
                    let forX = levelMap[x][y-1],
                        curX = levelMap[x][y]
                    horizontalMap[y-1][x] = (forX^curX)&levelMap[x][y-Math.max(dir,0)]
                }
            }


            let verticalMap = new Array(),
            verticalMapWidth = levelMap[0].length,
            verticalMapHeight = levelMap.length
            
            
            for (let x = 0; x < verticalMapWidth; x++) {
                verticalMap[x] = new Array()

                for (let y = 1; y < verticalMapHeight; y++) {

                    //console.log(x,y)
                    verticalMap[x][y-1] = (levelMap[y][x]^levelMap[y-1][x])&levelMap[y-Math.max(dir,0)][x]
                }
            }





            let verticalBodies = [],
                horizontalBodies = [],

                horizontalWidth = horizontalMap.length,
                horizontalHeight = horizontalMap[0].length
            
            for (let x = 0; x < horizontalWidth; x++) {
                let bodyLength = 0,
                    bodyStart = null
                    //console.log("---")
                for (let y = 0; y < horizontalHeight; y++) {
                    const cell = horizontalMap[x][y];
                    //console.log(cell)
                    if (cell) {
                        if (bodyStart==null) bodyStart = x
                        bodyLength += 1
                    } else {
                        if (bodyLength>0) {
                            console.log(bodyStart,y)
                            horizontalBodies.push({
                                length:bodyLength,
                                pos:v(
                                    bodyStart,
                                    y
                                )
                            })
                            bodyLength = 0
                            bodyStart = null
                        }
                    }
                }
                if (bodyLength>0) {
                    horizontalBodies.push({
                        length:bodyLength,
                        pos:v(
                            bodyStart,
                            horizontalHeight
                        )
                    })
                }
            }
            console.log(horizontalBodies)
            //================================
            let verticalWidth = verticalMap.length,
                verticalHeight = verticalMap[0].length

            for (let y = 0; y < verticalHeight; y++) {
                let bodyLength = 0,
                    bodyStart = null
                    //console.log("---")
                for (let x = 0; x < verticalWidth; x++) {

                
                    const cell = verticalMap[x][y];
                    //console.log(cell)
                    if (cell) {
                        if (bodyStart==null) bodyStart = x
                        bodyLength += 1
                    } else {
                        if (bodyLength>0) {
                            verticalBodies.push({
                                length:bodyLength,
                                pos:v(
                                    bodyStart,
                                    y
                                )
                            })
                            bodyLength = 0
                            bodyStart = null
                        }
                    }
                }
                if (bodyLength>0) {
                    verticalBodies.push({
                        length:bodyLength,
                        pos:v(
                            bodyStart,
                            y
                        )
                    })
                }
            }



            for (let i = 0; i < horizontalBodies.length; i++) {
                const bod = horizontalBodies[i];
                let wall = Matter.Bodies.rectangle(
                    ((bod.pos.x+((1-levelThickness)*0.5)-(levelThickness*Math.min(dir,0)))*cellsize.x),
                    ((bod.pos.y-(bod.length*0.5)-0.5)*cellsize.y), 
                    cellsize.x*levelThickness, 
                    bod.length*cellsize.y,
                    {isStatic:true})
                    
                Matter.Composite.add(this.levelComp, wall)

            }
            
            for (let i = 0; i < verticalBodies.length; i++) {
                const bod = verticalBodies[i];
                let wall = Matter.Bodies.rectangle(
                    ((bod.pos.x+(bod.length*0.5)-0.5)*cellsize.x), 
                    ((bod.pos.y+1-((1-levelThickness)*0.5)+(levelThickness*Math.min(-dir,0)))*cellsize.y),
                    bod.length*cellsize.x,
                    cellsize.x*levelThickness, 
                    {isStatic:true})
                    
                Matter.Composite.add(this.levelComp, wall)

            }

        }

        makeParts(1)
        makeParts(-1)

        if (!window.clientConnection) {
            
            for (let i = 0; i < levelData.doors.length; i++) {
                const dor = levelData.doors[i];
                dor.trigger = this.game.triggerHandler.addTrigger(v((dor.pos.x-0.5)*cellsize.x,(dor.pos.y-1.5)*cellsize.y),v(cellsize.x*2,cellsize.y*2))
                this.game.doors.push(dor)
                dor.game = this.game
                dor.trigger.onIn = dor.onIn
                dor.playerCount = this.game.players.length

            }
            
            for (let i = 0; i < levelData.blocks.length; i++) {
                const boc = levelData.blocks[i];
                this.game.blockHandler.addBlock(v(boc.pos.x*50,boc.pos.y*50), boc.size, boc)

            }
            for (let i = 0; i < levelData.keys.length; i++) {
                const key = levelData.keys[i];
                var newKey = new Key(this.game, v(key.x*cellsize.x,key.y*cellsize.y), {})
                this.game.entities.push(newKey)
            }
        }
        for (let i = 0; i < levelData.buttons.length; i++) {
            const but = levelData.buttons[i];
            let cellsize = this.game.levelHandler.currentLevel.cellsize
            but.trigger = this.game.triggerHandler.addTrigger(v((but.pos.x-0)*cellsize.x,(but.pos.y+0.25)*cellsize.y),v(cellsize.x,cellsize.y*0.5))
            but.trigger.onEnter = but.onPress
            but.trigger.onLeave = but.onUnpress
            but.trigger.onIn = but.onIn
        }
        for (let i = 0; i < levelData.jumppads.length; i++) {
            const jp = levelData.jumppads[i];
            let newJp = new Jumppad(this.game, v(jp.x,jp.y-2), {})
            this.game.jumppads.push(newJp)

        }
        levelData.lasers = levelData.lasers||[]
        for (let i = 0; i < levelData.lasers.length; i++) {
            const boc = levelData.lasers[i];
            let newLaser = new Laser(this.game, v(boc.pos.x*50,boc.pos.y*50), boc.angle,{})
            newLaser.enabled = boc.enabled==undefined?true:boc.enabled
            this.game.lasers.push(newLaser)

        }
        
    
    }
    
}



