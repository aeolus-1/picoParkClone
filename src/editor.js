var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
/*
var width = prompt("width")
var height = prompt("height")
*/
var width = 20
var height = 10
canvas.width = width*32
canvas.height = height*32

function setCanvasSize() {
    width = parseInt(document.getElementById("levelX").value)
    height = parseInt(document.getElementById("levelY").value)
    canvas.width = width*32
    canvas.height = height*32
    grid = []
    


    for(let a = 0; a < width; a++) {
        grid.push([]) 
        for(let b = 0; b < height; b++) {
            grid[a][b] = b==height-1?"1":"0"
        }
    }
}

laserRotation = 1

var grid = []
var selected = "1"
var mDown = false
var fill = false


for(let a = 0; a < width; a++) {
    grid.push([]) 
    for(let b = 0; b < height; b++) {
        grid[a][b] = b==height-1?"1":"0"
    }
}

setInterval(() => {
    ctx.fillStyle = "#000"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            let size = {x:1,y:1}
            ctx.strokeStyle = "#0000"
            if(grid[x][y] === "1") {
                ctx.fillStyle = "#32a852"
            } else if(grid[x][y] === "tree") {
                ctx.fillStyle = "#385741"
            } else if(grid[x][y] === "door") {
                size.x = 2
                size.y = 2
                ctx.fillStyle = "#8c602e"
            } else if(grid[x][y].split("|")[0] === "block") {
                size.x = parseInt(grid[x][y].split("|")[1].split(",")[0])
                size.y = parseInt(grid[x][y].split("|")[1].split(",")[1])
                ctx.fillStyle = "#6e3516"
                ctx.strokeStyle = "#fff"

            }  else if(grid[x][y] === "jumppad") {
                ctx.fillStyle = "#5f0"
            }  else if(grid[x][y] === "shrinkingButton") {
                ctx.fillStyle = "#f0e"
            } else if(grid[x][y] === "growingButton") {
                ctx.fillStyle = "#f08"
            }  else if(grid[x][y].split("|")[0] === "laser") {
                ctx.fillStyle = "#f00"
               
            } else if(grid[x][y] === "key") {
               
                ctx.fillStyle = "#9c7c14"

            } else {
                ctx.fillStyle = "#0000"

            }
            
            ctx.fillRect(x*32, y*32, 32*size.x, 32*size.y)
            let buffer = 10
            ctx.strokeRect((x*32)+buffer, (y*32)+buffer, (32*size.x)-(buffer*2), (32*size.y)-(buffer*2))
            
        }
    }
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            if(grid[x][y].split("|")[0] === "laser") {
                ctx.fillStyle = "#f00"
                ctx.beginPath()
                let angle = (parseInt(grid[x][y].split("|")[1]))*Math.PI*0.5
                    moveVector = v(100*Math.cos(angle),100*Math.sin(angle),)
                ctx.moveTo(16+(x*32), 16+(y*32))
                ctx.lineTo(moveVector.x+16+(x*32), moveVector.y+16+(y*32))
                ctx.strokeStyle = "#f00"
                ctx.stroke()
                ctx.closePath()
            } 
        }
    }

    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            ctx.fillStyle = "#000000"
            ctx.fillRect(x*32, y*32, 2, 32)
            ctx.fillRect(x*32, y*32, 32, 2)
            ctx.fillRect(x*32+30, y*32, 2, 32)
            ctx.fillRect(x*32, y*32+30, 32, 2)
        }
    }
}, 1000/60)

canvas.addEventListener("mousedown", (e) => {
    if(fill == true) fillAreaEditor(Math.floor(e.clientX/32),Math.floor(e.clientY/32),selected)
    grid[Math.floor((e.offsetX)/32)][Math.floor((e.offsetY)/32)] = selected
    mDown = true
    
})
addEventListener("mousemove", (e) => {
    if(mDown === true) grid[Math.floor(e.offsetX/32)][Math.floor(e.offsetY/32)] = selected
})
addEventListener("mouseup", (e) => {
    mDown = false
})
addEventListener("keydown", (e) => {
    if(LetterCode[e.key] != undefined) {
        selected = LetterCode[e.key]
        if (selected=="block") {
            let size = getCurrentBlockSize()
            selected += `|${size.x},${size.y},${size.min}`
        }
        if (selected=="laser") {
            selected += `|${laserRotation}`
        }
        document.getElementById("selectedTile").innerHTML = "selected tile = "+LetterCode[e.key]
    }
    if (e.key == "r") {
        laserRotation = (laserRotation%4)+1
        document.getElementById("laserRotation").textContent = laserRotation
        selected = `laser|${laserRotation}`

    }
    if(selected!=undefined) {console.log(selected)}
    if(e.key == "Shift") {fill = true; document.getElementById("filling").innerHTML = "filling = true"}
})
addEventListener("keyup", (e) => {if(e.key=="Shift"){fill=false;document.getElementById("filling").innerHTML = "filling = false"}})

