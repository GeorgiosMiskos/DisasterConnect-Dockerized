<?php
include "dbConnect.php";
session_start();

$products = array();
$query = mysqli_query($base, "SELECT products.product_id, products.product_name, products.quantity, categories.category_name, details.detail_name, details.detail_value FROM ((products INNER JOIN categories ON products.category_id = categories.category_id) LEFT JOIN details ON details.product_id = products.product_id) ORDER BY products.product_id ASC");
if (mysqli_num_rows($query) > 0) {
    while ($row = mysqli_fetch_assoc($query)) {  
        array_push($products, array('product_id' => $row['product_id'], 'product_name' => $row['product_name'], 'quantity' => $row['quantity'], 'category_name' => $row['category_name'], 'detail_name' => $row['detail_name'], 'detail_value' => $row['detail_value']));
    } 
}


$productsMap = [];


foreach ($products as $product) {
    $productId = $product['product_id'];
    $detailName = $product['detail_name'];
    $detailValue = $product['detail_value'];
    unset($product['detail_name'], $product['detail_value']); 

    
    if (!isset($productsMap[$productId])) {  
        $productsMap[$productId] = [
            'product_id' => $productId,
            'details' => [],
        ] + $product; 
    }

    
    $productsMap[$productId]['details'][] = [
        'detail_name' => $detailName,
        'detail_value' => $detailValue,
    ];
}


$organizedProducts = array_values($productsMap);  


$result = [
    "total" => count($organizedProducts), 
    "totalNotFiltered" => count($organizedProducts), 
    "rows" => []
];

foreach ($organizedProducts as $entry) {
    $result["rows"][] = $entry; 
}


echo json_encode($result, true);
