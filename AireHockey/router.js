var fs = require("fs");

var index = fs.readFileSync(__dirname + "/Title.html");
var game = fs.readFileSync(__dirname + "/game.html");
var backgroundImg = fs.readFileSync(__dirname + "/Images/background.png");
var userPaddleImg = fs.readFileSync(__dirname + "/Images/userPaddle.png");
var enemyPaddleImg = fs.readFileSync(__dirname + "/Images/enemyPaddle.png");
var puckImg = fs.readFileSync(__dirname + "/Images/puck.png");
var item_PuckScale = fs.readFileSync(__dirname + "/Images/puckScale.png");
var item_PuckSpeed = fs.readFileSync(__dirname + "/Images/puckSpeed.png");
var titleBack = fs.readFileSync(__dirname + "/Images/TitleBack.png");
var titleBack2 = fs.readFileSync(__dirname + "/Images/TitleBack2.png");
var titlebgm = fs.readFileSync(__dirname + "/Sounds/titlebgm.mp3");
var titlese = fs.readFileSync(__dirname + "/Sounds/titlese.mp3");

var router = function(request, response){
  switch (request.url) {
    case '/':
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(index);
      break;
    case '/game.html':
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(game);
      break;
    case '/Images/background.png':
      response.writeHead(200, {"Content-Type": "image/gif"});
      response.write(backgroundImg);
      break;
    case '/Images/userPaddle.png':
      response.writeHead(200, {"Content-Type": "image/gif"});
      response.write(userPaddleImg);
      break;
    case '/Images/enemyPaddle.png':
      response.writeHead(200, {"Content-Type": "image/gif"});
      response.write(enemyPaddleImg);
      break;
    case '/Images/puck.png':
      response.writeHead(200, {"Content-Type": "image/gif"});
      response.write(puckImg);
      break;
    case '/Images/puckScale.png':
      response.writeHead(200, {"Content-Type": "image/gif"});
      response.write(item_PuckScale);
      break;
    case '/Images/puckSpeed.png':
      response.writeHead(200, {"Content-Type": "image/gif"});
      response.write(item_PuckSpeed);
      break;
    case '/Images/TitleBack.png':
      response.writeHead(200, {"Content-Type": "image/gif"});
      response.write(titleBack);
      break;
    case '/Images/TitleBack2.png':
      response.writeHead(200, {"Content-Type": "image/gif"});
      response.write(titleBack2);
      break;
    case '/Sounds/titlebgm.mp3':
      response.writeHead(200, {"Content-Type": "sound/mp3"});
      response.write(titlebgm);
      break;
    case '/Sounds/titlese.mp3':
      response.writeHead(200, {"Content-Type": "sound/mp3"});
      response.write(titlese);
      break;
  }
  response.end();
};

module.exports = router;
