/**
*lufylegendRPG
*@author Yorhom (Yorhom Wang)
*@version 1.0.0
*modify by Ace Collins
*@explain lufylegendRPG是一个基于lufylegend的开源html5引擎，利用它可以快速方便地进行RPG游戏开发
*License:MIT
*/

/**
*LRPGStage.js
*/
var LRPGStage = function(){};
LRPGStage.shortcuts = false;
LRPGStage.type = "LRPGStage";
LRPGStage.setShortcuts = function(v){
	LRPGStage.shortcuts = v;
};
LRPGStage.closePage = function(){
	var browserName = navigator.appName; 
	if (browserName == "Netscape"){
		window.open("","_parent","");
		window.close();
	}else{ 
		if(browserName == "Microsoft Internet Explorer"){
			window.opener = "whocares";
			window.close();
		}
	}
};
var LRPG = LRPGStage,LRPGGlobal = LRPGStage;

/**
*LKeyboard.js
*/
var LKeyboard = {
	isEsc:function(e){
		if(LRPGStage.shortcuts == true){
			if(event.keyCode === 27){
				return true;
			}else{
				return false;
			}
		}else{
			trace("Error: Keyboard shortcuts have closed!")
		}
	},
	isEnter:function(e){
		if(LRPGStage.shortcuts == true){
			if(event.keyCode === 13){
				return true;
			}else{
				return false;
			}
		}else{
			trace("Error: Keyboard shortcuts have closed!")
		}
	},
	isCtrl:function(e){
		if(LRPGStage.shortcuts == true){
			if(event.keyCode === 17){
				return true;
			}else{
				return false;
			}
		}else{
			trace("Error:Keyboard shortcuts have closed!")
		}
	},
	isShift:function(e){
		if(LRPGStage.shortcuts == true){
			if(event.keyCode === 16){
				return true;
			}else{
				return false;
			}
		}else{
			trace("Error:Keyboard shortcuts have closed!")
		}
	},
	getKeyCode:function(event){
		return event.keyCode;
	},
	getKeyName:function(event){
		return String.fromCharCode(event.keyCode);
	}
};

/**
*LTileMap.js
*/
function LTileMap(data,img,width,height,tdata){
	var s = this;
	base(s,LSprite,[]);
	s.type = "LTileMap";
	s.x = 0;
	s.y = 0;
	s.mapData = data;
	s.imgData = img;
	
	s.mapSprite = new LSprite();
	s.addChild(s.mapSprite);
	s.textSprite = new LSprite();
	s.addChild(s.textSprite);
	
	if(!width){
		var wbitmap = new LBitmapData(s.imgData);
		s.partWidth = wbitmap.image.width;
	}else{
		s.partWidth = width;
	}
	if(!height){
		var hbitmap = new LBitmapData(s.imgData);
		s.partHeight = hbitmap.image.height;
	}else{
		s.partHeight = height;
	}
	if(!tdata){
		s.mapTerrain = [];
	}else{
		s.mapTerrain = tdata;
	}
	s.onshow();
}
LTileMap.prototype.setData = function(data,img,width,height){
	var s = this;
	s.mapData = data;
	s.imgData = img;
	if(!width){
		var wbitmap = new LBitmapData(s.imgData);
		s.partWidth = wbitmap.image.width;
	}else{
		s.partWidth = width;
	}
	if(!height){
		var hbitmap = new LBitmapData(s.imgData);
		s.partHeight = hbitmap.image.height;
	}else{
		s.partHeight = height;
	}
	s.onshow();
}
LTileMap.prototype.getWidth = function(){
	var s = this;
	return s.partWidth * s.mapData[0].length;
}
LTileMap.prototype.getHeight = function(){
	var s = this;
	return s.partHeight * s.mapData.length;
}
LTileMap.prototype.showData = function(color){
	var s = this;
	if(!color)color = "black";
	s.textSprite.removeAllChild();
	for(var i=0; i<s.mapTerrain.length;i++){
		for(var j=0;j<s.mapTerrain[0].length;j++){
			var text = new LTextField();
			text.size = s.partWidth / 2;
			text.color = color;
			text.x = j*s.partWidth + s.partWidth/3;
			text.y = i*s.partHeight;
			text.text = s.mapTerrain[i][j];
			s.textSprite.addChild(text);
		}
	}
	trace("Map data: " + s.mapData);
	trace("Images data: " + s.imgData);
	trace("Small map width: " + s.partWidth);
	trace("Small map hieght: " + s.partHeight);
}
LTileMap.prototype.onshow = function(){
	var s = this;
	var i,j,index,indexX,indexY;
	var mapdata = s.mapData;
	var partWidth = s.partWidth;
	var partHeight = s.partHeight;
	
    var bitmapdata,bitmap;
	
    var mapX = s.x / partWidth;
    var mapY = s.y / partHeight;
    s.mapSprite.removeAllChild();
	
	for(i=0;i<mapdata.length;i++){
		for(j=0;j<mapdata[0].length;j++){
            index = mapdata[i-mapY][j-mapX];
            indexY = Math.floor(index /10);
            indexX = index - indexY*10;
            bitmapdata = new LBitmapData(s.imgData,indexX*partWidth,indexY*partHeight,partWidth,partHeight);
            bitmap = new LBitmap(bitmapdata);
            bitmap.x = j*partWidth - s.x;
            bitmap.y = i*partHeight - s.y;
            s.mapSprite.addChild(bitmap);
        }
    }
}

