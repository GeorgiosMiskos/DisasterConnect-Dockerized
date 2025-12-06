<?php

include "dbConnect.php";
session_start();

$result = array();

$query = mysqli_query($base,"SELECT lat , lon FROM baseposition");
if (mysqli_num_rows($query) > 0) { 
  while ($row = mysqli_fetch_assoc($query)) {
      array_push($result, array('lat' => $row['lat'], 'lon' => $row['lon']));
  }
}

echo json_encode($result, true);