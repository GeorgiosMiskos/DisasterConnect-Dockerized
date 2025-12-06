const logged_user = JSON.parse(localStorage.getItem("logged_user")); 

if (logged_user == null) {
    window.location.assign("index.html");}
$("#nav-placeholder").load("./navbar/adminNavbar.html");
$("#footer-placeholder").load("footer.html");

let vehicleActiveMarkers = {};
let vehicleInactiveMarkers = {};

let pendingRequestMarkers = {};
let pendingAndAssingedRequestMarkers = {};
let assignedRequestMarkers = {};

let pendingOfferMarkers = {};
let pendingAndAssingedOfferMarkers = {};
let assignedOfferMarkers = {};




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

$("#filterActiveVehicles").change(function () {
    updateMarkerVisibility();
});

$("#filterInactiveVehicles").change(function () {
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
            console.log(data);
        },
    });

    baseAjax.done(CoordsResult);

    function CoordsResult(result){
        result.map((base, index) => {
            baseMarker = L.marker([base.lat,base.lon], { icon: Constants.baseMarkerIcon, draggable: true }).addTo(map).bindPopup('The base!')
            baseMarker.on('dragend', function (event) {
                let markerPosition = baseMarker.getLatLng();
                basePostion = [markerPosition.lat, markerPosition.lng]
                console.log('Base Coordinates: Lat ' + markerPosition.lat + ', Lng ' + markerPosition.lng);
                $.post("./php/updateBaseCoords.php", { lat: markerPosition.lat ,lng:  markerPosition.lng}, function (result) {
                    console.log(result)});
                loadVehicle();
            });
        });
        
    }
}


loadVehicle();
loadOffers();
loadRequests();

function loadVehicle() {
    
    const vehiclesAjax = $.ajax({
        url: "./php/getVehiclesInfo.php",
        method: "POST",
        dataType: "json",
        success: function (data) {
            console.log(data);
        },
    });

    vehiclesAjax.done(vehicleResults); 

    function vehicleResults(result) {
        result.map((vehicle, index) => { 
            const container = $("<div />");
            if (vehicle.offer_id[0] === "No active offers" && vehicle.request_id[0] === "No active requests") {
                console.log(vehicle.vehicle_id);
                vehicleInactiveMarkers[index] = L.marker([vehicle.lat, vehicle.lon], { icon: Constants.vehicleMarkerIcon }); 
                container.html(  
                    `<div class="card" style="width: 15rem;">  
                        <div class="card-body">
                            <h5 class="card-title">Vehicle ID: ${vehicle.vehicle_id}</h5>
                            <p class="card-subtitle">Resquer Name: ${vehicle.first_name} ${vehicle.last_name}</p>
                            <p class="card-subtitle">Request IDs: ${vehicle.request_id.join(", ")}</p>
                            <p class="card-subtitle">Offer IDs: ${vehicle.offer_id.join(", ")}</p>
                            <p class="card-subtitle">Vehicles Products: ${vehicle.product_name.join(", ")}</p>
                        </div>
                    </div>`
                );
                vehicleInactiveMarkers[index].bindPopup(container[0]); 
                vehicleInactiveMarkers[index].addTo(map);  
            } else {
                vehicleActiveMarkers[index] = L.marker([vehicle.lat, vehicle.lon], { icon: Constants.vehicleMarkerIcon }); 
                container.html(
                    `<div class="card" style="width: 15rem;">
                        <div class="card-body">
                            <h5 class="card-title">Vehicle ID: ${vehicle.vehicle_id}</h5>
                            <p class="card-subtitle">Resquer Name: ${vehicle.first_name}  ${vehicle.last_name}</p>
                            <p class="card-subtitle">Request IDs: ${vehicle.request_id.join(", ")}</p>
                            <p class="card-subtitle">Offer IDs: ${vehicle.offer_id.join(", ")}</p>
                            <p class="card-text">Request products: ${vehicle.product_name_request.join(", ")}</p>
                            <p class="card-text">Offer products: ${vehicle.product_name_offer.join(", ")}</p>
                            <p class="card-subtitle">Vehicles Products: ${vehicle.product_name.join(", ")}</p>
                        </div>
                    </div>`
                );
                vehicleActiveMarkers[index].bindPopup(container[0]); 
                vehicleActiveMarkers[index].addTo(map); 
            }
        });
        console.log(vehicleActiveMarkers);
        console.log(vehicleInactiveMarkers);
    } 
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

    if ($("#filterActiveVehicles").prop("checked")) {
        showMarkers(vehicleActiveMarkers);
    }

    if ($("#filterInactiveVehicles").prop("checked")) {
        showMarkers(vehicleInactiveMarkers);
    }
}


function hideAllMarkers() {
    hideMarkers(assignedRequestMarkers);
    hideMarkers(pendingAndAssingedRequestMarkers);
    hideMarkers(pendingRequestMarkers);
    hideMarkers(assignedOfferMarkers);
    hideMarkers(pendingAndAssingedOfferMarkers);
    hideMarkers(pendingOfferMarkers);
    hideMarkers(vehicleActiveMarkers);
    hideMarkers(vehicleInactiveMarkers);
    
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
