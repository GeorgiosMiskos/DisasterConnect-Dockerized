<?php
include "dbConnect.php";
session_start();

$sql = "SELECT product_ids , announcements.date FROM announcements";
$result = $base->query($sql);

$response = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $productIdsArray = json_decode($row['product_ids'], true)['product_ids'];

        $currentDate = date('Y-m-d');

        $announcementDate = $row['date'];

        $diff = strtotime($currentDate) - strtotime($announcementDate);
        $daysDifference = floor($diff / (60 * 60 * 24));

        $response[] = array('product_ids' => $productIdsArray, 'days_created_ago' => $daysDifference);
    }
} else {
    $response['error'] = "No results found";
}

header('Content-Type: application/json');
echo json_encode($response);
