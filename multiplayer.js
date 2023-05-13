class Connection {
  constructor(id=null) {
    this.lastPeerId = null;
    this.peer = null; // Own peer object
    this.peerId = null;
    this.conn = null;
    this.vanityId = id

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
      console.log(this);
      // Workaround for peer.reconnect deleting previous id
      if (this.id === null) {
        console.log("Received null id from peer open");
        this.id = this.connection.lastPeerId;
      } else {
        this.connection.lastPeerId = this.id;
      }

      
      console.log("Awaiting connection...");
      if (this.connection.joining) {
          console.log("atemping to join ",this.connection.joining)
        this.connection.join(this.connection.joining);
      } else {
        if (this.connection.isBuffer) {
          console.log("send reply buffer");
          clientConnection.conn.send("buffer " + this.id);
        }
      }
    });
    this.peer.on("connection", function (c) {
      console.log("connected");
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
      

      console.log("Connected to: " + this.connection.conn.peer);

      this.connection.ready();
    });
    this.peer.on("disconnected", function () {
      console.log("Connection lost. Please reconnect");
      this.connection.online = false;
      // Workaround for peer.reconnect deleting previous id
      this.id = this.connection.lastPeerId;
      this._lastServerId = this.connection.lastPeerId;
      this.reconnect();
    });
    this.peer.on("close", function () {
      this.connection.conn = null;
      this.connection.online = false;
      console.log("Connection destroyed");
    });
    this.peer.on("error", function (err) {
      console.log(err);
      alert("" + err);
    });
  }
  ready() {
    this.conn.on("data", function (data) {
        console.log(data)
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
        console.log("Connected to: " + this.peer);
      
      
      
      
      if (this.connection.addBuffer) {
        this.connection.buffer()
      } else {
        console.log("connection by buffer")
        this.send("yay")
      }
      
      //this.online = true;
      /*this.conn.on("data", function (data) {
        this.connection.receiveMultiplayerData(data);
      });*/

    });

    
    
  }
}