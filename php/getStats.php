<?php
include "dbConnect.php";
session_start();

$startDate = $_POST['startDate'];
$endDate = $_POST['endDate'];

$startDate = new Datetime($startDate);
$startDate = $startDate->format('Y-m-d');
$endDate = new Datetime($endDate);
$endDate = $endDate->format('Y-m-d');

$stats = [
    'newRequests' => 0,
    'completedRequests' => 0,
    'newOffers' => 0,
    'completedOffers' => 0
];


$query1 = "SELECT COUNT(*) as numRequests FROM requests WHERE accepted_date IS NULL AND completion_date IS NULL AND initial_request_date BETWEEN '$startDate' AND '$endDate'";
$result1 = $base->query($query1);
$row1 = $result1->fetch_assoc();
$stats['newRequests'] = $row1['numRequests'];


$query2 = "SELECT COUNT(*) as numCompletedRequests FROM requests WHERE completion_date IS NOT NULL AND initial_request_date BETWEEN '$startDate' AND '$endDate'";
$result2 = $base->query($query2);
$row2 = $result2->fetch_assoc();
$stats['completedRequests'] = $row2['numCompletedRequests'];


$query3 = "SELECT COUNT(*) as numOffers FROM offers WHERE accepted_date IS NULL AND completion_date IS NULL AND initial_offer_date BETWEEN '$startDate' AND '$endDate'";
$result3 = $base->query($query3);
$row3 = $result3->fetch_assoc();
$stats['newOffers'] = $row3['numOffers'];


$query4 = "SELECT COUNT(*) as numCompletedOffers FROM offers WHERE completion_date IS NOT NULL AND initial_offer_date BETWEEN '$startDate' AND '$endDate'";
$result4 = $base->query($query4);
$row4 = $result4->fetch_assoc();
$stats['completedOffers'] = $row4['numCompletedOffers'];

echo json_encode($stats);
?>