var gl;

function initGL(canvas)
{
    try
    {
        gl = canvas.getContext("experimental-webgl") || canvas.getContext("webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    }
    catch (e)
    {
        alert(e);
    }

    if (!gl)
        alert("Could not initialise WebGL, sorry :-(");

}

var objStr;

function loadObj(filename)
{
    var xmlhttp;

    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            objStr=xmlhttp.responseText;
        }
    };
    xmlhttp.open("GET",filename,false);
    xmlhttp.send();
    objStr=xmlhttp.responseText;
}

var scene;
var face;


var viewMat = mat4.create();
mat4.identity(viewMat);
viewTransform = new Transform(viewMat);

var scaleMat = mat4.create();
mat4.identity(scaleMat);
scaleTransform = new Transform(scaleMat);

function createScene()
{
    scene = new Scene(gl);

    faceGroup = new Group();
    var dir = document.getElementById("directory").value;

    faceTexture = new Texture("./Mesh/"+dir+"/shader/diff_texture.bmp", gl.TEXTURE0);
    faceGroup.addLeaf(faceTexture);
    faceRedNormals = new Texture("./Mesh/"+dir+"/shader/diff_normal_r.bmp", gl.TEXTURE1);
    faceGroup.addLeaf(faceRedNormals);
    faceGreenNormals = new Texture("./Mesh/"+dir+"/shader/diff_normal_g.bmp", gl.TEXTURE2);
    faceGroup.addLeaf(faceGreenNormals);
    faceBlueNormals = new Texture("./Mesh/"+dir+"/shader/diff_normal_b.bmp", gl.TEXTURE3);
    faceGroup.addLeaf(faceBlueNormals);
    faceSpecNormals = new Texture("./Mesh/"+dir+"/shader/spec_normal.bmp", gl.TEXTURE4);
    faceGroup.addLeaf(faceSpecNormals);
    faceSpecular = new Texture("./Mesh/"+dir+"/shader/spec_texture.bmp", gl.TEXTURE5);
    faceGroup.addLeaf(faceSpecular);

    face = new Obj(gl,objStr, 0.1);
    faceGroup.addChild(face);
    scene.addChild(faceGroup);
    scene.addLeaf(scaleTransform);
    scene.addLeaf(viewTransform);
}


function tick()
{
    requestAnimFrame(tick);
    scene.draw(gl);
}

var mouseDown = false;
var mouseButtonRight = false;
var lastMouseX = null;
var lastMouseY = null;
var edit = true;

var controlPoint = new Array;

function getZone()
{
    //preselection
    var minX = 0;
    var maxX = 0;
    var minY = 0;
    var maxY = 0;

    for(var i=0; i<controlPoint.length; i+=2)
    {
        if(minX > controlPoint[i])
            minX = controlPoint[i];
        else if (maxX < controlPoint[i])
            maxX = controlPoint[i];

        if(minY > controlPoint[i+1])
            minY = controlPoint[i+1];
        else if (maxY < controlPoint[i+1])
            maxY = controlPoint[i+1];
    }

    var removedPointId = new Array();

    //intersection bitwen halfline from the point and the polygon !
    for(var i=0; i<face.vertices.length; i+=3)
    {
        //remove the point if it's out the boundingBox
        if(face.vertices[i] < minX || face.vertices[i] > maxX)
        {
            //dell the point
            removedPointId.push(i/3+removedPointId.length);
            face.vertices.splice(i, 3);
            face.uvs.splice(i, 2);
            i-=3;
            continue;
        }

        if(face.vertices[i+1] < minY || face.vertices[i+1] > maxY)
        {
            //dell the point
            removedPointId.push(i/3+removedPointId.length);
            face.vertices.splice(i, 3);
            face.uvs.splice(i, 2);
            i-=3;
            continue;
        }
    }

    console.log(face.vertexIndices.length);
    console.log(face.uvs.length);
    for(var i=0; i<removedPointId.length; i++)
    {
        var id = face.vertexIndices.indexOf(removedPointId[i]);
        while(id != -1)
        {
            face.vertexIndices.splice(id-id%3, 3);

            id = face.vertexIndices.indexOf(removedPointId[i]);
        }
    }
    console.log(face.vertexIndices.length);
    console.log(face.uvs.length);

    for(var i=0; i<removedPointId.length; i++)
     {
         for(j=0; j<face.vertexIndices.length; j++)
         {
             if(face.vertexIndices[j] > removedPointId[i]-i)
                face.vertexIndices[j] -= 1;
         }
     }

    face.cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, face.cubeVertexPositionBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(face.vertices),gl.STATIC_DRAW);
    face.cubeVertexPositionBuffer.itemSize = 3;
    face.cubeVertexPositionBuffer.numItems = face.vertices.length/3;

    face.cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, face.cubeVertexTextureCoordBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(face.uvs), gl.STATIC_DRAW);
    face.cubeVertexTextureCoordBuffer.itemSize = 2;
    face.cubeVertexTextureCoordBuffer.numItems = face.uvs.length/2;

    face.cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, face.cubeVertexIndexBuffer);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(face.vertexIndices), gl.STATIC_DRAW);
    face.cubeVertexIndexBuffer.itemSize = 1;
    face.cubeVertexIndexBuffer.numItems = face.vertexIndices.length;
}


