<?php

include "dbConnect.php";
session_start();

$people = $_POST['people'];
$product = $_POST['product'];
$quantity = $_POST['quantity'];
$user_id = $_POST['user_id'];


$query = "INSERT INTO `requests`(`user_id`, `product_id`,`product_quantity`, `number_of_people`) VALUES ('$user_id', '$product','$quantity', '$people')";

if (mysqli_query($base, $query)) {
    echo 1;
} else {
    echo "Error: " . $query . mysqli_error($base);
}