function fillAreaEditor(x, y, type) {
    let tile = {x:x,y:y}
    let tileType = grid[tile.x][tile.y]
    console.log(tile, tileType, type)
    check(tile)
    function check(sTile) {
        function checkDefine(a, b) {
            if(grid[a] === undefined) return false
            if(grid[a][b] === undefined) return false
            return true
        }
        let up = {x:sTile.x,y:sTile.y-1}
        let right = {x:sTile.x+1,y:sTile.y}
        let down = {x:sTile.x,y:sTile.y+1}
        let left = {x:sTile.x-1,y:sTile.y}
        if (checkDefine(up.x, up.y)) {
            if (grid[up.x][up.y] === tileType) {
                grid[up.x][up.y] = type
                check(up)
            }
        } if (checkDefine(right.x, right.y)) {
            if (grid[right.x][right.y] === tileType) {
                grid[right.x][right.y] = type
                check(right)
            }
        } if (checkDefine(down.x, down.y)) {
            if (grid[down.x][down.y] === tileType) {
                grid[down.x][down.y] = type
                check(down)
            }
        } if (checkDefine(left.x, left.y)) {
            if (grid[left.x][left.y] === tileType) {
                grid[left.x][left.y] = type
                check(left)
            }
        }
    }
}

function ToType() {
    let z = ""
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            //console.log(grid[x][y], TypeCode[grid[x][y]], y)
            z += String(TypeCode[grid[y][x]])
        }
    }
    return z
}
function save() {
    let level = convert()
    localStorage.setItem("tempLevel", btoa(level))
}
function convert() {
    

    

    console.log(grid)

    
    g = []
    let keys = [],
        doors = [],
        blocks = [],
        gButtons = [],
        sButtons = [],
        lasers = [],
        jumppads = []
    for(let r = 0; r < height; r++) {
        g.push(new Array())
        for(let t = 0; t < width; t++) {
            let tile = grid[t][r].split("|")
            g[r][t] = tile[0]=="1"?"1":"0"
            switch (tile[0]) {
                case "door":
                    doors.push(v(t+1,r+2))
                    break;
                case "jumppad":
                    jumppads.push(v(t,r+2))
                    break;
            
                case "key":
                    keys.push(v(t,r))
                    break;

                case "growingButton":
                    gButtons.push(v(t,r))
                    break;
                case "shrinkingButton":
                    sButtons.push(v(t,r))
                    break;

                case "block":
                    blocks.push({
                        pos:v(t,r),
                        size:v(parseInt(tile[1].split(",")[0]),parseInt(tile[1].split(",")[1])),
                        minPlayers:parseInt(tile[1].split(",")[2])
                    })
                    break;
                case "laser":
                    console.log(tile)
                    lasers.push({
                        pos:v(t,r),
                        rotation:parseInt(tile[1])
                    })
                    break;
                
                default:
                    break;
            }
        }
    }
    e = ``
    for(let r = 0; r < height; r++) {
        e += `[`
        for(let t = 0; t < width; t++) {
            if(t!=0)e += `,${g[r][t]}`
            else e+=g[r][t]
        }
        if(r!=height-1)e += `],`
        else e += `]`
    }
    jumppads = (jumppads.map(k=>{
        return `
            v(${k.x},${k.y}),`
    }).join(""))
    keys = (keys.map(k=>{
        return `
            v(${k.x},${k.y}),`
    }).join(""))

    doors = (doors.map(k=>{
        return `
        new Door(v(${k.x},${k.y}),{
            nextLevel:"tempLevel",
            
        }),`
    }).join(""))

    blocks = (blocks.map(k=>{
        return `
        {
            pos:v(${k.pos.x},${k.pos.y}),
            size:v(${k.size.x},${k.size.y}),
            minPlayers:${k.minPlayers}
        },`
    }).join(""))

    gButtons = (gButtons.map(k=>{
        return `
        new Button(v(${k.x},${k.y}),{
            onPlayer:(e)=>{
                e.player.setScale(Math.min(Math.max(e.player.scale+0.0075, 0.5), 2))
                
            }
        }),`
    }).join(""))
    sButtons = (sButtons.map(k=>{
        return `
        new Button(v(${k.x},${k.y}),{
            onPlayer:(e)=>{
                e.player.setScale(Math.min(Math.max(e.player.scale-0.0075, 0.5), 2))
                
            }
        }),`
    }).join(""))
    
    lasers = (lasers.map(k=>{
        return `{
            pos:v(${k.pos.x},${k.pos.y}),
            angle:${k.rotation},
        },`
    }).join(""))
     

    

    var details = {
        playersBinded:new Boolean(document.getElementById("playersBinded").checked),
        map:e,

        buttons:gButtons+sButtons,

        keys:keys,

        playerShields:(()=>{
            let shields = "["
            if (document.getElementById("sT").checked) shields += "3,"
            if (document.getElementById("sB").checked) shields += "1,"
            if (document.getElementById("sL").checked) shields += "2,"
            if (document.getElementById("sR").checked) shields += "4,"
            return shields+"]"
        })(),

        blocks:blocks,

        doors:doors,
    }


    var template = `"tempName":{jumppads:[${jumppads}],playersHaveShields:${details.playerShields},playersBinded:${details.playersBinded},map:[${e}],lasers:[${lasers}],buttons:[${details.buttons}],keys:[${details.keys}],blocks:[${details.blocks}],doors:[${details.doors}]},`
    console.log(template)
    document.getElementById("convert").value = btoa(template)
    return template
}



var LetterCode = {
    "a": "1",
    "z": "0",
    "d": "door",
    "k": "key",
    "s": "shrinkingButton",
    "g": "growingButton",
    "j": "jumppad",
    "b": "block",
    "l": "laser",
}

window.onload = ()=>{
    for (let i = 0; i < Object.keys(LetterCode).length; i++) {
        const l = Object.keys(LetterCode)[i];
        document.getElementById("legend").innerHTML += `-- ${l}:${LetterCode[l]}<br>`
        console.log(`${l}:${LetterCode[l]}`)
    }
}

var TypeCode = {
    "grass": "a" ,
    "tree": "b" ,
   "void": "z",
}


