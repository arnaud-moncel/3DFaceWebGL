</head>
<?php
/**
 * Created by PhpStorm.
 * User: arnaud
 * Date: 07/04/14
 * Time: 12:31
 */
    include "header.html";

    echo ('<h1 style="text-align:center">Choose your mesh</h1>');

    if($folder = opendir('./Mesh'))
    {
        while(false !== ($directory = readdir($folder)))
        {
            if($directory != '.' && $directory != '..')
            {
                echo ('<p style="text-align:center"><a href="render.php?directory='.$directory.'">'.$directory.'</a>');
            }
        }
    }
    else
        echo ("<p><font color='red'>Couldn't open directory</font></p>");

    include "footer.html";
?>