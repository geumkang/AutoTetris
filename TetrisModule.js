var size = 40;
var Row, Col;
var currentBlockType, nextBlockType = [], currentBlockTypePC;
var gameMode = false;
var guideMode = true;
var rotateMode = true;
var rotateType = true;

var blockOrderData = [];
var blockOrderDataPC = [];

var timer, autoTimer, comTimer, comAutoTimer;
var autoPlayMode = false;

var autoDropTime = 1000;
var autoPlayTime = 1000;

var userGameBoxID = "#gamebox";
var comGameBoxID = "#gameboxPC";

$(function() {

	var currentBlock = null;
	var guideBlock = null;
	InitNextBlock();

	var currentBlockPC = null;
	var guideBlockPC = null;
	
	$("#guideMode, #rotateMode, #gameMode").on("mousedown", function(event){
		$(this).css("backgroundColor", "red");
	});

	$("#guideMode, #rotateMode, #gameMode").on("mouseup", function(event){
		$(this).css("backgroundColor", "black");
	});

	$("#startBtn").on("mouseenter", function(event){
		$("#startBtn").css("backgroundColor", "red");
	});	

	$("#startBtn").on("mouseleave", function(event){
		$("#startBtn").css("backgroundColor", "black");
	});	

	$("#guideMode").on("click", function(event){
		if(!autoPlayMode){
			if(guideMode){
				$("#guideMode").css("backgroundColor", "black");
				$("#guideMode").val("가이드 OFF");
			}
			else{
				$("#guideMode").css("backgroundColor", "black");
				$("#guideMode").val("가이드 ON");
			}
			guideMode = !guideMode;
			guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
		}
		$("#gamebox").focus();
	});

	$("#rotateMode").on("click", function(event){
		if(rotateMode){
			$("#rotateMode").css("backgroundColor", "black");
			$("#rotateMode").val("시계 방향");
		}
		else{
			$("#rotateMode").css("backgroundColor", "black");
			$("#rotateMode").val("반시계 방향");
		}
		rotateMode = !rotateMode;
		$("#gamebox").focus();
	});	

	function callbackTimer(gameBoxID){
		if(gameBoxID == userGameBoxID){
			checkCompleteLine(currentBlock, currentBlockPC, guideBlock, gameBoxID);
			guideBlockPC = drawGuide(currentBlockPC, guideBlockPC, comGameBoxID);
			if(!isOverlayed(currentBlock, gameBoxID)){
				moveBlock('40', currentBlock, gameBoxID);
			}
			else{			
				currentBlock = createBlock(gameBoxID);
				guideBlock = drawGuide(currentBlock, guideBlock, gameBoxID);
				if(isOverlayed(currentBlock, gameBoxID)){
					clearTimeout(timer);
					clearTimeout(comTimer);
					clearTimeout(comAutoTimer);
					gameMode = false;
					$("#startBtn").css("visibility", "visible");
					$("#gamebox").css("opacity", "0.5");
					$("#gameboxPC").css("opacity", "0.5");
					$("#loseImg").css("display", "block");
					return;
				}
			}
			timer = setTimeout(function(){
				callbackTimer(gameBoxID);
			}, autoDropTime);
		}
		else{
			checkCompleteLine(currentBlock, currentBlockPC, guideBlockPC, gameBoxID);
			guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
			if(!isOverlayed(currentBlockPC, gameBoxID)){
				moveBlock('40', currentBlockPC, gameBoxID);
			}
			else{			
				currentBlockPC = createBlock(gameBoxID);
				guideBlockPC = drawGuide(currentBlockPC, guideBlockPC, gameBoxID);
				if(isOverlayed(currentBlockPC, gameBoxID)){
					clearTimeout(timer);
					clearTimeout(comTimer);
					clearTimeout(comAutoTimer);
					gameMode = false;
					$("#startBtn").css("visibility", "visible");
					$("#gamebox").css("opacity", "0.5");
					$("#gameboxPC").css("opacity", "0.5");
					$("#winImg").css("display", "block");
					return;
				}
			}
			comTimer = setTimeout(function(){
				callbackTimer(gameBoxID);
			}, autoDropTime);
		}
		
	}

	$("#gameMode").on("click", function(event){
		if($("#startBtn").css("visibility") == "hidden"){
			if(gameMode){
				$("#gameMode").css("backgroundColor", "black");
				$("#gameMode").val("PLAY");
				clearTimeout(timer);
				clearTimeout(comTimer);
				clearTimeout(comAutoTimer);
				$("#gamebox").css("opacity", "0.5");
				$("#gameboxPC").css("opacity", "0.5");
			}
			else{
				$("#gameMode").css("backgroundColor", "black");
				$("#gameMode").val("PAUSE");
				$("#gamebox").css("opacity", "1.0");
				$("#gameboxPC").css("opacity", "1.0");
				timer = setTimeout(function(){
					callbackTimer(userGameBoxID);
				}, autoDropTime);

				comTimer = setTimeout(function(){
					callbackTimer(comGameBoxID);
				}, autoDropTime);

				comAutoTimer = setTimeout(function(){
					callbackAutoTimer(comGameBoxID);
				}, autoPlayTime);
			}
			gameMode = !gameMode;

			$("#gamebox").focus();
		}
	});	

	$("#timerInterval").on("mouseup", function(event){
		autoDropTime = $("#timerInterval").val();
		$("label#currentTimeInterval").text(autoDropTime/1000 + "s");
		$("#gamebox").focus();
	});

	$("#autoTimerInterval").on("mouseup", function(event){
		autoPlayTime = $("#autoTimerInterval").val();
		$("label#currentAutoTimeInterval").text(autoPlayTime/1000 + "s");
		$("#gamebox").focus();
	});

	function callbackAutoTimer(gameBoxID){
		if(gameMode){
			if(gameBoxID == userGameBoxID){
				autoPlay(currentBlock, guideBlock, gameBoxID);
				currentBlock = createBlock(gameBoxID);
				guideBlock = drawGuide(currentBlock, guideBlock, gameBoxID);
				autoTimer = setTimeout(function(){
					callbackAutoTimer(gameBoxID);
				}, autoPlayTime);
			}
			else{
				autoPlay(currentBlockPC, guideBlockPC, gameBoxID);
				currentBlockPC = createBlock(gameBoxID);
				guideBlockPC = drawGuide(currentBlockPC, guideBlockPC, gameBoxID);
				comAutoTimer = setTimeout(function(){
					callbackAutoTimer(gameBoxID);
				}, autoPlayTime);
			}
		}
		
	}

	$("#autoPlayMode").on("click", function(event){
		if(autoPlayMode){
			$("#autoPlayMode").val("MANUAL");
			clearTimeout(autoTimer);
		}
		else{
			$("#autoPlayMode").val("AUTO");
			$("#guideMode").val("가이드 ON");
			guideMode = true;
			autoTimer = setTimeout(function(){
				callbackAutoTimer(userGameBoxID);
			}, autoPlayTime);
		}
		
		autoPlayMode = !autoPlayMode;
		$("#gamebox").focus();
	});

	$("#startBtn").on("click", function(event){
		gameMode = true;
		$("label#score").text(0);
		$("#startBtn").css("visibility", "hidden");
		$(".matchResult").css("display", "none");
		$(userGameBoxID).css("opacity", "1.0");
		$(comGameBoxID).css("opacity", "1.0");
		$(userGameBoxID).focus();
		Row = Math.round($(userGameBoxID).height() / size);
		Col = Math.round($(userGameBoxID).width() / size);
		
		InitMap(userGameBoxID);
		InitMap(comGameBoxID);
		createBlockOrderData();

		currentBlock = createBlock(userGameBoxID);
		guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);

		currentBlockPC = createBlock(comGameBoxID);
		guideBlockPC = drawGuide(currentBlockPC, guideBlockPC, comGameBoxID);

		timer = setTimeout(function(){
			callbackTimer(userGameBoxID);
		}, autoDropTime);

		comTimer = setTimeout(function(){
			callbackTimer(comGameBoxID);
		}, autoDropTime);

		comAutoTimer = setTimeout(function(){
			callbackAutoTimer(comGameBoxID);
		}, autoPlayTime);

	});

	$(userGameBoxID).on("keydown", function(event) {
		if(gameMode && !autoPlayMode){
			if(event.which == '37'){		// Left
				if(!isOverlayed(currentBlock, userGameBoxID)){
					moveBlock(event.which, currentBlock, userGameBoxID);
					guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
				}
				else{
					currentBlock = createBlock(userGameBoxID);
					guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
				}
			}
			else if(event.which == '39'){	// Right
				if(!isOverlayed(currentBlock, userGameBoxID)){
					moveBlock(event.which, currentBlock, userGameBoxID);
					guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
				}
				else{
					currentBlock = createBlock(userGameBoxID);
					guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
				}
			}
			else if(event.which == '40'){	// Down
				if(!isOverlayed(currentBlock, userGameBoxID)){
					moveBlock(event.which, currentBlock, userGameBoxID);
					guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
				}
				else{
					currentBlock = createBlock(userGameBoxID);
					guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
				}
			}
			else if(event.which == '38'){	// Up / Rotate
				rotateBlock(currentBlock, userGameBoxID);
				guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
			}
			else if(event.which == '90'){	// Z Key
				if(!isOverlayed(currentBlock, userGameBoxID)){
					dropBlock(currentBlock, userGameBoxID);
					currentBlock = createBlock(userGameBoxID);
					guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
				}
			}
		}
    });
});



