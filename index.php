</head>
<?php
/**
 * Created by PhpStorm.
 * User: arnaud
 * Date: 07/04/14
 * Time: 12:31
 */
include "header.html";

    echo ('<h1>Choose your mesh</h1><br>');
    if($folder = opendir('./Mesh'))
    {
        while(false !== ($directory = readdir($folder)))
        {
            if($directory != '.' && $directory != '..')
            {
                echo ('<a href="render.php?directory='.$directory.'">'.$directory.'</a><br>');
            }
        }
    }
    else
        echo ("<p><font color='red'>Couldn't open directory</font></p>");

include "footer.html";