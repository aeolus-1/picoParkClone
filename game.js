class Game {
    constructor(options) {
        options = {
            ...options,
        }

        this.mobile = []
        this.players = []

        this.matter = new MatterHandler(this)
        this.playerhandler = new PlayerHandler(this)
        this.levelHandler = new LevelHandler(this)
        this.renderer = new Renderer(this)

        this.updateMobiles = function(self){
            self.playerhandler.updatePlayers()
        }
    }

    

    initRender() {
        this.renderer.init()
    }
    initPhysics() {
        this.matter.init()
        Matter.Events.on(this.matter.engine, "beforeUpdate", ()=>{this.updateMobiles(this)})

    }

    testInit() {
        this.initPhysics()
            //addBody(v(0,500),v(2000,50),{isStatic:true,render:levelRender})
        this.playerhandler.addPlayer({
            controls:["arrowleft","arrowright","arrowup","arrowdown"],
            keys:keys,
        }) 
        this.playerhandler.addPlayer({
            controls:["j","l","i","k"],
            color:"green",
        }) 
        this.playerhandler.addPlayer({
            controls:["a","d","w","s"],
            color:"orange",
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
        }) 

        this.levelHandler.loadLevel(levels.one)
    }
}