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
<script type="text/javascript">
    $(function()
    {
        $("div.slider").slider({
            min: -100,
            max: 100,
            values: [0],
            step: 5,
            slide: function(event, ui)
            {
                if(this.id == "sliderX")
                    $("#lightPosX").val(ui.value);
                else if(this.id == "sliderY")
                    $("#lightPosY").val(ui.value);
                else if(this.id == "sliderZ")
                    $("#lightPosZ").val(ui.value);
            }
        });
        $("#lightPosX").val($("#sliderX").slider("value"));
        $("#lightPosY").val($("#sliderY").slider("value"));
        $("#lightPosZ").val($("#sliderZ").slider("value"));
    });
</script>

<!--CSS-->
<style type="text/css">
    h4, p
    {
        text-align:center;
    }

    fieldset
    {
        text-align: center;
        width: 500px;
        margin: auto;
        padding-top: 0px;
    }

    fieldset h3
    {
        margin-top: 0px;
    }

    fieldset input
    {
        border:0;
        color:#f6931f;
        font-weight:bold;
        margin-bottom: 5px;
    }
</style>
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

    <fieldset>
        <h3>Light position</h3>
        <div id="sliderX" class="slider"></div>
        <label>X: </label>
        <input type="text" id="lightPosX">

        <div id="sliderY" class="slider"></div>
        <label>Y: </label>
        <input type="text" id="lightPosY">

        <div id="sliderZ" class="slider"></div>
        <label>Z: </label>
        <input type="text" id="lightPosZ">
    </fieldset>

    <h4>Rotate with: left mouse button.</h4>
    <h4>Move with: right mouse button.</h4>
    <h4>Reset with: R.</h4>

    <input id="directory" type="hidden" value="<?php if(isset($_GET["directory"])) echo($_GET["directory"]); ?>">

    <br><p><a href="index.php">Return</a></p>

 <?php
    include "footer.html";
?>