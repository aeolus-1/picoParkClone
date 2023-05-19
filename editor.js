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
    selected = LetterCode[e.key]
    if(selected!=undefined) console.log(selected)
})

function fillAreaEditor(x, y, type) {
    let tile = grid[x][y]
    let tileType = tile.type
    tile.type = type
    check(tile)
    function check(sTile) {
        if (sTile.up !== undefined) {
            if (sTile.up.type === tileType) {
                sTile.up.type = type
                check(sTile.up)
            }
        } if (sTile.left !== undefined) {
            if (sTile.left.type === tileType) {
                sTile.left.type = type
                check(sTile.left)
            }
        } if (sTile.down !== undefined) {
            if (sTile.down.type === tileType) {
                sTile.down.type = type
                check(sTile.down)
            }
        } if (sTile.right !== undefined) {
            if (sTile.right.type === tileType) {
                sTile.right.type = type
                check(sTile.right)
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


