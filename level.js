var currentLevel = {}

function loadLevel(dat) {
    var levelData = JSON.parse(atob(dat)),

        cellsize = v(50,50),
        wallThickness = 20

    currentLevel.data = levelData
    currentLevel.cellsize = cellsize


    for (let x = 0; x < levelData.length; x++) {
        const row = levelData[x];
        for (let y = 0; y < row.length; y++) {
            const cell = row[y];
            //console.log(cell)
            var wallone = levelData[Math.min(x+1,levelData.length-1)][y],
                walltwo = levelData[x][y+1]

            let options = {
                isStatic:true,
                collisionFilter:{
                    group:1
                },
                frictionStatic:0,
                friction:0,
                render:{
                    visible:false,
                }
                
            }

            if (cell^wallone) {
                let dir = ((cell-wallone))
                let wall = Matter.Bodies.rectangle((y*cellsize.y),((x+0.5)*cellsize.x)+(wallThickness*0.5*-dir), cellsize.y+(wallThickness*0), wallThickness, options)
                Matter.Composite.add(engine.world, wall)
            }
            if (cell^walltwo) {
                let dir = ((cell-walltwo))

                let wall = Matter.Bodies.rectangle(((y+0.5)*cellsize.y)+(wallThickness*0.5*-dir),(x)*cellsize.x, wallThickness,cellsize.x+(wallThickness*0), options)
                Matter.Composite.add(engine.world, wall)
            }
        }
    }
    console.log(levelData)

}

function renderLevel() {
    var color = "rgb(255,134,77)",
        levelData = currentLevel.data,
            cellsize = currentLevel.cellsize

    if (levelData!=undefined) {
        for (let x = 0; x < levelData.length; x++) {
            const row = levelData[x];
            for (let y = 0; y < row.length; y++) {
                const cell = row[y];
                ctx.fillStyle = color
                if (cell) ctx.fillRect((y-0.5)*cellsize.x,(x-0.5)*cellsize.y,cellsize.x,cellsize.y)
            }
        }
    }
}