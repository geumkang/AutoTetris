function autoPlay(currentBlock, guideBlock, gameBoxID){
	if(gameBoxID == userGameBoxID)
		blockType = currentBlockType;
	else
		blockType = currentBlockTypePC;

	var direction;
	var left = '37';
	var right = '39';
	var checkMode;
	var maxWeight; // weight, rotateCnt, col, maxHeight

	if(blockType == 0)
		checkMode = 2;
	else if(blockType == 3 || blockType == 4 || blockType == 5)
		checkMode = 2;
	else
		checkMode = 4;

	for(var i = 0; i < 5; i++){
		moveBlock(left, currentBlock, gameBoxID);
		guideBlock = drawGuide(currentBlock, guideBlock, gameBoxID);
	}

	maxWeight = [0, 0, 0, 100];
	direction = right;
	for(var rotateCnt = 0; rotateCnt < checkMode; rotateCnt++){
		
		for(var j = 0; j < Col; j++){
			currentWeight = guideBlockWeight(currentBlock, guideBlock, gameBoxID);
			maxHeight = findMaxHeight(guideBlock);
			if(currentWeight > maxWeight[0]){
				maxWeight[0] = currentWeight;
				maxWeight[1] = rotateCnt;
				maxWeight[2] = guideBlock[0][1];
				maxWeight[3] = maxHeight;
			}
			else if(currentWeight == maxWeight[0]){
				if(maxWeight[3] < maxHeight){
					maxWeight[0] = currentWeight;
					maxWeight[1] = rotateCnt;
					maxWeight[2] = guideBlock[0][1];
					maxWeight[3] = maxHeight;
				}
			}
			moveBlock(direction, currentBlock, gameBoxID);
			guideBlock = drawGuide(currentBlock, guideBlock, gameBoxID);
		}


		rotateBlock(currentBlock, gameBoxID);
		guideBlock = drawGuide(currentBlock, guideBlock, gameBoxID);

		moveBlock(direction, currentBlock);
		guideBlock = drawGuide(currentBlock, guideBlock, gameBoxID);
		
		if(direction == left)
			direction = right;
		else
			direction = left;
	}
	
	for(var i = 0; i < maxWeight[1]; i++){
		rotateBlock(currentBlock, gameBoxID);
		guideBlock = drawGuide(currentBlock, guideBlock, gameBoxID);
	}

	for(var i = 0; i < 3; i++){
		moveBlock(left, currentBlock, gameBoxID);
		guideBlock = drawGuide(currentBlock, guideBlock, gameBoxID);
	}

	for(var j = 0; j < Row - 1; j++){
		if(guideBlock[0][1] == maxWeight[2])
			break;
		moveBlock(right, currentBlock, gameBoxID);
		guideBlock = drawGuide(currentBlock, guideBlock, gameBoxID);
	}

	dropBlock(currentBlock, gameBoxID);
}

