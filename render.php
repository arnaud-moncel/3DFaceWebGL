<?php
/**
 * Created by PhpStorm.
 * User: arnaud
 * Date: 07/04/14
 * Time: 11:48
 */
    include "header.html";
?>

<script type="text/javascript" src="Js/glMatrix-0.9.5.min.js"></script>
<script type="text/javascript" src="Js/webgl-utils.js"></script>
<script type="text/javascript" src="Js/scenegraph.js"></script>
<?php
    include "Shaders/Cook_Torrance_frag.html";
    include "Shaders/Cook_Torrance_vert.html";
?>
<script type="text/javascript" src="Js/gl_script.js"></script>

<script type="text/javascript">
    document.oncontextmenu = function(){return false;};

    function resize()
    {
        var x = document.body.clientWidth;
        var pos = (x/2)-document.getElementById("canvas").width/2;

        document.getElementById("canvas").style.marginLeft = pos+"px";
    }
</script>
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

    <h4 style="text-align:center">Rotate with: left mouse button.</h4>
    <h4 style="text-align:center">Move with: right mouse button.</h4>
    <h4 style="text-align:center">Reset with: R.</h4>

    <input id="directory" type="hidden" value="<?php if(isset($_GET["directory"])) echo($_GET["directory"]); ?>">

    <input id="lightPositionX" type="hidden" value="700.0" />
    <input id="lightPositionY" type="hidden" value="700.0" />
    <input id="lightPositionZ" type="hidden" value="250.0" />

    <input id="pointR" type="hidden" value="0.8" />
    <input id="pointG" type="hidden" value="0.8" />
    <input id="pointB" type="hidden" value="0.8" />

    <input id="ambientR" type="hidden" value="0.15" />
    <input id="ambientG" type="hidden" value="0.15" />
    <input id="ambientB" type="hidden" value="0.15" />

    <br><p style="text-align:center"><a href="index.php">Return</a></p>

 <?php
    include "footer.html";
?>