function handleMouseDown(event)
{
    mouseDown = true;

    if(edit)
    {
        if(event.which == 3)//right button mouse
            mouseButtonRight = true;
        else
            mouseButtonRight = false;

        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
    else
    {
        var canvas = document.getElementById("canvas");
        var mPosX = event.clientX - (canvas.getBoundingClientRect().left + canvas.width/2);
        var mPosY = -(event.clientY - (canvas.getBoundingClientRect().top + canvas.height/2));

        var realPos = mat4.multiplyVec3(pMatrix, [mPosX, mPosY, 1]);

        console.log("Mouse pos: X=" + realPos[0]/100 + ", Y=" + realPos[1]/100);

        controlPoint.push(realPos[0]/100, realPos[1]/100);

        if(controlPoint.length >= 6)
            getZone();
    }
}

function handleMouseUp(event)
{
    mouseDown = false;
    mouseButtonRight = false;
}

function handleMouseMove(event)
{
    if (!mouseDown)
    {
        return;
    }

    if(edit)
    {
        var newX = event.clientX;
        var newY = event.clientY;

        var deltaX = newX - lastMouseX;
        var deltaY = newY - lastMouseY;

        var transformedMatrix = mat4.create();
        mat4.identity(transformedMatrix);

        if(!mouseButtonRight)
        {
            mat4.rotate(transformedMatrix, degToRad(deltaX / 10), [0, 1, 0]);

            mat4.rotate(transformedMatrix, degToRad(deltaY / 10), [1, 0, 0]);
        }
        else
        {
            mat4.translate(transformedMatrix, [deltaX/(50*scale), -deltaY/(50*scale), 0]);
        }

        mat4.multiply(transformedMatrix, viewMat, viewMat);

        viewTransform.setMatrix(viewMat);
        lastMouseX = newX;
        lastMouseY = newY;
    }
}

function handleKeyDown(event)
{
    if(event.which == 82)//key R for reset
    {
        scale = 1;
        mat4.identity(viewMat);
        mat4.identity(scaleMat);
    }
}

var scale = 1;

function scaleScene(e)
{
    var evt=window.event || e; //equalize event object

    var delta = 0;
    if(evt.detail > 0)
        delta = -0.5;
    else
        delta = 0.5;

    scale+=delta;

    if(scale < 0.5)
        scale = 0.5;

    mat4.identity(scaleMat);
    mat4.scale(scaleMat,  [scale, scale, scale]);

    scaleTransform.setMatrix(scaleMat);


    if (evt.preventDefault) //disable default wheel action of scrolling page
        evt.preventDefault();
    else
        return false;

    return true;
}

function setTextures(gl, shaderProgram)
{
    //textures
    shaderProgram.diffTextureUniform = gl.getUniformLocation(shaderProgram, "diffTexture");
    gl.uniform1i(shaderProgram.diffTextureUniform, 0);
    shaderProgram.redNormalsUniform = gl.getUniformLocation(shaderProgram, "redNormals");
    gl.uniform1i(shaderProgram.redNormalsUniform, 1);
    shaderProgram.greenNormalsUniform = gl.getUniformLocation(shaderProgram, "greenNormals");
    gl.uniform1i(shaderProgram.greenNormalsUniform, 2);
    shaderProgram.blueNormalsUniform = gl.getUniformLocation(shaderProgram, "blueNormals");
    gl.uniform1i(shaderProgram.blueNormalsUniform, 3);
    shaderProgram.specNormalsUniform = gl.getUniformLocation(shaderProgram, "specNormals");
    gl.uniform1i(shaderProgram.specNormalsUniform, 4);
    shaderProgram.specularUniform = gl.getUniformLocation(shaderProgram, "specTexture");
    gl.uniform1i(shaderProgram.specularUniform, 5);
}

var roughnessHtml = 0.2;
var indiceOfRefractionHtml = 0.2;
var fresnelPowHtml = 0.8;
var ecPosition = [0.0, 0.0, -10.0];

var phongHtml = 0;

var enabledLightHtml = [1, 0, 0, 0, 0, 0, 0, 0];
var lightPosHtml = [[0.0, 0.0, 15.0], [100.0, -100.0, 50.0], [50.0, 25.0, 10.0], [0.0, 0.0, 15.0],
                    [100.0, -100.0, 50.0], [50.0, 25.0, 10.0], [0.0, 0.0, 15.0], [100.0, -100.0, 50.0]];
/*var lightDirHtml = [[0.0, 0.0, -10.0], [0.0, 0.0, -10.0], [100.0, 100.0, -50.0], [0.0, 0.0, -10.0],
                    [0.0, 0.0, -10.0], [100.0, 100.0, -50.0], [0.0, 0.0, -10.0], [0.0, 0.0, -10.0]];*/
var lightColorHtml = [[[0.4, 0.4, 0.4], [0.6, 0.6, 0.6], [0.7, 0.7, 0.7]],
                      [[0.4, 0.4, 0.4], [0.4, 0.4, 0.4], [0.7, 0.7, 0.7]],
                      [[0.4, 0.4, 0.4], [0.4, 0.4, 0.4], [0.7, 0.7, 0.7]],
                      [[0.4, 0.4, 0.4], [0.6, 0.6, 0.6], [0.7, 0.7, 0.7]],
                      [[0.4, 0.4, 0.4], [0.4, 0.4, 0.4], [0.7, 0.7, 0.7]],
                      [[0.4, 0.4, 0.4], [0.4, 0.4, 0.4], [0.7, 0.7, 0.7]],
                      [[0.4, 0.4, 0.4], [0.6, 0.6, 0.6], [0.7, 0.7, 0.7]],
                      [[0.4, 0.4, 0.4], [0.4, 0.4, 0.4], [0.7, 0.7, 0.7]]];
//var lightCutoffHtml = [0.0, 90.0, 20.0, 0.0, 90.0, 20.0, 0.0, 90.0];

var materialAmbientHtml = [0.4, 0.4, 0.4];
var materialDiffuseHtml = [0.6, 0.6, 0.6];
var materialSpecularHtml = [0.7, 0.7, 0.7];

function setUniform(gl, shaderProgram)
{
    //other information
    shaderProgram.roughness = gl.getUniformLocation(shaderProgram, "roughness");
    gl.uniform1f(shaderProgram.roughness, parseFloat(roughnessHtml));
    shaderProgram.indiceOfRefraction = gl.getUniformLocation(shaderProgram, "indiceOfRefraction");
    gl.uniform1f(shaderProgram.indiceOfRefraction, parseFloat(indiceOfRefractionHtml));
    shaderProgram.FresnelPow = gl.getUniformLocation(shaderProgram, "fresnelPow");
    gl.uniform1f(shaderProgram.FresnelPow, parseFloat(fresnelPowHtml));

    shaderProgram.ecPosition = gl.getUniformLocation(shaderProgram, "ecPosition");
    gl.uniform3fv(shaderProgram.ecPosition, ecPosition);


    shaderProgram.phong = gl.getUniformLocation(shaderProgram, "phong");
    gl.uniform1i(shaderProgram.phong, phongHtml);


    //light information
    shaderProgram.enabledLights = gl.getUniformLocation(shaderProgram, "enabledLights");
    gl.uniform1iv(shaderProgram.enabledLights, enabledLightHtml);

    var lightPos = [parseFloat(lightPosHtml[0][0]), parseFloat(lightPosHtml[0][1]), parseFloat(lightPosHtml[0][2]),
                    parseFloat(lightPosHtml[1][0]), parseFloat(lightPosHtml[1][1]), parseFloat(lightPosHtml[1][2]),
                    parseFloat(lightPosHtml[2][0]), parseFloat(lightPosHtml[2][1]), parseFloat(lightPosHtml[2][2]),
                    parseFloat(lightPosHtml[3][0]), parseFloat(lightPosHtml[3][1]), parseFloat(lightPosHtml[3][2]),
                    parseFloat(lightPosHtml[4][0]), parseFloat(lightPosHtml[4][1]), parseFloat(lightPosHtml[4][2]),
                    parseFloat(lightPosHtml[5][0]), parseFloat(lightPosHtml[5][1]), parseFloat(lightPosHtml[5][2]),
                    parseFloat(lightPosHtml[6][0]), parseFloat(lightPosHtml[6][1]), parseFloat(lightPosHtml[6][2]),
                    parseFloat(lightPosHtml[7][0]), parseFloat(lightPosHtml[7][1]), parseFloat(lightPosHtml[7][2])];
    shaderProgram.lightPos = gl.getUniformLocation(shaderProgram, "lightPos");
    gl.uniform3fv(shaderProgram.lightPos, lightPos);

    /*var lightDirection = [parseFloat(lightDirHtml[0][0]), parseFloat(lightDirHtml[0][1]), parseFloat(lightDirHtml[0][2]),
                          parseFloat(lightDirHtml[1][0]), parseFloat(lightDirHtml[1][1]), parseFloat(lightDirHtml[1][2]),
                          parseFloat(lightDirHtml[2][0]), parseFloat(lightDirHtml[2][1]), parseFloat(lightDirHtml[2][2]),
                          parseFloat(lightDirHtml[3][0]), parseFloat(lightDirHtml[3][1]), parseFloat(lightDirHtml[3][2]),
                          parseFloat(lightDirHtml[4][0]), parseFloat(lightDirHtml[4][1]), parseFloat(lightDirHtml[4][2]),
                          parseFloat(lightDirHtml[5][0]), parseFloat(lightDirHtml[5][1]), parseFloat(lightDirHtml[5][2]),
                          parseFloat(lightDirHtml[6][0]), parseFloat(lightDirHtml[6][1]), parseFloat(lightDirHtml[6][2]),
                          parseFloat(lightDirHtml[7][0]), parseFloat(lightDirHtml[7][1]), parseFloat(lightDirHtml[7][2])];
    shaderProgram.lightDirection = gl.getUniformLocation(shaderProgram, "lightDirection");
    gl.uniform3fv(shaderProgram.lightDirection, lightDirection);*/

    var lightAmbient = [parseFloat(lightColorHtml[0][0][0]), parseFloat(lightColorHtml[0][0][1]), parseFloat(lightColorHtml[0][0][2]),
                        parseFloat(lightColorHtml[1][0][0]), parseFloat(lightColorHtml[1][0][1]), parseFloat(lightColorHtml[1][0][2]),
                        parseFloat(lightColorHtml[2][0][0]), parseFloat(lightColorHtml[2][0][1]), parseFloat(lightColorHtml[2][0][2]),
                        parseFloat(lightColorHtml[3][0][0]), parseFloat(lightColorHtml[3][0][1]), parseFloat(lightColorHtml[3][0][2]),
                        parseFloat(lightColorHtml[4][0][0]), parseFloat(lightColorHtml[4][0][1]), parseFloat(lightColorHtml[4][0][2]),
                        parseFloat(lightColorHtml[5][0][0]), parseFloat(lightColorHtml[5][0][1]), parseFloat(lightColorHtml[5][0][2]),
                        parseFloat(lightColorHtml[6][0][0]), parseFloat(lightColorHtml[6][0][1]), parseFloat(lightColorHtml[6][0][2]),
                        parseFloat(lightColorHtml[7][0][0]), parseFloat(lightColorHtml[7][0][1]), parseFloat(lightColorHtml[7][0][2])];
    shaderProgram.lightAmbient = gl.getUniformLocation(shaderProgram, "lightAmbient");
    gl.uniform3fv(shaderProgram.lightAmbient, lightAmbient);

    var lightDiffuse = [parseFloat(lightColorHtml[0][1][0]), parseFloat(lightColorHtml[0][1][1]), parseFloat(lightColorHtml[0][1][2]),
                        parseFloat(lightColorHtml[1][1][0]), parseFloat(lightColorHtml[1][1][1]), parseFloat(lightColorHtml[1][1][2]),
                        parseFloat(lightColorHtml[2][1][0]), parseFloat(lightColorHtml[2][1][1]), parseFloat(lightColorHtml[2][1][2]),
                        parseFloat(lightColorHtml[3][1][0]), parseFloat(lightColorHtml[3][1][1]), parseFloat(lightColorHtml[3][1][2]),
                        parseFloat(lightColorHtml[4][1][0]), parseFloat(lightColorHtml[4][1][1]), parseFloat(lightColorHtml[4][1][2]),
                        parseFloat(lightColorHtml[5][1][0]), parseFloat(lightColorHtml[5][1][1]), parseFloat(lightColorHtml[5][1][2]),
                        parseFloat(lightColorHtml[6][1][0]), parseFloat(lightColorHtml[6][1][1]), parseFloat(lightColorHtml[6][1][2]),
                        parseFloat(lightColorHtml[7][1][0]), parseFloat(lightColorHtml[7][1][1]), parseFloat(lightColorHtml[7][1][2])];
    shaderProgram.lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");
    gl.uniform3fv(shaderProgram.lightDiffuse, lightDiffuse);

    var lightSpecular = [parseFloat(lightColorHtml[0][2][0]), parseFloat(lightColorHtml[0][2][1]), parseFloat(lightColorHtml[0][2][2]),
                         parseFloat(lightColorHtml[1][2][0]), parseFloat(lightColorHtml[1][2][1]), parseFloat(lightColorHtml[1][2][2]),
                         parseFloat(lightColorHtml[2][2][0]), parseFloat(lightColorHtml[2][2][1]), parseFloat(lightColorHtml[2][2][2]),
                         parseFloat(lightColorHtml[3][2][0]), parseFloat(lightColorHtml[3][2][1]), parseFloat(lightColorHtml[3][2][2]),
                         parseFloat(lightColorHtml[4][2][0]), parseFloat(lightColorHtml[4][2][1]), parseFloat(lightColorHtml[4][2][2]),
                         parseFloat(lightColorHtml[5][2][0]), parseFloat(lightColorHtml[5][2][1]), parseFloat(lightColorHtml[5][2][2]),
                         parseFloat(lightColorHtml[6][2][0]), parseFloat(lightColorHtml[6][2][1]), parseFloat(lightColorHtml[6][2][2]),
                         parseFloat(lightColorHtml[7][2][0]), parseFloat(lightColorHtml[7][2][1]), parseFloat(lightColorHtml[7][2][2])];
    shaderProgram.lightSpecular = gl.getUniformLocation(shaderProgram, "lightSpecular");
    gl.uniform3fv(shaderProgram.lightSpecular, lightSpecular);

    /*shaderProgram.lightCutoff = gl.getUniformLocation(shaderProgram, "lightCutoff");
    gl.uniform1fv(shaderProgram.lightCutoff, lightCutoffHtml);*/


    //material information
    shaderProgram.materialAmbient = gl.getUniformLocation(shaderProgram, "materialAmbient");
    gl.uniform3fv(shaderProgram.materialAmbient, materialAmbientHtml);

    shaderProgram.materialDiffuse = gl.getUniformLocation(shaderProgram, "materialDiffuse");
    gl.uniform3fv(shaderProgram.materialDiffuse, materialDiffuseHtml);

    shaderProgram.materialSpecular = gl.getUniformLocation(shaderProgram, "materialSpecular");
    gl.uniform3fv(shaderProgram.materialSpecular, materialSpecularHtml);
}


function webGLStart()
{
    var dir = document.getElementById("directory").value;
    loadObj("./Mesh/"+dir+"/mesh_mid.obj");

    var canvas = document.getElementById("canvas");
    initGL(canvas);

    var shaderProgram = initShaders(gl);

    setTextures(gl, shaderProgram);
    setUniform(gl, shaderProgram);

    createScene();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    document.onkeydown = handleKeyDown;
    var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x

    if (canvas.attachEvent) //if IE (and Opera depending on user setting)
        canvas.attachEvent("on"+mousewheelevt, scaleScene);
    else if (canvas.addEventListener) //WC3 browsers
        canvas.addEventListener(mousewheelevt, scaleScene, false);
    tick();
}