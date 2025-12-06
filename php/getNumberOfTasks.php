<?php
include "dbConnect.php";
session_start();

$user_id =  $_SESSION['user_id'];

$result = mysqli_query($base, "SELECT `vehicle_id` FROM `vehicles` WHERE `resquer_id` = '$user_id'");
if ($result) {
    $vehicle = mysqli_fetch_assoc($result);
} else {
    echo "Error executing query: " . mysqli_error($base);
}

$result1 = mysqli_query($base, "SELECT COUNT(*) AS total_requests FROM requests WHERE assigned_vehicle = '" . $vehicle['vehicle_id'] . "' AND completion_date IS NULL");
$row1 = mysqli_fetch_assoc($result1);
$totalRequests = $row1['total_requests'];

$query2 = "SELECT COUNT(*) AS total_offers FROM offers WHERE assigned_vehicle = '" . $vehicle['vehicle_id'] . "' AND completion_date IS NULL";
$result2 = mysqli_query($base, $query2);
$row2 = mysqli_fetch_assoc($result2);
$totalOffers = $row2['total_offers'];


$totalTasks = $totalRequests + $totalOffers;

echo $totalTasks;