<?php

session_start();
include "dbConnect.php";

$products = $_POST['products'];


$productIDs = array_map('intval', $products);


$queryProducts = "DELETE FROM `products` WHERE `product_id` IN (" . implode(',', $productIDs) . ")";


$queryDetails = "DELETE FROM `details` WHERE `product_id` IN (" . implode(',', $productIDs) . ")";


if ($base->query($queryProducts) === TRUE) {
    
    if ($base->query($queryDetails) === TRUE) {
        echo 1; 
    } else {
        
        echo "Error deleting details record: " . $base->error;
    }
} else {
    
    echo "Error deleting products record: " . $base->error;
}
