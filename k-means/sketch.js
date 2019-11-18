/**
 * @file K-means
 * @copyright Bart Cox 2019
 */

let canvasWidth = 500;
let canvasHeight = 500;

let nodes = [];

let meanCentres = [];

let K = 5;

let doDrawNodes = true;
let doDrawCentres = true;

let classColorList = [
	'#D3D3D3',
	'#FF0000',
	'#00FF00',
	'#0000FF',
	'#FFFF00',
	'#00FFFF',
	'#FF00FF',
]

let debounce = false;

let controlPane = {
	height: canvasHeight,
	width: 200,
	x: 0,
	y: 0,
	color: null,
	title: {
		text: 'K-means',
		size: 32,
		color: null,
	},
	playButton: null,
	resetButton: null,
	randomButton: null,
	stepButton: null,
	drawNodesCheckbox: null,
	drawCentresCheckbox: null,
	inBounds: function(){
		let mx = mouseX;
		let my = mouseY;
		let endx = this.x + this.width;
		let endy = this.y + this.height;
		if (mx < this.x || mx > endx)
			return false;
		if (my < this.y || my > endy)
			return false;
		return true;
	}
};

let contentPane = {
	height: canvasHeight,
	width: 200,
	x: 0,
	y: 0,
	color: null,
	inBounds: function(){
		let mx = mouseX;
		let my = mouseY
		let endx = this.x + this.width;
		let endy = this.y + this.height;
		if (mx < this.x || mx > endx)
			return false;
		if (my < this.y || my > endy)
			return false;
		return true;
	}
};

function setup() {
	canvasWidth = windowWidth;
	canvasHeight = windowHeight-4;

	controlPane.height = canvasHeight;
	controlPane.width = 200;

	createCanvas(canvasWidth, canvasHeight);


	// Setup control pane
	controlPane.width = 200;
	controlPane.height = canvasHeight;
	controlPane.color = color(221,206,170);
	controlPane.title.color = color(0,0,0);

	controlPane.resetButton = createButton('Reset');
  	controlPane.resetButton.position(10, 70);
    controlPane.resetButton.mousePressed(function(){
    	buttonEvent('reset');
    });

    controlPane.playButton = createButton('Play');
  	controlPane.playButton.position(10, 40);
    controlPane.playButton.mousePressed(function(){
    	buttonEvent('play');
    });

    controlPane.playButton = createButton('Random');
  	controlPane.playButton.position(10, 100);
    controlPane.playButton.mousePressed(function(){
    	buttonEvent('random');
    });

    controlPane.playButton = createButton('Step');
  	controlPane.playButton.position(10, 130);
    controlPane.playButton.mousePressed(function(){
    	buttonEvent('step');
    });

    controlPane.drawNodesCheckbox = createCheckbox('Draw Nodes', true);
  	controlPane.drawNodesCheckbox.position(10, 160);
    controlPane.drawNodesCheckbox.changed(toggleDrawNodes);

    controlPane.drawCentresCheckbox = createCheckbox('Draw Centroids', true);
  	controlPane.drawCentresCheckbox.position(10, 190);
    controlPane.drawCentresCheckbox.changed(toggleDrawCentres);
	// Setup content pane
	contentPane.width = canvasWidth + controlPane.width;
	contentPane.height = canvasHeight;
	contentPane.x = controlPane.x + controlPane.width;
	controlPane.y = 0;
	contentPane.color = color(179,216,199);
		
}

function draw() {
	background(180);
	drawContentPane();
	drawControlPane();
	if(doDrawNodes)
		drawNodes();
	if(doDrawCentres)
		drawK();
}

function drawNodes() {
	_.forEach(nodes, node => {
		// console.log(node)
		let c = classColorList[node.class]
		fill(c);
		square(node.x, node.y, node.size);
		// circle(node.x, node.y, node.size);
	})
}

function toggleDrawNodes(){
	if(doDrawNodes)
		doDrawNodes = false;
	else
		doDrawNodes = true;
	console.log('Toggle draw nodes ', doDrawNodes);
}

