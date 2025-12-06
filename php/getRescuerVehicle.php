
<?php
include "dbConnect.php";
session_start();

$user_id =  $_SESSION['user_id'];

$array = array();
$array2 = array();
$array3 = array();
$array4 = array();
$result = array();
$unique_id = array();
$products_request = array();
$requests = array();
$products_offer = array();
$offers = array();

$query = mysqli_query($base, "SELECT vehicles.vehicle_id, requests.request_id, products.product_name FROM ((vehicles LEFT OUTER JOIN requests ON requests.assigned_vehicle = vehicles.vehicle_id  AND requests.completion_date IS NULL) LEFT OUTER JOIN products ON products.product_id = requests.product_id) WHERE vehicles.resquer_id ='$user_id'");
if (mysqli_num_rows($query) > 0) {
    while ($row = mysqli_fetch_assoc($query)) {
        array_push($array, array('vehicle_id' => $row['vehicle_id'], 'request_id' => $row['request_id'], 'product_name_request' => $row['product_name']));
        array_push($unique_id, $row['vehicle_id']);
    }
}

$query2 = mysqli_query($base, "SELECT vehicles.vehicle_id, offers.offer_id, products.product_name FROM ((vehicles LEFT OUTER JOIN offers ON offers.assigned_vehicle = vehicles.vehicle_id AND offers.completion_date IS NULL ) LEFT OUTER JOIN products ON products.product_id = offers.product_id) WHERE vehicles.resquer_id = '$user_id'");
if (mysqli_num_rows($query2) > 0) {
    while ($row = mysqli_fetch_assoc($query2)) {
        array_push($array2, array('vehicle_id' => $row['vehicle_id'], 'offer_id' => $row['offer_id'], 'product_name_offer' => $row['product_name']));
    }
}

$query3 =mysqli_query($base, "SELECT vehicleproducts.vehicle_id,vehicleproducts.product_name FROM vehicleproducts LEFT OUTER JOIN vehicles ON vehicles.vehicle_id = vehicleproducts.vehicle_id  WHERE vehicles.resquer_id = '$user_id'");
if (mysqli_num_rows($query3) > 0) {
    while ($row = mysqli_fetch_assoc($query3)) {
        array_push($array3, array('vehicle_id' => $row['vehicle_id'],'product_name' => $row['product_name']));
    }
}

$query4 = mysqli_query($base, "SELECT vehicles.vehicle_id,vehicles.lat, vehicles.lon FROM vehicles WHERE vehicles.resquer_id = '$user_id'");
    if (mysqli_num_rows($query4) > 0) {       
        while ($row = mysqli_fetch_assoc($query4)) {
            array_push($array4 , array('vehicle_id' => $row['vehicle_id'],'lat' => $row['lat'], 'lon' => $row['lon']));
        }
    }

$unique_id = array_unique($unique_id);

foreach ($unique_id as $key => $value) {
    $products_request = [];
    $requests = [];
    $products_offer = [];
    $offers = [];
    $vehicle_products = [];
    $lat = null;
    $lon = null;
    $has_products = false;

    for ($i = 0; $i < count($array); $i++) {
        if ($value == $array[$i]['vehicle_id']) {
            $request_id = $array[$i]['request_id'];
            if ($request_id == null) {
                $request_id = "No active requests";
            }

            array_push($products_request, $array[$i]['product_name_request']);
            array_push($requests, $request_id);

        }
    }

    for ($i = 0; $i < count($array2); $i++) {
        if ($value == $array2[$i]['vehicle_id']) {
            $offer_id = $array2[$i]['offer_id'];
            if ($offer_id == null) {
                $offer_id = "No active offers";
            }

            array_push($products_offer, $array2[$i]['product_name_offer']);
            array_push($offers, $offer_id);

        }
    }

    for ($i = 0; $i < count($array3); $i++) {
        if ($value == $array3[$i]['vehicle_id']) {
            array_push($vehicle_products, $array3[$i]['product_name']);
            $has_products = true;
        }

    }

    if (!$has_products) {
        $vehicle_products[] = "Vehicle has no products";
    }

    for ($i = 0; $i < count($array4); $i++) {
        if ($value == $array4[$i]['vehicle_id']) {
            $lat = $array4[$i]['lat'];
            $lon = $array4[$i]['lon'];
        }

    }



    array_push($result, array("vehicle_id" => $value, "request_id" => $requests, 'lat' => $lat, 'lon' => $lon, 'product_name_request' => $products_request, "offer_id" => $offers, 'product_name_offer' => $products_offer, 'product_name' => $vehicle_products));
}

echo json_encode($result, true);
