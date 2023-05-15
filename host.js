class Host {
    constructor(game) {
        this.game = game
        this.connections = []
    }
    init() {
        this.roomJoinConn = this.openConnection()
    }
    openConnection(id=randChar()) {
        var connection = new Connection2W()

        connection.open(id)
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
}