function guideBlockWeight(currentBlock, guideBlock, gameBoxID){
	var weight = 0;
	var num = [0,0,0,0,0];
	for(var i = 0; i < 4; i++){
		if($(gameBoxID + " tr").eq(guideBlock[i][0] + 1).children().eq(guideBlock[i][1]).css("backgroundColor") != "rgba(0, 0, 0, 0)" ||
			guideBlock[i][0] + 1 == Row){
			if(!isCurrentBlock(guideBlock, guideBlock[i][0] + 1, guideBlock[i][1])){
				weight++;	
				num[0]++;			
			}
		}

		if($(gameBoxID + " tr").eq(guideBlock[i][0]).children().eq(guideBlock[i][1] - 1).css("backgroundColor") != "rgba(0, 0, 0, 0)"
			&& guideBlock[i][1] != 0){
			if(!isCurrentBlock(guideBlock, guideBlock[i][0], guideBlock[i][1] - 1)){
				weight++;
				num[1]++;			
			}
		}

		if($(gameBoxID + " tr").eq(guideBlock[i][0]).children().eq(guideBlock[i][1] - 1).css("backgroundColor") != "rgba(0, 0, 0, 0)"
			&& guideBlock[i][1] == Col - 1){
			if(!isCurrentBlock(guideBlock, guideBlock[i][0], guideBlock[i][1] - 1)){
				weight++;	
				num[2]++;	
			}
		}

		if($(gameBoxID + " tr").eq(guideBlock[i][0]).children().eq(guideBlock[i][1] + 1).css("backgroundColor") != "rgba(0, 0, 0, 0)" 
			&& guideBlock[i][1] != Col - 1){
			if(!isCurrentBlock(guideBlock, guideBlock[i][0], guideBlock[i][1] + 1)){
				weight++;	
				num[3]++;	
			}
		}

		if($(gameBoxID + " tr").eq(guideBlock[i][0]).children().eq(guideBlock[i][1] + 1).css("backgroundColor") != "rgba(0, 0, 0, 0)"
			&& guideBlock[i][1] == 0){
			if(!isCurrentBlock(guideBlock, guideBlock[i][0], guideBlock[i][1] + 1)){
				weight++;	
				num[4]++;			
			}
		}

		blank = 1;
		while($(gameBoxID + " tr").eq(guideBlock[i][0] + blank).children().eq(guideBlock[i][1]).css("backgroundColor") == "rgba(0, 0, 0, 0)"){
			if(isCurrentBlock(guideBlock, guideBlock[i][0] + 1, guideBlock[i][1]))
				break;
			else
				weight--;
			blank++;
		}

	}
	return weight;
}

function findMaxHeight(guideBlock){
	maxHeight = 0;
	for(var i = 0; i < 4; i++){
		if(guideBlock[i][0] > maxHeight)
			maxHeight = guideBlock[i][0];
	}

	if(maxHeight == 0)
		window.alert("maxHeight Error");

	return maxHeight;
}



function createBlock(gameBoxID){

	var blockSet = [[[0,4], [0,5], [1,4], [1,5]],	// 네모
					[[1,4], [0,3], [1,3], [1,5]],	// 니은
					[[1,4], [1,3], [1,5], [0,5]],	// 반대 니은
					[[1,4], [0,4], [1,5], [2,5]],	// 꼬부리
					[[1,5], [1,4], [0,5], [2,4]],	// 반대꼬부리
					[[1,4], [0,4], [2,4], [3,4]],	// ㅣ
					[[1,4], [1,3], [1,5], [0,4]]]	// ㅗ

	var block;

	if(gameBoxID == userGameBoxID){
		currentBlockType = nextBlockType.shift();
		nextBlockType.push(blockOrderData.shift());
		
		block = blockSet[currentBlockType];
		
		InitNextBlock();
		fillNextBlock(blockSet[nextBlockType[0]], blockSet[nextBlockType[1]]);
	}
	else{
		currentBlockTypePC = blockOrderDataPC.shift();
		block = blockSet[currentBlockTypePC];
	}
	fillBlock(block, gameBoxID);
	rotateType = true;

	$(gameBoxID + " td").attr("class", "originBlock");

	return block;
}


function InitNextBlock(){
	if($(".nextBlock:has(tr)").length == 0){
		for(var i = 0; i < 5; i++)
			$(".nextBlock").append("<tr></tr>");
		for(var j = 0; j < 5; j++)
			$(".nextBlock tr").append("<td></td>");
	}

	for(var i = 0; i < Row; i++){
		for(var j = 0; j < Col; j++){
			$(".nextBlock tr").eq(i).children().eq(j).css("backgroundColor", "rgba(0, 0, 0, 0)");
			$(".nextBlock tr").eq(i).children().eq(j).attr("class", "originBlock");
		}
	}
}

function fillNextBlock(nextBlock1, nextBlock2){
	var colorInfo = ["#fe4365", "rgba(0, 0, 0, 0.7)", "#fc9d9a", "#f9cdad", "#c8c8a9", "rgba(255, 0, 0, 0.7)", "rgba(0, 255, 0, 0.7)"];
	for(var i = 0; i < 4; i++)
		for(j = 0; j < 7; j++)
			if(nextBlockType[0] == j)
				$("#nextBlock1 tr").eq(nextBlock1[i][0]).children().eq(nextBlock1[i][1]-3).css("backgroundColor", colorInfo[j]);
	
	for(var i = 0; i < 4; i++)
		for(j = 0; j < 7; j++)
			if(nextBlockType[1] == j)
				$("#nextBlock2 tr").eq(nextBlock2[i][0]).children().eq(nextBlock2[i][1]-3).css("backgroundColor", colorInfo[j]);
}