/**
*LEffect.js
*/
function LEffect(){
	var s = this;
	base(s,LSprite,[]);
	s.type = "LEffect";
	s.rainList = [];
	s.snowList = [];
	s.rainLayer = new LSprite();
	s.rainLayer.alpha = 0.8;
	s.addChild(s.rainLayer);
	s.snowLayer = new LSprite();
	s.snowLayer.alpha = 0.8;
	s.addChild(s.snowLayer);
}
LEffect.prototype.raining = function(speed,size){
	var s = this;
	if(!speed)speed = 30;
	if(!size)size = 5;
	s.rainLayer.addEventListener(LEvent.ENTER_FRAME,function(){
		s.onshow("rain",speed,size);
	});
}
LEffect.prototype.snowing = function(speed,size){
	var s = this;
	if(!speed)speed = 10;
	if(!size)size = 1;
	s.snowLayer.addEventListener(LEvent.ENTER_FRAME,function(){
		s.onshow("snow",speed,size);
	});
}
LEffect.prototype.sleeting = function(speed,snowsize,rainsize){
	var s = this;
	if(!speed)speed = 30;
	if(!snowsize)snowsize = 1;
	if(!rainsize)rainsize = 5;
	s.snowLayer.addEventListener(LEvent.ENTER_FRAME,function(){
		s.onshow("sleet",speed,[snowsize,rainsize]);
	});
}
LEffect.prototype.onshow = function(thing,speed,size){
	var s = this;
	if(thing == "rain"){
		s.rainLayer.graphics.clear();
		var rainX = Math.random()*(LStage.width-10-10)+10;
		var n = s.rainList.length;
		while(n--){
			var o = s.rainList[n];
			o.y += o.s;
			s.rainLayer.graphics.drawRect(1,"white",[o.x,o.y,1,size],true,"#f3f3f3");
		}
		s.rainList.push({x:rainX,y:0,s:speed});
	}else if(thing == "snow"){
		s.snowLayer.graphics.clear();
		var snowX = Math.random()*(LStage.width-10-10)+10;
		var n = s.snowList.length;
		while(n--){
			var o = s.snowList[n];
			o.y += o.s;
			s.snowLayer.graphics.drawArc(2,"white",[o.x,o.y,size,0,2*Math.PI],true,"white");
		}
		s.snowList.push({x:snowX,y:0,s:speed});
	}else if(thing == "sleet"){
		s.snowLayer.graphics.clear();
		var snowX = Math.random()*(LStage.width-10-10)+10;
		var n = s.snowList.length;
		while(n--){
			var o = s.snowList[n];
			o.y += o.s;
			s.snowLayer.graphics.drawArc(2,"white",[o.x,o.y,size[0],0,2*Math.PI],true,"white");
		}
		s.snowList.push({x:snowX,y:0,s:speed});
		
		s.rainLayer.graphics.clear();
		var rainX = Math.random()*(LStage.width-10-10)+10;
		var n = s.rainList.length;
		while(n--){
			var o = s.rainList[n];
			o.y += o.s;
			s.rainLayer.graphics.drawRect(1,"white",[o.x,o.y,1,size[1]],true,"#f3f3f3");
		}
		s.rainList.push({x:rainX,y:0,s:speed});
	}
}

/**
*LCurtainSample1.js
*/
function LCurtainSample1(speed,onClosing,onComplete){
	var s = this;
	base(s,LSprite,[]);
	s.type = "LCurtainSample1";
	if(!speed)speed = LStage.width/100;
	if(!onClosing){
		s.onClosing = function(){};
	}else{
		s.onClosing = onClosing;
	}	
	if(!onComplete){
		s.onComplete = function(){};
	}else{
		s.onComplete = onComplete;
	}
	s.mode = "close";
	s.width1 = 0;
	s.width2 = 0;
	s.isDoClosing = false;
	s.speed = speed;
	s.addEventListener(LEvent.ENTER_FRAME,s.onshow);
}
LCurtainSample1.prototype.onshow = function(s){
	s.graphics.clear();
	s.graphics.drawRect(1,"black",[0,0,s.width1,LStage.height],true,"black");
	s.graphics.drawRect(1,"black",[LStage.width-s.width2,0,s.width2,LStage.height],true,"black");
	if(s.width1 >= LStage.width/2){
		s.mode = "open";
		if(s.isDoClosing == false){
			s.onClosing();
			s.isDoClosing = true;
		}
	}
	if(s.mode == "close"){
		s.width1 += s.speed;
		s.width2 += s.speed;
	}else if(s.mode == "open"){
		s.width1 -= s.speed;
		s.width2 -= s.speed;
		if(s.width1 < 0){
			s.mode = "stop";
		}
	}else if(s.mode == "stop"){
		s.graphics.clear();
		s.removeEventListener(LEvent.ENTER_FRAME,s.onshow);
		s.onComplete();
	}
}

/**
*LCurtainSample2.js
*/
function LCurtainSample2(speed,onClosing,onComplete){
	var s = this;
	base(s,LSprite,[]);
	s.type = "LCurtainSample2";
	if(!speed)speed = LStage.height/100;
	if(!onClosing){
		s.onClosing = function(){};
	}else{
		s.onClosing = onClosing;
	}	
	if(!onComplete){
		s.onComplete = function(){};
	}else{
		s.onComplete = onComplete;
	}
	s.mode = "close";
	s.height1 = 0;
	s.height2 = 0;
	s.isDoClosing = false;
	s.speed = speed;
	s.addEventListener(LEvent.ENTER_FRAME,s.onshow);
}
LCurtainSample2.prototype.onshow = function(s){
	s.graphics.clear();
	s.graphics.drawRect(1,"black",[0,0,LStage.width,s.height1],true,"black");
	s.graphics.drawRect(1,"black",[0,LStage.height-s.height2,LStage.width,s.height2],true,"black");
	if(s.height1 >= LStage.height/2){
		s.mode = "open";
		if(s.isDoClosing == false){
			s.onClosing();
			s.isDoClosing = true;
		}
	}
	if(s.mode == "close"){
		s.height1 += s.speed;
		s.height2 += s.speed;
	}else if(s.mode == "open"){
		s.height1 -= s.speed;
		s.height2 -= s.speed;
		if(s.height1 < 0){
			s.mode = "stop";
		}
	}else if(s.mode == "stop"){
		s.graphics.clear();
		s.removeEventListener(LEvent.ENTER_FRAME,s.onshow);
		s.onComplete();
	}
}

