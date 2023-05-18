var currentLevel = {}

class LevelHandler {
    constructor(game) {
        this.game = game
        
        this.currentLevel={}

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
    
        this.game.renderer.offset = v(
            (cellsize.x*0.5)+(-width*0.5)+(window.innerWidth*0.5),
            (cellsize.y*0.5)+(-height*0.5)+(window.innerHeight*0.5),
        )
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
                    Matter.Composite.add(this.game.matter.engine.world, wall)
                }
                if (cell^walltwo) {
                    let dir = ((cell-walltwo))
    
                    let wall = Matter.Bodies.rectangle(((y+0.5)*cellsize.y)+(wallThickness*0.5*-dir),(x)*cellsize.x, wallThickness,cellsize.x+(wallThickness*0), options)
                    Matter.Composite.add(this.game.matter.engine.world, wall)
                }
                
            }
        }
        for (let i = 0; i < levelData.buttons.length; i++) {
            const but = levelData.buttons[i];
            let cellsize = this.game.levelHandler.currentLevel.cellsize
            but.trigger = this.game.triggerHandler.addTrigger(v((but.pos.x-0)*cellsize.x,(but.pos.y-0)*cellsize.y),v(cellsize.x,cellsize.y))
            console.log(but)
            but.trigger.onEnter = but.onPress
            but.trigger.onIn = but.onIn
        }
        for (let i = 0; i < levelData.doors.length; i++) {
            const dor = levelData.doors[i];
            dor.trigger = this.game.triggerHandler.addTrigger(v((dor.pos.x-0.5)*cellsize.x,(dor.pos.y-1.5)*cellsize.y),v(cellsize.x*2,cellsize.y*2))
            this.game.doors.push(dor)
            dor.trigger.onIn = dor.onIn

        }
        for (let i = 0; i < levelData.keys.length; i++) {
            const key = levelData.keys[i];
            var newKey = new Key(this.game, v(key.x*cellsize.x,key.y*cellsize.y), {})
            this.game.entities.push(newKey)
        }
    
    }
    
}



