class Client {
    constructor(game, player) {
        this.game = game

        this.mainPlayer = player

        this.roomConn;
        this.mainConn;

        this.recentPing = 0

        let name = localStorage.getItem("username")
        name = name||"unnamed"
        this.username = name
    }
    init(roomId) {
        this.roomConn = new Connection2W()
        this.roomConn.connect(roomId)

        this.roomConn.e.onData = (d)=>{
            this.processData(d)
        }

        this.roomConn.e.onConnectionFail = ()=>{
            console.log("retrying")
            this.init(roomId)
            

        }
    }

    processData(d,rd) {
        d = JSON.parse(d)
        
        if (true) {
            if (d.reconnectToThis) {
                this.mainConn = new Connection2W()
                this.mainConn.connect(d.reconnectToThis)
                this.mainConn.e.onData = (d, rd)=>{
                    this.processData(d,rd)
                }
                this.mainConn.e.onConnection = ()=>{
                    this.mainConn.send(JSON.stringify({
                        setUsername:this.username
                    }))
                }
            }
            if (d.playerData) {
                this.updateHostPlayers(d.playerData)
            }
            if (d.syncData&&mainGame.running) {
                this.game.syncHandler.processSyncData(d.syncData)
            }
            if (d.setColor) {
                this.mainPlayer.color = d.setColor
            }
            if (d.startGame) {
                startGame()
            }
            if (d.setLevel) {
                this.game.renderer.levelTransistion(d.setLevel)
                
            }
            if (d.restartLevel) {
                this.game.levelHandler.setLevel(mainGame.levelHandler.currentLevel.name)
                
            }
        }
    }
    updateKey(keycode, value) {
        this.mainConn.send(JSON.stringify({
            keycode:{
                code:keycode,
                value:value,
            }
        }))
    }
    updateHost() {
        if (this.mainConn !=undefined&&this.mainConn.fullyConnected) this.mainConn.send(JSON.stringify({
            player:parsePlayerData(this.mainPlayer)
        }))
    }
    updateHostPlayers(players) {
        var findPlayerById = (id) => {
            for (let i = 0; i < this.game.players.length; i++) {
                const player = this.game.players[i];
                if (player.body.id == id) return player
            }
        }
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            var playerId = player.id

            var foundPlayer = findPlayerById(playerId)
                if (foundPlayer==undefined) {

                    foundPlayer = mainGame.playerhandler.addPlayer({
                        bodyOptions:{
                            id:player.id,
                        },
                    })
                    foundPlayer.onlinePlayer = true
                } else {

                }

                if (foundPlayer.body.id!=this.mainPlayer.body.id||true) {
                    this.setPlayer(foundPlayer, player)
                }
            
        }
    }
    setPlayer(body, data) {
        setPlayerWithData(body, data)
    }
}