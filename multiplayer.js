class Connection {
  constructor(id=null) {
    this.lastPeerId = null;
    this.peer = null; // Own peer object
    this.peerId = null;
    this.conn = null;
    this.vanityId = id

    this.e = {
      connection:this,
      onConnection:()=>{},
      onOpening:()=>{},
      onDisconnection:()=>{},
      onData:()=>{},
    }

    this.send = (d)=>{
      this.conn.send(d)
    }

    this.online = false;
    this.joining = undefined;
  }
  initialize(id=null) {
      this.joining = id
    // Create own peer object with connection to shared PeerJS server
    this.peer = new Peer(this.vanityId, {
      debug: 2,
    });

    this.peer.connection = this;

    this.peer.on("open", function (id) {
      // Workaround for peer.reconnect deleting previous id
      if (this.id === null) {
        this.id = this.connection.lastPeerId;
      } else {
        this.connection.lastPeerId = this.id;
      }

      
      if (this.connection.joining) {
        this.connection.join(this.connection.joining);
      } else {
        if (this.connection.isBuffer) {
          //clientConnection.conn.send("buffer " + this.id);
        }
      }
      this.connection.e.onOpening()  
    });
    this.peer.on("connection", function (c) {
      // Allow only a single connection
      this.connection.online = true;

      if (this.connection.conn && this.connection.conn.open) {
        c.on("open", function () {
          c.send("Already connected to another client");
          setTimeout(function () {
            c.close();
          }, 500);
        });
        return;
      }

      this.connection.conn = c;
      this.connection.conn.connection = this.connection;
      

      this.connection.e.onConnection()

      this.connection.ready();

    });
    this.peer.on("disconnected", function () {
      this.connection.e.onDisconnection()
      this.connection.online = false;
      // Workaround for peer.reconnect deleting previous id
      this.id = this.connection.lastPeerId;
      this._lastServerId = this.connection.lastPeerId;
      this.reconnect();
    });
    this.peer.on("close", function () {
      this.connection.conn = null;
      this.connection.online = false;
    });
    this.peer.on("error", function (err) {
      alert("" + err);
    });
    
  }
  ready() {
    this.conn.on("data", function (data) {
        this.connection.e.onData(data)
    });
    this.conn.on("close", function () {
      this.conn = null;
    });
  }
  join(id) {
    

    // Create connection to destination peer specified in the input field
    this.conn = this.peer.connect(id, {
      reliable: true,
    });
    this.conn.connection = this
    //this.conn.connection = this;

    this.conn.on("open", function () {
      
        this.connection.e.onConnection()

      
      
      
      
      //this.online = true;
      /*this.conn.on("data", function (data) {
        this.connection.receiveMultiplayerData(data);
      });*/

    });

    
    
  }
}

class Connection2W {
  constructor() {
    this.connS2T;
    this.connT2S;
    this.selfId;
    this.fullyConnected = false;
  }
  open(id=null, twC=false) {
    this.selfId = id
    this.connS2T = new Connection(id)
    this.connS2T.twC = this
    this.connS2T.initialize()
    this.connS2T.e.onOpening=function(){
      console.log("opened joinConn on id: ",this.connection.lastPeerId)
      

    }
    if (twC) {

      this.connS2T.e.onConnection=function(){
        this.connection.twC.fullyConnected = true
        console.log("fullyConnected")
      }


    }

    this.connS2T.e.onData=function(d) {
      let self = this.connection.twC
      self.processData(d)
    }
    
  }
  connect(id, twC=false) {
    this.connT2S = new Connection()
    this.connT2S.twC = this
    this.connT2S.initialize(id)
    if (!twC) {
        this.connT2S.e.onConnection=function(){
        this.connection.twC.open(null, true)
        this.connection.twC.connS2T.e.onOpening=function(){
          var newId = this.connection.twC.connS2T.lastPeerId
          this.connection.twC.connT2S.send(JSON.stringify({
            connectToNow:newId,
            content:{},
          }))

        }

      }
    } else {
      
      this.connT2S.e.onConnection=function(){
        this.connection.twC.fullyConnected = true
        console.log("fullyConnected")

      }
    }


  }
  
  processData(d) {
    d = JSON.parse(d)
    if (d.connectToNow) {
      this.connect(d.connectToNow, true)
    } else {
      console.log(d.content)
    }
  }


  send(d) {
    if (this.fullyConnected) {
      this.connT2S.send(JSON.stringify({
        content:d,
      }))
    } else {
      console.error("2 way not fully connected")
    }
  }


}