/**
*LCurtainSample3.js
*/
function LCurtainSample3(speed,onClosing,onComplete){
	var s = this;
	base(s,LSprite,[]);
	s.type = "LCurtainSample3";
	if(!speed)speed = LStage.width/100;
	if(!onClosing){
		s.onClosing = function(){};
	}else{
		s.onClosing = onClosing;
	}	
	if(!onComplete){
		s.onComplete = function(){};
	}else{
		s.onComplete = onComplete;
	}
	s.mode = "close";
	s.height1 = 0;
	s.height2 = 0;
	s.width1 = 0;
	s.width2 = 0;
	s.isDoClosing = false;
	s.speed = speed;
	s.addEventListener(LEvent.ENTER_FRAME,s.onshow);
}
LCurtainSample3.prototype.onshow = function(s){
	s.graphics.clear();
	s.graphics.drawRect(1,"black",[0,0,LStage.width,s.height1],true,"black");
	s.graphics.drawRect(1,"black",[0,LStage.height-s.height2,LStage.width,s.height2],true,"black");
	s.graphics.drawRect(1,"black",[0,0,s.width1,LStage.height],true,"black");
	s.graphics.drawRect(1,"black",[LStage.width-s.width2,0,s.width2,LStage.height],true,"black");
	if(s.height1 >= LStage.height/2 ){
		s.mode = "open";
		if(s.isDoClosing == false){
			s.onClosing();
			s.isDoClosing = true;
		}
	}
	if(s.mode == "close"){
		s.height1 += s.speed;
		s.height2 += s.speed;
		s.width1 += s.speed;
		s.width2 += s.speed;
	}else if(s.mode == "open"){
		s.height1 -= s.speed;
		s.height2 -= s.speed;
		s.width1 -= s.speed;
		s.width2 -= s.speed;
		if(s.height1 < 0){
			s.mode = "stop";
		}
	}else if(s.mode == "stop"){
		s.graphics.clear();
		s.removeEventListener(LEvent.ENTER_FRAME,s.onshow);
		s.onComplete();
	}
}

/**
*LTalk.js
*/
function LTalk(content){
	var s = this;
	base(s,LSprite,[]);
	s.type = "LTalk";
	if(!content){
		s.content = [];
	}else{
		s.content = content;
	}
	s.x = 0;
	s.y = 0;
	s.textWidth = LStage.width;
	s.talkIndex = 0;
	s.faceX = 0;
	s.faceY = 0;
	s.nameX = 0;
	s.nameY = 0;
	s.nameColor = "black";
	s.nameFont = "宋体";
	s.nameSize = "15";
	s.msgX = 0;
	s.msgY = 0;
	s.msgColor = "black";
	s.msgFont = "宋体";
	s.msgSize = "15";
}
LTalk.prototype.setData = function(content){
	var s = this;
	s.content = content;
}
LTalk.prototype.showData = function(){
	var s = this;
	for(var key in s.content){
		trace("----------No."+key+"----------");
		trace("Name: " + s.content[key].name);
		trace("Msg: " + s.content[key].msg);
		trace("Face: " + s.content[key].face);
	}
}
LTalk.prototype.setFaceStyle = function(styleData){
	var s = this;
	if(!styleData.x){s.faceX = 0;}else{s.faceX = styleData.x;}
	if(!styleData.y){s.faceY = 0;}else{s.faceY = styleData.y;}
}
LTalk.prototype.setNameStyle = function(styleData){
	var s = this;
	if(!styleData.x){s.nameX = 0;}else{s.nameX = styleData.x;}
	if(!styleData.y){s.nameY = 0;}else{s.nameY = styleData.y;}
	if(!styleData.color){s.nameColor = "black";}else{s.nameColor = styleData.color;}
	if(!styleData.font){s.nameFont = "宋体";}else{s.nameFont = styleData.font;}
	if(!styleData.size){s.nameSize = "15";}else{s.nameSize = styleData.size;}
}
LTalk.prototype.setMsgStyle = function(styleData){
	var s = this;
	if(!styleData.x){s.msgX = 0;}else{s.msgX = styleData.x;}
	if(!styleData.y){s.msgY = 0;}else{s.msgY = styleData.y;}
	if(!styleData.color){s.msgColor = "black";}else{s.msgColor = styleData.color;}
	if(!styleData.font){s.msgFont = "宋体";}else{s.msgFont = styleData.font;}
	if(!styleData.size){s.msgSize = "15";}else{s.msgSize = styleData.size;}
}
LTalk.prototype.wind = function(num,completeFunc){
	var s = this;
	if(!num || num == null)num = 0;
	if(!completeFunc)completeFunc = null;
	s.talkIndex = num;
	s.removeAllChild();
	if(s.talkIndex < s.content.length){
		var talkObject = s.content[s.talkIndex];
		var faceBitmapdata = new LBitmapData(talkObject.face);
		var faceBitmap = new LBitmap(faceBitmapdata);
		faceBitmap.x = s.faceX;
		faceBitmap.y = s.faceY;
		s.addChild(faceBitmap);
		var name = new LTextField();
		name.x = s.nameX;
		name.y = s.nameY;
		name.size = s.nameSize;
		name.color = s.nameColor;
		name.font = s.nameFont;
		name.text = talkObject.name;
		name.width = s.textWidth;
		name.setWordWrap(true,name.getHeight()+5);
		s.addChild(name);
		var msg = new LTextField();
		msg.x = s.msgX;
		msg.y = s.msgY;
		msg.size = s.msgSize;
		msg.color = s.msgColor;
		msg.font = s.msgFont;
		msg.text = talkObject.msg;
		msg.width = s.textWidth;
		msg.setWordWrap(true,msg.getHeight()+7);
		msg.wind(completeFunc);
		s.addChild(msg);
	}else{
		trace("Error: Param exceeds the size of the content!");
	}
}
LTalk.prototype.clear = function(){
	var s = this;
	s.removeAllChild();
	s.die();
}

