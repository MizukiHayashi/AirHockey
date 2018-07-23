"user strict";

class GameManager{
  constructor(room, io, p1, p2){
    this.room = room;
    this.io = io;
    this.p1 = p1;
    this.p2 = p2;

    this.gameWidth=1280;
    this.gameHeight=720;

    this.gameComplete = false;
    this.gameActive = false;
    this.intervalOn = false;

    this.puck = {
      pos:{
        x:this.gameWidth/2,
        y:this.gameHeight/2
      },
      vel:{
        x:0,
        y:0
      },
      radius: 25
    };

    this.item = {
      itemCount: 0,
      itemNum: 0,
      pos:{
        x: this.randomv(this.gameWidth-50)+15,
        y: this.randomv(this.gameHeight-50)+15
      },
      vel:{
        x: 1,
        y: 1
      },
      radius: 15,
      alive: false
    };

    this.getItem = false;
    this.itemEfficacyTime = 1000;
    this.efficacyTimer = 0;
    this.itemInstTime = 1600;
    this.itemInstTimer = 0;

    this.p1.radius = this.p2.radius = 50;

    this.p1.score = this.p2.score = 0;

    this.onUpdate(p1);
    this.onUpdate(p2);

    this.p1.pos = {
      x: this.gameWidth * 0.75,
      y: this.gameHeight/2
    };

    this.p2.pos ={
      x: this.gameWidth * 0.25,
      y: this.gameHeight/2
    };

    this.io.sockets.in(this.room).emit("beginPlay");

    this.p1.emit(
      "updateInfo",
      {
        object: "otherUser",
        username: this.p2.name
      }
    );
    this.p1.emit(
      "msg",
      {
        msg: "対戦相手: " + this.p2.name + "."
      }
    );
    this.p1.side=0;

    this.p2.emit(
      "updateInfo",
      {
        object: "otherUser",
        username: this.p1.name
      }
    );
    this.p2.emit(
      "msg",
      {
        msg: "対戦相手: " + this.p1.name + "."
      }
    );
    this.p2.emit("updateInfo",{object: "user", side: 1});
    this.p2.side=1;

    this.notifyUsersMultiple(["5秒後に開始します","開始まで 3","2","1","開始！"],1000);
    this.activateGame(5000);
  }

  onUpdate(socket){
    socket.on("update", function(data){
      if(socket.pos){
        socket.prevPos = socket.pos;
      }
      else{
        socket.prevPos = data.pos;
      }
      socket.pos = data.pos;
      socket.broadcast.to(socket.roomName).emit("updateInfo",{object: "otherUser",pos: data.pos,radius: data.radius, time: new Date().getTime() });
    });
  }

  notifyUsers(msg, duration){
    this.io.sockets.in(this.room).emit("notify",{msg: msg, duration: duration});
  }

  notifyUsersMultiple(msgs,duration){
    for(var i=0; i<msgs.length; ++i){
      setTimeout(this.notifyUsers.bind(this), i*duration, msgs[i], duration);
    }
  }

  activateGame(delay){
    setTimeout(function(){
      if(this.intervalOn == false){
        setInterval(this.update.bind(this),1000/120);
        this.intervalOn=true;
      }
      this.gameActive = true;
    }.bind(this),delay);
  }

  deactiveGame(){
    this.gameActive = false;
  }

  distance(obj1, obj2){
    return Math.sqrt(Math.pow(obj2.pos.x - obj1.pos.x, 2) + Math.pow(obj2.pos.y - obj1.pos.y,2));
  }

  pointDistance(obj1, obj2){
    return Math.sqrt(Math.pow(obj2.x - obj1.x, 2) + Math.pow(obj2.y - obj1.y, 2));
  }

  vecSubtract(obj1, obj2){
    var vec = {
      x: obj2.pos.x - obj1.pos.x,
      y: obj2.pos.y - obj1.pos.y
    };

    var dist = this.distance(obj1, obj2);

    vec.x /= dist;
    vec.y /= dist;

    return vec;
  }

