lotoApp.factory('parseCsvService', [function() {

    //calculate sum of each number
    function getSumNumbers(csv){
      var lines=readLines (csv);//return an array of strings
      var byValue =[];
      var countValues = [];
      // create array of [number] [how many times showed up]
      //retreive data and sort
      for(var i=1;i<lines.length;i++){
          var assignLine = lines[i].split(",");
          for(var j=2 ; j<9 ; j++){
            byValue.push(assignLine[j]);
          }
      }
      byValue.sort(sortNums);
      countValues = countNumbers(byValue);
      return countValues;
    }
    
    function getSumNumbersPerYear(csv){
      var lines=readLines (csv);//return an array of strings
      var newLines =[];
      var byYear = {};
      var currentYear;
      
      var arrayNumbers = [];//sort numbers by year: {year: [number, number, number], year:...}
      // create array of [number] [how many times showed up]
      //retreive data and sort
      var counts = [];//store count of each number by year. this will be an array of arrays with the following structure:
      // [year][1][2][3][4]...
      // [year][sum of #1][sum of #2][sum of #n]
      var countNum = [];
      var max = -Infinity;
      var header = [];
      for(var i=1;i<lines.length;i++){
          var assignLine = lines[i].split(",");
          //remove unrelavent elements from object
          assignLine.shift();
          assignLine.pop();
          assignLine.pop();
          assignLine[0] = formatYear(assignLine[0]);
          newLines.push(assignLine);
      }
      newLines.sort();
      
      for (var i=0 ; i<newLines.length ; i++){
        if (newLines[i][0] == currentYear){
          for (var j=1 ; j<newLines[i].length ; j++){
            arrayNumbers.push(newLines[i][j]);
          }
          byYear[currentYear] = arrayNumbers.sort();
        }
        else {
          arrayNumbers = [];
          currentYear = newLines[i][0];
          for (var j=1 ; j<newLines[i].length ; j++){
            arrayNumbers.push(newLines[i][j]);
          }
          byYear[currentYear] = arrayNumbers;
        }
      }
      //count numbers by year
      for (var key in byYear){
          countNum[0] = key;
          for(i = 0; i< byYear[key].length; i++) {
            var num = byYear[key][i];
            if (countNum[num]){
              countNum[num]++;
            }
            else {
              countNum[num] = 1;
            }
          }
          counts.push(countNum);
          countNum=[];
      }

      //arrays must all have the same length. append 0 value at end of shorter arrays
      counts.forEach(function(a, i){
        if (a.length>max) {
          max = a.length;
        }
      });
      counts.forEach(function(a, i){
        if (a.length<max) {
          var length = max - a.length;
          for (i=1 ; i <= length ; i++){
            a.push(0);
          }
        }
      });
      //add header to object
      header[0] = 'Years'
      for (i=1 ; i<max ; i++){
        header[i] = i.toString();
      }
      counts.unshift(header);
      return counts;
    }
    
    
    function getSumNumbersByYear(csv, year){
      var lines=readLines (csv);
      var byValue =[];
      var countValues = [];
      countValues[0] = ['number', 'sum'];
      for(var i=1;i<lines.length;i++){
          var assignLine = lines[i].split(",");
          if (formatYear(assignLine[1]) == year){//push only values with selectd year
            for(var j=2 ; j<9 ; j++){
                byValue.push(assignLine[j]);
            }
          }
      }
      byValue.sort();
      countValues = countNumbers(byValue);
      return countValues;
    }
    
    function getYearList(csv){
      var years = [];
      var lines=csv.split("\n");
      for(var i=1;i<lines.length;i++){
          var readLine = lines[i].split(",");
          years.push(formatYear(readLine[1]));
      }
      return Array.from(new Set(years));//return list of years
    }
    
    function getNumList(csv){
      var max = getMax(csv);
      var nums = [];
      for (var i=1 ; i<=max ; i++){
        nums.push(i);
      }
      return nums;
    }
 
    function countNumbers(byValue){
      var countValues = [];
      var current = null;
      var countNumber = 0;
      var cnt = 0;
      
      countValues[0] = ['number', 'sum'];
      for (var i = 0; i < byValue.length; i++) {
          if (byValue[i] != current) {
              if (countNumber > 0) {
                  cnt++;
                  countValues[cnt]= [current, countNumber];
              }
              current = byValue[i];
              countNumber = 1;
          } else {
              countNumber++;
          }
      }
      if (countNumber > 0) {
        cnt++;
          countValues[cnt]= [current, countNumber];
      }
      return countValues;
    }
    
    function readLines (csv){
      return csv.split("\n");
    }
    
    function sortNums(a, b){
        return a - b;
    }
    
    function formatYear (date){
      var getYear = parseInt(date.split("/").pop());
      if (getYear.toString().length <= 2){
            if (getYear < 20 ){
              getYear = getYear+2000;
            } else {
              getYear = getYear +1900;
            }
          }
          return getYear;
    } 
    function getMax(csv){
        var lines=csv.split("\n");
        var allNums = [];
        var max;
        for(var i=1;i<lines.length;i++){
            var array = lines[i].split(",");
            array.shift();
            array.shift();
            array.pop();
            array.pop();
            allNums = array.concat(allNums);
        }
        allNums = allNums.map(function (x) { 
          return parseInt(x, 10); 
        });
        allNums.sort(sortNums);
        max = allNums.pop();
        return max;
    }
    return {
        getYearList: function (csv) {
          return getYearList(csv);
        },
        getNumList: function (csv) {
          return getNumList(csv);
        },
        getSumNumbers: function (csv) {
             return getSumNumbers(csv);                   
        }, 
        getSumNumbersByYear: function(csv, year){
          return getSumNumbersByYear(csv, year);
        }, 
        getSumNumbersPerYear: function(csv){
          return getSumNumbersPerYear(csv);
        }
    };
}]);  