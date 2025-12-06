const logged_user = JSON.parse(localStorage.getItem("logged_user"));
if (logged_user == null) {
    window.location.assign("index.html");}
$("#nav-placeholder").load("./navbar/rescuerNavbar.html");
$("#footer-placeholder").load("footer.html");

let vehicleMarker = {};
let baseMarker = {};

let pendingRequestMarkers = {};
let pendingAndAssingedRequestMarkers = {};
let assignedRequestMarkers = {};

let pendingOfferMarkers = {};
let pendingAndAssingedOfferMarkers = {};
let assignedOfferMarkers = {};

let basePosition = [0,0];
let vehiclePostion = [0, 0]
let vehicleInfo = {};


$("#filterRequestPending").change(function () {
    updateMarkerVisibility();
});

$("#filterRequestPendingAssigned").change(function () {
    1
    updateMarkerVisibility();
});

$("#filterRequestAssigned").change(function () {
    updateMarkerVisibility();
});

$("#filterOffersPending").change(function () {
    updateMarkerVisibility();
});

$("#filterOffersPendingAssigned").change(function () {
    updateMarkerVisibility();
});

$("#filterOffersAssigned").change(function () {
    updateMarkerVisibility();
});


let baseLayer = L.tileLayer(
    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18,
    }
);
let map = new L.Map("map", {
    center: new L.LatLng(38.246361, 21.734966),
    zoom: 15,
    layers: [baseLayer],
    zoomControl: false,
});

loadBase();

function loadBase() {
    const baseAjax = $.ajax({
        url: "./php/getBaseCoords.php",
        method: "POST",
        dataType: "json",
        success: function (data) {
            basePosition = [data[0].lat, data[0].lon]
        },
    });

    baseAjax.done(CoordsResult);

    function CoordsResult(result){
        if (baseMarker[0]) {
            map.removeLayer(baseMarker[0]);
        }

         baseMarker[0] = L.marker([basePosition[0], basePosition[1]], { icon: Constants.baseMarkerIcon, draggable: false }).addTo(map).bindPopup('The base!');
    }
}

loadVehicle();
loadOffers();
loadRequests();
updateTasks();
let isxyei ;

function loadVehicle() {
   
    const vehiclesAjax = $.ajax({
        url: "./php/getRescuerVehicle.php",
        method: "POST",
        dataType: "json",
        success: function (data) {
            vehiclePostion = [data[0].lat, data[0].lon]
            vehicleInfo = data
            console.log(data);
        },
    });

    
    vehiclesAjax.done(vehicleResults);
}

