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

var mainAtlas = createImgEle("atlas.png")

var imagePosY = 0
function drawSprite(id,pos) {
    var spos = sprites[id]
    drawImageTemp(v(
        pos.x-(spriteSize.x/2),
        pos.y-(spriteSize.y/2),
    ),spos, spriteSize)
}
function drawImageTemp(pos,spos,size) {
    ctx.drawImage(mainAtlas,spos.x,spos.y,size.x,size.y,pos.x,pos.y, size.x,size.y)
    
}

function generateSprites(atlas, options) {
    var sprites = {},
        spriteSize = options.spriteSize,

    frames = Object.keys(options.sprites)

    for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        var pos = options.sprites[frame]
        sprites[frame] = v(pos.x*spriteSize.x,pos.y*spriteSize.y)
        
    }
    
    window.spriteSize = spriteSize
    window.sprites = sprites
}


    generateSprites(mainAtlas, {
        spriteSize:v(40,46),
        sprites:{
            "idle":v(0,0),
            "walking1":v(0,1),
            "walking2":v(1,1),
            "jumping":v(2,1),
        }
    })

