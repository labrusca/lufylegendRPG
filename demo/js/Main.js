LSystem.screen(LStage.FULL_SCREEN);
init(50,"mylegend",480,288,main);
LGlobal.setDebug(true);
LRPG.setShortcuts(true);

var backLayer,loadingLayer;
var loadData = [
	{path:"./js/script.js",type:"js"},
	{name:"map",path:"./images/map01.jpg"},
	{name:"player",path:"./images/p0.png"},
	{name:"npc",path:"./images/p1.png"},
	{name:"m",path:"./images/m.jpg"},
	{name:"n",path:"./images/n.jpg"},
	{name:"talk",path:"./images/back.png"},
	{name:"e1",path:"./images/e1.png"},
	{name:"e2",path:"./images/e2.png"}
];
var datalist = [];

var map,mapData;
var charaList;
var talkContent;
var jumpTo;
var stage;

var isJumpMap = false;
var stageObj;

var dir = "";

function main(){
	loadingLayer = new LoadingSample3(); 
	addChild(loadingLayer); 

	LLoadManage.load(
		loadData,
		function(progress){
			loadingLayer.setProgress(progress);
		},
		gameInit
	);
}
function gameInit(result){
	removeChild(loadingLayer);
	datalist = result;
	
	initLayer();
	
	initScriptData();
	stage = script.stage01;
	initScript();
	addCtrl();
}
function initLayer(){
	backLayer = new LSprite();
	addChild(backLayer);
	ctrlLayer = new LSprite();
	addChild(ctrlLayer);
}
function addScene(){
	var mapObj = new LTileMap(map,datalist["map"],32,32,mapData);
	var stageData = new LSceneData(mapObj,charaList,talkContent);
	stageObj = new LScene(stageData);
	backLayer.addChild(stageObj);
	
	var talkBoardData = new LBitmapData(datalist["talk"]);
	var talkBoard = new LBitmap(talkBoardData);
	talkBoard.scaleX = 28;
	talkBoard.scaleY = 6.2;
	talkBoard.x = 100;
	talkBoard.y = 70;
	talkBoard.alpha = 0.7;
	
	stageObj.talk.x = 120;
	stageObj.talk.y = 30;
	stageObj.setTalkStyle({x:-80,y:20},{x:20,y:55,size:12,color:"lightgray"},{x:20,y:85,size:10,color:"lightgray"},talkBoard,200);
	stageObj.addMoveEventListener(LEvent.COMPLETE,function(){
		for(var i=0;i<jumpTo.length;i++){
			if(isJumpMap == false && stageObj.playerX == jumpTo[i].at.x && stageObj.playerY == jumpTo[i].at.y){
				stage = script[jumpTo[i].to];
				initScript();
				isJumpMap = true;
			}
			if(isJumpMap == true)isJumpMap = false;
		}
	});
}
function addCtrl(){
	var bitmapdata = new LBitmapData(datalist["e1"]);
	var bitmap = new LBitmap(bitmapdata);
	bitmap.x = 0;
	bitmap.y = 0;
	ctrlLayer.addChild(bitmap);
	var bitmapdata = new LBitmapData(datalist["e2"]);
	var bitmap = new LBitmap(bitmapdata);
	bitmap.x = 280;
	bitmap.y = 30;
	ctrlLayer.addChild(bitmap);
	ctrlLayer.x = 40;
	ctrlLayer.y = 160;
	
	addEvent();
}
function addEvent(){
	backLayer.addEventListener(LMouseEvent.MOUSE_DOWN,ondown);
	backLayer.addEventListener(LMouseEvent.MOUSE_UP,onup);
	backLayer.addEventListener(LEvent.ENTER_FRAME,onframe);
}
function ondown(event){
	if(event.offsetX >= ctrlLayer.x + 40 && event.offsetX <= ctrlLayer.x+80){
		if(event.offsetY >= ctrlLayer.y && event.offsetY <= ctrlLayer.y+40){
			dir = "UP";
		}else if(event.offsetY >= ctrlLayer.y+80 && event.offsetY <= ctrlLayer.y+120){
			dir = "DOWN";
		}
	}else if(event.offsetX >= ctrlLayer.x && event.offsetX <= ctrlLayer.x+40){
		dir = "LEFT";
	}else if(event.offsetX >= ctrlLayer.x+80 && event.offsetX <= ctrlLayer.x+120){
		dir = "RIGHT";
	}
}
function onup(event){
	dir = "";
	if(event.offsetX >= ctrlLayer.x + 280 && event.offsetX <= ctrlLayer.x+330){
		if(event.offsetY >= ctrlLayer.y+40 && event.offsetY <= ctrlLayer.y+100){
			stageObj.startTalk();
		}
	}
}
function onframe(){
	switch(dir){
		case "UP":
			stageObj.movePlayer(LPlayerMove.UP);
			break;
		case "DOWN":
			stageObj.movePlayer(LPlayerMove.DOWN);
			break;
		case "LEFT":
			stageObj.movePlayer(LPlayerMove.LEFT);
			break;
		case "RIGHT":
			stageObj.movePlayer(LPlayerMove.RIGHT);
			break;
	}
}