<?php
include "dbConnect.php";
session_start();

$id = $_POST['id'];


$vehicleProducts = array();
$result = mysqli_query($base, "SELECT `product_id`,`quantity` FROM `vehicleproducts` WHERE `vehicle_id` = '$id'");
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        array_push($vehicleProducts, array('product_id' => $row['product_id'], 'quantity' => $row['quantity']));
    }
;
}


foreach ($vehicleProducts as $product) {
    $new_quantity = 0;


    $old_quantity = array();
    $query2 = mysqli_query($base, "SELECT `quantity` FROM `products` WHERE `product_id` = '" . $product['product_id'] . "'");
    if (mysqli_num_rows($query2) > 0) {
        while ($row = mysqli_fetch_assoc($query2)) {
            array_push($old_quantity, $row['quantity']);
        }
       
    }
    $new_quantity = $old_quantity[0] + $product['quantity'];

    $query3 = "UPDATE `products` SET `quantity`='$new_quantity' WHERE `product_id` = '" . $product['product_id'] . "'";

    if (mysqli_query($base, $query3)) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $query3 . mysqli_error($base);
    }


    $query1 = "DELETE FROM `vehicleproducts` WHERE `vehicle_id`='$id'";

    if (mysqli_query($base, $query1)) {
    } else {
        echo "Error: " . $query1 . mysqli_error($base);
    }
}
