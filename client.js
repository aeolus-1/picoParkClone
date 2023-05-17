class Client {
    constructor(game, player) {
        this.game = game

        this.mainPlayer = player

        this.roomConn;
        this.mainConn;

        this.username = prompt("username?")
    }
    init(roomId) {
        this.roomConn = new Connection2W()
        this.roomConn.connect(roomId)

        this.roomConn.e.onData = (d)=>{
            this.processData(d)
        }
    }

    processData(d) {
        d = JSON.parse(d)
        if (d.reconnectToThis) {
            this.mainConn = new Connection2W()
            this.mainConn.connect(d.reconnectToThis)
            this.mainConn.e.onData = (d)=>{
                this.processData(d)
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
        if (d.setColor) {
            this.mainPlayer.color = d.setColor
        }
        if (d.startGame) {
            startGame()
        }
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
                    console.log(player.id)

                    foundPlayer = mainGame.playerhandler.addPlayer({
                        bodyOptions:{
                            id:player.id,
                        },
                    })
                    foundPlayer.onlinePlayer = true
                } else {

                }

                if (foundPlayer.body.id!=this.mainPlayer.body.id) {
                    this.setPlayer(foundPlayer, player)
                }
            
        }
    }
    setPlayer(body, data) {
        setPlayerWithData(body, data)
    }
}