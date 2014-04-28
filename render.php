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
    </p>

    <div id="popup" title="Tune the light position">
        <fieldset>
            <h3>ID light : <input type="text" id="lightSelectedStr" readonly></h3>
            <div id="sliderX" class="sliderPos"></div>
            <label>X: </label>
            <input type="text" id="lightPosX" readonly>

            <div id="sliderY" class="sliderPos"></div>
            <label>Y: </label>
            <input type="text" id="lightPosY" readonly>

            <div id="sliderZ" class="sliderPos"></div>
            <label>Z: </label>
            <input type="text" id="lightPosZ" readonly>
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