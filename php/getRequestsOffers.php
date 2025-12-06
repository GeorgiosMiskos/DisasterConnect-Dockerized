<?php
include "dbConnect.php";
session_start();

$tasks = array();
$query1 = mysqli_query($base, "SELECT requests.request_id, requests.user_id, requests.number_of_people, requests.initial_request_date, products.product_name, person.first_name, person.last_name, person.phone FROM ((requests INNER JOIN products ON requests.product_id = products.product_id) LEFT OUTER JOIN person ON person.user_id = requests.user_id) WHERE requests.completion_date IS NULL AND requests.accepted_date IS NULL ORDER BY requests.request_id ASC");
if (mysqli_num_rows($query1) > 0) {
    while ($row = mysqli_fetch_assoc($query1)) {
        array_push($tasks, array('id' => $row['request_id'], 'number_of_people' => $row['number_of_people'], 'initial_date' => $row['initial_request_date'], 'product_name' => $row['product_name'], 'first_name' => $row['first_name'], 'last_name' => $row['last_name'], 'phone' => $row['phone'], 'type' => 'Request'));
    }
    
}

$query2 = mysqli_query($base, "SELECT offers.offer_id, offers.user_id, offers.initial_offer_date, products.product_name, person.first_name, person.last_name, person.phone, person.lat, person.lon FROM ((offers INNER JOIN products ON offers.product_id = products.product_id) LEFT OUTER JOIN person ON person.user_id = offers.user_id) WHERE offers.accepted_date IS NULL AND offers.completion_date IS NULL ORDER BY offers.offer_id ASC");
if (mysqli_num_rows($query2) > 0) {
    while ($row = mysqli_fetch_assoc($query2)) {
        array_push($tasks, array('id' => $row['offer_id'], 'initial_date' => $row['initial_offer_date'], 'product_name' => $row['product_name'],'number_of_people' => 'N/A', 'first_name' => $row['first_name'], 'last_name' => $row['last_name'], 'phone' => $row['phone'], 'type' => 'Offer'));
    }
    
}


$organizedTasks = array_values($tasks);


$result = [
    "total" => count($organizedTasks),
    "totalNotFiltered" => count($organizedTasks),
    "rows" => []
];

foreach ($organizedTasks as $entry) {
    $result["rows"][] = $entry;
}


echo json_encode($result, true);
