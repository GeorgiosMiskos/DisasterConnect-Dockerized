<?php
session_start();
include "dbConnect.php";

$productIdsArray = $_POST['products'];
$productIds = json_encode(['product_ids' => $productIdsArray]);


$query = "INSERT INTO `announcements` (`product_ids`) VALUES ('$productIds')";


if ($base->query($query) === TRUE) {
    echo 1;
} else {
    echo $base->error;
}
