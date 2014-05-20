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
    //intersection bitwen halfline from the point and the polygon !
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

        console.log("Mouse pos: X=" + realPos[0]*scale/100 + ", Y=" + realPos[1]*scale/100);

        controlPoint.push(realPos[0]*scale/100, realPos[1]*scale/100);

        if(controlPoint.length == 8)
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

var roughnessHtml = 0.1;
var indiceOfRefractionHtml = 3.0;
var ecPosition = [0.0, 0.0, 10.0];

var phongHtml = 0;

var enabledLightHtml = [1, 0, 0, 0, 0, 0, 0, 0];
var lightPosHtml = [[0.0, 0.0, 15.0], [100.0, -100.0, 50.0], [50.0, 25.0, 10.0]];
var lightDirHtml = [[0.0, 0.0, -10.0], [0.0, 0.0, -10.0], [100.0, 100.0, -50.0]];
var lightColorHtml = [[[0.2, 0.2, 0.2], [0.6, 0.6, 0.6], [0.7, 0.7, 0.7]],
                      [[0.2, 0.2, 0.2], [0.4, 0.4, 0.4], [0.7, 0.7, 0.7]],
                      [[0.2, 0.2, 0.2], [0.4, 0.4, 0.4], [0.7, 0.7, 0.7]]];
var lightCutoffHtml = [0.0, 90.0, 20.0];

var materialAmbientHtml = [0.2, 0.2, 0.2];
var materialDiffuseHtml = [0.6, 0.6, 0.6];
var materialSpecularHtml = [0.7, 0.7, 0.7];

function setUniform(gl, shaderProgram)
{
    //other information
    shaderProgram.roughness = gl.getUniformLocation(shaderProgram, "roughness");
    gl.uniform1f(shaderProgram.roughness, parseFloat(roughnessHtml));
    shaderProgram.indiceOfRefraction = gl.getUniformLocation(shaderProgram, "indiceOfRefraction");
    gl.uniform1f(shaderProgram.indiceOfRefraction, parseFloat(indiceOfRefractionHtml));

    shaderProgram.ecPosition = gl.getUniformLocation(shaderProgram, "ecPosition");
    gl.uniform3fv(shaderProgram.ecPosition, ecPosition);


    shaderProgram.phong = gl.getUniformLocation(shaderProgram, "phong");
    gl.uniform1i(shaderProgram.phong, phongHtml);


    //light information
    shaderProgram.enabledLights = gl.getUniformLocation(shaderProgram, "enabledLights");
    gl.uniform1iv(shaderProgram.enabledLights, enabledLightHtml);

    var lightPos = [parseFloat(lightPosHtml[0][0]), parseFloat(lightPosHtml[0][1]), parseFloat(lightPosHtml[0][2]),
                    parseFloat(lightPosHtml[1][0]), parseFloat(lightPosHtml[1][1]), parseFloat(lightPosHtml[1][2]),
                    parseFloat(lightPosHtml[2][0]), parseFloat(lightPosHtml[2][1]), parseFloat(lightPosHtml[2][2])];
    shaderProgram.lightPos = gl.getUniformLocation(shaderProgram, "lightPos");
    gl.uniform3fv(shaderProgram.lightPos, lightPos);

    var lightDirection = [parseFloat(lightDirHtml[0][0]), parseFloat(lightDirHtml[0][1]), parseFloat(lightDirHtml[0][2]),
                          parseFloat(lightDirHtml[1][0]), parseFloat(lightDirHtml[1][1]), parseFloat(lightDirHtml[1][2]),
                          parseFloat(lightDirHtml[2][0]), parseFloat(lightDirHtml[2][1]), parseFloat(lightDirHtml[2][2])];
    shaderProgram.lightDirection = gl.getUniformLocation(shaderProgram, "lightDirection");
    gl.uniform3fv(shaderProgram.lightDirection, lightDirection);

    var lightAmbient = [parseFloat(lightColorHtml[0][0][0]), parseFloat(lightColorHtml[0][0][1]), parseFloat(lightColorHtml[0][0][2]),
                        parseFloat(lightColorHtml[1][0][0]), parseFloat(lightColorHtml[1][0][1]), parseFloat(lightColorHtml[1][0][2]),
                        parseFloat(lightColorHtml[2][0][0]), parseFloat(lightColorHtml[2][0][1]), parseFloat(lightColorHtml[2][0][2])];
    shaderProgram.lightAmbient = gl.getUniformLocation(shaderProgram, "lightAmbient");
    gl.uniform3fv(shaderProgram.lightAmbient, lightAmbient);

    var lightDiffuse = [parseFloat(lightColorHtml[0][1][0]), parseFloat(lightColorHtml[0][1][1]), parseFloat(lightColorHtml[0][1][2]),
                        parseFloat(lightColorHtml[1][1][0]), parseFloat(lightColorHtml[1][1][1]), parseFloat(lightColorHtml[1][1][2]),
                        parseFloat(lightColorHtml[2][1][0]), parseFloat(lightColorHtml[2][1][1]), parseFloat(lightColorHtml[2][1][2])];
    shaderProgram.lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");
    gl.uniform3fv(shaderProgram.lightDiffuse, lightDiffuse);

    var lightSpecular = [parseFloat(lightColorHtml[0][2][0]), parseFloat(lightColorHtml[0][2][1]), parseFloat(lightColorHtml[0][2][2]),
                         parseFloat(lightColorHtml[1][2][0]), parseFloat(lightColorHtml[1][2][1]), parseFloat(lightColorHtml[1][2][2]),
                         parseFloat(lightColorHtml[2][2][0]), parseFloat(lightColorHtml[2][2][1]), parseFloat(lightColorHtml[2][2][2])];
    shaderProgram.lightSpecular = gl.getUniformLocation(shaderProgram, "lightSpecular");
    gl.uniform3fv(shaderProgram.lightSpecular, lightSpecular);

    shaderProgram.lightCutoff = gl.getUniformLocation(shaderProgram, "lightCutoff");
    gl.uniform1fv(shaderProgram.lightCutoff, lightCutoffHtml);


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