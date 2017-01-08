// Initialize Firebase
const config = {
  apiKey: "AIzaSyBS30JMwms4UgxP7nI6D5WEBjZUt4-iMqM",
  authDomain: "mediti-c9a8d.firebaseapp.com",
  databaseURL: "https://mediti-c9a8d.firebaseio.com",
  storageBucket: "mediti-c9a8d.appspot.com",
};

firebase.initializeApp(config);

angular
  .module('mediti', ['firebase', 'ngRoute', 'ngMaterial'])
  .constant('modelPaths', {
    history: 'data/history'
  })
  .config(($routeProvider, $locationProvider) => {
    console.log('hello from config');

    $routeProvider
      .when('/history', {
        templateUrl: '/templates/history.html',
        controller: 'HistoryCtrl'
      })
      .when('/session', {
        templateUrl: '/templates/session.html',
        controller: 'SessionCtrl'
      })
      .when('/profile', {
        templateUrl: '/templates/profile.html',
        controller: 'ProfileCtrl'
      })
      .when('/', {
        templateUrl: '/templates/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode(true);
  })
  .run(($rootScope, $location, $firebaseArray, firebase, modelPaths) => {
    $rootScope.goTo = path => $location.path(path);

    const ref = firebase.database().ref().child(modelPaths.history);
    $rootScope.history = $firebaseArray(ref);
    // syncObject.$bindTo($rootScope, "history");
  })
  .controller('MainCtrl', function ($scope, $location, $mdDialog) {
    $scope.showInfo = function() {
      const alert = $mdDialog.alert({
        title: 'Info',
        textContent: 'Simple application for tracking meditation session.',
        ok: 'Close'
      });

      $mdDialog.show(alert);
    };
  })
  .controller('HistoryCtrl', function ($scope, $rootScope) {
    console.log('ENTRIES', $rootScope.history)
  })
  .controller('SessionCtrl', function ($scope, $timeout, $rootScope) {
    $timeout(() => {
      console.log($rootScope.history);
      const r = $rootScope.history.$add({
        date: (new Date()).toString(),
        text: 'HURRA'
      });
      r
        .then(x => console.log(x))
        .catch(err => console.error('ERROR', err));
      console.log(r);
     // $rootScope.goTo('/')
    }, 2000);
  })
  .controller('ProfileCtrl', function ($scope) {

  });