function fillBlock(currentBlock, gameBoxID){
	if(gameBoxID == userGameBoxID)
		blockType = currentBlockType;
	else
		blockType = currentBlockTypePC;
	
	var colorInfo = ["#fe4365", "rgba(0, 0, 0, 0.7)", "#fc9d9a", "#f9cdad", "#c8c8a9", "rgba(255, 0, 0, 0.7)", "rgba(0, 255, 0, 0.7)"];
	for(var i = 0; i < 4; i++)
		for(j = 0; j < 7; j++)
			if(blockType == j)
				$(gameBoxID +" tr").eq(currentBlock[i][0]).children().eq(currentBlock[i][1]).css("backgroundColor", colorInfo[j]);
}

function eraseBlock(currentBlock, gameBoxID){
	if(currentBlock == undefined) return;
	for(var i = 0; i < 4; i++){
		$(gameBoxID + " tr").eq(currentBlock[i][0]).children().eq(currentBlock[i][1]).css("backgroundColor", "rgba(0, 0, 0, 0)");
	}
}

function moveBlock(direction, currentBlock, gameBoxID){
	var isMoveable = true;
	eraseBlock(currentBlock, gameBoxID);
	if(direction == 37){				// Left
		for(var i = 0; i < 4; i++){
			if(currentBlock[i][1] == 0)
				isMoveable = false;
			else if($(gameBoxID + " tr").eq(currentBlock[i][0]).children().eq(currentBlock[i][1] - 1).css("backgroundColor") != "rgba(0, 0, 0, 0)"){
				if(!isCurrentBlock(currentBlock, currentBlock[i][0], currentBlock[i][1] - 1))
					isMoveable = false;
			}
		}
		if(isMoveable)
			for(var i = 0; i < 4; i++)
				currentBlock[i][1]--;
	}

	else if(direction == 39){			// Right
		for(var i = 0; i < 4; i++){
			if(currentBlock[i][1] == Col - 1)
				isMoveable = false;
			else if($(gameBoxID + " tr").eq(currentBlock[i][0]).children().eq(currentBlock[i][1] + 1).css("backgroundColor") != "rgba(0, 0, 0, 0)"){
				if(!isCurrentBlock(currentBlock, currentBlock[i][0], currentBlock[i][1] + 1))
					isMoveable = false;
			}
		}
		if(isMoveable)
			for(var i = 0; i < 4; i++)
				currentBlock[i][1]++;
	}

	else if(direction == 40){			// Down
		for(var i = 0; i < 4; i++){
			if(currentBlock[i][0] == Row - 1)
				isMoveable = false;
		}
		if(isMoveable)
			for(var i = 0; i < 4; i++)
				currentBlock[i][0]++;
	}
	fillBlock(currentBlock, gameBoxID);
}


function multiplyMatrix(a, b) { 
	var aNumRows = a.length, aNumCols = a[0].length,
	bNumRows = b.length, bNumCols = b[0].length,
	m = new Array(aNumRows);  // initialize array of rows
	for (var r = 0; r < aNumRows; ++r) {
		m[r] = new Array(bNumCols); // initialize the current row
		for (var c = 0; c < bNumCols; ++c) {
			m[r][c] = 0;             // initialize the current cell
			for (var i = 0; i < aNumCols; ++i) {
				m[r][c] += Math.round(a[r][i] * b[i][c]);
			}
		}
	}
	return m;
} 


