lotoApp.factory('readFileService', ['$http', '$q', function($http, $q) {/*global lotoApp*/
  function getData(){
      return  $http.get('../data/loto.csv'). //Return here
        then(function(response) { 
            return response.data;
        }, function(response) {
          console.log(response);
        });
    }
  
    return {
    getData: function () {
      return getData(); 
    }
  };
}]);