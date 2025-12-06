<?php
include "dbConnect.php";
session_start();

$products = json_decode($_POST["products"], true);
$user_id = $_SESSION['user_id'];;


foreach ($products as $product) {
    
    $product_id = $product['product_id'];
    $product_quantity = $product['quantity'];

    $query1 = "INSERT INTO `offers`(`user_id`, `product_id`,`product_quantity`) VALUES ($user_id, $product_id, $product_quantity)";

    if (mysqli_query($base, $query1)) {
    } else {
        echo "Error: " . $query1 . mysqli_error($base);
    }
}
echo 1;
