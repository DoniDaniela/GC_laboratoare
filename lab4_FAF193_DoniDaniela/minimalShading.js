"use strict";
var canvas;
var gl;

var numTimesToSubdivide = 3;
var pointsArray = [];
var normalsArray = [];
var lightPosition = vec4(5.0, 0.0, -2.0, 1.0 );
var lightPositionLoc;

window.onload = function init() {
	canvas = document.getElementById( "gl-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	gl.enable(gl.DEPTH_TEST);

	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );
	tetrahedron(numTimesToSubdivide);

	sendArrayToShader(program, pointsArray, "vPosition");
	sendArrayToShader(program, normalsArray, "vNormal");	

	lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
	render();
}

function render() {

	lightPosition[0] = 2* Math.sin( (new Date).getTime() * speed ); 
	lightPosition[1] = Math.cos( (new Date).getTime() * speed ); 

	gl.uniform4fv( lightPositionLoc, flatten(lightPosition) );

	gl.drawArrays( gl.TRIANGLES, 0, pointsArray.length );

	window.requestAnimFrame(render);
}

function calculateNormal(a, b, c){
	var t1 = subtract(b, a);
	var t2 = subtract(c, a);
	var normal = normalize(cross(t2, t1));

	normal = vec4(normal);
	return normal;
}

function triangle(a, b, c) {
	var normal = calculateNormal(a, b, c); 

	normalsArray.push(normal);
	normalsArray.push(normal);
	normalsArray.push(normal);

	pointsArray.push(a);
	pointsArray.push(b);
	pointsArray.push(c);
}


function sendArrayToShader(program, inputArray, shaderAttributeName){
	var buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, buffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(inputArray), gl.STATIC_DRAW );

	var attributeLocation = gl.getAttribLocation( program, shaderAttributeName );
	gl.vertexAttribPointer( attributeLocation, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( attributeLocation);
}


function divideTriangle(a, b, c, count) {
	if ( count > 0 ) {

		var ab = mix( a, b, 0.5);
		var ac = mix( a, c, 0.5);
		var bc = mix( b, c, 0.5);

		ab = normalize(ab, true);
		ac = normalize(ac, true);
		bc = normalize(bc, true);

		divideTriangle( a, ab, ac, count - 1 );
		divideTriangle( ab, b, bc, count - 1 );
		divideTriangle( bc, c, ac, count - 1 );
		divideTriangle( ab, bc, ac, count - 1 );
	}
	else {
		triangle( a, b, c );
	}
}


function tetrahedron(n) {	
	var a = vec4(0.0, 0.0, -1.0,1);
	var b = vec4(0.0, 0.94, 0.33, 1);
	var c = vec4(-0.81, -0.47, 0.33, 1);
	var d = vec4(0.87, -0.4, 0.33,1);
	divideTriangle(a, b, c, n);
	divideTriangle(d, c, b, n);
	divideTriangle(a, d, b, n);
	divideTriangle(a, c, d, n);
}
