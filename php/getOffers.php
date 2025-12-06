<?php
include "dbConnect.php";
session_start();

$user_id =  $_SESSION['user_id'];

$offers = array();

$query = mysqli_query($base, "SELECT offers.offer_id, offers.user_id, offers.initial_offer_date, offers.accepted_date, offers.completion_date, products.product_name FROM offers INNER JOIN products ON offers.product_id = products.product_id WHERE offers.user_id = '$user_id' ORDER BY `completion_date` DESC, `accepted_date` DESC");
if (mysqli_num_rows($query) > 0) {
    while ($row = mysqli_fetch_assoc($query)) {
        array_push($offers, array('offer_id' => $row['offer_id'], 'user_id' => $row['user_id'], 'product_name' => $row['product_name'], 'initial_offer_date' => $row['initial_offer_date'], 'accepted_date' => $row['accepted_date'], 'completion_date' => $row['completion_date']));
    }
}

$organizedProducts = array_values($offers);


foreach ($organizedProducts as $entry) {
    $result["rows"][] = $entry;
}

echo json_encode($result, JSON_PRETTY_PRINT);