function vehicleResults(result) {
    if (vehicleMarker[0]) {
        map.removeLayer(vehicleMarker[0]);
    }
    
    vehicleMarker[0] = L.marker([vehiclePostion[0], vehiclePostion[1]], { icon: Constants.vehicleMarkerIcon, draggable: true });

    const distance = getDistance(basePosition[0], basePosition[1], vehiclePostion[0], vehiclePostion[1]);
    console.log('Distance:', distance);
    if (distance <=100){
        console.log('mphka');
        isxyei = true;
    }
    else {
        isxyei = false;
    }
    
    const container = $("<div />");
    let containerContent = `
        <div class="card" style="width: 15rem;">
            <div class="card-body">
                <h5 class="card-title">Vehicle ID: ${result[0].vehicle_id}</h5>
                <p class="card-subtitle">Request IDs: ${result[0].request_id.join(", ")}</p>
                <p class="card-subtitle">Offer IDs: ${result[0].offer_id.join(", ")}</p>
                <p class="card-subtitle">Vehicles Products: ${result[0].product_name.join(", ")}</p>
                <button class="btn btn-primary btn-sm load">Load</button>
                <button class="btn btn-primary btn-sm unload">Unload</button>
            </div>
        </div>`;

    
    if (isxyei == true) {
        if (result[0].offer_id[0] === "No active offers" && result[0].request_id[0] === "No active requests") {
            containerContent = `
                <div class="card" style="width: 15rem;">
                    <div class="card-body">
                        <h5 class="card-title">Vehicle ID: ${result[0].vehicle_id}</h5>
                        <p class="card-subtitle">Request IDs: ${result[0].request_id.join(", ")}</p>
                        <p class="card-subtitle">Offer IDs: ${result[0].offer_id.join(", ")}</p>
                        <p class="card-subtitle">Vehicles Products: ${result[0].product_name.join(", ")}</p>
                        <button class="btn btn-primary btn-sm load">Load</button>
                        <button class="btn btn-primary btn-sm unload">Unload</button>
                    </div>
                </div>`;
        } else {
            containerContent = `
                <div class="card" style="width: 15rem;">
                    <div class="card-body">
                        <h5 class="card-title">Vehicle ID: ${result[0].vehicle_id}</h5>
                        <p class="card-subtitle">Request IDs: ${result[0].request_id.join(", ")}</p>
                        <p class="card-subtitle">Offer IDs: ${result[0].offer_id.join(", ")}</p>
                        <p class="card-text">Request products: ${result[0].product_name_request.join(", ")}</p>
                        <p class="card-text">Offer products: ${result[0].product_name_offer.join(", ")}</p>
                        <p class="card-subtitle">Vehicles Products: ${result[0].product_name.join(", ")}</p>
                        <button class="btn btn-primary btn-sm load">Load</button>
                        <button class="btn btn-primary btn-sm unload">Unload</button>
                    </div>
                </div>`;
        }
    } else {
        if (result[0].offer_id[0] === "No active offers" && result[0].request_id[0] === "No active requests") {
            containerContent = `
                <div class="card" style="width: 15rem;">
                    <div class="card-body">
                        <h5 class="card-title">Vehicle ID: ${result[0].vehicle_id}</h5>
                        <p class="card-subtitle">Request IDs: ${result[0].request_id.join(", ")}</p>
                        <p class="card-subtitle">Offer IDs: ${result[0].offer_id.join(", ")}</p>
                        <p class="card-subtitle">Vehicles Products: ${result[0].product_name.join(", ")}</p>
                    </div>
                </div>`;
        } else {
            containerContent = `
                <div class="card" style="width: 15rem;">
                    <div class="card-body">
                        <h5 class="card-title">Vehicle ID: ${result[0].vehicle_id}</h5>
                        <p class="card-subtitle">Request IDs: ${result[0].request_id.join(", ")}</p>
                        <p class="card-subtitle">Offer IDs: ${result[0].offer_id.join(", ")}</p>
                        <p class="card-text">Request products: ${result[0].product_name_request.join(", ")}</p>
                        <p class="card-text">Offer products: ${result[0].product_name_offer.join(", ")}</p>
                        <p class="card-subtitle">Vehicles Products: ${result[0].product_name.join(", ")}</p>
                    </div>
                </div>`;
        }
    }

    
    container.html(containerContent);
    vehicleMarker[0].bindPopup(container[0]);
    vehicleMarker[0].addTo(map);
    console.log(isxyei);

    container.on("click", ".load", function () {
        let params = new URLSearchParams();
        params.append("vehicle_id", result[0].vehicle_id);
        let url = "./loadManagment.html?" + params.toString();
        window.location.assign(url, '_blank');
        $.getJSON('./php/getRescuerVehicle.php', function(data) {
            vehicleResults(data);
            
        });
    });
    container.on("click", ".unload", function () {
        Swal.fire({
            title: "Are you sure",
            text: "Do you want to unload all the products from the vehicle?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
        }).then((kati) => {
            if (kati.isConfirmed) {
                $.post("./php/unloadVehicle.php", { id: result[0].vehicle_id }, function (result) {
                    console.log(result)
                    if (result == "1") {
                        updateTasks();
                        Swal.fire("Vehicle empty!", "", "success");
                        $.getJSON('./php/getRescuerVehicle.php', function(data) {
                            vehicleResults(data);
                        });
                    }
                    window.location.reload();
                });
            }
        });
        
    });
   
    
    vehicleMarker[0].on('dragend', function (event) {
        let markerPosition = vehicleMarker[0].getLatLng();
        vehiclePostion = [markerPosition.lat, markerPosition.lng]
       
        updateTasks();
        console.log('Marker Coordinates: Lat ' + markerPosition.lat + ', Lng ' + markerPosition.lng);
        $.post("./php/updateVehicleCoords.php", { lat: markerPosition.lat ,lng:  markerPosition.lng}, function (result) {
            console.log(result)});
            const distance = getDistance(basePosition[0], basePosition[1], vehiclePostion[0], vehiclePostion[1]);
            console.log('Distance:', distance);
            if (distance <=100){
                console.log('mphka');
                isxyei = true;
                vehicleResults(result);
            }
            else {
                isxyei = false;
                vehicleResults(result);
            }

    });
  
} 

