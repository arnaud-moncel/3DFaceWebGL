    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }


    var shaderProgram;

    function initShaders(gl)
    {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
        shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
        shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
        shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
        shaderProgram.pointLightingColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingColor");
        return shaderProgram;
    }


    function handleLoadedTexture(texture) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }


    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var textureStack = [];
    var pMatrix = mat4.create();

    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

        var normalMatrix = mat3.create();
        mat4.toInverseMat3(mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    }


    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }


function Group() {
    this.children = new Array();
    this.leaves = new Array();
}

Group.prototype.addChild = function(child) {
    this.children.push(child);
}
Group.prototype.addLeaf = function(leaf) {
    this.leaves.push(leaf);
}
	
Group.prototype.draw = function(gl) {
    for (var i=0; i<this.leaves.length; i++) {
	this.leaves[i].preRender(gl);
    }
    for (var i=0; i<this.children.length; i++) {
	this.children[i].draw(gl);
    }
    for (var i=0; i<this.leaves.length; i++) {
	this.leaves[i].postRender(gl);
    }
}


    function Transform(mat) {
	this.mat = mat;
    }
    
Transform.prototype.setMatrix = function(mat) {
    this.mat = mat;
}

Transform.prototype.preRender = function(gl) {
    mvPushMatrix();
    mat4.multiply(mvMatrix, this.mat, mvMatrix);
}
    
Transform.prototype.postRender = function(gl) {
    mvPopMatrix();
}


function RotationBehavior(speed) {
    this.speed = speed;
    this.angle=0;
    this.lastTime=0;
}
    
RotationBehavior.prototype.preRender = function(gl) {
    mvPushMatrix();
    mat4.rotate(mvMatrix, degToRad(this.angle), [0, 1, 0]);
    
        var timeNow = new Date().getTime();
        if (this.lastTime != 0) {
            var elapsed = timeNow - this.lastTime;
            this.angle+=this.speed*elapsed*0.01;
        }
        this.lastTime = timeNow;
    }

    
RotationBehavior.prototype.postRender = function(gl) {
    mvPopMatrix();
}

function Texture(texFile, texUnit){
        this.textureUnit = texUnit;
        this.texture = gl.createTexture();
        this.texture.image = new Image();
	var self = this;
        this.texture.image.onload = function () {
            handleLoadedTexture(self.texture);
        }
        this.texture.image.src = texFile;
}

Texture.prototype.preRender = function(gl) {
    //   textureStack.push(this.textureUnit, this.texture);
       gl.activeTexture(this.textureUnit);//gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
}

Texture.prototype.postRender = function(gl) {
/*  textureStack.pop();
  textureStack.pop();
  gl.bindTexture(gl.TExTURE_2D, null);
  if (textureStack.length<2) return;
  gl.activeTexture(textureStack[textureStack.length-2]);
  gl.bindTexture(gl.TEXTURE_2D, textureStack[textureStack.length-1]);
  */
}

// Create some global sphere data
    var sphereVertexPositionBuffer;
    var sphereVertexNormalBuffer;
    var sphereVertexTextureCoordBuffer;
    var sphereVertexIndexBuffer;

function createSphere(gl) {
    var latitudeBands = 30;
    var longitudeBands = 30;
    var radius = 2;
    
    var vertexPositionData = [];
    var normalData = [];
    var textureCoordData = [];
    for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
	var theta = latNumber * Math.PI / latitudeBands;
	var sinTheta = Math.sin(theta);
	var cosTheta = Math.cos(theta);
	
	for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
	    var phi = longNumber * 2 * Math.PI / longitudeBands;
	    var sinPhi = Math.sin(phi);
	    var cosPhi = Math.cos(phi);
	    
	    var x = cosPhi * sinTheta;
	    var y = cosTheta;
	    var z = sinPhi * sinTheta;
	    var u = 1 - (longNumber / longitudeBands);
	    var v = 1 - (latNumber / latitudeBands);
	    
	    normalData.push(x);
	    normalData.push(y);
	    normalData.push(z);
	    textureCoordData.push(u);
	    textureCoordData.push(v);
	    vertexPositionData.push(radius * x);
	    vertexPositionData.push(radius * y);
	    vertexPositionData.push(radius * z);
	}
    }
    
    var indexData = [];
    for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
	for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
	    var first = (latNumber * (longitudeBands + 1)) + longNumber;
	    var second = first + longitudeBands + 1;
	    indexData.push(first);
	    indexData.push(second);
	    indexData.push(first + 1);
	    
	    indexData.push(second);
	    indexData.push(second + 1);
	    indexData.push(first + 1);
	}
    }
    
    sphereVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
    sphereVertexNormalBuffer.itemSize = 3;
    sphereVertexNormalBuffer.numItems = normalData.length / 3;
    
    sphereVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
    sphereVertexTextureCoordBuffer.itemSize = 2;
    sphereVertexTextureCoordBuffer.numItems = textureCoordData.length / 2;
    
    sphereVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
    sphereVertexPositionBuffer.itemSize = 3;
    sphereVertexPositionBuffer.numItems = vertexPositionData.length / 3;
    
    sphereVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STREAM_DRAW);
    sphereVertexIndexBuffer.itemSize = 1;
    sphereVertexIndexBuffer.numItems = indexData.length;
}

