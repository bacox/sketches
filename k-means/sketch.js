/**
 * @file K-means
 * @copyright Bart Cox 2019
 */

let canvasWidth = 500;
let canvasHeight = 500;

let nodes = [];

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
	// Setup content pane
	contentPane.width = canvasWidth - controlPane.width;
	contentPane.height = canvasHeight;
	contentPane.x = controlPane.x + controlPane.width;
	controlPane.y = 0;
	contentPane.color = color(179,216,199);
		
}

function draw() {
	background(180);
	drawContentPane();
	drawControlPane();
}

function createNode(x, y, size, c){
	return {
		x: x,
		y: y,
		size: size,
		color: c,
		class: -1
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

function contentPaneClicked(){
    console.log("Pressed on contentpane");
}

function buttonEvent(event) {
	console.log("Button pressed ", event);
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