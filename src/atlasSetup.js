function createImgEle(src) {
    var img = document.createElement("img")
    img.src = src
    return img
}

class imgSprite {
    constructor(atlas, options) {
        this.atlas = atlas
    }
}

var mainAtlas = createImgEle("./assets/imgs/atlas.png"),
    levelAtlas = createImgEle("./assets/imgs/levelAssets.png"),
    laserAtlas = createImgEle("./assets/imgs/laser.png")

var imagePosY = 0
function drawSprite(render, player) {
    var ctx = render.ctx,
        frameId = player.frame,
        color = player.color,
        pos = player.body.position,
        spos = getSpritePosition(frameId, color, player)
    drawImageTemp(ctx, v(
        pos.x-(spos.size.x/2),
        pos.y-(spos.size.y/2),
    ),spos.pos, spos.size)
    return spos.choosenFrame
}
function drawImageTemp(ctx,pos,spos,size) {
    ctx.drawImage(mainAtlas,spos.x,spos.y,size.x,size.y,pos.x,pos.y, size.x,size.y)
    
}

var spriteSize = v(40,46)

var sprites = {
    "idle":{
        count:8,
        speed:120,
        frames:[
            
            {
                pos:v(34,56),
                size:v(42,46),
            },
            {
                pos:v(87,56),
                size:v(42,46),
            },
            {
                pos:v(136,56),
                size:v(42,46),
            },
            {
                pos:v(185,56),
                size:v(42,46),
            },
            {
                pos:v(234,56),
                size:v(42,46),
            },
            {
                pos:v(285,56),
                size:v(42,46),
            },
            {
                pos:v(335,56),
                size:v(42,46),
            },
            {
                pos:v(387,56),
                size:v(42,46),
            },
            {
                pos:v(438,56),
                size:v(42,46),
            },
        ]
        
    },
    "falling":{
        count:2,
        speed:80,
        frames:[
            {
                pos:v(613,120),
                size:v(40,45),
            },
            {
                pos:v(558,120),
                size:v(39,45),
            },
            
        ]
        
    },
    "leaping":{
        count:1,
        speed:1000,
        frames:[
            {
                pos:v(557,55),
                size:v(40,45)
            },
        ],
    },
    "walking":{
        count:9,
        speed:80,
        frames:[
            {
                pos:v(34,119),
                size:v(40,46),
            },
            {
                pos:v(87,119),
                size:v(40,46),
            },
            {
                pos:v(136,119),
                size:v(40,46),
            },
            {
                pos:v(185,119),
                size:v(40,46),
            },
            {
                pos:v(234,119),
                size:v(40,46),
            },
            {
                pos:v(285,119),
                size:v(40,46),
            },
            {
                pos:v(335,119),
                size:v(40,46),
            },
            {
                pos:v(387,119),
                size:v(40,46),
            },
            {
                pos:v(438,119),
                size:v(40,46),
            },            
        ]
        
    },
    "pushing":{
        count:3,
        speed:190,
        frames:[
            {
                pos:v(30,190),
                size:v(40,46),
            },
            {
                pos:v(84,190),
                size:v(40,46),
            },
            {
                pos:v(133,190),
                size:v(40,46),
            },
        ]
    },
    "dead":{
        count:1,
        speed:10,
        frames:[
            {
                pos:v(560,191),
                size:v(40,46),
            }
        ]
    },
    
},
    colorMods = {
        "red":v(),
        "blue":v(0, 252),
        "yellow":v(0, 501),
        "green":v(0, 750),
        "orange":v(723, 0),
        "pink":v(723, 252),
        "purple":v(723, 501),
        "gray":v(723, 750),
    }

function getSpritePosition(id, color, player) {
    if (id=="dead") color = "red"
    var frameData = sprites[id],
        frameCount = frameData.count,
        offset = 0,
        choosenFrame = Math.floor(((((new Date()).getTime())/frameData.speed)+offset)%frameCount)
        positions = frameData.frames[choosenFrame]
    return {
        pos:v(
            positions.pos.x+colorMods[color].x,
            positions.pos.y+colorMods[color].y,
        ),
        size:positions.size,
        choosenFrame:choosenFrame,
    }
}

