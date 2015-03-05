angular.module('timeMgmt').controller('logoutCtrl', function($auth) {
    $auth.logout();
});