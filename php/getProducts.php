<?php
include "dbConnect.php";
session_start();

$category = json_decode($_POST["category"], true);

$products = array();
if ($category == '0') {
    $query = mysqli_query($base, "SELECT `product_id`, `product_name` FROM `products`");
    if (mysqli_num_rows($query) > 0) {
        while ($row = mysqli_fetch_assoc($query)) {
            array_push($products, array('product_id' => $row['product_id'], 'product_name' => $row['product_name']));
        }
    }
} else {
    $query2 = mysqli_query($base, "SELECT `product_id`, `product_name` FROM `products` WHERE `category_id` = '$category'");
    if (mysqli_num_rows($query2) > 0) {
        while ($row = mysqli_fetch_assoc($query2)) {
            array_push($products, array('product_id' => $row['product_id'], 'product_name' => $row['product_name']));
        }
    }
}
echo json_encode($products, true);
