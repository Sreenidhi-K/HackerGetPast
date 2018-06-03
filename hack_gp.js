//Initial declarations and initialisations
var user;
var obst = [];
var mouseX = 0;
var mouseY = 0;
var score=0;
var theI=-1;
var level_count=1;
var h_int=200;
var xpos=0;
var ypos=0;
var speed=2;
var demx=new Array(), demy=new Array();
var ddy=0.2;
var power, radian, ball_x, ball_y, dx, dy; 
var mysound=new sound("expl.mp3");
var bg_m= new sound("bg_music.mp3");
power=8;


//Start game
function startGame() {
    user = new component(30, 30, "#F7DC6F",xpos, ypos);
    bg_m.play();
    canvarea.start();
}

//The canvas 
var canvarea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.canvas.addEventListener("mousemove", setMousePosition);
        this.frame_num = 0;
        demx[0]=250;
       demy[0]=400;
        
        radian=Math.random()*Math.PI;
        ball_x=demx[0]+10;
        ball_y=demy[0]+10;
        dx=power*Math.cos(radian);
        dy=-1*power*Math.sin(radian);
        this.interval = setInterval(updatecanvarea, 20);
    },
    stop : function() {
        clearInterval(this.interval);
        var info=document.getElementById("info");
        info.textContent="* GAME OVER *";
        var button= document.getElementById("but");
        button.textContent="PLAY AGAIN";
        button.setAttribute("style","position: absolute;top: 300px; left:150px;font-family: monospace;font-size:25px;padding:5px;border-style:groove;border-color:#D4E6F1");
        button.addEventListener("click",function(){
            window.location.reload();
        });
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// The component - the obstacles and the user piece
function component(width, height, color, x, y) 
{
    this.width = width;
    this.height = height;  
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = canvarea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
// Checks hitting of user piece and obstacles
    this.hitting = function(otherobj) 
    {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

//Update the canvas
function updatecanvarea() 
{
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
   
    
    //chase the mouse with constant speed
    if(mouseX>0 && mouseY>0)
    {
    var angle= Math.atan(Math.abs((mouseY - ypos)/( mouseX - xpos)));
    
    if((mouseY - ypos)<0 && ( mouseX - xpos)<0)
    {
    if(theI ==-1)
    xpos = xpos - speed * Math.cos(angle);
    ypos = ypos - speed * Math.sin(angle);
    }
    else if((mouseY - ypos)>0 && ( mouseX - xpos)<0)
    {
    if(theI ==-1)
    xpos = xpos - speed * Math.cos(angle);
    ypos = ypos + speed * Math.sin(angle);
    }
    else if((mouseY - ypos)>0 && ( mouseX - xpos)>0)
    {
    if(theI ==-1)
    xpos = xpos + speed * Math.cos(angle);
    ypos = ypos + speed * Math.sin(angle);
    }
    else if((mouseY - ypos)<0 && ( mouseX - xpos)>0)
    {
    if(theI ==-1)
    xpos = xpos + speed * Math.cos(angle);
    ypos = ypos - speed * Math.sin(angle);
    }
    }
   
    if((ball_x+5>user.x) && (ball_x+5< user.x+30) && (ball_y+5>user.y) && (ball_y+5< user.y+30))
        {
            mysound.play();
            bg_m.stop();
            canvarea.stop();
            return;
        }
    if(user.x<=0 && theI!=-1)
        {
             mysound.play();
            bg_m.stop();
            canvarea.stop();
            return;
        }
    
    for (i = 0; i < obst.length; i += 1)
    {
        if (user.hitting(obst[i])) 
        {   
            xpos=obst[i].x-user.width;
             user = new component(30, 30, "#F7DC6F",xpos, ypos);
            theI=i;
            break;
        } 
                
    }
    if(i==obst.length)
        {
            
          user = new component(30, 30, "#F7DC6F",xpos, ypos);
            theI=-1;  
        }
    canvarea.clear();
    canvarea.frame_num += 1;
    
    if (canvarea.frame_num == 1 || everyinterval(h_int))
    {   
        
        x = canvarea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 300;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        obst.push(new component(10, height, "#1A5276", x, 0));
        obst.push(new component(10, x - height - gap, "#1A5276", x, height + gap));
        score+=10;
        if(score%50==0)
            {
            level_count++;
            power++;
            h_int=Math.floor((200)/level_count);
            
            bg_m.stop();
            bg_m.play();
            }
    }
    for (i = 0; i < obst.length; i+= 1) 
    {
         obst[i].x -= level_count;
        obst[i].update();
    }
    
    user.update();
    cn=canvarea.context;
    
    //score
    cn.font="30px Century Gothic";
    cn.fillStyle="black";
    cn.fillText("Score: "+score,20,50);
    
    //demon
    var demon=new Image(10,10);
    demon.src="demon_pic.png";
    cn.drawImage(demon,demx[0],demy[0],40,40);
    
    //Shoot
    
    var w_img=new Image(10,10);
    w_img.src="brown_arrow.png";
    cn.drawImage(w_img,ball_x,ball_y,30,30);
    
    
    if((ball_x<0) || (ball_x>500) || (ball_y<0)|| (ball_y>500))
        {
         
        radian=Math.random()*Math.PI;
        ball_x=demx[0]+10;
        ball_y=demy[0]+10;
        dx=power*Math.cos(radian);
        dy=-1*power*Math.sin(radian);
        }
    dy+=ddy;
    ball_x+=dx;
    ball_y+=dy;
   
}


function everyinterval(n) 
{
    if ((canvarea.frame_num % n)  == 0) {return true;}
    return false;
}
//Getting mouse pointer's position 
function getPosition(el) {
  var xPosition = 0;
  var yPosition = 0;
 
  while (el) {
    xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
    yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
    el = el.offsetParent;
  }
  return {
    x: xPosition,
    y: yPosition
  };
}       
 
function setMousePosition(e) {
    var canvasPos = getPosition(canvarea.canvas);
  mouseX = e.clientX-canvasPos.x;
  mouseY = e.clientY-canvasPos.y;

}       
//sound
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
        this.sound.currentTime=0;
    }    
}