  update(){
    if(this.gameActive){
      var newPuckVel = {
        x: 0,
        y: 0
      };

      var p1Impulse;
      var p2Impulse;
      var spd;


      if(this.item.itemCount === 0){
        this.itemInstTimer++;
        //console.log(this.itemInstTimer);
      }
      if(this.item.itemCount === 0 &&   this.itemInstTimer >= this.itemInstTime){
        var itemRand = this.randomv(10);
        if(itemRand >= 5){
          this.item.itemNum = 0;
        }
        else{
          this.item.itemNum = 1;
        }
        this.item.pos.x = this.randomv(this.gameWidth-50)+15;
        this.item.pos.y = this.randomv(this.gameHeight-50)+15;
        this.item.vel.x = 1;
        this.item.vel.y = 1;
        this.item.alive = true;
        this.item.itemCount = 1;
        this.itemInstTimer = 0;
      }

      if(this.getItem == true){
        this.efficacyTimer++;
        if(this.efficacyTimer >= this.itemEfficacyTime){
          this.resetItemEfficacy();
          this.getItem = false;
          this.efficacyTimer = 0;
        }
      }

      if(this.distance(this.p1, this.puck)< this.p1.radius + this.puck.radius){
        spd = this.pointDistance(this.p1.prevPos, this.p1.pos);

        p1Impulse = this.vecSubtract(this.p1, this.puck);

        p1Impulse.x *= Math.min(1.75, 1 + Math.pow(spd, 1/5));
        p1Impulse.y *= Math.min(1.75, 1 + Math.pow(spd, 1/5));

        newPuckVel.x += p1Impulse.x;
        newPuckVel.y += p1Impulse.y;
      }

      if(this.distance(this.p2, this.puck)< this.p2.radius + this.puck.radius){
        spd = this.pointDistance(this.p2.prevPos, this.p2.pos);

        p2Impulse = this.vecSubtract(this.p2, this.puck);

        p2Impulse.x *= Math.min(1.75, 1 + Math.pow(spd, 1/5));
        p2Impulse.y *= Math.min(1.75, 1 + Math.pow(spd, 1/5));

        newPuckVel.x += p2Impulse.x;
        newPuckVel.y += p2Impulse.y;

      }

      if(this.distance(this.p1, this.item) < this.p1.radius + this.item.radius){
        switch (this.item.itemNum) {
          case 0:
            this.puck.radius = 35;
            this.destoryItem();
            break;
          case 1:
            this.puck.vel.x *= 1.2;
            this.puck.vel.y *= 1.2;
            this.destoryItem();
            break;
        }
        this.getItem = true;
      }

      if(this.distance(this.p2, this.item) < this.p2.radius + this.item.radius){
        switch (this.item.itemNum) {
          case 0:
            this.puck.radius = 35;
            this.destoryItem();
            break;
          case 1:
            this.puck.vel.x *= 1.2;
            this.puck.vel.y *= 1.2;
            this.destoryItem();
            break;
        }
        this.getItem = true;
      }

      if(p1Impulse || p2Impulse){
        this.puck.vel.x += newPuckVel.x;
        this.puck.vel.y += newPuckVel.y;
      }

      this.puck.pos.x += this.puck.vel.x;
      this.puck.pos.y += this.puck.vel.y;

      if(this.item.itemCount != 0){
        this.item.pos.x += this.item.vel.x;
        this.item.pos.y += this.item.vel.y;
        this.bounceItem();
      }

      this.bouncePuck();

      if(this.puckInGoakHeight()){
        this.puck.pos.x = this.clamp(this.puck.pos.x, this.puck.radius, this.gameWidth - this.puck.radius);
      }

      this.checkForPoint();

      this.puck.pos.y = this.clamp(this.puck.pos.y, this.puck.radius, this.gameHeight - this.puck.radius);

      this.puck.vel.x *= 0.9975;
      this.puck.vel.y *= 0.9975;

      if(Math.abs(this.puck.vel.x)<0.001){
        this.puck.vel.x =0;
      }
      if(Math.abs(this.puck.vel.y)<0.001){
        this.puck.vel.y =0;
      }
      this.io.sockets.in(this.room).emit("updateInfo",{
        object: "item",
        itemCount: this.item.itemCount,
        itemNum: this.item.itemNum,
        pos: this.item.pos,
        vel: this.item.vel,
        alive: this.item.alive,
        time: new Date().getTime()
      });

      this.io.sockets.in(this.room).emit("updateInfo",{
        object: "puck",
        pos: this.puck.pos,
        vel: this.puck.vel,
        radius: this.puck.radius,
        time: new Date().getTime()
      });
    }
    else{
      this.puck.vel = {x: 0, y: 0};
      this.puck.pos = {x: this.gameWidth/2, y: this.gameHeight/2};
      this.resetItemEfficacy();
      this.destoryItem();

      this.io.sockets.in(this.room).emit("updateInfo",{
        object: "puck",
        pos: this.puck.pos,
        vel: this.puck.vel,
        radius: this.puck.radius,
        time: new Date().getTime()
      });

      this.io.sockets.in(this.room).emit("updateInfo",{
        object: "item",
        itemCount: this.item.itemCount,
        itemNum: this.item.itemNum,
        pos: this.item.pos,
        vel: this.item.vel,
        alive: this.item.alive,
        time: new Date().getTime()
      });
    }
  }