/**
*LCharacter.js
*/
function LCharacter(data,row,col,speed,isFighter){
	var s = this;
	base(s,LSprite,[]);
	s.type = "LCharacter";
	if(!speed)speed = 0;
	if(isFighter == undefined)isFighter = false;
	s.speed = speed;
	s.speedIndex = 0;
	s.x = 0;
	s.y = 0;
	s.mode = "";
	s.index = 0;
	if(isFighter == true){
		s.hp = 0;
		s.attack = 0;
		s.defense = 0;
	}
	s.effect = null;
	s.avatarNum = 0;
	s.flickerNum = 0;
	s.img = data;
	s.row = row;
	s.col = col;
	s.effectSprite = new LSprite();
	s.addChild(s.effectSprite);
	s.nameSprite = new LSprite();
	s.addChild(s.nameSprite);
	var imgData = new LBitmapData(data);
	imgData.setProperties(0,0,imgData.image.width/col,imgData.image.height/row);
	var list = LGlobal.divideCoordinate(imgData.image.width,imgData.image.height,row,col);
	s.imgWidth = imgData.image.width/col;
	s.imgHeight = imgData.image.height/row;
	s.anime = new LAnimation(s,imgData,list);
	s.addEventListener(LEvent.ENTER_FRAME,function(){
		if(s.effect != null){
			s.showEffect(s,s.effect);
		}
	});
}
LCharacter.prototype.setData = function(data,row,col,speed,isFighter){
	var s = this;
	if(!speed)speed = 0;
	if(isFighter == undefined)isFighter = false;
	s.speed = speed;
	s.img = data;
	s.row = row;
	s.col = col;
	if(isFighter == true){
		s.hp = s.hp || 0;
		s.attack = s.attack || 0;
		s.defense = s.defense || 0;
	}
	var imgData = new LBitmapData(data);
	imgData.setProperties(0,0,imgData.image.width/col,imgData.image.height/row);
	var list = LGlobal.divideCoordinate(imgData.image.width,imgData.image.height,row,col);
	s.imgWidth = imgData.image.width/col;
	s.imgHeight = imgData.image.height/row;
	s.removeChild(s.anime);
	s.anime = new LAnimation(s,imgData,list);
}
LCharacter.prototype.addActionEventListener = function(type,listener){
	var s = this;
	s.anime.addEventListener(type,listener);
}
LCharacter.prototype.setAction = function(rowIndex,colIndex,mode,isMirror){
	var s = this;
	s.anime.setAction(rowIndex,colIndex,mode,isMirror);
}
LCharacter.prototype.getAction = function(){
	var s = this;
	var returnAction = s.anime.getAction();
	return returnAction;
}
LCharacter.prototype.onframe = function(){
	var s = this;
	if(s.speedIndex++ < s.speed)return;
	s.speedIndex = 0;
	s.anime.onframe();
}
LCharacter.prototype.moveTo = function(x,y,timer,type,style,completefunc){
	var s = this;
	if(!timer)timer = 1;
	if(!type)type = Quad.easeIn;
	if(!style)style = LMoveStyle.direct;
	
	switch(style){
		case LMoveStyle.direct:
			var vars = {
				x:x,
				y:y,
				ease:type,
				onComplete:completefunc
			};
			LTweenLite.to(s,timer,vars);
			break;
		case LMoveStyle.horizontal:
			LTweenLite.to(s,timer,{
				x:x,
				ease:type,
				onComplete:function(){
					LTweenLite.to(s,timer,{
						y:y,
						ease:type,
						onComplete:completefunc
					});
				}
			});
			break;
		case LMoveStyle.vertical:
			LTweenLite.to(s,timer,{
				y:y,
				ease:type,
				onComplete:function(){
					LTweenLite.to(s,timer,{
						x:x,
						ease:type,
						onComplete:completefunc
					});
				}
			});
			break;
		default:
			trace("Error: Value of last param is wrong!");
			break;
	}
}
LCharacter.prototype.addName = function(name,style){
	var s = this;
	s.nameSprite.removeAllChild();
	if(!name)name = 0;
	if(!style)style = [];
	if(!style[0])style[0] = 0;
	if(!style[1])style[1] = 0;
	if(!style[2])style[2] = "black";
	if(!style[3])style[3] = "11";
	if(!style[4])style[4] = "utf-8";
	var nameText = new LTextField();
	nameText.text = name;
	nameText.x = style[0];
	nameText.y = style[1];
	nameText.color = style[2];
	nameText.size = style[3];
	nameText.font = style[4];
	s.nameSprite.addChild(nameText);
}
LCharacter.prototype.showEffect = function(s,type){
	switch(type){
		case LSkill.avatar:
			if(s.avatarNum++ < 3){
				var nowImg = s.anime.getAction();
				var nowY = nowImg[0];
				var nowX = nowImg[1];
				
				var bitmapData = new LBitmapData(s.img,nowX*s.imgWidth,nowY*s.imgHeight,s.imgWidth,s.imgHeight);
				var bitmap = new LBitmap(bitmapData);
				bitmap.x = 0;
				bitmap.y = 0;
				LTweenLite.to(bitmap,0.5,{
					x:(s.imgWidth)*s.avatarNum,
					alpha:0.2,
					ease:Quad.easeIn,
					onComplete:function(){
						LTweenLite.to(bitmap,0.5,{
							x:(s.imgWidth)*s.avatarNum,
							ease:Quad.easeIn,
						});
					}
				});
				s.effectSprite.addChild(bitmap);
				
				var bitmapData2 = new LBitmapData(s.img,nowX*s.imgWidth,nowY*s.imgHeight,s.imgWidth,s.imgHeight);
				var bitmap2 = new LBitmap(bitmapData2);
				bitmap2.x = 0;
				bitmap2.y = 0;
				LTweenLite.to(bitmap2,0.5,{
					x:(s.imgWidth)*s.avatarNum * -1,
					alpha:0.2,
					ease:Quad.easeIn,
					onComplete:function(){
						LTweenLite.to(bitmap2,0.5,{
							x:(s.imgWidth)*s.avatarNum * -1,
							ease:Quad.easeIn,
							onComplete:function(){
								s.avatarNum = 0;
								s.effect = null;
								s.effectSprite.removeAllChild();
							}
						});
					}
				});
				s.effectSprite.addChild(bitmap2);
			}
			break;
		case LSkill.flicker:
			if(s.flickerNum++ < 3){
				LTweenLite.to(s,0.3,{
					alpha:0.5,
					ease:Quad.easeIn,
					onComplete:function(){
						LTweenLite.to(s,0.5,{
							alpha:1,
							ease:Quad.easeIn,
							onComplete:function(){
								s.effect = null;
								s.flickerNum = 0;
							}
						});
					}
				});
			}	
			break;
		default:
			trace("Error: LSkill has no property that named " + "'" + type + "'");
			break;
	}
}
var LMoveStyle = {
	horizontal:"horizontal",
	vertical:"vertical",
	direct:"direct"
};
var LSkill = {
	avatar:"LSkillAvatar",
	flicker:"LSkillFlicker"
};

