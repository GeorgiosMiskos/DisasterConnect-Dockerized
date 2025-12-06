<?php

$base = mysqli_connect("disaster-mysql", "root", "Omgkai3lol!", "web24") or die("Unable to connect");

if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    exit();
}
