 const logged_user = JSON.parse(localStorage.getItem("logged_user"));
 if (logged_user == null) {
    window.location.assign("index.html");}

$("#nav-placeholder").load("./navbar/adminNavbar.html");
$("#footer-placeholder").load("footer.html");

const dateForm = document.getElementById("dateForm");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

const ctx = document.getElementById("serviceStats").getContext("2d");
let statsChart = new Chart(ctx);

endDate.valueAsDate = new Date();

getChartData();

dateForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (startDate.value > endDate.value) {
        Swal.fire({
            icon: "error",
            title: "Please select start date earlier than end date",
        });
    } else {
        
        getChartData();
    }
})

function getChartData() {
    const statsAjax = $.ajax({
        url: './php/getStats.php',
        method: 'POST',
        dataType: 'json',
        data: { startDate: startDate.value, endDate: endDate.value },
        success: function (data) {
            
            statsChart.destroy();
        }
    });
    statsAjax.done(populateChart);

}

function populateChart(result) {
    let data = {
        labels: ['# of new Requests', '# of completed Requests', '# of new Offers', '# of completed Offers'],
        datasets: [{
            data: [
                result.newRequests,
                result.completedRequests,
                result.newOffers,
                result.completedOffers
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    };

    
    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        legend: {
            display: false
        }
    };

    statsChart.destroy();

    
    statsChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}