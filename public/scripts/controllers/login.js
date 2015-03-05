angular.module('timeMgmt').controller('loginCtrl', function($scope, alert, $auth) {

    function handleError(err) {
        alert('warning', 'Unable to login account :(', err.message);
    }

    $scope.submit = function() {
        $auth.login({
                email : $scope.email,
                password : $scope.password
        })
            .then(function (res) {
                alert('success', 'Logged In!', 'Welcome '+ res.data.user.email+'!!!');
            })
            .catch(handleError);
    }

    $scope.authenticate = function(provider) {
        $auth.authenticate(provider)
            .then(function(res) {
                alert('success', 'Logged In!', 'Welcome '+ res.data.user.displayName+'!!!');
            }, handleError)
    }
});