<?php
$DB_HOST = getenv('DB_HOST');
$DB_USER = getenv('DB_USER')
$DB_PASS = getenv('DB_PASS')
$DB_NAME = getenv('DB_NAME')
$base = mysqli_connect("DB_HOST", "DB_USER", "DB_PASS", "DB_NAME") or die("Unable to connect");


if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    exit();
}
