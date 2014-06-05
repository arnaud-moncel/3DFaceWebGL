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
    include "Shaders/cook_frag.html";
    include "Shaders/cook_vert.html";
?>
<script type="text/javascript" src="Js/gl_script.js"></script>

<!--Resize Canvas-->
<script type="text/javascript">
    //disable the right clic action on the page
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

 <body onload="webGLStart(); resize();" onresize="resize();" id="body">
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
    <!--<input type="button" value="Edit" id="editButton"><br>-->

    <canvas id="canvas" height="800" width="800"></canvas><br><br>

    <?php
        include "popupDef.html";
    ?>

    <h4>Rotate with: left mouse button.</h4>
    <h4>Move with: right mouse button.</h4>
    <h4>Reset with: R.</h4>

    <input id="directory" type="hidden" value="<?php if(isset($_GET["directory"])) echo($_GET["directory"]); ?>">

    <br><p><a href="index.php">Return</a></p>

 <?php
    include "footer.html";
?>