class Renderer {
    constructor(game) {
        this.game = game

        this.canvas = document.getElementById("c")
        this.ctx = this.canvas.getContext("2d")

        this.resizeCanvas()
        this.lastFPS = (new Date()).getTime()
        this.fps = 0

        this.offset = v()
        this.levelBounds = {pos:v(),size:v(100,100)}

        this.transistionSpeed = (localfile)?0.1:1

        this.fadeValue = 1
        this.displayedTitle = ""
        
        this.globalScale = 1
        this.border = 80

        this.debug = localfile
        window.onresize = ()=>{this.resizeCanvas()}
    }
    async levelTransistion(nextLevel) {
        await this.setFade(1, 1000)
        await this.wait(300)
        this.game.levelHandler.setLevel(nextLevel)
        await this.showTitle("-- "+nextLevel+" --", 1000)
        await this.setFade(0, 1000)
        

    }
    async wait(time) {
        return new Promise((resolve)=>{
            setTimeout(() => {
                resolve("done")
            }, time*this.transistionSpeed);
        })
    }
    async setFade(targetFade, time=10) {
        return new Promise((resolve, reject) => {
            var startTime = (new Date()).getTime(),
                startValue = this.fadeValue,
                dst = targetFade-this.fadeValue,
                int = setInterval(() => {
                    let currentTime = ((new Date()).getTime())-startTime,
                        timePer = currentTime/(time*this.transistionSpeed)

                    this.fadeValue = startValue+(dst*timePer)
                    //console.log(timePer)


                    if (currentTime>(time*this.transistionSpeed)) {
                        resolve("done")
                        clearInterval(int)
                    }
            }, 1000/60);
            
          });
    }
    async showTitle(text, time) {
        this.displayedTitle = ""
        return new Promise((resolve, reject) => {
            this.displayedTitle = text
            setTimeout(() => {
                resolve("done")
            
            
            }, time*this.transistionSpeed)
        })
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        if (this.levelBounds!=undefined) {
            let minScale = Math.min(
                    (this.canvas.width/(this.levelBounds.size.x+(this.border))),
                    (this.canvas.height/(this.levelBounds.size.y+(this.border)))
                )
                
            this.globalScale = minScale
        }
    }

    init() {
        requestAnimationFrame(()=>{this.renderLoop(this)})
    }
    clearCanvas() {
        this.canvas.width = this.canvas.width
    }

    renderLoop(self) {
        let averageStrength = 50,
            currentFps = (new Date()).getTime()-self.lastFPS
        if(currentFps<100) self.fps = ((self.fps*averageStrength)+currentFps)/(averageStrength+1)
        
        self.clearCanvas()
        self.renderBackground()
        self.ctx.save()
        self.ctx.translate(((self.offset.x)*this.globalScale)+(window.innerWidth*0.5),((self.offset.y)*this.globalScale)+(window.innerHeight*0.5))
        self.ctx.scale(this.globalScale,this.globalScale)
        self.renderLevel(self.game.levelHandler)
        self.renderConstraints()

        

        for (let i = 0; i < self.game.players.length; i++) {
            const player = self.game.players[i];
            self.renderPlayer(player)
        }

        self.renderEntities()
        
        if (self.debug) self.renderTriggers()
        if (self.debug) {
            self.ctx.strokeStyle = "#f0f"

            let boundsRect = self.levelBounds
            self.ctx.strokeRect(
                boundsRect.pos.x-5,
                boundsRect.pos.y-5,
                boundsRect.size.x+10,
                boundsRect.size.y+10
                )

        }
        self.ctx.restore()

        if (self.debug) self.renderDebug()

        self.renderEffects()

        self.lastFPS = (new Date()).getTime()
        requestAnimationFrame(()=>{self.renderLoop(self)})
    }
    renderEffects() {
        let fade = Math.max(Math.min(this.fadeValue,1),0)
        this.ctx.globalAlpha = fade
        this.ctx.fillStyle = `rgb(255,255,255)`
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
        this.renderTitle()
    }
    renderTitle() {
        this.ctx.fillStyle = "#c47418"
        this.ctx.font = "30px squareforced"
        let measure = this.ctx.measureText(this.displayedTitle)
        this.ctx.fillText(this.displayedTitle, (window.innerWidth/2)-(measure.width*0.5),window.innerHeight/2)
    }

