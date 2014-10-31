var ApiService = function($http) {
  var api = {
    get: function(callback) {
      var baseUrl = 'http://localhost:3000';
      $http({method: 'GET', url: baseUrl + '/api' }).
      success(function(data, status, headers, config) {
        callback(null, data);
      }).
      error(function(data, status, headers, config) {
        callback(data, null);
      });
    }
  };
  return api;
}
