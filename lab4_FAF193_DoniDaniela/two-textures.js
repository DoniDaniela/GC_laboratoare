"use strict"; 

var canvas;
var gl;

var vertices = [];
var textureCoords = [];
window.onload = init; 

var vBuffer;

var textureDataLocation;

function init() {    
		canvas = document.getElementById( "gl-canvas" ); 
		gl = WebGLUtils.setupWebGL( canvas ); 
		if ( !gl ) { alert( "WebGL isn't available" ); }

		vertices = [
				vec3(  0.0,  0.0,  0.0 ), 
				vec3(  1.0,  0.0,  0.0 ),
				vec3(  0.5,  1.0,  0.0 ),

				vec3(  0.0,  0.0,  0.0 ), 
				vec3( -1.0,  0.0,  0.0 ),
				vec3( -0.5, -1.0,  0.0 )
		];
		textureCoords = [
				vec2(  0.0,  1.0 ),
				vec2(  1.0,  1.0 ),
				vec2(  0.5,  0.0 ),

				vec2(  1.0,  0.0 ),
				vec2(  0.0,  0.0 ),
				vec2(  0.5,  1.0 )
		];
		

		gl.viewport( 0, 0, canvas.width, canvas.height );

		gl.clearColor( 0.2, 0.2, 0.2, 1.0 );

		var program = initShaders( gl, "vertex-shader", "fragment-shader" ); 
		gl.useProgram( program );
		vBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
		var vAttributeLocation = gl.getAttribLocation( program, 'vPosition' );
		gl.vertexAttribPointer( vAttributeLocation, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vAttributeLocation);

		var tcBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, tcBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, flatten(textureCoords), gl.STATIC_DRAW );
		var tcAttributeLocation = gl.getAttribLocation( program, 'vTextureCoord' );
		gl.vertexAttribPointer( tcAttributeLocation, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( tcAttributeLocation);

		textureDataLocation = gl.getUniformLocation(program, 'textureData');

		setLoadTextureListener();

		render();
};

function setLoadTextureListener(){
	document.querySelectorAll('.file-loader').forEach(function(button) {
    	button.addEventListener('change', function() {    		    		
			var selectedFiles = this.files;
			var textureNumber = parseInt( this.getAttribute("texture-number") );
			if(selectedFiles.length == 0) {
				alert('Error : No file selected');
				return;
			}
			var firstFile = selectedFiles[0];
			readImageFromFile(firstFile, textureNumber);
		});
	});
}

function readImageFromFile(file, textureNumber) {
	var reader = new FileReader();
	reader.addEventListener('load', function(e) {
		var imgRawData = e.target.result;
		var texture = loadTexture(gl, imgRawData, textureNumber);
	});

	reader.addEventListener('error', function() {
		alert('File error happened!');
	});

	reader.readAsDataURL(file);
}

function loadTexture(gl, dataRaw, activeTextureNumber) {
	gl.activeTexture(gl.TEXTURE0 + activeTextureNumber);
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	const internalFormat = gl.RGBA;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;

	const image = new Image();
	image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, srcFormat, srcType, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	};
	image.src = dataRaw;

	return texture;
}

function render() {
 
		var speed = 0.005;
		var time = (new Date).getTime();
		var amplitude = 0.01;
		vertices[0][0] += 	amplitude * Math.sin( time * speed );
		vertices[0][1] +=	amplitude * Math.cos( time * speed );
		vertices[3][0] -= 	amplitude * Math.sin( time * speed );
		vertices[3][1] -=	amplitude * Math.cos( time * speed );

		gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

		gl.clear( gl.COLOR_BUFFER_BIT ); 
		gl.uniform1i(textureDataLocation, 0);
		gl.drawArrays( gl.TRIANGLES, 0, vertices.length/2 ); 
		gl.uniform1i(textureDataLocation, 1);
		gl.drawArrays( gl.TRIANGLES, vertices.length/2, vertices.length/2 ); 

		requestAnimFrame(render);
}