function InitMap(gameBoxID){

	if($(gameBoxID + ":has(tr)").length == 0){
		for(var i = 0; i < Row; i++)
			$(gameBoxID).append("<tr></tr>");
		for(var j = 0; j < Col; j++)
			$(gameBoxID + " tr").append("<td></td>");
	}

	for(var i = 0; i < Row; i++){
		for(var j = 0; j < Col; j++){
			$(gameBoxID + " tr").eq(i).children().eq(j).css("backgroundColor", "rgba(0, 0, 0, 0)");
			$(gameBoxID + " tr").eq(i).children().eq(j).attr("class", "originBlock");
		}
	}	
}

function createBlockOrderData(){
	for(var j = 0; j < 5000; j++){
		var tempData = [0, 1, 2, 3, 4, 5, 6];
		for(var i = 0; i < 20; i++){
			var val1 = Math.floor(Math.random() * 7);
			var val2 = Math.floor(Math.random() * 7);
			
			var temp = tempData[val1];
			tempData[val1] = tempData[val2];
			tempData[val2] = temp;
		}
		blockOrderData = blockOrderData.concat(tempData);
	}

	blockOrderDataPC = blockOrderData.slice();

	nextBlockType.push(blockOrderData.shift());
	nextBlockType.push(blockOrderData.shift());
}