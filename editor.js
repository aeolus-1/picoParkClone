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

var grid = []
var selected = "1"
var mDown = false
var fill = false


for(let a = 0; a < width; a++) {
    grid.push([]) 
    for(let b = 0; b < height; b++) {
        grid[a][b] = "1"
    }
}

setInterval(() => {
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            if(grid[x][y] === "1") {
                ctx.fillStyle = "#32a852"
            } else if(grid[x][y] === "tree") {
                ctx.fillStyle = "#385741"
            } else {
                ctx.fillStyle = "#0a0a0a"
            }
            ctx.fillRect(x*32, y*32, 42, 32)
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

addEventListener("mousedown", (e) => {
    if(fill == true) fillAreaEditor(Math.floor(e.clientX/32),Math.floor(e.clientY/32),selected)
    grid[Math.floor(e.clientX/32)][Math.floor(e.clientY/32)] = selected
    mDown = true
    
})
addEventListener("mousemove", (e) => {
    if(mDown === true) grid[Math.floor(e.clientX/32)][Math.floor(e.clientY/32)] = selected
})
addEventListener("mouseup", (e) => {
    mDown = false
})
addEventListener("keydown", (e) => {
    if(LetterCode[e.key] != undefined) {
        selected = LetterCode[e.key]
        document.getElementById("selectedTile").innerHTML = "selected tile = "+LetterCode[e.key]
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
        console.log(sTile)
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

function convert() {
    console.log(grid)
    g = []
    for(let r = 0; r < height; r++) {
        g.push(new Array())
        for(let t = 0; t < width; t++) {
            g[r][t] = Number(grid[t][r])
        }
    }
    console.log(g)
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
    console.log(e)
}



var LetterCode = {
    "a": "1",
    "z": "0",
}

var TypeCode = {
    "grass": "a" ,
    "tree": "b" ,
   "void": "z",
}


