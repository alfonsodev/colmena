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
var startContainer = function(container, $http) {
  var data = {
    "Hostname" : "",
    "User" : "",
    "Memory" : 0,
    "MemorySwap" : 0,
    "AttachStdin" : false,
    "AttachStdout" : true,
    "AttachStderr" : true,
    "PortSpecs" : null,
    "Tty" : false,
    "OpenStdin" : false,
    "StdinOnce" : false,
    "Env" : null,
    "Cmd" : ['/bin/bash', '-c',  container.cmd ],
    "Image" : container.image || '', 
    "WorkingDir": '/data/INTARG/intarg_webui',
    "DisableNetwork": false
  };

  $http
    .post('http://colmena.local/dockerapi/containers/create', data)
    .error(function(data, status){
       $scope.result = data;
    })
    .success(function(data, status) {
        var dat = {
            "PublishAllPorts": false,
            "Privileged": false,
            "Dns": ["8.8.8.8"],
            "VolumesFrom": container.volumesFrom || [],
            "Links": container.links || [],
        };

        $http.post('http://colmena.local/dockerapi/containers/' + data.Id + '/start', dat)
            .success(function(data2, status) {
                $http
                .post('http://colmena.local/dockerapi/containers/' + data.Id + '/attach?logs=1&stream=1&stdout=1')
                .success((function(data,status) {
                debugger;
                   // $scope.result = data;
                   // console.log($scope.output);
                   $scope.result = ansi2html.toHtml(data);
                   // term.write(data);
                }));

            });
    });


};
var cellController = function($scope, $routeParams, $http){
  $scope.cellId = $routeParams.cellId;
  $scope.cell = {
    valumes: [
      { name: 'my-data', image: 'busybox', volumes: ['/mnt/sda1/data:/data'], cmd: 'true'}
    ],
    containers: [
      { name: 'mongodb3', image: 'dockerfile/mongodb', daemon: true, ports: ['27017:27017'], volumesFrom: 'my-data', cmd: 'mongod --dbpath /data/mongodb' },
      { name: 'mysql', image: 'tutum/mysql', daemon: true, ports: ['3306:3306'], volumesFrom: 'my-data', env: ['MYSQL_PASS="12345"'] },
      { name: 'samba', image: 'svendowideit/samba', daemon: true  },
      { name: 'intarg_acc', image: 'alfonso/nginx-symfony:0.5', daemon: true, ports: ['4444:443', '7778:80'], links: ['mysql-server:mysql' ]},
      { name: 'intarg_web',
        image: 'alfonso/nginx-symfony:0.5',
        daemon: true,
        ports: ['4443:443', '7777:80'], 
        links: ['mysql-server:mysql', 'intarg_acc:intarg_acc', 'mongodb:datastore' ],
        env: ['TZ=CET-1CEST,M3.5.0,M10.5.0/3', 'WEBPUBLIC=/data/INTARG/intarg_webui/web', 'MYSQL_ENV_MYSQL_USER=admin']
      },
    ]
  };
 
  if($routeParams.action === 'start') {
    startContainer($scope.cell.containers[$routeParams.index], $http)
  } else if($routeParams.action === 'stop') {
    
  } 
};

angular.module('colmenaApp',['ngRoute']).
  factory('ApiService', ApiService)
  .controller('homeController', homeController)
  .controller('dashboardController', dashboardController)
  .config(function($routeProvider, $sceProvider) {
    $sceProvider.enabled(false);
    $routeProvider
      .when('/home',{ controller: homeController, templateUrl: 'app/home/home.html'})
      .when('/dashboard',{ controller: dashboardController, templateUrl: 'app/dashboard/dashboard.html'})
      .when('/cell/:cellId',{ controller: cellController, templateUrl: 'app/cell/cell.html'})
      .when('/cell/:cellId/:action/:index',{ controller: cellController, templateUrl: 'app/cell/cell.html'});

  })
  .run(function() {
    console.log('running home controller ');
  });


