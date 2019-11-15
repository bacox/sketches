/**
 * @file Dynamic Background with triangles
 * @copyright Bart Cox 2019
 */

 let canvasWidth = 500;
 let canvasHeight = 500;

 let controlPane = {
 	width: 0,
 	height: 0,
 	color: {r: 241, g:242, b:227},
 	frameRateSlider: null,
 	speedSlider: null,
 	borderCheckbox: null,
 	drawBorders: false
 }

 let colorPallete = [
	{r: 38, g: 70, b: 83}, // #264653
	{r: 42, g: 157, b: 143}, // #2A9D8F
	{r: 233, g: 196, b: 106}, // #E9C46A
	{r: 244, g: 162, b: 97}, // #F4A261
	{r: 231, g: 111, b: 81} // #E76F51
	]

	let totalRandomColors = false;

	let padding = 100;
	let vPadding = padding * (2/3);
	let nodesize = 5;
	let numberOfNodesW = 0;
	let numberOfNodesV = 0;
	let transitionSpeed = 0.005;
	let transitionSpeedMargin = 0.005;
	let tUpper = transitionSpeed + (transitionSpeedMargin / 2);
	let tLower = transitionSpeed - (transitionSpeedMargin / 2);
	let nodes = [];
	let triangles = [];
	let t;

	let transition = 0;
	function setup() {
		canvasWidth = windowWidth + padding;
		canvasHeight = windowHeight + padding;

		controlPane.height = canvasHeight;
		controlPane.width = 200;

		createCanvas(canvasWidth, canvasHeight);
		
		controlPane.frameRateSlider = createSlider(1, 60, 60, 1);
		controlPane.frameRateSlider = controlPane.frameRateSlider.position(100, 10);
		controlPane.frameRateSlider = controlPane.frameRateSlider.style('width', '80px');
		controlPane.speedSlider = createSlider(100, 1000, 500, 1);
		controlPane.speedSlider = controlPane.speedSlider.position(100, 40);
		controlPane.speedSlider = controlPane.speedSlider.style('width', '80px');
		controlPane.borderCheckbox = createCheckbox('Borders', true);
		controlPane.borderCheckbox.position(10, 70);
		transitionSpeed = controlPane.speedSlider.value()/20000;
		transitionSpeedMargin = controlPane.speedSlider.value()/20000;
		tUpper = transitionSpeed + (transitionSpeedMargin / 2);
		tLower = transitionSpeed - (transitionSpeedMargin / 2);
		createGrid();
		t = createTriangle([{x: 50, y: 50}, {x: 100, y: 50}, {x: 100, y: 100}], color(255, 204, 0), 1);
		createTriangles();
		changeCoords();
	}

	function draw() {
		frameRate(controlPane.frameRateSlider.value());
		let tSpeed = controlPane.speedSlider.value() / 20000;
		controlPane.drawBorders = controlPane.borderCheckbox.checked()
		
		transitionSpeed = tSpeed;
		transitionSpeedMargin = tSpeed;
		tUpper = transitionSpeed + (transitionSpeedMargin / 2);
		tLower = transitionSpeed - (transitionSpeedMargin / 2);

		background(200);
		updateCoords();
		drawNodes();
		drawTriangles();
		updateTransition();
		drawControl();
	}

	function drawControl() {
		let c = controlPane.color;
		fill(color(c.r, c.g, c.b))
		rect(0,0, controlPane.width , controlPane.height)

		textSize(16);
		fill(0, 0, 0);
		text('FrameRate', 10, 27);
		text('Speed', 10, 57);
	}


	function createGrid(){

		numberOfNodesW = round(canvasWidth / padding) + 2;
		let startX = 0 - padding;
		let startY = 0 - vPadding;
		let toggleOffset = false;
		let currentOffset = 0;
		let offset = padding / 2;
	// offset = 0;
	numberOfNodesV = round(canvasHeight / vPadding) + 2;
	
	for(let j = 0; j < numberOfNodesV; j ++){
		if(toggleOffset) {
			currentOffset = offset;
			toggleOffset = false;
		} else {
			toggleOffset = true;
			currentOffset = 0;
		}
		toggleOffset != toggleOffset;
		let y_pos = startY + (j * vPadding);
		for(let i = 0; i < numberOfNodesW; i++) {
			let x_pos = startX + (i * padding) + currentOffset;
			nodes.push(createNode(x_pos, y_pos, nodesize, random(tLower, tUpper)));
		}
	}
}