/**
*LHitList.js
*/
function LHitList(objectA,sprite,type){
	if(!objectA)trace("Error: The first param was not assigned.");
	if(!sprite)trace("Error: The second param was not assigned.");
	if(!type)type = "TestRect";
	var s = this;
	base(s,LObject,[]);
	s.type = "LHitList";
	s.objectA = objectA;
	s.objectB = null;
	s.sprite = sprite;
	s.ishit = false;
	s.list = [];
	s.type = type;
}
LHitList.prototype.getList = function(){
	var s = this;
	var n = s.sprite.childList.length;
	if(s.type != "TestRect" && s.type != "TestArc"){	
		trace("Type is wrong. It must be 'TestRect' or 'TestArc'.");
	}else{
		while(n--){
			s.objectB = s.sprite.childList[n];
			if(s.type == "TestRect"){
				s.ishit = LGlobal.hitTest(s.objectA,s.objectB);
			}else if(s.type == "TestArc"){
				s.ishit = LGlobal.hitTestArc(s.objectA,s.objectB);
			}
			if(s.ishit == true && s.objectB != s.objectA){
				s.list[s.list.length] = s.sprite.childList[n];
			}
		}
		return s.list;
	}
}
LHitList.prototype.clearList = function(){
	var s = this;
	s.list = [];
}

/**
*LBackground.js
*/
function LBackground(data,mode){	
	var s = this;
	base(s,LSprite,[]);
	s.type = "LBackground";
	if(!data)trace("Error: First param is wrong!");
	if(!mode)mode = LBackStyle.tile;
	s.data = data;
	s.x = 0;
	s.y = 0;
	s.mode = mode;
	s.onshow(s.mode);
}
LBackground.prototype.onshow = function(mode){
	var s = this;
	switch(mode){
		case LBackgroundStyle.tile:
			var partx = Math.ceil(LStage.width/s.data.image.width);
			var party = Math.ceil(LStage.height/s.data.image.height);
			for(var i=0;i<party;i++){
				for(var j=0;j<partx;j++){ 
					var bitmap = new LBitmap(s.data);
					bitmap.x = j*s.data.image.width;
					bitmap.y = i*s.data.image.height;
					s.addChild(bitmap);
				}
			}
			break;
		case LBackgroundStyle.scale:
			var scalex = LStage.width/s.data.image.width;
			var scaley = LStage.height/s.data.image.height;
			var bitmap = new LBitmap(s.data);
			bitmap.x = 0;
			bitmap.y = 0;
			bitmap.scaleX = scalex;
			bitmap.scaleY = scaley;
			s.addChild(bitmap);
			break;
		default:
			trace("Error: LBackgroundStyle has no property that named " + "'" + mode + "'");
			break;
	}
}
LBackground.prototype.showData = function(){
	var s = this;
	trace("Back data: "+s.data);
	switch(s.mode){
		case LBackgroundStyle.tile:
			trace("Back style: LBackgroundStyle.tile");
			break;
		case LBackgroundStyle.scale:
			trace("Back style: LBackgroundStyle.scale");
			break;
	}
}
var LBackgroundStyle = {
	tile:"backtile",
	scale:"backscale"
};

