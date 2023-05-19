class Block {
    constructor(game, pos, size, options) {
        this.game = game
        options = {
            ...options,
        }
        
        this.rect = this.game.matter.addBody(pos, v(size.x*50, size.y*50))
    }
}

class BlockHandler {
    constructor(game, options) {
        this.game = game
    }
    addBlock(pos,size,options) {
        var newBoc = new Block(this.game, pos, size, options) 
        this.game.blocks.push(newBoc)
        return newBoc
    }
    updateBlocks() {

    }
}