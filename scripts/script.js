const ctx = document.getElementById('myChart');

const sourceFile = "../data/yelp_academic_dataset_business.json"

var filteredResults = [];

let top_results;

let myChart;

//open and get file contents
fetch(sourceFile)
.then(function(response){
    if(response.ok == true){
        return response.text();
    }
})
.then(function(data){
  // split text into array of lines
  // each line is a json object
  var d = data.split("\n");

  d.forEach(element => {
    // make sure the line is not empty
    if (element) {
      // convert text to json object
      var obj = JSON.parse(element)
      // check to make sure the values for these fields is NOT empty or null
      if (obj["categories"] && obj["stars"] && obj["review_count"]) {
        if (obj["categories"].includes("Food") && obj["review_count"] >= 100 && obj["stars"] == 5) {
          
          //create item object to store if it meets all criteria
          var temp = {"name": obj["name"],
                      "stars": obj["stars"],
                      "review_count": obj["review_count"]}
          filteredResults.push(temp)
        }
      }
      
    }
    
  });

  //sort by overall star score and then number of reviews
  filteredResults.sort(function(first, second) {
    return second["stars"] - first["stars"] ||
            second["review_count"] - first["review_count"];
  });

  //get top 10 of the sorted results
  top_results = filteredResults.slice(0, 10)

  createChart(top_results, 'bar');
});

function setChartType(chartType){
  myChart.destroy();
  createChart(top_results, chartType)
}


function createChart(top_results, type){

  myChart = new Chart(ctx, {
    type: type,
    data: {
      labels: top_results.map(a => a.name + ` ( ${a.stars}🌟)`),
      datasets: [{
        label: '# of Reviews',
        data: top_results.map(a => a.review_count),
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

}
