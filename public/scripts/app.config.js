angular.module('timeMgmt').config(function($stateProvider, $urlRouterProvider, $httpProvider, $authProvider, API_URL) {
    $urlRouterProvider.otherwise('#');

    $stateProvider
        .state('main', {
        url : '/',
        templateUrl : 'partials/main',
        controller: 'mainCtrl'
         })
        .state('register', {
            url : '/register',
            templateUrl : 'partials/register',
            controller: 'registerCtrl'
        })
        .state('logout', {
            url : '/logout',
            controller: 'logoutCtrl'
        })
        .state('liContacts', {
            url : '/liContacts',
            templateUrl : 'partials/liContacts',
            controller: 'liContactsCtrl'
        })
        .state('login', {
            url : '/login',
            templateUrl : 'partials/login',
            controller: 'loginCtrl'
        });

    $authProvider.loginUrl = API_URL+'auth/login';
    $authProvider.signupUrl = API_URL+'auth/register';

    $authProvider.google({
       clientId: '503501779119-v05efpsbmus1ilagluueh30ulluq3a79.apps.googleusercontent.com',
       url: API_URL + 'auth/google'
    });

    $authProvider.linkedin({
        clientId: '75z59dckqhikzr',
        url: API_URL + 'auth/linkedin'
    });
})
.constant('API_URL', 'https://murmuring-bayou-1234.herokuapp.com/')
.run(function($window) {
    var params = $window.location.search.substring(1);

    if(params && $window.opener && $window.opener.location.origin === $window.location.origin) {
        var pair = prams.split('=');
        var code = decodeURIComponent((pair[1]));

        $window.opener.postMessage(code, $window.location.origin);
    }
});