function loadOffers() {
    const offersAjax = $.ajax({
        url: "./php/getOffersAll.php",
        method: "POST",
        dataType: "json",
        success: function (data) {
        },
    });

    offersAjax.done(offersResults);

    function offersResults(result) {
        result.map((offer, index) => {  
            const container = $("<div />");
            if (offer.assigned_vehicles.every(item => item === "N/A")) { 
                pendingOfferMarkers[index] = L.marker([offer.lat, offer.lon], { icon: Constants.offerPendingMarkerIcon }); 
                container.html(
                    `<div class="card" style="width: 15rem;">
                        <div class="card-body">
                            <h5 class="card-title">Citizen: ${offer.first_name} ${offer.last_name}</h5>
                            <p class="card-subtitle">Phone number: ${offer.phone}</p>
                            <p class="card-text">offer ID: ${offer.offer_ids.join(", ")}</p>
                            <p class="card-text">Date of registration: ${offer.initial_offer_dates.join(", ")}</p>
                            <p class="card-text">Products: ${offer.products.join(", ")}</p>
                            <p class="card-text">Number of products: ${offer.product_quantity.join(", ")}</p>
                        </div>
                    </div>`
                );
                pendingOfferMarkers[index].bindPopup(container[0]);
                pendingOfferMarkers[index].addTo(map);
            } else if (offer.assigned_vehicles.some(item => item === "N/A")) { 
                pendingAndAssingedOfferMarkers[index] = L.marker([offer.lat, offer.lon], { icon: Constants.offerPendingAndAssignedMarkerIcon });
                container.html(
                    `<div class="card" style="width: 15rem;">
                        <div class="card-body">
                            <h5 class="card-title">Citizen: ${offer.first_name} ${offer.last_name}</h5>
                            <p class="card-subtitle">Phone number: ${offer.phone}</p>
                            <p class="card-text">offer ID: ${offer.offer_ids.join(", ")}</p>
                            <p class="card-text">Date of registration: ${offer.initial_offer_dates.join(", ")}</p>
                            <p class="card-text">Products: ${offer.products.join(", ")}</p>
                            <p class="card-text">Number of products: ${offer.product_quantity.join(", ")}</p>
                            <p class="card-text">Vehicle id numbers: ${offer.assigned_vehicles.join(", ")}</p>
                            <p class="card-text">Accepted Dates: ${offer.accepted_dates.join(", ")}</p>
                        </div>
                    </div>`
                );
                pendingAndAssingedOfferMarkers[index].bindPopup(container[0]);
                pendingAndAssingedOfferMarkers[index].addTo(map);
            } else if (!offer.assigned_vehicles.includes("N/A")) {
                assignedOfferMarkers[index] = L.marker([offer.lat, offer.lon], { icon: Constants.offerAssignedMarkerIcon });
                container.html(
                    `<div class="card" style="width: 15rem;">
                        <div class="card-body">
                            <h5 class="card-title">Citizen: ${offer.first_name} ${offer.last_name}</h5>
                            <p class="card-subtitle">Phone number: ${offer.phone}</p>
                            <p class="card-text">offer ID: ${offer.offer_ids.join(", ")}</p>
                            <p class="card-text">Date of registration: ${offer.initial_offer_dates.join(", ")}</p>
                            <p class="card-text">Products: ${offer.products.join(", ")}</p>
                            <p class="card-text">Number of products: ${offer.product_quantity.join(", ")}</p>
                            <p class="card-text">Vehicle id numbers: ${offer.assigned_vehicles.join(", ")}</p>
                            <p class="card-text">Accepted Dates: ${offer.accepted_dates.join(", ")}</p>
                        </div>
                    </div>`
                );
                assignedOfferMarkers[index].bindPopup(container[0]);
                assignedOfferMarkers[index].addTo(map);
            }
        });
       
    } 
}

