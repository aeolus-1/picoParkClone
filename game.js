class Game {
    constructor(options) {
        options = {
            ...options,
        }

        this.mobile = []
        this.players = []
        this.constraints = []

        this.matter = new MatterHandler(this)
        this.playerhandler = new PlayerHandler(this)
        this.levelHandler = new LevelHandler(this)
        this.renderer = new Renderer(this)
        this.constraintHandler = new ConstraintHandler(this)

        this.updateMobiles = function(self){
            self.playerhandler.updatePlayers()
            self.constraintHandler.updateConstraints()
        }

        this.currentColor = 0
    }

    

    initRender() {
        this.renderer.init()
    }
    initPhysics() {
        this.matter.init()
        Matter.Events.on(this.matter.engine, "beforeUpdate", ()=>{this.updateMobiles(this)})

    }

    fetchColor() {
        var colors = Object.keys(colorMods)
        this.currentColor+=1
        return colors[this.currentColor%colors.length]
    }

    testInit() {
        this.initPhysics()
            //addBody(v(0,500),v(2000,50),{isStatic:true,render:levelRender})
        
        /*
        
        this.playerhandler.addPlayer({
            controls:["a","d","w","s"],
            color:"orange",
        }) 
        

        this.playerhandler.addPlayer({
            controls:["j","l","i","k"],
            color:"green",
        }) 
        
    
        this.playerhandler.addPlayer({
            
            color:"pink",
        }) 
        this.playerhandler.addPlayer({
            color:"purple",
        }) 
        this.playerhandler.addPlayer({
            color:"gray",
        }) 
        
        this.playerhandler.addPlayer({
            color:"blue",
        }) 
        this.playerhandler.addPlayer({
            color:"yellow",
        }) */

        this.levelHandler.loadLevel(levels.one)

        //this.bindPlayers(this.players)
    }

    bindPlayers(players) {
        for (let i = 0; i < players.length-1; i++) {
            const player = players[i];
            this.constraintHandler.addConstraint({
                bodyA:players[i],
                bodyB:players[i+1],
            })
            this.constraintHandler.addConstraint({
                bodyB:players[i],
                bodyA:players[i+1],
            })
        }
        
                
    }
}