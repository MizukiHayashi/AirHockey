var fs = require("fs");

var index = fs.readFileSync(__dirname + "/game.html");
var backgroundImg = fs.readFileSync(__dirname + "/Images/background.png");
var userPaddleImg = fs.readFileSync(__dirname + "/Images/userPaddle.png");
var enemyPaddleImg = fs.readFileSync(__dirname + "/Images/enemyPaddle.png");
var puckImg = fs.readFileSync(__dirname + "/Images/puck.png");
var item_PaddleScale = fs.readFileSync(__dirname + "/Images/paddleScale.png");
var item_PuckScale = fs.readFileSync(__dirname + "/Images/puckScale.png");
var item_PuckSpeed = fs.readFileSync(__dirname + "/Images/puckSpeed.png");

var router = function(request, response){
  switch (request.url) {
    case '/':
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(index);
      break;
    case '/favicon.ico':
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
    case '/Images/paddleScale.png':
      response.writeHead(200, {"Content-Type": "image/gif"});
      response.write(item_PaddleScale);
      break;
    case '/Images/puckScale.png':
      response.writeHead(200, {"Content-Type": "image/gif"});
      response.write(item_PuckScale);
      break;
    case '/Images/puckSpeed.png':
      response.writeHead(200, {"Content-Type": "image/gif"});
      response.write(item_PuckSpeed);
      break;
  }
  response.end();
};

module.exports = router;
