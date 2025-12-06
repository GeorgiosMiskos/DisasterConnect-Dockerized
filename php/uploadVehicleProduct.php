<?php
include "dbConnect.php";
session_start();

$user_id =  $_SESSION['user_id'];

$product_id = $_POST["product_id"];
$product_name = $_POST["product_name"];
$vehicle_id = $_POST["vehicle_id"];
$old_ammount = $_POST["old_ammount"];
$new_amount = $_POST["new_amount"];

$final_amount = $old_ammount - $new_amount;

$query1 = "INSERT INTO `vehicleproducts`(`product_id`, `product_name`, `vehicle_id`, `quantity`) VALUES ('$product_id','$product_name','$vehicle_id','$new_amount')";

try {
    if (mysqli_query($base, $query1)) {
        $query4 = "UPDATE `products` SET `quantity`='$final_amount' WHERE `product_id` = '$product_id'";
        if (mysqli_query($base, $query4)) {
            echo 11;
        } else {
            echo "Error: " . $query4 . mysqli_error($base);
        }
    } else {
        echo "Error: " . $query1 . mysqli_error($base);
    }
} catch (mysqli_sql_exception $e) {
    if ($e->getCode() == 1062) {
        $query2 = "UPDATE `vehicleproducts` SET `quantity`='$new_amount' WHERE `product_id` = '$product_id'";
        if (mysqli_query($base, $query2)) {
            echo 1;
            $query3 = "UPDATE `products` SET `quantity`='$final_amount' WHERE `product_id` = '$product_id'";
            if (mysqli_query($base, $query3)) {
                echo 1;
            } else {
                echo "Error: " . $query3 . mysqli_error($base);
            }
        } else {
            echo "Error: " . $query2 . mysqli_error($base);
        }
    }
}
