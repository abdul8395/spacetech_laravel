<?php

session_start();

if(!isset($_SESSION['user_id'])){
 echo 'false';
}else {
    echo $_SESSION['user_id'];
}
?>