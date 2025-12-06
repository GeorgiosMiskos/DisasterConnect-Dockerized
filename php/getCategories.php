<?php
include "dbConnect.php";
session_start();

$result = mysqli_query($base, "SELECT * FROM `categories`");
$categories = array();
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        array_push($categories, array('category_id' => $row['category_id'], 'category_name' => $row['category_name']));
    }
    echo json_encode($categories, true);
}
