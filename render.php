<?php
/**
 * Created by PhpStorm.
 * User: arnaud
 * Date: 07/04/14
 * Time: 11:48
 */
include "header.html";

    if(isset($_GET["directory"]))
    {
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

include "footer.html";
