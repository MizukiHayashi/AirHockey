var http = require("http");
var socketio = require("socket.io");
var router = require("./router.js");
var gameManager = require("./gameManager.js");
var port = 3001;

var curRoomNum = 1;

var app = http.createServer(router).listen(port);
console.log("HTTP server started, listening on port" + port);

var io = socketio(app);
var users = [];
var userQueue = [];
var currentGames = [];

function createGame(){
  var roomName = "room" + curRoomNum;

  ++curRoomNum;

  userQueue[0].roomName = roomName;
  userQueue[1].roomName = roomName;
  userQueue[0].join(roomName);
  userQueue[1].join(roomName);

  var newGame = new gameManager(roomName, io, userQueue[0], userQueue[1]);
  currentGames.push(newGame);

  userQueue.splice(0,2);
}

function cleanGames(){
  for (var i = 0; i < currentGames.length; ++i){
    var curr = currentGames[i];
    if(curr.gameComplete){
      currentGames.splice(currentGames.indexOf(curr),1);
    }
  }
}

var onJoined = function(socket){
  socket.on("join",function(data){
    if(users[data.name]){
      socket.emit("msg",{msg: "既に使用されています。他のに変更してください。"});
      return;
    }

    socket.name = data.name;
    users[data.name] = socket.name;
    userQueue.push(socket);
    socket.emit("msg",{msg: "対戦相手を待っています"});
    socket.emit("接続完了");
    if(userQueue.length >= 2){
      socket.emit("接続完了");
      createGame();
    }
  });
};
var onDisconnect = function(socket){
  socket.on("disconnect",function(data){
    delete users[socket.name];
    delete userQueue[socket.name];
  });
};

io.sockets.on("connection",function(socket){
  onJoined(socket);
  onDisconnect(socket);
});
console.log("Websocket server started");

setInterval(cleanGames,1000);
