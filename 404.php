<?php
/**
 * Created by PhpStorm.
 * User: arnaud
 * Date: 07/04/14
 * Time: 12:57
 */
    include "header.html";

    echo("<h1>404 Not Found</h1>");
    header("Refresh: 2; url=index.php");

    include "footer.html";
?>