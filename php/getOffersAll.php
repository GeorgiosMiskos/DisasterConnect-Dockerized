<?php
include "dbConnect.php";
session_start();

$groupedOffers = array();

$query = mysqli_query($base, "SELECT offers.offer_id, offers.user_id, offers.assigned_vehicle, offers.initial_offer_date, offers.accepted_date, products.product_name,offers.product_quantity, person.first_name, person.last_name, person.phone, person.lat, person.lon FROM ((offers INNER JOIN products ON offers.product_id = products.product_id) LEFT OUTER JOIN person ON person.user_id = offers.user_id) WHERE offers.completion_date IS NULL");

if (mysqli_num_rows($query) > 0) {
    while ($row = mysqli_fetch_assoc($query)) {
        $userId = $row['user_id'];

        if (!isset($groupedOffers[$userId])) { 
            $groupedOffers[$userId] = array(
                'user_id' => $userId,
                'first_name' => $row['first_name'],
                'last_name' => $row['last_name'],
                'phone' => $row['phone'],
                'lat' => $row['lat'],
                'lon' => $row['lon'],
                'offer_ids' => array(),
                'products' => array(),
                'product_quantity' => array(),
                'assigned_vehicles' => array(),
                'initial_offer_dates' => array(),
                'accepted_dates' => array(),
            );
        }

        
        if (!in_array($row['offer_id'], $groupedOffers[$userId]['offer_ids'])) { 
            array_push($groupedOffers[$userId]['offer_ids'],  $row['offer_id']);
            array_push($groupedOffers[$userId]['products'],  $row['product_name']);
            array_push($groupedOffers[$userId]['assigned_vehicles'],  $row['assigned_vehicle'] ?? "N/A");
            array_push($groupedOffers[$userId]['initial_offer_dates'],  $row['initial_offer_date']);
            array_push($groupedOffers[$userId]['accepted_dates'],  $row['accepted_date'] ?? "N/A");
            array_push($groupedOffers[$userId]['product_quantity'],  $row['product_quantity']);
        }
    }
}


$groupedOffers = array_values($groupedOffers);

echo json_encode($groupedOffers, true);