function toggleDrawCentres(){
	if(doDrawCentres)
		doDrawCentres = false;
	else
		doDrawCentres = true;
	console.log('Toggle draw centres ', doDrawCentres);
}

function initK(){
	let counter = 0;
	while(counter <= K) {
		let x = random(contentPane.x, controlPane.x + contentPane.width);
		let y = random(contentPane.y, controlPane.y + contentPane.height); 	
		let _class = ++counter;
		console.log('Creating new class: ', _class);
		meanCentres.push(createKCentre(x,y, _class));
	}

	stepK();
}

function stepK(){
	_.map(nodes, node =>{
		let closestId = 0;
		let minDistance = Number.MAX_SAFE_INTEGER;
		_.forEach(meanCentres, centre => {
			let d = distance(node.x, node.y, centre.x, centre.y);
			if(d < minDistance) {
				// console.log('New class: ', mea);
				closestId = centre.class;
				minDistance = d;
			}
		});
		node.class = closestId;
	})
}
function recalculateMeanCentres() {
	_.forEach(meanCentres, recalculateMeanCentre);
}
function recalculateMeanCentre(centre) {
	let id = centre.class;
	let amount = 0;
	let sumx = 0;
	let sumy = 0;
	_(nodes)
		.filter({class: id})
		.forEach(node => {
			sumx += node.x;
			sumy += node.y;
			amount++;
		})
	centre.x = sumx / amount;
	centre.y = sumy / amount;
}

function distance(x1, y1, x2, y2) {
	var a = x1 - x2;
	var b = y1 - y2;

	return Math.sqrt( a*a + b*b );
}

function drawK(){
	_.forEach(meanCentres, centre => {
		let c = classColorList[centre.class];
		fill(color(c));
		circle(centre.x, centre.y, centre.size);
	});
}

function createKCentre(x, y, c) {
	let size = 15;
	return {
		x: x,
		y: y,
		class: c,
		size: size
	};
}

function initRandomNodes() {
	let num = 10000;
	let counter = 0;
	while(counter ++ < num) {
		let x = random(contentPane.x, controlPane.x + contentPane.width);
		let y = random(contentPane.y, controlPane.y + contentPane.height);
		let nodeSize = 5;
		let nodeColor = color(255,0,0);
		nodes.push(createNode(x, y, nodeSize, nodeColor));
	}
}

function createNode(x, y, size, c){
	return {
		x: x,
		y: y,
		size: size,
		color: c,
		class: 0
	}
}

function mouseClicked() {
  // console.log('Mouse clicked: ', mouseX, mouseY);
  if(controlPane.inBounds())
  		console.log("Pressed on controlpane");
  if(contentPane.inBounds())
  	contentPaneClicked()
  // line(mouseX, 0, mouseX, 100);
}

function mouseDragged() {
  if(contentPane.inBounds() && !debounce){
  	debounce = true;
  	contentPaneClicked()
  }
}

function contentPaneClicked(){
    console.log("Pressed on contentpane");
    // Add node
    let nodeSize = 5;
    let nodeColor = color(255,0,0);
    nodes.push(createNode(mouseX, mouseY,nodeSize, nodeColor));

    setTimeout(function(){
    	debounce = false;
    }, 50);
}

function buttonEvent(event) {
	console.log("Button pressed ", event);
	if(event == 'reset')
		return resetButton();
	if(event == 'random')
		return randomButton();
	if(event == 'play')
		playButton();
	if(event == 'step')
		stepButton();
}

function stepButton(){
	console.log('Stepping');
	if(meanCentres.length == 0) {
		initK();
	}
	recalculateMeanCentres();
	stepK();
}

function playButton(){
	initK();
}

function resetButton(){
	nodes = [];
	meanCentres = [];
}

function randomButton() {
	initRandomNodes();
}

function drawPane(pane) {
	fill(pane.color);
	rect(pane.x, pane.y, pane.width, pane.height);
}

function drawControlPane(){
	drawPane(controlPane);
	textSize(controlPane.title.size);
	fill(controlPane.title.color);
	text(controlPane.title.text, 10, 27);
	// console.log(controlPane.title.color);
}

function drawContentPane(){
	drawPane(contentPane);
}