<?php
include "dbConnect.php";
session_start();


$productName = $_POST['productName'];
$categoryName = $_POST['categoryName'];
$quantity = $_POST['quantity'];
$details = json_decode($_POST['details'], true);

  
  error_log("Product Name: " . $productName);
  error_log("Category Name: " . $categoryName);
  error_log("Quantity: " . $quantity);
  error_log("Details: " . print_r($details, true));


$category_id = null;
$productId = null;

$query = mysqli_query($base,"SELECT categories.category_id FROM categories WHERE categories.category_name = '$categoryName'");
if (mysqli_num_rows($query) > 0){
  while ($row = mysqli_fetch_assoc($query)) {
    $category_id = $row['category_id'];
  }
}
else { 
  $query1 = mysqli_query($base,"INSERT INTO categories (categories.category_name) VALUES ('$categoryName')");
    if ($query1) {
      $query2 = mysqli_query ($base,"SELECT categories.category_id FROM categories WHERE categories.category_name = '$categoryName'");
        while ($row = mysqli_fetch_assoc($query2)) {
          $category_id = $row['category_id'];
        }
    }
}


$query3 = mysqli_query($base,"INSERT INTO products (product_name, category_id, quantity) VALUES ('$productName', '$category_id', '$quantity')");
if ($query3) {
  $query4 = mysqli_query ($base,"SELECT products.product_id FROM products WHERE products.product_name = '$productName'");
    while ($row = mysqli_fetch_assoc($query4)) {
      $productId = $row['product_id'];
    }
  
    foreach ($details as $detail) {
      $detail_name = $detail['detail_name'];
      $detail_value = $detail['detail_value'];
      $query5 = mysqli_query($base,"INSERT INTO details (detail_name, detail_value, product_id) VALUES ('$detail_name', '$detail_value','$productId')");
    }
    echo "Product added successfully";
}
else {
  echo "Error: " . $query . "<br>" . mysqli_error($base);
}