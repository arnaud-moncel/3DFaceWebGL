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
    include "Shaders/Coke_Torrance_frag.html";
    include "Shaders/Coke_Torrance_vert.html";
?>
<script type="text/javascript" src="Js/gl_script.js"></script>
</head>

 <body onload="webGLStart();">
    <?php
         if(isset($_GET["directory"]))
         {
             echo("<h1>".$_GET["directory"]." 3D Mesh</h1>");
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
                echo ("<p><font color='red'>Couldn't open directory</font></p>");
         }
         else
            echo("<p><font color='red'>No file selected</font></p>");
    ?>

    <canvas height="500" id="canvas" style="border: none;" width="500"></canvas><br />

    <input id="directory" type="hidden" value="<?php if(isset($_GET["directory"])) echo($_GET["directory"]); ?>">

    <input id="lightPositionX" type="hidden" value="0.0" />
    <input id="lightPositionY" type="hidden" value="0.0" />
    <input id="lightPositionZ" type="hidden" value="200.0" />

    <input id="pointR" type="hidden" value="0.8" />
    <input id="pointG" type="hidden" value="0.8" />
    <input id="pointB" type="hidden" value="0.8" />

    <input id="ambientR" type="hidden" value="0.2" />
    <input id="ambientG" type="hidden" value="0.2" />
    <input id="ambientB" type="hidden" value="0.2" />

    <br><a href="index.php">Return</a>

 <?php
    include "footer.html";
?>