function rotateBlock(currentBlock, gameBoxID){
	if(gameBoxID == userGameBoxID)
		blockType = currentBlockType;
	else
		blockType = currentBlockTypePC;

	eraseBlock(currentBlock, gameBoxID);
	var rotate90Mode = [[0, -1], [1, 0]];
	var rotate270Mode = [[0, 1], [-1, 0]];
	var tempBlock = [];
	for(var i = 0; i < 4; i++)
		tempBlock[i] = currentBlock[i].slice();

	for(var i = 0; i < 4; i++){
		tempBlock[i][0] -= currentBlock[0][0];
		tempBlock[i][1] -= currentBlock[0][1];
	}

	if(blockType == 0){

	}
	else if(blockType == 1 || blockType == 2 || blockType == 6){
		if(rotateMode)
			tempBlock = multiplyMatrix(tempBlock, rotate90Mode);
		else
			tempBlock = multiplyMatrix(tempBlock, rotate270Mode);
	}
	else{
		if(rotateType)
			if(rotateMode)
				tempBlock = multiplyMatrix(tempBlock, rotate90Mode);
			else
				tempBlock = multiplyMatrix(tempBlock, rotate270Mode);
		else
			if(rotateMode)
				tempBlock = multiplyMatrix(tempBlock, rotate270Mode);
			else
				tempBlock = multiplyMatrix(tempBlock, rotate90Mode);
		
		rotateType = !rotateType;
	}
	for(var i = 0; i < 4; i++){
		tempBlock[i][0] += currentBlock[0][0];
		tempBlock[i][1] += currentBlock[0][1];
	}


	for(var i = 0; i < 4; i++){
		var overVal = 0;
		if(tempBlock[i][1] < 0)
			overVal = -tempBlock[i][1];
		else if(tempBlock[i][1] > Col - 1)
			overVal = Col - tempBlock[i][1] - 1;

		if(overVal != 0){
			for(var j = 0; j < 4; j++){
				tempBlock[j][1] += overVal;
			}
			i = 0;
		}
	}

	if(isRotateable(tempBlock, gameBoxID)){
		for(var i = 0; i < 4; i++)
			currentBlock[i] = tempBlock[i].slice();
	}

	fillBlock(currentBlock, gameBoxID);
}

function isRotateable(tempBlock, gameBoxID){
	for(var i = 0; i < 4; i++){
		if($(gameBoxID + " tr").eq(tempBlock[i][0]).children().eq(tempBlock[i][1]).css("backgroundColor") != "rgba(0, 0, 0, 0)")
			return false;
	}
	return true;
}

function dropBlock(currentBlock, gameBoxID){
	var isMoveable = true;
	eraseBlock(currentBlock, gameBoxID);
	while(!isOverlayed(currentBlock, gameBoxID)){
		for(var i = 0; i < 4; i++)
			currentBlock[i][0]++;
	}
	fillBlock(currentBlock, gameBoxID);
}

function isOverlayed(currentBlock, gameBoxID){
	var overlay = false;
	for(var i = 0; i < 4; i++){
		if(currentBlock[i][0] == Row - 1)
			return true;
		else if($(gameBoxID + " tr").eq(currentBlock[i][0] + 1).children().eq(currentBlock[i][1]).css("backgroundColor") != "rgba(0, 0, 0, 0)"){
			if(!isCurrentBlock(currentBlock, currentBlock[i][0] + 1, currentBlock[i][1])){
				return true;
				break;
			}
		}
		
	}

	return false;
}

function isCurrentBlock(currentBlock, row, col){
	for(var i = 0; i < 4; i++){
		if(currentBlock[i][0] == row && currentBlock[i][1] == col){
			return true;
		}
	}
	return false;	
}

