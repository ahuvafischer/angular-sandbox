lotoApp.controller('lotoResults', ['$scope', '$filter', '$interval', 'readFile', 'parseCsv', function($scope ,$filter, $interval, readFile, parseCsv) {/*global lotoApp*/
    /*initializations*/

    $scope.selectYear = [];
    $scope.selectNum = [];
    $scope.data = {
      selectYear: null,
      yearList: [],
      selectNum: null,
      numList: [],
    };
    
    //initialize data
    $scope.getFile = function(){
      readFile.getData().then(function(data) {
       $scope.lotoData = data;
     });
    };
    $scope.getFile();
   
    /*watch*/
    //watch for data to be fetched or changed, then update graphs
    $scope.$watch('lotoData', function(newValue, oldValue) {
      if(!newValue) return;
      $scope.data.yearList = parseCsv.getYearList($scope.lotoData);
      $scope.data.numList = parseCsv.getNumList($scope.lotoData);
      var pieData = updatePie();
      var barData = updateBar();
      //call function to display graphs
      drawGraphs(pieData, barData);
      trigerInterval();
    });
    
    $scope.$watch('data.selectYear', function(newValue, oldValue) {
      if(!newValue) return;
      //read values by year
      var pieData = updatePieByYear();
      var barData = updateBar();
      drawGraphs(pieData, barData);
    });
    
    $scope.$watch('data.selectNum', function(newValue, oldValue) {
      if(!newValue) return;
      //read values by year
      var pieData = updatePie();
      var barData = updateBar();
      drawGraphs(pieData, barData);
    });
    
   /*functions*/

   function trigerInterval() {
      $interval(function updateData(){
          $scope.getFile();
      }, 30000);
    }
    
    function updatePie(){
      var pieData = [];
      if ($scope.data.selectYear){
        pieData = updatePieByYear();
      } else {
        pieData = parseCsv.getSumNumbers($scope.lotoData);
      }
      return pieData;
    }
    
    function updateBar(){
      var barData = [];
      barData = parseCsv.getSumNumbersPerYear($scope.lotoData);
      return barData;
    }
    
    function updatePieByYear (){
      var year = $scope.data.selectYear;
      var pieData = parseCsv.getSumNumbersByYear($scope.lotoData, year);
      return pieData;
    }
    
    function drawGraphs(pieArray, barArray){
      drawPie(pieArray);
      drawBar(barArray);
    }
    
   function drawPie (pieArray){
     var pieData = google.visualization.arrayToDataTable(pieArray, false); /*global google*/ //create a data table for google api to use i order to draw the pie
     var pieOptions = {
            title: 'Pie:'
          };  
          
    var pieView = new google.visualization.DataView(pieData);
    var pie = new google.visualization.PieChart(document.getElementById('pie_div'));
    pie.draw(pieView, pieOptions);
   }  
   
   function drawBar (barArray){
      var barData = google.visualization.arrayToDataTable(barArray, false);
      var barOptions = {
        title: 'Bar',
        hAxis: {title: 'Year'},
        vAxis: {title: 'Times number showed up'}
      };
      var barView = new google.visualization.DataView(barData);
      if ($scope.data.selectYear){
        barView.setRows(barView.getFilteredRows([{column: 0, value: ($scope.data.selectYear)}]));
      }
      if ($scope.data.selectNum){
        var num = parseInt($scope.data.selectNum);
        barView.setColumns([0, num]);
      }
      var bar = new google.visualization.ColumnChart(document.getElementById('chart_div'));
      bar.draw(barView, barOptions);
   }
   
}]);