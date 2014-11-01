var ApiService = function($http) {
  var api = {
    get: function(callback) {
      var baseUrl = 'http://192.168.59.103:2375';
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
