class Renderer {
    constructor(game) {
        this.game = game

        this.canvas = document.getElementById("c")
        this.ctx = this.canvas.getContext("2d")

        this.resizeCanvas()
        window.onresize = ()=>{this.resizeCanvas()}
    }
    resizeCanvas() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }

    init() {
        requestAnimationFrame(()=>{this.renderLoop(this)})
    }
    clearCanvas() {
        this.canvas.width = this.canvas.width
    }

    renderLoop(self) {
        self.clearCanvas()
        self.renderLevel(self.game.levelHandler)
        self.renderConstraints()

        for (let i = 0; i < self.game.players.length; i++) {
            const player = self.game.players[i];
            self.renderPlayer(player)
        }



        requestAnimationFrame(()=>{self.renderLoop(self)})
    }

    renderPlayer(player) {
        this.ctx.save()
        var playerPos = player.body.position
        this.ctx.translate(playerPos.x,playerPos.y)
        this.ctx.scale(player.direction,1)
        this.ctx.scale(player.scale,player.scale)
        this.ctx.translate(-playerPos.x,-playerPos.y)
        drawSprite(this, player)
    
        this.ctx.restore()
    }
    renderConstraints() {
        for (let i = 0; i < this.game.constraints.length; i++) {
            const con = this.game.constraints[i];
            this.ctx.beginPath()
            this.ctx.moveTo(con.bodyA.body.position.x,con.bodyA.body.position.y)
            this.ctx.lineTo(con.bodyB.body.position.x,con.bodyB.body.position.y)
            this.ctx.stroke()
            this.ctx.closePath()
            
        }
    }
    renderLevel(levelHandler) {
        var color = "rgb(255,134,77)",
            levelData = levelHandler.currentLevel.data,
                cellsize = levelHandler.currentLevel.cellsize
    
        if (levelData!=undefined) {
            for (let x = 0; x < levelData.length; x++) {
                const row = levelData[x];
                for (let y = 0; y < row.length; y++) {
                    const cell = row[y];
                    this.ctx.fillStyle = color
                    if (cell) this.ctx.fillRect((y-0.5)*cellsize.x,(x-0.5)*cellsize.y,cellsize.x,cellsize.y)
                }
            }
        }
/*
        var bodies = Matter.Composite.allBodies(this.game.matter.engine.world)
        for (let i = 0; i < bodies.length; i++) {
            const bod = bodies[i];
            var bounds = bod.bounds,
                size = v(-(bounds.min.x-bounds.max.x),-(bounds.min.y-bounds.max.y))
            this.ctx.fillStyle = color

            this.ctx.fillRect(bounds.min.x,bounds.min.y,size.x,size.y)
        }*/
    }
    
    
}

function renderCheckLoop() {
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        player.updatePlayerParts()


    }
}