function Sphere(radius) {
    this.radius = radius;
}

Sphere.prototype.draw = function(gl) {
    mvPushMatrix();
    mat4.scale(mvMatrix, [this.radius, this.radius, this.radius]);
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();
}

function Box(gl, size) {
        this.size = size;
        this.cubeVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
        vertices = [
            // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,

            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.cubeVertexPositionBuffer.itemSize = 3;
        this.cubeVertexPositionBuffer.numItems = 24;
        
        this.cubeVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
        var vertexNormals = [
            // Front face
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,

            // Back face
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,

            // Top face
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,

            // Bottom face
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,

            // Right face
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,

            // Left face
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
        this.cubeVertexNormalBuffer.itemSize = 3;
        this.cubeVertexNormalBuffer.numItems = 24;
        this.cubeVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
        var textureCoords = [
            // Front face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            // Back face
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,

            // Top face
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,

            // Bottom face
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,

            // Right face
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,

            // Left face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
        this.cubeVertexTextureCoordBuffer.itemSize = 2;
        this.cubeVertexTextureCoordBuffer.numItems = 24;

        this.cubeVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        var cubeVertexIndices = [
            0, 1, 2,      0, 2, 3,    // Front face
            4, 5, 6,      4, 6, 7,    // Back face
            8, 9, 10,     8, 10, 11,  // Top face
            12, 13, 14,   12, 14, 15, // Bottom face
            16, 17, 18,   16, 18, 19, // Right face
            20, 21, 22,   20, 22, 23  // Left face
        ]
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
        this.cubeVertexIndexBuffer.itemSize = 1;
        this.cubeVertexIndexBuffer.numItems = 36;
    }


Box.prototype.draw = function(gl) {
    mvPushMatrix();
    mat4.scale(mvMatrix, [this.size, this.size, this.size]);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();
}




function Scene(gl) {
    createSphere(gl);
  //  gl.clearColor(1, 1, 0, 1);
}

Scene.prototype = new Group();

Scene.prototype.draw = function(gl) {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
     //   gl.clearColor(1, 1, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, [0,0,-20]);

            gl.uniform3f(
                shaderProgram.ambientColorUniform,
                parseFloat(document.getElementById("ambientR").value),
                parseFloat(document.getElementById("ambientG").value),
                parseFloat(document.getElementById("ambientB").value)
            );
            
            var lightPos = vec3.create();
            lightPos[0]= parseFloat(document.getElementById("lightPositionX").value);
            lightPos[1]=     parseFloat(document.getElementById("lightPositionY").value);
            lightPos[2]=     parseFloat(document.getElementById("lightPositionZ").value);
            lightPos = mat4.multiplyVec3(mvMatrix, lightPos, lightPos);
                  
                var i;
                for (i=0; i<this.leaves.length; i++) {
                  if (this.leaves[i] instanceof Transform) {
                    lightPos = mat4.multiplyVec3(this.leaves[i].mat, lightPos, lightPos);
                  }
                }
                
            gl.uniform3f(
                shaderProgram.pointLightingLocationUniform, lightPos[0], lightPos[1], lightPos[2]
               
            );

            gl.uniform3f(
                shaderProgram.pointLightingColorUniform,
                parseFloat(document.getElementById("pointR").value),
                parseFloat(document.getElementById("pointG").value),
                parseFloat(document.getElementById("pointB").value)
            );


        
	Group.prototype.draw.call(this, gl);
}


function fixIndices(vertexIndices, originalIndex, originalArray, dim) {
  var newArray = [];
  var i, j;
  for (i=0; i<vertexIndices.length; i++) {
    newArray[i]=0;
  }
  for (i=0; i<vertexIndices.length; i++) {
    for (j=0; j<dim; j++) {
      newArray[vertexIndices[i]*dim+j] = originalArray[originalIndex[i]*dim+j];
      }
  }
  return newArray;
}

function Obj(gl, text, size) {
        this.size = size;
        var vertices = [];
		var verticesCount = 0;
		var normals = [];
		var uvs = [];
    var vertexIndices = [];
    var uvIndices = [];
    var normalIndices = [];
    
		// v float float float

		var vertex_pattern = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

		// vn float float float

		var normal_pattern = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

		// vt float float

		var uv_pattern = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

		// f vertex vertex vertex

		var face_pattern1 = /f( +\d+)( +\d+)( +\d+)/;

		// f vertex/uv vertex/uv vertex/uv

		var face_pattern2 = /f( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))/;

		// f vertex/uv/normal vertex/uv/normal vertex/uv/normal

		var face_pattern3 = /f( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))/;

		// f vertex//normal vertex//normal vertex//normal

		var face_pattern4 = /f( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))/;

		//

		var lines = text.split( '\n' );

		for ( var i = 0; i < lines.length; i ++ ) {

			var line = lines[ i ];
			line = line.trim();

			var result;

			if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

				continue;

			} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

				// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

				vertices.push(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] ),
					parseFloat( result[ 3 ] )
				 );

			} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

				// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

				normals.push( 
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] ),
					parseFloat( result[ 3 ] )
				 );

			} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

				// ["vt 0.1 0.2", "0.1", "0.2"]

				uvs.push(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] )
				 );

			} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {

				// ["f 1 2 3", "1", "2", "3"]

				vertexIndices.push(
					 parseInt( result[ 1 ] ) - 1 ,
					 parseInt( result[ 2 ] ) - 1 ,
					 parseInt( result[ 3 ] ) - 1 
				);

				uvIndices.push(
					 parseInt( result[ 1 ] ) - 1 ,
					 parseInt( result[ 2 ] ) - 1 ,
					 parseInt( result[ 3 ] ) - 1 
				);
      normalIndices.push(
					 parseInt( result[ 1 ] ) - 1 ,
					 parseInt( result[ 2 ] ) - 1 ,
					 parseInt( result[ 3 ] ) - 1 
				);

			} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {

				// ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3"]

				vertexIndices.push(
					 parseInt( result[ 2 ] ) - 1 ,
					 parseInt( result[ 5 ] ) - 1 ,
					 parseInt( result[ 8 ] ) - 1 
				);

				uvIndices.push(
					 parseInt( result[ 3 ] ) - 1 ,
					 parseInt( result[ 6 ] ) - 1 ,
					 parseInt( result[ 9 ] ) - 1 
				);
        normalIndices.push(
					 parseInt( result[ 2 ] ) - 1 ,
					 parseInt( result[ 5 ] ) - 1 ,
					 parseInt( result[ 8 ] ) - 1 
				);
			} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {

				// ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3"]

				vertexIndices.push(
					 parseInt( result[ 2 ] ) - 1 ,
					 parseInt( result[ 6 ] ) - 1 ,
					 parseInt( result[ 10 ] ) - 1 
				);

				uvIndices.push(
					 parseInt( result[ 3 ] ) - 1 ,
					 parseInt( result[ 7 ] ) - 1 ,
					 parseInt( result[ 11 ] ) - 1 
				);
    
        normalIndices.push(
					 parseInt( result[ 4 ] ) - 1 ,
					 parseInt( result[ 8 ] ) - 1 ,
					 parseInt( result[ 12 ] ) - 1 
				);

			} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {

				// ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3"]

				vertexIndices.push(
					 parseInt( result[ 2 ] ) - 1 ,
					 parseInt( result[ 5 ] ) - 1 ,
					 parseInt( result[ 8 ] ) - 1 
				);
        uvIndices.push(
					 parseInt( result[ 2 ] ) - 1 ,
					 parseInt( result[ 5 ] ) - 1 ,
					 parseInt( result[ 8 ] ) - 1 
				);
			  normalIndices.push(
					 parseInt( result[ 3 ] ) - 1 ,
					 parseInt( result[ 6 ] ) - 1 ,
					 parseInt( result[ 9 ] ) - 1 
				);


			} else {

				 console.log( "ObjLoader: Unhandled line " + line );

			}

		}
  
    normals = fixIndices(vertexIndices, normalIndices, normals, 3);
    uvs = fixIndices(vertexIndices, uvIndices, uvs, 2);

        this.cubeVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.cubeVertexPositionBuffer.itemSize = 3;
        this.cubeVertexPositionBuffer.numItems = vertices.length/3;
        
        this.cubeVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
       
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        this.cubeVertexNormalBuffer.itemSize = 3;
        this.cubeVertexNormalBuffer.numItems = normals.length/3;
        this.cubeVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
        this.cubeVertexTextureCoordBuffer.itemSize = 2;
        this.cubeVertexTextureCoordBuffer.numItems = uvs.length/2;

        this.cubeVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
       
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
        this.cubeVertexIndexBuffer.itemSize = 1;
        this.cubeVertexIndexBuffer.numItems = vertexIndices.length;
        
    }


Obj.prototype.draw = function(gl) {
    mvPushMatrix();
    mat4.scale(mvMatrix, [this.size, this.size, this.size]);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();
}