function loadRequests() {
    const requestsAjax = $.ajax({ 
        url: "./php/getRequests.php",
        method: "POST",
        dataType: "json",
        success: function (data) {
        },
    });

    requestsAjax.done(requestsResults);

    function requestsResults(result) {
        result.map((request, index) => {
            const container = $("<div />");
            if (request.assigned_vehicles.every(item => item === "N/A")) {
                pendingRequestMarkers[index] = L.marker([request.lat, request.lon], { icon: Constants.requestPendingMarkerIcon });
                container.html(
                    `<div class="card" style="width: 15rem;">
                        <div class="card-body">
                            <h5 class="card-title">Citizen: ${request.first_name} ${request.last_name}</h5>
                            <p class="card-subtitle">Phone number: ${request.phone}</p>
                            <p class="card-text">Request ID: ${request.request_ids.join(", ")}</p>
                            <p class="card-text">Date of registration: ${request.initial_request_dates.join(", ")}</p>
                            <p class="card-text">Products: ${request.products.join(", ")}</p>
                            <p class="card-text">Number of people: ${request.number_of_peoples.join(", ")}</p>
                            <p class="card-text">Number of products: ${request.product_quantity.join(", ")}</p>
                        </div>
                    </div>`
                );
                pendingRequestMarkers[index].bindPopup(container[0]);
                pendingRequestMarkers[index].addTo(map);
            } else if (request.assigned_vehicles.some(item => item === "N/A")) {
                pendingAndAssingedRequestMarkers[index] = L.marker([request.lat, request.lon], { icon: Constants.requestPendingAndAssingedMarkerIcon });
                container.html(
                    `<div class="card" style="width: 15rem;">
                        <div class="card-body">
                            <h5 class="card-title">Citizen: ${request.first_name} ${request.last_name}</h5>
                            <p class="card-subtitle">Phone number: ${request.phone}</p>
                            <p class="card-text">Request ID: ${request.request_ids.join(", ")}</p>
                            <p class="card-text">Date of registration: ${request.initial_request_dates.join(", ")}</p>
                            <p class="card-text">Products: ${request.products.join(", ")}</p>
                            <p class="card-text">Number of people: ${request.number_of_peoples.join(", ")}</p>
                            <p class="card-text">Number of products: ${request.product_quantity.join(", ")}</p>
                            <p class="card-text">Vehicle id numbers: ${request.assigned_vehicles.join(", ")}</p>
                            <p class="card-text">Accepted Dates: ${request.accepted_dates.join(", ")}</p>
                        </div>
                    </div>`
                );
                pendingAndAssingedRequestMarkers[index].bindPopup(container[0]);
                pendingAndAssingedRequestMarkers[index].addTo(map);
            } else if (!request.assigned_vehicles.includes("N/A")) {
                assignedRequestMarkers[index] = L.marker([request.lat, request.lon], { icon: Constants.requestAssignedMarkerIcon });
                container.html(
                    `<div class="card" style="width: 15rem;">
                        <div class="card-body">
                            <h5 class="card-title">Citizen: ${request.first_name} ${request.last_name}</h5>
                            <p class="card-subtitle">Phone number: ${request.phone}</p>
                            <p class="card-text">Request ID: ${request.request_ids.join(", ")}</p>
                            <p class="card-text">Date of registration: ${request.initial_request_dates.join(", ")}</p>
                            <p class="card-text">Products: ${request.products.join(", ")}</p>
                            <p class="card-text">Number of people: ${request.number_of_peoples.join(", ")}</p>
                            <p class="card-text">Number of products: ${request.product_quantity.join(", ")}</p>
                            <p class="card-text">Vehicle id numbers: ${request.assigned_vehicles.join(", ")}</p>
                            <p class="card-text">Accepted Dates: ${request.accepted_dates.join(", ")}</p>
                        </div>
                    </div>`
                );
                assignedRequestMarkers[index].bindPopup(container[0]);
                assignedRequestMarkers[index].addTo(map);
            }
        });
    } 
}

function updateMarkerVisibility() {
    hideAllMarkers();

    if ($("#filterRequestAssigned").prop("checked")) {
        showMarkers(assignedRequestMarkers);
    }

    if ($("#filterRequestPendingAssigned").prop("checked")) {
        showMarkers(pendingAndAssingedRequestMarkers);
    }

    if ($("#filterRequestPending").prop("checked")) {
        showMarkers(pendingRequestMarkers);
    }

    if ($("#filterOffersAssigned").prop("checked")) {
        showMarkers(assignedOfferMarkers);
    }

    if ($("#filterOffersPendingAssigned").prop("checked")) {
        showMarkers(pendingAndAssingedOfferMarkers);
    }

    if ($("#filterOffersPending").prop("checked")) {
        showMarkers(pendingOfferMarkers);
    }

}

function hideAllMarkers() {
    hideMarkers(assignedRequestMarkers);
    hideMarkers(pendingAndAssingedRequestMarkers);
    hideMarkers(pendingRequestMarkers);
    hideMarkers(assignedOfferMarkers);
    hideMarkers(pendingAndAssingedOfferMarkers);
    hideMarkers(pendingOfferMarkers);
}

