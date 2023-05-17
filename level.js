var currentLevel = {}

class LevelHandler {
    constructor(game) {
        this.game = game
        
        this.currentLevel={}

    }
    loadLevel(dat) {
        var levelData = JSON.parse(atob(dat)),
    
            cellsize = v(50,50),
            wallThickness = 30
    
            this.currentLevel.data = levelData
            this.currentLevel.cellsize = cellsize
    
    
        for (let x = 0; x < levelData.length; x++) {
            const row = levelData[x];
            for (let y = 0; y < row.length; y++) {
                const cell = row[y];
                //console.log(cell)
                var wallone = levelData[Math.min(x+1,levelData.length-1)][y],
                    walltwo = levelData[x][y+1]
    
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
    
    }
    
}



