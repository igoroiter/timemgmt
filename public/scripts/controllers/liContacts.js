angular.module('timeMgmt').controller('liContactsCtrl', function($scope, $http, API_URL, alert, $state) {
    $http.get(API_URL+'contacts')
        .success(function (contacts) {
            $scope.contacts = contacts;
        })
        .error(function(err) {
            alert('warning', 'Unable to get jobs', err.message);
            $state.go('main');
        });

});