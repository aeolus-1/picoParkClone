class Host {
    constructor(game) {
        this.game = game
        this.connections = []
        let wordsf = words.filter(a=>{return a.length==4})
        this.id = wordsf[randInt(0, wordsf.length)].toUpperCase()
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
    broadcast(data) {
        for (let i = 0; i < this.connections.length; i++) {
            const conn = this.connections[i];
            conn.send(data)
        }
    }
    recycleJoinConn() {
        this.joinConn = new Connection2W()
        this.joinConn.open(this.id)
        this.opening = true

        this.joinConn.e.onOpening = ()=>{
            this.roomJoinOnline = true
            this.opening = false
            setRoomCode(this.joinConn.selfId)

        }
        this.joinConn.e.onConnection = ()=>{
            document.getElementById("incoming").textContent = " (incoming connection)"

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
            this.recycleJoinConn()
            

        }


    }
    closeConnection(conn) {
        for (let i = 0; i < this.connections.length; i++) {
            const conn2 = this.connections[i];
            if(conn.selfId==conn2.selfId) {
                conn.unloaded = true
                this.connections.splice(i,1)
                break
            }
        }
    }
    openConnection() {
        var connection = new Connection2W()

        connection.open()

        connection.e.onData = (d)=>{
            d = JSON.parse(d)
            if (d.player) {
                connection.player = this.updateClientBody(d.player, connection)
            }
            if (d.setUsername) {
                connection.clientUsername = d.setUsername
                addPlayerToMenu(d.setUsername)
            }
        }
        connection.e.onConnection = (d)=>{
            document.getElementById("incoming").textContent = ""
           
            //addPlayerToMenu("yay")
        }
        connection.e.onClose = (d)=>{
            console.log(connection)
            connection.player.color = "red"
            connection.player.unload()
            this.closeConnection(connection)

           
            //addPlayerToMenu("yay")
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

    updateClientBody(data, conn) {
        var findPlayerById = (id) => {
            for (let i = 0; i < this.game.players.length; i++) {
                const player = this.game.players[i];
                if (player.body.id == id) return player
            }
        }
        const player = data;
        var playerId = player.id
        var foundPlayer = findPlayerById(playerId)
        if (foundPlayer==undefined) {
            

            foundPlayer = mainGame.playerhandler.addPlayer({
                bodyOptions:{
                    id:player.id,
                },
                color:this.game.fetchColor(),
            })
            foundPlayer.onlinePlayer = true
        } else {

        }
        conn.clientBody = foundPlayer

        foundPlayer.conn = conn
        foundPlayer.keys = data.keys

        return foundPlayer
    
    }
    

    updateClients() {
        for (let i = 0; i < this.connections.length; i++) {
            const conn = this.connections[i];
            if (conn.fullyConnected) {
                conn.send(
                    JSON.stringify({
                        playerData:this.getPlayersData(),
                        syncData:this.game.syncHandler.getSyncData(),
                    })
                )
            }
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
        return parsePlayerData(p)
    }
}