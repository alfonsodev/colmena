var homeController = function($scope) {
  console.log('here we go');
};
var dashboardController = function($scope) {
  console.log('here we go to the dashboard');
  $scope.cells = [
    { id: 1 , name: 'symfony 2 env' },
    { id: 2, name: 'prestaShop' }
  ];
};

var cellController = function($scope, $routeParams){
  console.log(' the id of the cell is ...');
  $scope.cellId = $routeParams.cellId;
  $scope.cell = {
    
  };
};

angular.module('colmenaApp',['ngRoute']).
  factory('ApiService', ApiService)
  .controller('homeController', homeController)
  .controller('dashboardController', dashboardController)
  .config(function( $routeProvider) {
    $routeProvider
      .when('/home',{ controller: homeController, templateUrl: 'app/home/home.html'})
      .when('/dashboard',{ controller: dashboardController, templateUrl: 'app/dashboard/dashboard.html'})
      .when('/cell/:cellId',{ controller: cellController, templateUrl: 'app/cell/cell.html'})
  })
  .run(function() {
    console.log('running home controller ');
  });