  checkForPoint(){
    var goalScored = ((this.puck.pos.x < 0) || (this.puck.pos.x - this.puck.radius > this.gameWidth));

    if(goalScored){
      var side;
      if(this.puck.pos.x < 0){
        side = 0;
        ++this.p1.score;
      }
      else{
        side = 1;
        ++this.p2.score;
      }

      this.deactiveGame();

      this.io.sockets.in(this.room).emit("scorePoint",{side: side});

      this.puck.vel = {x: 0, y: 0};
      this.puck.pos = {x: this.gameWidth/2, y: this.gameHeight/2};

      this.io.sockets.in(this.room).emit("updateInfo",{
        object: "puck",
        pos: this.puck.pos,
        vel: this.puck.vel,
        radius: this.puck.radius
      });

      if(this.p1.score >= 10 || this.p2.score >= 10){
        this.notifyUsers("終了",-1);
        this.gameComplete = true;
      }
      else{
        this.notifyUsersMultiple(["開始まで 3","2","1","開始!"],500);
        this.activateGame(3000);
      }
    }
  }

  bouncePuck(){
    if((this.puck.pos.x - this.puck.radius < 0) || (this.puck.pos.x + this.puck.radius > this.gameWidth)){
      if(this.puckInGoakHeight()){
        this.puck.vel.x *= -1;
      }
    }

    if((this.puck.pos.y - this.puck.radius < 0) || (this.puck.pos.y + this.puck.radius > this.gameHeight)){
      this.puck.vel.y *= -1;
    }
  }

  bounceItem(item){
    if((this.item.pos.x - this.item.radius < 0) || (this.item.pos.x + this.item.radius > this.gameWidth)){
      this.item.vel.x *= -1;
    }

    if((this.item.pos.y - this.item.radius < 0) || (this.item.pos.y + this.item.radius > this.gameHeight)){
      this.item.vel.y *= -1;
    }
  }

  clamp(val, min, max){
    return Math.max(min, Math.min(val,max));
  }

  puckInGoakHeight(){
    return (this.puck.pos.y < this.gameHeight*0.35 || this.puck.pos.y > this.gameHeight * 0.65);
  }

  randomv(num){
  	return Math.floor(Math.random() * num);
  }

  destoryItem(){
    this.item.pos.x = 2000;
    this.item.pos.y = 2000;
    this.item.vel.x = 0;
    this.item.vel.y = 0;
    this.item.itemCount = 0;
    this.item.alive = false;
    this.itemInstTimer = 0;
  }

  resetItemEfficacy(){
    if(this.item.itemNum == 0){
      this.puck.radius = 25;
    }
    if(this.item.itemNum == 1){
      this.puck.vel.x /= 1.2;
      this.puck.vel.y /= 1.2;
    }
  }
}

module.exports = GameManager;
