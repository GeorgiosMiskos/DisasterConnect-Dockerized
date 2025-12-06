

const Constants = {
    baseMarkerIcon: L.icon({ 
        iconUrl: "./icons/base_marker.png", 
        iconSize: [30, 30], 
        popupAnchor: [0, -15], 
    }),
    vehicleMarkerIcon: L.icon({
        iconUrl: "./icons/vehicle.png",
        iconSize: [40, 40],
        popupAnchor: [0, -20],
    }),
    requestPendingMarkerIcon: L.icon({
        iconUrl: "./icons/request1.png",
        iconSize: [40, 40],
        iconAnchor: [10, 10],
        popupAnchor: [10, -5],
    }),
    requestPendingAndAssingedMarkerIcon: L.icon({
        iconUrl: "./icons/request2.png",
        iconSize: [40, 40],
        iconAnchor: [25, 0],
        popupAnchor: [-5, 0],
    }),
    requestAssignedMarkerIcon: L.icon({
        iconUrl: "./icons/request3.png",
        iconSize: [40, 40],
        iconAnchor: [10, -10],
        popupAnchor: [10, 10],
    }),
    offerPendingMarkerIcon: L.icon({
        iconUrl: "./icons/offer1.png",
        iconSize: [40, 40],
        iconAnchor: [-10, 10],
        popupAnchor: [30, -10],
    }),
    offerPendingAndAssignedMarkerIcon: L.icon({
        iconUrl: "./icons/offer2.png",
        iconSize: [40, 40],
        iconAnchor: [-25, 0],
        popupAnchor: [45, 0],
    }),
    offerAssignedMarkerIcon: L.icon({
        iconUrl: "./icons/offer3.png",
        iconSize: [40, 40],
        iconAnchor: [-10, -10],
        popupAnchor: [30, 10],
    })
};


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Constants;
}