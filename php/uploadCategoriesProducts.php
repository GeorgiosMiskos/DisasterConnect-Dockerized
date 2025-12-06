
<?php
include "dbConnect.php";
session_start();

$products = json_decode($_POST["products"], true);
$categories = json_decode($_POST["categories"], true);
$details = json_decode($_POST["details"], true);


foreach ($products as $product) {
    $productId = mysqli_real_escape_string($base, $product['id']);
    $productName = mysqli_real_escape_string($base, $product['name']);
    $categoryId = mysqli_real_escape_string($base, $product['category']);
    $quantity = mysqli_real_escape_string($base, $product['quantity']);

    
    $checkQuery = "SELECT * FROM products WHERE product_id = '$productId'";
    $checkResult = mysqli_query($base, $checkQuery);

    if (mysqli_num_rows($checkResult) == 0) {
        
        $query1 = "INSERT IGNORE INTO products (product_id, product_name, category_id, quantity) 
                   VALUES ('$productId', '$productName', '$categoryId', '$quantity')";

        if (mysqli_query($base, $query1)) {
            
        } else {
            
        }
    }
}

foreach ($categories as $category) {
    $categoryId = mysqli_real_escape_string($base, $category['id']);
    $categoryName = mysqli_real_escape_string($base, $category['name']);

    
    $checkQuery = "SELECT * FROM categories WHERE category_id = '$categoryId'";
    $checkResult = mysqli_query($base, $checkQuery);

    if (mysqli_num_rows($checkResult) == 0) {
        
        $query = "INSERT IGNORE INTO categories (category_id, category_name) 
                  VALUES ('$categoryId', '$categoryName')";

        if (mysqli_query($base, $query)) {
            
        } else {
            
        }
    }
}

foreach ($details as $detail) {
    $detailName = mysqli_real_escape_string($base, $detail['detail_name']);
    $detailValue = mysqli_real_escape_string($base, $detail['detail_value']);
    $productId = mysqli_real_escape_string($base, $detail['product_id']);

    $query2 = "INSERT INTO details (detail_name, detail_value, product_id) 
               VALUES ('$detailName', '$detailValue', '$productId')";

    if (mysqli_query($base, $query2)) {
        
    } else {
        
    }
}

echo 1;
