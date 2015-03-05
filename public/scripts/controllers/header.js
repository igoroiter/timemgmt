angular.module('timeMgmt').controller('headerCtrl', function ($scope, $auth) {
    $scope.isAuthenticated = $auth.isAuthenticated;
});