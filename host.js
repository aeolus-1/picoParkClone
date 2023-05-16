class Host {
    constructor(game) {
        this.game = game
        this.connections = []

        this.id = randChar()
        this.roomJoinOnline = false
        this.opening = true
    }
    init() {
        this.recycleJoinConn()
        setInterval(function(){
            if (window.hostConnection) {
                if (!(window.hostConnection.roomJoinOnline || window.hostConnection.opening)) {
                window.hostConnection.recycleJoinConn()
            }}
        })
    }
    recycleJoinConn() {
        this.joinConn = new Connection2W()
        this.joinConn.open(this.id)
        this.opening = true

        this.joinConn.e.onOpening = ()=>{
            this.roomJoinOnline = true
            this.opening = false

        }
        this.joinConn.e.onConnection = ()=>{
            var newConnection = this.openConnection()
            newConnection.e.onOpening = ()=>{
                this.joinConn.send(JSON.stringify({
                    reconnectToThis:newConnection.connS2T.lastPeerId,
                }))
                setTimeout(() => {
                    this.joinConn.terminate()
                }, 1000);

            }
            
        }
        this.joinConn.e.onDisconnection = ()=>{
            this.roomJoinOnline = false
        }


    }
    openConnection() {
        var connection = new Connection2W()

        connection.open()

        connection.e.onData = (d)=>{
            this.updateClientBody(JSON.parse(d).player)
        }
        /*
        connection.e.onOpening = function () {
            let self = this.connection
            console.log("opened joinConn on id: ",self.lastPeerId)
        }

        connection.initialize()
        */
       
        this.connections.push(connection)
        return connection
    }

    updateClientBody(data) {
        var findPlayerById = (id) => {
            for (let i = 0; i < this.game.players.length; i++) {
                const player = this.game.players[i];
                if (player.body.id == id) return player
            }
        }
        const player = data;
        var playerId = player.id
        console.log(data)
        var foundPlayer = findPlayerById(playerId)
        if (foundPlayer==undefined) {
            console.log(player.id)

            foundPlayer = mainGame.playerhandler.addPlayer({
                bodyOptions:{
                    id:player.id,
                },
            })
        } else {

        }

        Matter.Body.setPosition(foundPlayer.body, data.position)
        foundPlayer.direction = data.direction
    
    }
    

    updateClients() {
        for (let i = 0; i < this.connections.length; i++) {
            const conn = this.connections[i];
            if (conn.fullyConnected) conn.send(JSON.stringify(this.getPlayersData()))
        }
    }
    getPlayersData() {
        var returnOb = []
        for (let i = 0; i < this.game.players.length; i++) {
            returnOb.push(this.getPlayerData(this.game.players[i]))
            
        }

        return returnOb


    }
    getPlayerData(p) {
        return {
            id:p.body.id,
            position:p.body.position,
            direction:p.direction,
           
        }
    }
}