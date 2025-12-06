<?php
include "dbConnect.php";
session_start();

$user_id = $_SESSION['user_id'];

$result = mysqli_query($base, "SELECT `vehicle_id` FROM `vehicles` WHERE `resquer_id` = '$user_id'");
if ($result) {
    $vehicle = mysqli_fetch_assoc($result);
} else {
    echo "Error executing query: " . mysqli_error($base);
}

$tasks = array();
$query1 = mysqli_query($base, "SELECT requests.request_id, requests.user_id, requests.number_of_people, requests.initial_request_date, products.product_name, person.first_name, person.last_name, person.phone, person.lat, person.lon FROM ((requests INNER JOIN products ON requests.product_id = products.product_id) LEFT OUTER JOIN person ON person.user_id = requests.user_id) WHERE requests.completion_date IS NULL AND requests.assigned_vehicle = '" . $vehicle['vehicle_id'] . "' ORDER BY requests.request_id ASC");
if (mysqli_num_rows($query1) > 0) {
    while ($row = mysqli_fetch_assoc($query1)) {
        array_push($tasks, array('id' => $row['request_id'], 'number_of_people' => $row['number_of_people'], 'initial_date' => $row['initial_request_date'], 'product_name' => $row['product_name'], 'first_name' => $row['first_name'], 'last_name' => $row['last_name'], 'phone' => $row['phone'], 'lat' => $row['lat'], 'lon' => $row['lon'], 'type' => 'Request'));
    }
   ;
}

$query2 = mysqli_query($base, "SELECT offers.offer_id, offers.user_id, offers.initial_offer_date, products.product_name, person.first_name, person.last_name, person.phone, person.lat, person.lon FROM ((offers INNER JOIN products ON offers.product_id = products.product_id) LEFT OUTER JOIN person ON person.user_id = offers.user_id) WHERE offers.completion_date IS NULL AND offers.assigned_vehicle = '" . $vehicle['vehicle_id'] . "' ORDER BY offers.offer_id ASC");
if (mysqli_num_rows($query2) > 0) {
    while ($row = mysqli_fetch_assoc($query2)) {
        array_push($tasks, array('id' => $row['offer_id'], 'initial_date' => $row['initial_offer_date'], 'product_name' => $row['product_name'], 'number_of_people' => 'N/A', 'first_name' => $row['first_name'], 'last_name' => $row['last_name'], 'phone' => $row['phone'], 'lat' => $row['lat'], 'lon' => $row['lon'], 'type' => 'Offer'));
    }
}

echo json_encode($tasks, true);
