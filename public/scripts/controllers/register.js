angular.module('timeMgmt').controller('registerCtrl', function($scope, alert, $auth) {
    $scope.submit = function () {
        $auth.signup({email: $scope.email, password: $scope.password})
            .then(function (res) {
                alert('success', 'Account Created!', 'Welcome '+ res.data.user.email+'!!!');
            })
            .catch(function (err) {
                alert('warning', 'Unable to create account :(', err.message);
            });
    };
});