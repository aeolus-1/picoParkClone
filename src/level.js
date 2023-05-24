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
        this.game.levelHandler.loadLevel(levels[name])
    }
    restartLevel() {
        this.game.doors = []
        this.game.entities = []
        this.game.button = []
        this.game.triggers = []
        this.game.constraints = []
        this.game.blocks = []
        this.game.lasers = []

        Matter.Composite.remove(this.game.matter.engine.world, this.levelComp)
        this.levelComp = Matter.Composite.create()
        Matter.Composite.add(this.game.matter.engine.world, this.levelComp)
        
        Matter.Composite.remove(this.game.matter.engine.world, this.game.blockHandler.comp)
        this.game.blockHandler.comp = Matter.Composite.create()
        Matter.Composite.add(this.game.matter.engine.world, this.game.blockHandler.comp)
        
    }
    loadLevel(dat) {
        var levelData = dat,
    
            cellsize = v(50,50),
            wallThickness = 30
    
            let levelMap = levelData.map
            this.currentLevel.data = levelMap
            this.currentLevel.cellsize = cellsize
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
        if (levelData.playersHaveShields) {
            for (let i = 0; i < levelData.playersHaveShields.length; i++) {
                const shield = levelData.playersHaveShields[i];
                this.game.players[i].giveShield(shield)
            }
        }
    
        this.game.renderer.offset = v(
            (cellsize.x*0.5)+(-width*0.5)+(window.innerWidth*0.5),
            (cellsize.y*0.5)+(-height*0.5)+(window.innerHeight*0.5),
        )
        for (let i = 0; i < this.game.players.length; i++) {
            const player = this.game.players[i];
            player.restart(i)
        }




        let horizontalMap = new Array(),
            horizontalMapWidth = levelMap[0].length,
            horizontalMapHeight = levelMap.length
        
        
        for (let y = 1; y < horizontalMapWidth; y++) {
            horizontalMap[y-1] = new Array()
            for (let x = 0; x < horizontalMapHeight; x++) {
                horizontalMap[y-1][x] = levelMap[x][y-1]^levelMap[x][y]
            }
        }


        let verticalMap = new Array(),
        verticalMapWidth = levelMap[0].length,
        verticalMapHeight = levelMap.length
        
        
        for (let x = 0; x < verticalMapWidth; x++) {
            verticalMap[x] = new Array()

            for (let y = 1; y < verticalMapHeight; y++) {

                //console.log(x,y)
                verticalMap[x][y-1] = levelMap[y][x]^levelMap[y-1][x]
            }
        }





        let verticalBodies = [],
            horizontalBodies = [],

            horizontalWidth = horizontalMap.length,
            horizontalHeight = horizontalMap[0].length
        
        for (let x = 0; x < horizontalWidth; x++) {
            let bodyLength = 0,
                bodyStart = null
            for (let y = 0; y < horizontalHeight; y++) {
                const cell = horizontalMap[x][y];
                if (cell) {
                    if (bodyStart==null) bodyStart = x
                    bodyLength += 1
                } else {
                    if (bodyLength>0&&bodyStart!=null) {
                        //console.log(bodyLength, bodyStart)
                        bodyLength = 0
                        bodyStart = null
                    }
                }
            }
        }

        console.log(horizontalBodies)

        for (let x = 0; x < levelMap.length; x++) {
            const row = levelMap[x];
            for (let y = 0; y < row.length; y++) {
                const cell = row[y];
                //console.log(cell)
                var wallone = levelMap[Math.min(x+1,levelMap.length-1)][y],
                    walltwo = levelMap[x][y+1]
    
                let options = {
                    isStatic:true,
                    //noGravity:true,

                    //frictionStatic:1,
                    //friction:1,
                    //slop:1,
                    render:{
                        visible:false,
                    }
                    
                }
    
                if (cell^wallone) {
                    let dir = ((cell-wallone))
                    let wall = Matter.Bodies.rectangle((y*cellsize.y),((x+0.5)*cellsize.x)+(wallThickness*0.5*-dir), cellsize.y+(wallThickness*0), wallThickness, options)
                    Matter.Composite.add(this.levelComp, wall)
                }
                if (cell^walltwo) {
                    let dir = ((cell-walltwo))
    
                    let wall = Matter.Bodies.rectangle(((y+0.5)*cellsize.y)+(wallThickness*0.5*-dir),(x)*cellsize.x, wallThickness,cellsize.x+(wallThickness*0), options)
                    Matter.Composite.add(this.levelComp, wall)
                }
                
            }
        }
        for (let i = 0; i < levelData.buttons.length; i++) {
            const but = levelData.buttons[i];
            let cellsize = this.game.levelHandler.currentLevel.cellsize
            but.trigger = this.game.triggerHandler.addTrigger(v((but.pos.x-0)*cellsize.x,(but.pos.y-0)*cellsize.y),v(cellsize.x,cellsize.y))
            but.trigger.onEnter = but.onPress
            but.trigger.onIn = but.onIn
        }
        for (let i = 0; i < levelData.doors.length; i++) {
            const dor = levelData.doors[i];
            dor.trigger = this.game.triggerHandler.addTrigger(v((dor.pos.x-0.5)*cellsize.x,(dor.pos.y-1.5)*cellsize.y),v(cellsize.x*2,cellsize.y*2))
            this.game.doors.push(dor)
            dor.trigger.onIn = dor.onIn
            dor.playerCount = this.game.players.length

        }
        levelData.lasers = levelData.lasers||[]
        for (let i = 0; i < levelData.lasers.length; i++) {
            const boc = levelData.lasers[i];
            let newLaser = new Laser(this.game, v(boc.pos.x*50,boc.pos.y*50), boc.angle,{})
            this.game.lasers.push(newLaser)

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
    
}



