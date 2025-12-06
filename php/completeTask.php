<?php
include "dbConnect.php";
session_start();


$user_id =  $_SESSION['user_id'];
$type = $_POST['type'];
$id = $_POST['id'];



$query = mysqli_query($base, "SELECT vehicles.vehicle_id FROM vehicles WHERE vehicles.resquer_id = '$user_id'");
if (mysqli_num_rows($query) > 0) {
    while ($row = mysqli_fetch_assoc($query)) {
        $unique_id =$row['vehicle_id'];
    }
}

$query1 = mysqli_query ($base,"SELECT requests.request_id,requests.product_id,requests.product_quantity,vehicleproducts.quantity,requests.assigned_vehicle FROM requests LEFT OUTER JOIN vehicleproducts ON requests.product_id= vehicleproducts.product_id WHERE requests.assigned_vehicle='$unique_id' AND requests.request_id='$id'");
if (mysqli_num_rows($query1) > 0) {
    while ($row = mysqli_fetch_assoc($query1)) {
        $request_id = $row['request_id'];
        $product_id = $row['product_id'];
        $product_quantity = $row['product_quantity'];
        $quantity = $row['quantity'];
        $assigned_vehicle = $row['assigned_vehicle'];
    }
}

$query2 = mysqli_query($base,"SELECT offers.product_id,products.product_name,offers.assigned_vehicle,offers.product_quantity FROM offers LEFT OUTER JOIN products ON offers.product_id = products.product_id WHERE offers.assigned_vehicle='$unique_id' AND offers.offer_id='$id'");
if (mysqli_num_rows($query2) > 0){
    while ($row = mysqli_fetch_assoc($query2)) {
        $product_id = $row['product_id'];
        $product_name = $row['product_name'];
        $assigned_vehicle = $row['assigned_vehicle'];
        $product_quantity = $row['product_quantity'];
    }
}

date_default_timezone_set('Europe/Athens');
$currentDate = date('Y-m-d');

if ($type == 'Request') {
    if ($product_quantity == $quantity){
        $query3 = "UPDATE `requests` SET `completion_date`='$currentDate' WHERE `request_id` = '$id'";
        $query4 = "DELETE FROM vehicleproducts WHERE vehicleproducts.product_id = '$product_id'";
            if (mysqli_query($base, $query3)){
                if (mysqli_query($base, $query4)){
                    echo 1;
                }
            } else {
                echo "Error: " . $query3 . mysqli_error($base);
                echo "Error: " . $query4 . mysqli_error($base);
            }   
    }
    else if($quantity>$product_quantity){
        $newquantity = $quantity - $product_quantity;
        $query5 = "UPDATE `requests` SET `completion_date`='$currentDate' WHERE `request_id` = '$id'";
        $query6 = "UPDATE vehicleproducts SET vehicleproducts.quantity = '$newquantity' WHERE vehicleproducts.product_id = '$product_id'";
        if (mysqli_query($base, $query5)){
            if (mysqli_query($base, $query6)){
                echo 1;
            }
        } else {
            echo "Error: " . $query5 . mysqli_error($base);
            echo "Error: " . $query6 . mysqli_error($base);
        }  
    }
    else {
            echo 2;
        }
    
    }
else if ($type == 'Offer') {
    $query7 = "UPDATE `offers` SET `completion_date`='$currentDate' WHERE `offer_id` = '$id'";
    $query8 = "INSERT INTO `vehicleproducts` (`product_id`, `product_name`, `vehicle_id`, `quantity`) VALUES ('$product_id','$product_name','$assigned_vehicle',' $product_quantity') ";
    if (mysqli_query($base, $query7)) {
        if (mysqli_query($base, $query8)){
            echo 1;
        }
    } else {
        echo "Error: " . $query7 . mysqli_error($base);
        echo "Error: " . $query8 . mysqli_error($base);
    }
}