/**
*LXMLToArray.js
*/
function LXMLToArray(xmlPath,type){
	var s = this;
	base(s,LObject,[]);
	s.type = "LXMLToArray";
	
	if (window.XMLHttpRequest){
		s.xmlhttp = new XMLHttpRequest();
	}else{
		s.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(!type)type = "map";
	s.xmlPath = xmlPath;
	s.type = type;
	s.xmlhttp.open("GET",s.xmlPath,false);
	s.xmlhttp.send();
	s.xmlDoc = s.xmlhttp.responseXML;
}
LXMLToArray.prototype.get = function(){
	var s = this;
	var c;
	switch(s.type){
		case "map":
			c = s.xmlDoc.getElementsByTagName("map");
			break;
		case "mapdata":
			c = s.xmlDoc.getElementsByTagName("mapdata");
			break;
		default:
			trace("Error: Value of type is wrong!");
			break;
	}
	var result = new Array();
	
	for(var i=0; i<c.length; i++){ 
		var textContent = c[i].childNodes[0].nodeValue.toString();
		var rowArray = textContent.split(",");
		result.push(rowArray);
		rowArray = [];
	}
	return result;
}

/**
*LSceneData.js
*/
function LSceneData(backObj,charaList,talkContent,weather){
	var s = this;
	s.type = "LSceneData";
	s.backObj = backObj || "no";
	s.charaList = charaList || [];
	s.talkContent = talkContent || [];
	s.weather = weather || "normal";
}
LSceneData.prototype = {
	setData:function(backObj,charaList,talkContent){
		var s = this;
		s.backObj = backObj;
		s.charaList = charaList;
		s.talkContent = talkContent;
	},
	showData:function(){
		var s = this;
		s.backObj.showData();
		trace("<br />Character List: ");
		for(var key in s.charaList){
			trace("----------No."+key+"----------");
			trace("Chara: " + s.charaList[key].chara);
			trace("Data: " + s.charaList[key].data);
			trace("Row: " + s.charaList[key].row);
			trace("Col: " + s.charaList[key].col);
			trace("Speed: " + s.charaList[key].speed);
			trace("x: " + s.charaList[key].x);
			trace("y: " + s.charaList[key].y);
			if(s.charaList[key].chara != "player"){
				trace("Talk Index: " + s.charaList[key].talkIndex);
			}
		}
		trace("<br />Talk List: " + s.talkContent);
	}
};

/**
*LScene.js
*/
function LScene(data){
	var s = this;
	base(s,LSprite,[]);
	s.type = "LScene";
	s.data = data;
	
	s.removeAllChild();
	
	s.mapLayer = new LSprite();
	s.addChild(s.mapLayer);
	s.charaLayer = new LSprite();
	s.addChild(s.charaLayer);
	s.talkLayer = new LSprite();
	s.addChild(s.talkLayer);
	s.weatherLayer = new LSprite();
	s.addChild(s.weatherLayer);
	
	s.mapObj = null;
	s.mapData = [];
	s.mapTerrain = [];
	s.mapPartWidth = 0;
	s.mapPartHeight = 0;
	s.mapCanWalk = 0;
	s.mapCannotWalk = 1;
	
	s.mapMove = false;
	s.movemapRight = 0;
	s.movemapLeft = 0;
	s.movemapUp = 0;
	s.movemapDown = 0;
	
	s.charaList = new Array();
	s.player = null;
	s.playerDir = null;
	s.playerX = 0;
	s.playerY = 0;
	s.step = 0;
	s.stepIndex = 0;
	s.isWalk = false;
	s.characterList = s.charaLayer.childList;
	s.playerStep = UNDEFINED;
	
	s.charaLeftStyle = 0;
	s.charaUpStyle = 0;
	s.charaRightStyle = 0;
	s.charaDownStyle = 0;
	
	s.talk = new LTalk();
	s.talkList = s.data.talkContent;
	s.talkNum = 0;
	s.talking = false;
	s.talkBack = null;
	
	s.walkCompleteFunc = null;
	
	s.weatherObj = null;
	
	s.addEventListener(LEvent.ENTER_FRAME,function(){s.onframe();});
	LEvent.addEventListener(LGlobal.window,LKeyboardEvent.KEY_DOWN,function(){s.onkeydown(event);});
	LEvent.addEventListener(LGlobal.window,LKeyboardEvent.KEY_UP,function(){s.onkeyup(event);});
	
	if(s.data.backObj != "no"){
		if(s.data.backObj.type == "LTileMap"){
			s.addMap();
		}else if(s.data.type == "LBackground"){
			s.addBackground();
		}
	}
	if(s.data.charaList != [])s.addCharacter();
	if(s.data.weather != "normal")s.addWeather();
}
LScene.prototype.addWeather = function(){
	var s = this;
	s.weatherObj = s.data.weather;
	s.weatherLayer.addChild(s.weatherObj);
}
LScene.prototype.addMoveEventListener = function(type,func){
	var s = this;
	switch(type){
		case LEvent.COMPLETE:
			s.walkCompleteFunc = func;
			break;
	}
}
LScene.prototype.addBackground = function(){
	var s = this;
	s.mapLayer.addChild(s.data.backObj);
}
LScene.prototype.addMap = function(){
	var s = this;
	s.mapObj = s.data.backObj;
	s.mapLayer.addChild(s.mapObj);
	s.mapTerrain = s.mapObj.mapTerrain;
	s.mapData = s.mapObj.mapData;
	s.mapPartWidth = s.mapObj.partWidth;
	s.mapPartHeight = s.mapObj.partHeight;
	
	s.movemapRight = Math.floor(LStage.width / s.mapObj.partWidth) - 2;
	s.movemapLeft = 1;
	s.movemapUp = 1;
	s.movemapDown = Math.floor(LStage.height / s.mapObj.partHeight) - 2;
	
	if(s.mapData.length != s.mapTerrain.length){
		trace("Warning: Map image array's length is different from map terrain array's length!");
	}else{
		for(var i=0;i<s.mapTerrain.length;i++){
			for(var j=0;j<s.mapData.length;j++){
				if(s.mapData[j].length != s.mapTerrain[i].length){
					trace("Warning: Map image array's length is different from map terrain array's length!");
				}
			}
		}
	}
}
LScene.prototype.setMap = function(canMove,cannotMove){
	var s = this;
	s.mapCanWalk = canMove || 0;
	s.mapCannotWalk = cannotMove || 1;
}
LScene.prototype.addCharacter = function(){
	var s = this;
	s.charaList = s.data.charaList;
	for(var i=0;i<s.charaList.length;i++){
		var data = s.charaList[i].data;
		var row = s.charaList[i].row;
		var col = s.charaList[i].col;
		var speed = s.charaList[i].speed;
		var x = s.charaList[i].x;
		var y = s.charaList[i].y;
		var talkIndex = s.charaList[i].talkIndex;
		s.step = speed;
		
		var chara = new LCharacter(data,row,col,speed,false);
		if(s.mapObj.type == "LTileMap"){
			chara.x = x*s.mapPartWidth;
			chara.y = y*s.mapPartHeight;
		}else if(s.mapObj.type == "LBackground"){
			chara.x = x;
			chara.y = y;
		}
		s.charaLayer.addChild(chara);
		
		if(s.charaList[i].chara == "player"){
			s.player = chara;
			s.playerX = x;
			s.playerY = y;
		}else{
			s.mapTerrain[y][x] = s.mapCannotWalk;
			chara.index = talkIndex;
		}
	}
	s.charaLeftStyle = 1;
	s.charaUpStyle = 3;
	s.charaRightStyle = 2;
	s.charaDownStyle = 0;
}
LScene.prototype.setCharacter = function(moveLeft,moveRight,moveUp,moveDown){
	var s = this;
	s.charaLeftStyle = moveLeft || 0;
	s.charaUpStyle = moveUp || 0;
	s.charaRightStyle = moveRight || 0;
	s.charaDownStyle = moveDown || 0;
}
var LPlayerMove = {
	LEFT:"left",
	RIGHT:"right",
	UP:"up",
	DOWN:"down"
};
LScene.prototype.movePlayer = function(dir){
	var s = this;
	if(s.player.mode == ""){
		s.player.mode = "ismove";
		switch(dir){
			case LPlayerMove.LEFT:
				s.playerDir = "left";
				s.player.setAction(s.charaLeftStyle);
				if(s.mapPartWidth*s.playerX - s.x > s.mapPartWidth && s.playerX <= s.movemapLeft && s.x != 0){
					s.mapMove = true;
				}else{
					s.mapMove = false;
				}
				break;
			case LPlayerMove.UP:
				s.playerDir = "up";
				s.player.setAction(s.charaUpStyle);
				if(s.mapPartHeight*s.playerY - s.y > s.mapPartHeight && s.playerY <= s.movemapUp && s.y != 0){
					s.mapMove = true;
				}else{
					s.mapMove = false;
				}
				break;
			case LPlayerMove.RIGHT:
				s.playerDir = "right";
				s.player.setAction(s.charaRightStyle);
				if(s.x + s.mapPartWidth <= LStage.width && s.playerX >= s.movemapRight && s.x + s.mapObj.getWidth() != LStage.width){
					s.mapMove = true;
				}else{
					s.mapMove = false;
				}
				break;
			case LPlayerMove.DOWN:
				s.playerDir = "down";
				s.player.setAction(s.charaDownStyle);
				if(s.y + s.mapPartHeight <= LStage.height && s.playerY >= s.movemapDown && s.y + s.mapObj.getHeight() != LStage.height){
					s.mapMove = true;
				}else{
					s.mapMove = false;
				}
				break;
			default:
				s.mapMove = false;
				s.player.mode = "";
				trace("Error: Param is wrong!");
				break;
		}
	}
}
LScene.prototype.onkeydown = function(event){
	var s = this;
	var keycode = event.keyCode;

	switch(keycode){
		case 37:
			s.movePlayer(LPlayerMove.LEFT);
			break;
		case 65:
			s.movePlayer(LPlayerMove.LEFT);
			break
		case 38:
			s.movePlayer(LPlayerMove.UP);
			break;
		case 87:
			s.movePlayer(LPlayerMove.UP);
			break
		case 39:
			s.movePlayer(LPlayerMove.RIGHT);
			break;
		case 68:
			s.movePlayer(LPlayerMove.RIGHT);
			break
		case 40:
			s.movePlayer(LPlayerMove.DOWN);
			break;
		case 83:
			s.movePlayer(LPlayerMove.DOWN);
			break
	}
}
LScene.prototype.onkeyup = function(event){
	var s = this;
	if(event.keyCode == 13){
		s.startTalk();
	}
}
LScene.prototype.onframe = function(){
	var s = this;
	if(s.characterList.length > 0){
		for(var key in s.characterList)s.characterList[key].onframe();
	}
	if(s.playerStep == UNDEFINED){
		if(s.playerDir == "right" || s.playerDir == "left"){
			s.playerStep = s.mapPartWidth/s.step;
		}else if(s.playerDir == "down" || s.playerDir == "up"){
			s.playerStep = s.mapPartHeight/s.step;
		}
	}
	
	if(s.player.mode == "ismove"){
		if(s.stepIndex++ < s.step){
			if(s.playerDir == "right" && s.playerX+1 < s.mapTerrain[s.playerY].length && s.mapTerrain[s.playerY][s.playerX+1] == s.mapCanWalk){
				if(s.mapMove != true){
					s.player.x += s.playerStep;
					s.isWalk = true;
				}else{
					s.moveMap(s.playerDir);
				}
			}else if(s.playerDir == "left" && s.playerX-1 >= 0 && s.mapTerrain[s.playerY][s.playerX-1] == s.mapCanWalk){
				if(s.mapMove != true){
					s.player.x -= s.playerStep;
					s.isWalk = true;
				}else{
					s.moveMap(s.playerDir);
				}
			}else if(s.playerDir == "up" && s.playerY-1 >= 0 && s.mapTerrain[s.playerY-1][s.playerX] == s.mapCanWalk){
				if(s.mapMove != true){
					s.player.y -= s.playerStep;
					s.isWalk = true;
				}else{
					s.moveMap(s.playerDir);
				}
			}else if(s.playerDir == "down" && s.playerY+1 < s.mapTerrain.length && s.mapTerrain[s.playerY+1][s.playerX] == s.mapCanWalk){
				if(s.mapMove != true){
					s.player.y += s.playerStep;
					s.isWalk = true;
				}else{
					s.moveMap(s.playerDir);
				}
			}
		}else{
			s.stepIndex = 0;
			s.player.mode = "";
			if(s.mapMove == true && s.isWalk == true){
				switch(s.playerDir){
					case "right":
						s.movemapRight += 1;
						s.movemapLeft += 1;
						break;
					case "left":
						s.movemapLeft -= 1;
						s.movemapRight -= 1;
						break;
					case "up":
						s.movemapUp -= 1;
						s.movemapDown -= 1;
						break;
					case "down":
						s.movemapDown += 1;
						s.movemapUp += 1;
						break;
				}
			}
			if(s.isWalk == true){
				if(s.playerDir == "right"){
					s.playerX += 1;
				}else if(s.playerDir == "left"){
					s.playerX -= 1;
				}else if(s.playerDir == "up"){
					s.playerY -= 1;
				}else if(s.playerDir == "down"){
					s.playerY += 1;
				}
				s.isWalk = false;
			}	
			s.walkCompleteFunc();
		}
	}
}
LScene.prototype.walkCompleteFunc = function(){}
LScene.prototype.moveMap = function(dir){
	var s = this;
	switch(dir){
		case "right":
			s.x -= s.playerStep;
			s.player.x += s.playerStep;
			s.talkLayer.x += s.playerStep;
			s.isWalk = true;
			break;
		case "left":
			s.x += s.playerStep;
			s.player.x -= s.playerStep;
			s.talkLayer.x -= s.playerStep;
			s.isWalk = true;
			break;
		case "up":
			s.y += s.playerStep;
			s.player.y -= s.playerStep;
			s.talkLayer.y -= s.playerStep;
			s.isWalk = true;
			break;
		case "down":
			s.y -= s.playerStep;
			s.player.y += s.playerStep;
			s.talkLayer.y += s.playerStep;
			s.isWalk = true;
			break;
	}
}
LScene.prototype.startTalk = function(){
	var s = this;
	var tx = s.playerX,ty = s.playerY;
	switch(s.playerDir){
		case "right":
			tx += 1;
			break;
		case "left":
			tx -= 1;
			break;
		case "up":
			ty -= 1;
			break;
		case "down":
			ty += 1;
			break;
	}
	for(var key in s.characterList){
		if((s.characterList[key].x/s.mapPartWidth) == tx && (s.characterList[key].y)/s.mapPartHeight == ty){
			if(s.talking == false){
				if(s.talkNum < s.talkList[s.characterList[key].index].length){
					s.talk.setData(s.talkList[s.characterList[key].index]);
					s.addTalk();
					s.say();
					s.player.mode = "cannotmove";
				}
			}else{
				if(s.talkNum < s.talkList[s.characterList[key].index].length){
					s.say();
				}else{
					s.talk.clear();
					s.player.mode = "";
					s.talking = false;
					s.talkNum = 0;
					s.talkLayer.removeAllChild();
				}
			}
		}
    }
}
LScene.prototype.say = function(){
	var s = this;
	s.talking = true;
	s.talk.wind(s.talkNum);
	s.talkNum++;
}
LScene.prototype.addTalk = function(){
	var s = this;
	s.stepIndex = 0;
	s.talkLayer.addChild(s.talkBack);
	s.talkLayer.addChild(s.talk);
}
LScene.prototype.setTalkStyle = function(faceStyle,nameStyle,msgStyle,back,textWidth){
	var s = this;
	if(!faceStyle)faceStyle = {x:0,y:0};
	if(!nameStyle)nameStyle = {x:0,y:0,font:"utf-8",size:"15",color:"black"};
	if(!msgStyle)msgStyle = {x:0,y:0,font:"utf-8",size:"15",color:"black"};
	if(!back)back = null;
	s.talkBack = back;
	s.talk.setFaceStyle(faceStyle);
	s.talk.setNameStyle(nameStyle);
	s.talk.setMsgStyle(msgStyle);
	s.talk.textWidth = textWidth;
}