function checkCompleteLine(currentBlock, currentBlockPC, guideBlock, gameBoxID){
	var player, enemy;
	if(gameBoxID == userGameBoxID){
		player = currentBlock;
		enemy = currentBlockPC;
	}
	else if(gameBoxID == comGameBoxID){
		player = currentBlockPC;
		enemy = currentBlock;
	}

	var fillCount, score = 0;
	for(var rowIdx = 0; rowIdx < Row; rowIdx++){
		fillCount = 0;

		for(var colIdx = Col - 1; colIdx >= 0; colIdx--){
			if($(gameBoxID + " tr").eq(rowIdx).children().eq(colIdx).css("backgroundColor") != "rgba(0, 0, 0, 0)")
				fillCount++;
			if(fillCount == 0) break;
		}

		if(fillCount == Col){
			score += 10;
			if(!isOverlayed(player, gameBoxID))
				eraseBlock(player, gameBoxID);
			for(var colIdx = 0; colIdx < Col; colIdx++)
				$(gameBoxID + " tr").eq(rowIdx).children().eq(colIdx).css("backgroundColor", "rgba(0, 0, 0, 0)");
			for(var temp = rowIdx; temp > 0; temp--){	
				for(var colIdx = 0; colIdx < Col; colIdx++){
					$(gameBoxID + " tr").eq(temp).children().eq(colIdx).css("backgroundColor", $(gameBoxID + " tr").eq(temp - 1).children().eq(colIdx).css("backgroundColor"));
					$(gameBoxID + " tr").eq(temp - 1).children().eq(colIdx).css("backgroundColor", "rgba(0, 0, 0, 0)");
				}
			}
			if(!isOverlayed(player, gameBoxID))
				fillBlock(player, gameBoxID);
		}
	}
	console.log(score);
	doAttack(enemy, gameBoxID, score);

	$("label#score").text(parseInt($("#score").text()) + score);
	guideBlock = drawGuide(player, guideBlock, gameBoxID);
}

function doAttack(currentBlock, gameBoxID, score){
	var attackTo;
	if(gameBoxID == userGameBoxID)
		attackTo = comGameBoxID;
	else if(gameBoxID == comGameBoxID)
		attackTo = userGameBoxID;

	if(score >= 20){
		eraseBlock(currentBlock, attackTo);
		for(var rowIdx = 0; rowIdx < Row - 1; rowIdx++){	
			for(var colIdx = 0; colIdx < Col; colIdx++){
				$(attackTo + " tr").eq(rowIdx).children().eq(colIdx).css("backgroundColor", $(attackTo + " tr").eq(rowIdx + 1).children().eq(colIdx).css("backgroundColor"));
				$(attackTo + " tr").eq(rowIdx + 1).children().eq(colIdx).css("backgroundColor", "rgba(0, 0, 0, 0)");
			}
		}

		var val1 = Math.floor(Math.random() * Col);
		//var val2 = Math.floor(Math.random() * Col);
		for(var colIdx = 0; colIdx < Col; colIdx++){
			if(colIdx != val1) // && colIdx != val2)
				$(attackTo + " tr").eq(Row - 1).children().eq(colIdx).css("backgroundColor", "rgba(255, 255, 0, 0.5)");
		}
		if(!isOverlayed(currentBlock, attackTo))
			fillBlock(currentBlock, attackTo);
		else{
			isMoveable = true;
			while(!isOverlayed(currentBlock, attackTo)){	
				for(var i = 0; i < 4; i++){
					if(currentBlock[i][0] == 0)
						isMoveable = false;
				}
				if(isMoveable)
					for(var i = 0; i < 4; i++)
						currentBlock[i][0]--;
			}
			fillBlock(currentBlock, attackTo);
		}
	}
}

function drawGuide(currentBlock, guideBlock, gameBoxID){
	if(guideBlock != undefined){
		$(gameBoxID + " td").attr("class", "originBlock");
	}

	if(guideMode){
		guideBlock = [[0,0], [0,0], [0,0], [0,0]];
		for(var i = 0; i < 4; i++)
			guideBlock[i] = currentBlock[i].slice();

		while(!isOverlayed(guideBlock, gameBoxID)){
			var check = true;
			for(var i = 0; i < 4; i++){
				if(guideBlock[i][0] == Row - 1)
					check = false;
			}
			if(check){
				for(var i = 0; i < 4; i++)
					guideBlock[i][0]++;
			}
			else
				break;
		}

		for(var i = 0; i < 4; i++){
			$(gameBoxID + " tr").eq(guideBlock[i][0]).children().eq(guideBlock[i][1]).attr("class", "guideBlock");
		}
	}
	return guideBlock;
}