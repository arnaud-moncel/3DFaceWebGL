<?php
/**
 * Created by PhpStorm.
 * User: arnaud
 * Date: 07/04/14
 * Time: 11:48
 */
    include "header.html";
?>
<!--OpenGl library-->
<script type="text/javascript" src="Js/glMatrix-0.9.5.min.js"></script>
<script type="text/javascript" src="Js/webgl-utils.js"></script>
<script type="text/javascript" src="Js/scenegraph.js"></script>

<?php
    include "Shaders/Cook_Torrance_frag.html";
    include "Shaders/Cook_Torrance_vert.html";
?>
<script type="text/javascript" src="Js/gl_script.js"></script>

<!--Resize Canvas-->
<script type="text/javascript">
    document.oncontextmenu = function(){return false;};

    function resize()
    {
        var x = document.body.clientWidth;
        var pos = (x/2)-document.getElementById("canvas").width/2;

        document.getElementById("canvas").style.marginLeft = pos+"px";
    }
</script>

<!--jQuery libray-->
<link href="css/ui-lightness/jquery-ui-1.10.4.custom.css" rel="stylesheet">
<script src="Js/jQuery/jquery-1.10.2.js"></script>
<script src="Js/jQuery/jquery-ui-1.10.4.custom.min.js"></script>

<script type="text/javascript" src="Js/jQuery/jquery_script.js"></script>

<!--CSS-->
<link rel="stylesheet" href="css/style_div_slider.css" type="text/css"/>

</head>

 <body onload="webGLStart(); resize();" onresize="resize();">
    <?php
         if(isset($_GET["directory"]))
         {
             echo('<h1 style="text-align:center">'.$_GET["directory"].' 3D Mesh</h1>');
             $ok = false;
             if($folder = opendir('./Mesh'))
             {
                while(false !== ($directory = readdir($folder)))
                 {
                     if($directory == $_GET["directory"])
                     $ok = true;
                 }
                 if(!$ok)
                 header('Location: 404.php');
             }
             else
                echo ("<p<font color='red'>Couldn't open directory</font></p>");
         }
         else
            echo("<p style='text-align: center;'><font color='red'>No file selected</font></p>");
    ?>

    <canvas id="canvas" height="500" width="500"></canvas><br><br>

    <!--The tune popup-->
    <p>
        Select your light:
        <select name="lightSelected" id="lightSelected">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
        </select>
        <input type="button" id="enableLightButton" value="Enabled">
        <input type="button" id="popupLightPosActivator" value="Light Position">
        <input type="button" id="popupLightDirActivator" value="Light Direction"><br>
        <input type="button" id="popupLightColorActivator" value="Light Color">
    </p>

    <!--The light position popup-->
    <div id="popupLightPos" class="popup" title="Tune the light position">
        <fieldset>
            <h3>ID light : <input type="text" class="lightSelectedStr" readonly></h3>
            <h4>Position: </h4>
            <div id="sliderLightPosX" class="sliderLightPos"></div>
            <label>X: </label>
            <input type="text" id="lightPosX" readonly>

            <div id="sliderLightPosY" class="sliderLightPos"></div>
            <label>Y: </label>
            <input type="text" id="lightPosY" readonly>

            <div id="sliderLightPosZ" class="sliderLightPos"></div>
            <label>Z: </label>
            <input type="text" id="lightPosZ" readonly>
        </fieldset>
    </div>

    <!--The light position popup-->
    <div id="popupLightDir" class="popup" title="Tune the light direction">
        <fieldset>
            <h3>ID light : <input type="text" class="lightSelectedStr" readonly></h3>
            <h4>Direction: </h4>
            <div id="sliderLightDirX" class="sliderLightDir"></div>
            <label>X: </label>
            <input type="text" id="lightDirX" readonly>

            <div id="sliderLightDirY" class="sliderLightDir"></div>
            <label>Y: </label>
            <input type="text" id="lightDirY" readonly>

            <div id="sliderLightDirZ" class="sliderLightDir"></div>
            <label>Z: </label>
            <input type="text" id="lightDirZ" readonly>
        </fieldset>
    </div>

    <!--The light color popup-->
    <div id="popupLightColor" class="popup" title="Tune the light color">
        <fieldset>
            <h3>ID light : <input type="text" class="lightSelectedStr" readonly></h3>
            <h4>Ambient: </h4>
            <div id="sliderLightAmbR" class="sliderLightAmb"></div>
            <label>R: </label>
            <input type="text" id="lightAmbR" readonly>

            <div id="sliderLightAmbG" class="sliderLightAmb"></div>
            <label>G: </label>
            <input type="text" id="lightAmbG" readonly>

            <div id="sliderLightAmbB" class="sliderLightAmb"></div>
            <label>B: </label>
            <input type="text" id="lightAmbB" readonly>


            <h4>Diffuse: </h4>
            <div id="sliderLightDifR" class="sliderLightDif"></div>
            <label>R: </label>
            <input type="text" id="lightDifR" readonly>

            <div id="sliderLightDifG" class="sliderLightDif"></div>
            <label>G: </label>
            <input type="text" id="lightDifG" readonly>

            <div id="sliderLightDifB" class="sliderLightDif"></div>
            <label>B: </label>
            <input type="text" id="lightDifB" readonly>


            <h4>Specular: </h4>
            <div id="sliderLightSpecR" class="sliderLightSpec"></div>
            <label>R: </label>
            <input type="text" id="lightSpecR" readonly>

            <div id="sliderLightSpecG" class="sliderLightSpec"></div>
            <label>G: </label>
            <input type="text" id="lightSpecG" readonly>

            <div id="sliderLightSpecB" class="sliderLightSpec"></div>
            <label>B: </label>
            <input type="text" id="lightSpecB" readonly>
        </fieldset>
    </div>

    <h4>Rotate with: left mouse button.</h4>
    <h4>Move with: right mouse button.</h4>
    <h4>Reset with: R.</h4>

    <input id="directory" type="hidden" value="<?php if(isset($_GET["directory"])) echo($_GET["directory"]); ?>">

    <br><p><a href="index.php">Return</a></p>

 <?php
    include "footer.html";
?>