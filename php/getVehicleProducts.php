<?php

include "dbConnect.php";
session_start();
$array  = array();

$query = mysqli_query ($base,"SELECT products.product_id,products.product_name,categories.category_name,vehicleproducts.quantity,vehicleproducts.vehicle_id FROM products LEFT OUTER JOIN categories ON products.category_id=categories.category_id LEFT OUTER JOIN vehicleproducts ON vehicleproducts.product_id=products.product_id WHERE vehicleproducts.vehicle_id IS NOT NULL;");
if (mysqli_num_rows($query) > 0) {
  while ($row = mysqli_fetch_assoc($query)) {
    array_push($array, array('product_id' => $row['product_id'],'product_name' => $row['product_name'],'category_name' => $row['category_name'],'quantity' => $row['quantity'],'vehicle_id' => $row['vehicle_id']));
  }
}

$result = [
  "total" => count($array),
  "rows" => []
];

foreach ($array as $entry) {
  $result["rows"][] = $entry; 
}

echo json_encode($result, true);