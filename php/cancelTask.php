<?php
include "dbConnect.php";
session_start();

$user_id =  $_SESSION['user_id'];
$type = $_POST['type'];
$id = $_POST['id'];

date_default_timezone_set('Europe/Athens');
$currentDate = date('Y-m-d');

if ($type == 'Request') {
    $query = "UPDATE `requests` SET `assigned_vehicle`= NULL,`accepted_date`= NULL WHERE `request_id` = '$id'";
    if (mysqli_query($base, $query)) {
        echo 1;
    } else {
        echo "Error: " . $query . mysqli_error($base);
    }
} else if ($type == 'Offer') {
    $query2 = "UPDATE `offers` SET `assigned_vehicle`= NULL,`accepted_date`= NULL WHERE `offer_id` = '$id'";
    if (mysqli_query($base, $query2)) {
        echo 1;
    } else {
        echo "Error: " . $query2 . mysqli_error($base);
    }
}