function changeCoords(){	
	_.map(nodes, changeNodeCoords)
}

function changeNodeCoords(nodeObj) {
	let r = padding / 3;
	nodeObj.x_goal = random(nodeObj.x_orig - r, nodeObj.x_orig + r);
	nodeObj.y_goal = random(nodeObj.y_orig - r, nodeObj.y_orig + r);
	nodeObj.deltaX =  nodeObj.x_goal - nodeObj.x;
	nodeObj.deltaY = nodeObj.y_goal -  nodeObj.y;
	nodeObj.transition = 0;
	nodeObj.transitionSpeed = random(tLower, tUpper);
}

function updateCoords() {
	_.map(nodes, function(node){
		node.x +=  node.deltaX * node.transitionSpeed
		node.y +=  node.deltaY * node.transitionSpeed
	})
}

function updateTransition() {
	_.map(nodes, function(node){
		node.transition += node.transitionSpeed;
		if(node.transition > 1) {
			changeNodeCoords(node)

		}
	})
}

function pickColor() {

	if(totalRandomColors) {
		let r = random(100, 200);
		let g = random(100, 200);
		let b = random(100, 200);
		return color(r,g,b);
	}
	let p = random(colorPallete);
	return color(p.r, p.g, p.b);	
}

function createTriangles(){
	let flip = false;
	let strokeSize = 0;
	for(let j= 0; j < numberOfNodesV - 1; j++){
		if(flip) {
			flip = false;
		} else {
			flip = true;
		}
		for(let i = 0 + (j * numberOfNodesW); i < numberOfNodesW + (j * numberOfNodesW) -1; i++){
			
			if(!flip) {
				let nodeList = [nodes[i], nodes[i+1], nodes[i+numberOfNodesW+1]]
				let t = createTriangle(nodeList, pickColor(), strokeSize);
				triangles.push(t);

				let nodeList2 = [nodes[i + numberOfNodesW], nodes[i+1 + numberOfNodesW], nodes[i]]
				let t2 = createTriangle(nodeList2, pickColor(), strokeSize);
				triangles.push(t2);
			} else {
				let nodeList = [nodes[i], nodes[i+1], nodes[i+numberOfNodesW]]
				let t = createTriangle(nodeList, pickColor(), strokeSize);
				triangles.push(t);

				let nodeList2 = [nodes[i + numberOfNodesW], nodes[i+1 + numberOfNodesW], nodes[i+1]]
				let t2 = createTriangle(nodeList2, pickColor(), strokeSize);
				triangles.push(t2);
			}
		}
	}
}

function createTriangle(listOfNodes, color, strokeSize){
	return {
		nodes: listOfNodes,
		color: color,
		strokeSize: strokeSize
	};
}

function drawTriangles() {
	_.forEach(triangles, drawTriangle);
}

function drawTriangle(triangleObj){
	fill(triangleObj.color);
	if(controlPane.drawBorders) {
		stroke(151);
		strokeWeight(1);
	} else {
		strokeWeight(0);
	}
	triangle(triangleObj.nodes[0].x, triangleObj.nodes[0].y, triangleObj.nodes[1].x, triangleObj.nodes[1].y, triangleObj.nodes[2].x, triangleObj.nodes[2].y)
	stroke(0);
	strokeWeight(0);
}

function createNode(xpos, ypos, radius, transitionSpeed){
	return {
		x: xpos,
		y: ypos,
		x_orig: xpos,
		y_orig: ypos,
		r: radius,
		x_goal: xpos,
		y_goal: ypos,
		deltaX: 0,
		deltaY: 0,
		transition: 0,
		transitionSpeed : transitionSpeed
	};
}

function drawNodes(){
	_.forEach(nodes, drawNode);
}

function drawNode(node) {
	fill(0);
	strokeWeight(node.size);
	circle(node.x, node.y, node.r);
}