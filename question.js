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

//create and append a new line on the pre-exsisting svg
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

  // we create polygon as a copy of points but we append the first point to it in order to also check against the last polygon segment,
  // this is just to avoid to declare extra conditions and duplication of logic in the loop.
  // Iterate over each consecutive set of points in the polygon to check if they intersect with the drawn segment
  const polygon = [...points, points[0]];

  // flags to check when and if we encouter any intersection
  var isIntersection1 = false;
  var isIntersection2 = false;


  polygon.forEach(function(point, i, points) {
    if (i < points.length -1) {

      let inter = checkIntersection(line, point, points[i+1]);

      if (inter && !isIntersection1) {
        poly1.push(point, inter);
        poly2.push(inter);
        isIntersection1 = true;
      } else if(inter && isIntersection1 && !isIntersection2) {
        poly2.push(point, inter);
        poly1.push(inter);
        isIntersection2 = true;
      } else if (!inter && isIntersection1 && !isIntersection2) {
        poly2.push(point);
      } else {
        poly1.push(point);
      }
    }
  });

  clearPoly();

  //check if we have at least 2 intersections, if not return the inital polygon
  if (!isIntersection1 || !isIntersection2) {
    addPoly(points, 'black');
  } else {
    addPoly(poly1, 'blue');
    addPoly(poly2, 'green');
  }
}


/*
   We can check if two segments intersect by:
   1. computing the line equation for each segment
   2. find the point of intersection of the lines
   3. check if the intersection is on both segments
   We have to run this for each possible pairs of segments which give use a complexity of O(n2).
   There are more efficient approaches like the sweep line algorithm O(nlogn).
   But for the purpose of this exercise, given the relatively small amount of segments to check we can use this 'bruteforce' approach.
   This is still pretty fast because we are only using simple mathematical operations and comparisons.
*/
function checkIntersection(line, polygonPoint, polygonNextPoint) {
  var p1 = { x: line.x1, y: line.y1 };
  var p2 = { x: line.x2, y: line.y2 };
  var p3 = { x: polygonPoint.x, y: polygonPoint.y };
  var p4 = { x: polygonNextPoint.x, y: polygonNextPoint.y };


  var delta0 = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);

  // if delta0 is 0 then the 2 segments are parallel, so interesction can occour
  if (delta0 === 0) {
    return false;
  }

  var delta1 = (p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x);

  var delta2 = (p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x);

  var ka = delta1 / delta0;
  var kb = delta2 / delta0;

  if ((ka >= 0 && ka <= 1) && (kb >= 0 && kb <= 1)) {
    var intersectionX = p1.x + ka * (p2.x - p1.x);
    var intersectionY = p1.y + ka * (p2.y - p1.y);

    return {x: intersectionX, y: intersectionY};
  }

  return false;
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
