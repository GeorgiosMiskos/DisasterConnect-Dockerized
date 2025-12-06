<?php
include "dbConnect.php";
session_start();

$groupedRequests = array();

$query = mysqli_query($base, "SELECT requests.request_id, requests.user_id,requests.product_quantity, requests.assigned_vehicle, requests.number_of_people, requests.initial_request_date, requests.accepted_date, products.product_name, person.first_name, person.last_name, person.phone, person.lat, person.lon FROM ((requests INNER JOIN products ON requests.product_id = products.product_id) LEFT OUTER JOIN person ON person.user_id = requests.user_id) WHERE requests.completion_date IS NULL");

if (mysqli_num_rows($query) > 0) {
    while ($row = mysqli_fetch_assoc($query)) {
        $userId = $row['user_id'];

        
        if (!isset($groupedRequests[$userId])) {
            $groupedRequests[$userId] = array(
                'user_id' => $userId,
                'first_name' => $row['first_name'],
                'last_name' => $row['last_name'],
                'phone' => $row['phone'],
                'lat' => $row['lat'],
                'lon' => $row['lon'],
                'request_ids' => array(),
                'products' => array(),
                'product_quantity' => array(),
                'assigned_vehicles' => array(),
                'initial_request_dates' => array(),
                'accepted_dates' => array(),
                'number_of_peoples' => array(),
            );
        }

        
        if (!in_array($row['request_id'], $groupedRequests[$userId]['request_ids'])) {
            array_push($groupedRequests[$userId]['request_ids'],  $row['request_id']);
            array_push($groupedRequests[$userId]['products'],  $row['product_name']);
            array_push($groupedRequests[$userId]['assigned_vehicles'],  $row['assigned_vehicle'] ?? "N/A");
            array_push($groupedRequests[$userId]['initial_request_dates'],  $row['initial_request_date']);
            array_push($groupedRequests[$userId]['accepted_dates'],  $row['accepted_date'] ?? "N/A");
            array_push($groupedRequests[$userId]['number_of_peoples'],  $row['number_of_people']);
            array_push($groupedRequests[$userId]['product_quantity'],  $row['product_quantity']);
        }
    }
}


$groupedRequests = array_values($groupedRequests);

echo json_encode($groupedRequests, true);