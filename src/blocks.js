class Block {
    constructor(game, pos, size, options) {
        this.game = game
        options = {
            minPlayers:0,
            static:false,
            ...options,
        }
        this.options = options
        this.pos = pos
        this.size = size

        this.id = Math.floor(Math.random()*100000)

        this.locked = ()=>{return Object.keys(this.pressing).length>options.minPlayers-1}
        this.playersNeeded = ()=>{return (options.minPlayers)-Object.keys(this.pressing).length}
        this.pressing = {}
        this.minPlayers = options.minPlayers
        
        this.rect = this.game.matter.addBody(v(
            (pos.x-(0.5*50))+((size.x*50)/2),
            (pos.y-(0.5*50))+((size.y*50)/2),
        ), v(size.x*50, size.y*50), {}, this.game.blockHandler.comp)
        this.rect.isStatic = options.static
        this.rect.isBlock = true
        this.rect.block = this
    }
}

class BlockHandler {
    constructor(game, options) {
        this.game = game
        this.comp = Matter.Composite.create()
        Matter.Composite.add(this.game.matter.engine.world, this.comp)
    }
    addBlock(pos,size,options) {
        var newBoc = new Block(this.game, pos, size, options) 
        this.game.blocks.push(newBoc)
        return newBoc
    }
    updateBlocks() {
        for (let i = 0; i < this.game.blocks.length; i++) {
            const block = this.game.blocks[i];
            //console.log(block.pressing)
            Matter.Body.setVelocity(block.rect, v(0,block.rect.velocity.y))
            block.pressing = {}
        }
    }
}