    renderPlayer(player) {
        this.ctx.save()
        var playerPos = player.body.position
        this.ctx.translate(playerPos.x,playerPos.y)
        this.ctx.scale(player.direction,1)
        this.ctx.scale(player.scale,player.scale)
        this.ctx.translate(-playerPos.x,-playerPos.y)
        let frame = drawSprite(this, player)
    
        this.ctx.restore()
        this.ctx.fillStyle = "#f0f"
        if (this.debug) {
            this.ctx.fillText(frame, playerPos.x+(spriteSize.x*0.5)+5,playerPos.y-(spriteSize.y*0.5))
            if (player.conn) {
                this.ctx.fillText(player.conn.clientUsername, playerPos.x,playerPos.y-(spriteSize.y*0.5)-10)
            }
            this.ctx.save()
            this.ctx.beginPath()
            let centerPos = v(player.body.position.x,player.body.position.y+(spriteSize.y*0.5))
            this.ctx.translate(centerPos.x,centerPos.y)
            this.ctx.scale(1.45,0.5)
            this.ctx.translate(-centerPos.x,-centerPos.y)
            this.ctx.arc(centerPos.x,centerPos.y,spriteSize.x*0.25,0,Math.PI*2)

            this.ctx.stroke()
            if(player.onGround()) this.ctx.fill()
            this.ctx.closePath()
            this.ctx.restore()
        }
        if (player.laserShields.length>0) {
            for (let i = 0; i < player.laserShields.length; i++) {
                const sh = player.laserShields[i];
                if (sh!=undefined) {
                this.ctx.save()
                let laserShield = sh.position
                this.ctx.translate(laserShield.x,laserShield.y)
                this.ctx.rotate((sh.shieldAngle*Math.PI*0.5)%(Math.PI*2))
                this.ctx.translate(-laserShield.x,-laserShield.y)
                this.ctx.drawImage(levelAtlas, 
                    108,1368,
                    30,222,
                    sh.position.x-5,sh.position.y-(75/2), 10,75
                    )

                this.ctx.restore()
                }
            }
            

        }

    }
    renderConstraints() {
        for (let i = 0; i < this.game.constraints.length; i++) {
            const con = this.game.constraints[i];
            if (!con.bodyA.ready&&!con.bodyB.ready) {
                this.ctx.beginPath()
                this.ctx.moveTo(con.bodyA.body.position.x,con.bodyA.body.position.y)
                this.ctx.lineTo(con.bodyB.body.position.x,con.bodyB.body.position.y)
                this.ctx.stroke()
                this.ctx.closePath()
            }
            
        }
    }
    renderBackground() {
        var grad = this.ctx.createLinearGradient(window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight)
        
        grad.addColorStop(1,"rgb(255,226,24)")
        grad.addColorStop(0,"rgb(255,176,23)")
        this.ctx.fillStyle = grad
        this.ctx.fillRect(0,0,window.innerWidth,window.innerHeight)
    }
    renderButtons() {
        var cellsize = this.game.levelHandler.currentLevel.cellsize

        for (let i = 0; i < this.game.buttons.length; i++) {
            const but = this.game.buttons[i];
            //console.log(but.trigger)
            if (but.trigger.playerInside) {
                this.ctx.drawImage(levelAtlas, 
                    600,535,
                    161,161,
                    (but.pos.x-0.5)*cellsize.x,(but.pos.y-0.5)*cellsize.y,cellsize.x,cellsize.y)
            } else {
                this.ctx.drawImage(levelAtlas, 
                    389,535,
                    161,161,
                    (but.pos.x-0.5)*cellsize.x,(but.pos.y-0.5)*cellsize.y,cellsize.x,cellsize.y)
                }
            
        }
    }
    renderJumppads() {
        for (let i = 0; i < this.game.jumppads.length; i++) {
            const jp = this.game.jumppads[i];
            let pos = jp.pos,
                cellsize = v(50,50)
            this.ctx.fillStyle = "#f50"
            let heightDiff = (
                Math.sin((((new Date()).getTime()+jp.id)/50))*25
            )
            this.ctx.fillRect(((pos.x-0.5)*cellsize.x),((pos.y-0.5)*cellsize.y)-heightDiff,cellsize.x,cellsize.y+heightDiff)
            
        }
    }
    renderBlocks() {
        for (let i = 0; i < this.game.blocks.length; i++) {
            const boc = this.game.blocks[i];
            let size = v(
                boc.size.x*50,
                boc.size.y*50,
            )
                

            for (let x = 0; x < boc.size.x; x++) {
                for (let y = 0; y < boc.size.y; y++) {
                    
                    let bocPos = v((boc.rect.position.x-(size.x*0.5))+(x*50),(boc.rect.position.y-(size.y*0.5))+(y*50))
                    this.ctx.drawImage(levelAtlas, 
                        655,196,
                        161,161,
                        bocPos.x,bocPos.y,50,50
                        )

                    
                }                
            }
            let text = Math.max(boc.playersNeeded(),0),
                textPos = boc.rect.position
            if (text>0) {
                this.ctx.fillStyle = "#c47418"
                this.ctx.font = "30px squareforced"
                let measure = this.ctx.measureText(text)

                this.ctx.strokeStyle = "#fff"
                this.ctx.lineWidth = 3.5
                this.ctx.strokeText(text, textPos.x-(measure.width*0.5),textPos.y)
                this.ctx.fillText(text, textPos.x-(measure.width*0.5),textPos.y)
            }



        }
    }
    renderDoors() {
        var cellsize = this.game.levelHandler.currentLevel.cellsize

        for (let i = 0; i < this.game.doors.length; i++) {
            const but = this.game.doors[i];
            //console.log(but.trigger)
            if (but.open) {
                this.ctx.drawImage(levelAtlas, 
                    591,885,
                    161*2.5,161*2.5,
                    (but.pos.x-1.5)*cellsize.x,(but.pos.y-2.5)*cellsize.y,cellsize.x*2,cellsize.y*2)
            } else {
                this.ctx.drawImage(levelAtlas, 
                    111,885,
                    161*2.5,161*2.5,
                    (but.pos.x-1.5)*cellsize.x,(but.pos.y-2.5)*cellsize.y,cellsize.x*2,cellsize.y*2)
                }
            
        }
    }
    renderTriggers() {
        for (let i = 0; i < this.game.triggers.length; i++) {
            const trig = this.game.triggers[i];
            this.ctx.strokeStyle = "#f00"
            var bounds = trig.rect.bounds,
                    size = v(-(bounds.min.x-bounds.max.x),-(bounds.min.y-bounds.max.y))
            if (!trig.norender) this.ctx.strokeRect(bounds.min.x,bounds.min.y, size.x,size.y)
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
                    if (cell) {
                        if (!levelData[Math.max(x-1,0)][y]) {
                            this.ctx.drawImage(
                                levelAtlas,
                                126,194,
                                161,161,
                                (y-0.5)*cellsize.x,(x-0.5)*cellsize.y,cellsize.x,cellsize.y
                            )
                        } else{
                            this.ctx.drawImage(
                                levelAtlas,
                                389,191,
                                161,161,
                                (y-0.5)*cellsize.x,(x-0.5)*cellsize.y,cellsize.x,cellsize.y
                            )
                        }
                    }
                }
            }
        }
        this.renderDoors()
        this.renderBlocks()

        this.renderButtons()

        this.renderJumppads()

        this.renderParticles()
        this.renderLasers()

        if(this.debug) {
            var bodies = Matter.Composite.allBodies(this.game.matter.engine.world)
            for (let i = 0; i < bodies.length; i++) {
                const bod = bodies[i];
                var bounds = bod.bounds,
                    size = v(-(bounds.min.x-bounds.max.x),-(bounds.min.y-bounds.max.y))
                this.ctx.strokeStyle = "#f0f"
                this.ctx.lineWidth = 2

                this.ctx.strokeRect(bounds.min.x,bounds.min.y,size.x,size.y)
            }
        }


    }
    renderParticles() {
        let parts = this.game.particleHandler.particles
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            let image = part.image
            this.ctx.drawImage(image.img, image.pos.x,image.pos.y,image.size.x,image.size.y,part.body.position.x-15,part.body.position.y-15, 30,30)
        }
    }
    renderLasers() {
        for (let i = 0; i < this.game.lasers.length; i++) {
            const laser = this.game.lasers[i];
            let points = laser.cal()
            if (laser.enabled) this.renderLaser(points.start, points.end)
        }
    }
    renderLaser(start, end) {
        
        var angle = -getAngle(start, end)-(Math.PI*0.5)
            length = getDst(start, end)

        var laser = {
            startPos:v(start.x,start.y),
            length:length+62,
            angle:angle,
        },
            laserStart = {
                origin:v(0,4),
                size:v(36,92)
            },
            laserSeg = {
                origin:v(57,0),
                size:v(100,100)
            },
            laserEnd = {
                origin:v(170,1),
                size:v(64,99)
            }

            this.ctx.save()

        this.ctx.translate(laser.startPos.x,laser.startPos.y)
        this.ctx.rotate(angle)
        this.ctx.scale(1, 0.5)
        this.ctx.translate(-laser.startPos.x,-laser.startPos.y)

        let segLength = laser.length-(laserStart.size.x)-(laserEnd.size.x)

        let startCen = v(laserStart.size.x*0.5,laserStart.size.y*0.5)
        this.ctx.drawImage(laserAtlas, 
            laserStart.origin.x,laserStart.origin.y,laserStart.size.x,laserStart.size.y,
            laser.startPos.x-(startCen.x),laser.startPos.y-(startCen.y), laserStart.size.x,laserStart.size.y
            )
        
        let segCen = v(laserSeg.size.x*0.5,laserSeg.size.y*0.5)
        this.ctx.drawImage(laserAtlas, 
            laserSeg.origin.x,laserSeg.origin.y,laserSeg.size.x,laserSeg.size.y,
            (laser.startPos.x+laserStart.size.x-startCen.x)-1.5,laser.startPos.y-segCen.y, segLength,laserSeg.size.y
            )
        let endCen = v(laserEnd.size.x*0.5,laserEnd.size.y*0.5)
        this.ctx.drawImage(laserAtlas, 
            laserEnd.origin.x,laserEnd.origin.y,laserEnd.size.x,laserEnd.size.y,
            ((laser.startPos.x+laserStart.size.x-startCen.x)+segLength)-15,laser.startPos.y-endCen.y, laserEnd.size.x,laserEnd.size.y
            )

            this.ctx.restore()
    }
    renderEntities() {
        for (let i = 0; i < this.game.entities.length; i++) {
            const ent = this.game.entities[i];
            ent.render(this.ctx)
            if (ent.constructor.name=="Key"&&this.debug) {
                if (!ent.targetedDoor) {
                    this.ctx.beginPath()
                    this.ctx.arc(ent.pos.x,ent.pos.y,45,0,Math.PI*2)
                    this.ctx.strokeStyle = "#f00"
                    this.ctx.stroke()
                    this.ctx.closePath()

                    if (ent.followingPlayer) {
                        this.ctx.beginPath()

                        this.ctx.moveTo(ent.pos.x,ent.pos.y)
                        this.ctx.lineTo(ent.followingPlayer.body.position.x,ent.followingPlayer.body.position.y)
                        this.ctx.strokeStyle = "#00f"
                        this.ctx.stroke()
                        this.ctx.closePath()

                    }
                }
                
            }
        }
    }
    renderDebug() {
        
        var strings = [
            "break",
            "v69.420",
            "pico park clone | aeolus-1 on github",
                (new Date()),
                "break",
            ...((window.clientConnection)?([
                "--client connection--",

            `server connection: ${window.navigator.onLine}`,
            `fully connected: ${clientConnection.mainConn.fullyConnected}`,
            `ping: ${Math.floor(clientConnection.mainConn.lastPing*10)/10}ms`,
            ]):(window.hostConnection)?([
                "--host connection--",
                `connections: ${hostConnection.connections.length}`,
                ...(
                    function(){
                        var connections = hostConnection.connections,
                            mapConn = new Array(connections.length),
                                returnArray = []

                        for (let i = 0; i < mapConn.length; i++) {
                            const mA = mapConn[i];
                            if (mA) if (mA.clientBody) {
                                returnArray = [...returnArray,
                                    "step",
                                    `username: ${connections[i].clientUsername}`,
                                    `color: ${connections[i].clientBody.color}`,
                                    `id: ${connections[i].clientBody.body.id}`,
                                    `ping: ${Math.floor(connections[i].lastPing*10)/10}ms`,
                                    `S2T connected: ${connections[i].connS2T.peer._open}; T2S connected: ${connections[i].connT2S.peer._open}`
                                ]
                            }
                                
                            
                        }

                        return [...returnArray,]
                    }
                )(),
            ]):([
                "not multiplayer game",
                "step",
                "warm sandy beaches and ",
                "cocktails with the little straw hats",
            ])
            ),
            "break",
            "--matter--",
            `FPS: ${Math.floor(10000/mainGame.renderer.fps)/10}`,
            `bodies: ${Matter.Composite.allBodies(mainGame.matter.engine.world).length}`,
            "break",
            
        ],
            fontsize = 15,
            step = 0

        for (let i = 0; i < strings.length; i++) {
            const str = strings[i];
            if (str=="break") {
                step += fontsize*1
            } else if(str=="step"){
                step += fontsize*0.3
            } else {
                step += fontsize
                ;this.drawDebugText(v(0,step),str, fontsize)}
        }
        
    }
    drawDebugText(pos, string, fontsize) {
        this.ctx.fillStyle = "#000a"
        this.ctx.font = `${fontsize}px Times New Roman`
        var measure = this.ctx.measureText(string)
        

        this.ctx.fillRect(pos.x,pos.y+2,measure.width,(-fontsize))
        this.ctx.fillStyle = "#fff"

        this.ctx.fillText(string, pos.x, pos.y)
    }
    
    
}

function renderCheckLoop() {
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        player.updatePlayerParts()


    }
}

