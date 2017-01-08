// Initialize Firebase
const config = {
  apiKey: "AIzaSyBS30JMwms4UgxP7nI6D5WEBjZUt4-iMqM",
  authDomain: "mediti-c9a8d.firebaseapp.com",
  databaseURL: "https://mediti-c9a8d.firebaseio.com",
  storageBucket: "mediti-c9a8d.appspot.com",
  // messagingSenderId: "822076598026"
};

firebase.initializeApp(config);

angular
  .module('mediti', ['firebase', 'ngRoute'])
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
  .controller('SimpleCtrl', ($scope, $firebaseObject) => {
    const ref = firebase.database().ref().child("data");
    const syncObject = $firebaseObject(ref);
    // synchronize the object with a three-way data binding
    // click on `index.html` above to see it used in the DOM!
    syncObject.$bindTo($scope, "data");
  })
  .controller('MainCtrl', function ($scope) {
    console.log('hello from main-ctrl')
  })
  .controller('HistoryCtrl', function ($scope) {
    console.log('HISTROY')
  })
  .controller('SessionCtrl', function ($scope, $routeParams) {

  })
  .controller('ProfileCtrl', function ($scope) {

  })
;