function hideMarkers(markers) {
    for (let key in markers) {
        if (markers.hasOwnProperty(key)) {
            markers[key].setOpacity(0); 
        }
    }
}


function showMarkers(markers) {
    for (let key in markers) {
        if (markers.hasOwnProperty(key)) {
            markers[key].setOpacity(1); 
        }
    }
}

function updateTasks() {
    const taskContainer = document.getElementById('taskContainer'); 
    const tasksAjax = $.ajax({
        url: "./php/getRescuerTasks.php",
        method: "POST",
        dataType: "json",
        success: function (data) {
        },
    });

    tasksAjax.done(renderTasks); 

    function renderTasks(tasks) {
        taskContainer.innerHTML = ''; 

        tasks.map(task => {
            console.log(getDistance(vehiclePostion[0], vehiclePostion[1], task.lat, task.lon)); 
            if (getDistance(vehiclePostion[0], vehiclePostion[1], task.lat, task.lon) >= 50) {
                const taskItem = document.createElement('div');
                taskItem.classList.add('card', 'mb-3');
                taskItem.style.width = '18rem'; 

                taskItem.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">Type: ${task.type}</h5>
                        <p class="card-text">Product: ${task.product_name}</p>
                        <p class="card-text">First name: ${task.first_name}</p>
                        <p class="card-text">Last name: ${task.last_name}</p>
                        <p class="card-text">Phone: ${task.phone}</p>
                        <p class="card-text">Date: ${task.initial_date}</p>
                        <button class="btn btn-success me-2" disabled>Completed</button>
                        <button class="btn btn-danger" onclick="cancelTask('${task.id}','${task.type}')">Cancel</button>
                    </div>`;
                taskContainer.appendChild(taskItem); 
            } else {
                const taskItem = document.createElement('div');
                taskItem.classList.add('card', 'mb-3');
                taskItem.style.width = '18rem'; 

                taskItem.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">Type: ${task.type}</h5>
                        <p class="card-text">Product: ${task.product_name}</p>
                        <p class="card-text">First name: ${task.first_name}</p>
                        <p class="card-text">Last name: ${task.last_name}</p>
                        <p class="card-text">Phone: ${task.phone}</p>
                        <p class="card-text">Date: ${task.initial_date}</p>
                        <button class="btn btn-success me-2" onclick="completeTask('${task.id}','${task.type}')">Completed</button>
                        <button class="btn btn-danger" onclick="cancelTask('${task.id}','${task.type}')">Cancel</button>
                    </div>`;
                taskContainer.appendChild(taskItem);
            }
        });
    }
}

function completeTask(id, type) {
    Swal.fire({ 
        title: "Do you want to complete this task?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Save",
    }).then((result) => {
        if (result.isConfirmed) {
            $.post("./php/completeTask.php", { type: type, id: id, }, function (result) {
               console.log(result);
                if (result == "1") {
                    window.location.reload();
                    const vehiclesAjax = $.ajax({
                        url: "./php/getRescuerVehicle.php",
                        method: "POST",
                        dataType: "json",
                        success: function (data) {
                            vehiclePostion = [data[0].lat, data[0].lon]
                            vehicleInfo = data
                            console.log(data);
                        },
                    });
                
                    
                    vehiclesAjax.done(vehicleResults);
                    Swal.fire("Thank you!", "", "success");
                }
                else if (result == "2"){
                    Swal.fire({
                        title: 'Error',
                        text: 'Vehicle has not enough products',
                        icon: 'error'
                    })
                }
            });
        }
    });
}
function cancelTask(id, type) {
    Swal.fire({
        title: "Do you want to cancel this task?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Save",
    }).then((result) => {
        if (result.isConfirmed) {
            $.post("./php/cancelTask.php", { type: type, id: id, }, function (result) {
                if (result == "1") {
                    window.location.reload();
                    const vehiclesAjax = $.ajax({
                        url: "./php/getRescuerVehicle.php",
                        method: "POST",
                        dataType: "json",
                        success: function (data) {
                            vehiclePostion = [data[0].lat, data[0].lon]
                            vehicleInfo = data
                            console.log(data);
                        },
                    });
                
                    
                    vehiclesAjax.done(vehicleResults);
                    Swal.fire("Thank you!", "", "success");
                }
            });
        }
    });
}

function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; 
    var dLat = deg2rad(lat2 - lat1); 
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; 
    return parseInt(d * 1000);
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}