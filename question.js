
/*
    The goal of this exercise is to take a polygon defined by the points 'points', use the mouse
    events to draw a line that will split the polygon and then draw the two split polygons.
    In the start, you'll have the initial polygon (start.png)
    While dragging the mouse, the polygon should be shown along with the line you're drawing (mouseMove.png)
    After letting go of the mouse, the polygon will be split into two along that line (mouseUp.png)

    The code provided here can be used as a starting point using plain-old-Javascript, but it's fine
    to provide a solution using react/angular/vue/etc if you prefer.
*/

// store line coordinates
var line = {};

// create a svg line element
var svgLine = document.createElementNS("http://www.w3.org/2000/svg", 'line');

function intializeLine() {
  var svg = document.getElementsByTagName('svg')[0];
  svgLine.setAttribute('stroke', 'black');
  svgLine.setAttribute('x1', line.x1);
  svgLine.setAttribute('y1', line.y1);
  svg.appendChild(svgLine);
}

function onMouseDown(event) {
  line.x1 = event.offsetX;
  line.y1 = event.offsetY;

  intializeLine();

}

function onMouseMove(event) {
  line.x2 = event.offsetX;
  line.y2 = event.offsetY;
  svgLine.setAttribute('x2', line.x2);
  svgLine.setAttribute('y2', line.y2);
}

function onMouseUp(event) {
  const poly1 = [];
  const poly2 = [];

  //Generate the two sets of points for the split polygons
  //An algorithm for finding interceptions of two lines can be found in https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection


  clearPoly();
  addPoly(poly1, 'blue');
  addPoly(poly2, 'green');
}


/*
	Code below this line shouldn't need to be changed
*/

//Draws a polygon from the given points and sets a stroke with the specified color
function addPoly(points, color = 'black') {
    if(points.length < 2) {
        console.error("Not enough points");
        return;
    }
    
    const content = document.getElementById('content');
    
    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var svgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    let path = 'M' + points[0].x + ' ' + points[0].y
    
    for(const point of points) {
        path += ' L' + point.x + ' ' + point.y;
    }
    path += " Z";
    svgPath.setAttribute('d', path);
    svgPath.setAttribute('stroke', color);
    
    svgElement.setAttribute('height', "500"); 
    svgElement.setAttribute('width', "500");
    svgElement.setAttribute('style', 'position: absolute;');
    svgElement.setAttribute('fill', 'transparent');
    svgElement.setAttribute('border', '1px solid black');
    
    svgElement.appendChild(svgPath);
    content.appendChild(svgElement);
}

//Clears the all the drawn polygons
function clearPoly() {
    const content = document.getElementById('content');
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
}

//Sets the mouse events needed for the exercise
function setup() {
    this.clearPoly();
    this.addPoly(points);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
}

const points = [
    { x : 100, y: 100 },
    { x : 200, y: 50 },
    { x : 300, y: 50 },
    { x : 400, y: 200 },
    { x : 350, y: 250 },
    { x : 200, y: 300 },
    { x : 150, y: 300 },
]

window.onload = () => setup()

