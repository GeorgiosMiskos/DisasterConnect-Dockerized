<?php
include "dbConnect.php";
session_start();

$amount = json_decode($_POST["amount"], true);
$product = json_decode($_POST["product"], true);


$query = "UPDATE `products` SET `quantity`='$amount' WHERE `product_id`='$product'";


if (mysqli_query($base, $query)) {
    echo "Updated successfully";
} else {
    echo "Error: " . $query . mysqli_error($base);
}
