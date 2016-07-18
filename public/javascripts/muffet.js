var app = angular.module('muffet', ['ngRoute', 'ngResource']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-brew', {
            templateUrl: 'partials/brew-form.html',
            controller: 'AddBrewCtrl'
        })
        .when('/brew/:id', {
            templateUrl: 'partials/brew-form.html',
            controller: 'EditBrewCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomeCtrl', ['$scope', '$resource', 
    function($scope, $resource) {
        // resource object for REST API at /brews
        var brews = $resource('/brews');

        // $resource.query() = REST {method:'GET', isArray:true}
        brews.query(function(brews) {
            $scope.brews = brews;
        });
}]);

app.controller('AddBrewCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location) {
        var b = { 
            date:new Date().toLocaleDateString('en-US', {
                month : 'short',
                day : 'numeric',
                year : 'numeric'
            }),
            bean:"Geisha",
            dose:12.0,
            bw:175.0,
            tds:0,
            lrr:2.50,
            extraction:0,
            grind:"0"
        };
        $scope.brew = b;

        $scope.save = function() {
            // resource object for REST API at /brews
            var brews = $resource('/brews');

            // $resource.save() = REST {method:'POST'}
            brews.save($scope.brew, function() {
                $location.path('/');
            });
        };
    }
]);

app.controller('EditBrewCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams) {
        var brew = $resource('/brews/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });

        brew.get({ id: $routeParams.id }, function(b) {
            $scope.brew = b;
        });

        // REST PUT when clicking Edit Save button
        $scope.save = function() {
            brew.update($scope.brew, function() {
                $location.path('/');
            });
        }
    }
]);
