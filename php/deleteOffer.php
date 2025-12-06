<?php
session_start();
include "dbConnect.php";

$offer = $_POST['offer'];


$query = "DELETE FROM `offers` WHERE `offer_id` = '$offer'";

if ($base->query($query) === TRUE) {
    echo 1; 
} else {
    echo $base->error;
}
