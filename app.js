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
  .run(($rootScope, $location, $firebaseArray, firebase) => {
    // nawigacja
    $rootScope.goTo = path => $location.path(path);
  })
  .filter('duration', () => durationMs => {
    const pad = n => n < 10 ? `0${n}` : `${n}`;
    const seconds = Math.floor((durationMs / 1000) % 60);
    const minutes = Math.floor((((durationMs / 1000) - seconds) / 60)) % 60;
    const hours =  Math.floor(((durationMs / 1000) - minutes * 60 - seconds)) / 3600;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  })
  .factory('Sessions', (firebase, $firebaseArray) => {
    let history = null;

    return {
      init: uid => history = $firebaseArray(firebase.database().ref().child(`/users/${uid}/sessions-history`)),
      destroy: () => {
        history && history.$destroy();
        history = null;
      },
      getHistory: () => history,
      addSession: ({start, duration}) => history.$add({ start, duration }),
    }
  })
  .controller('LoginCtrl', function ($scope, $rootScope, $firebaseAuth, Sessions) {
    const auth = $firebaseAuth();

    const initUser = () => {
      const user = auth.$getAuth();
      console.log('LOGIN', user);
      if (user) {
        $rootScope.user = user;
        Sessions.init(user.uid);
      }
    }

    initUser();

    $scope.login = provider => {
      auth.$signInWithPopup(provider)
        .then(initUser)
        .catch(err => console.error('LOGIN', err));
    }
  })
  .controller('MainCtrl', function ($scope, $location, $rootScope, $mdDialog, $firebaseAuth, Sessions) {
    $scope.showInfo = function() {
      const alert = $mdDialog.alert({
        title: 'Info',
        textContent: 'Simple application for tracking meditation session.',
        ok: 'Close'
      });

      $mdDialog.show(alert);
    };

    $scope.logout = () => $firebaseAuth().$signOut()
      .then(() => {
        $rootScope.user = null;
        Sessions.destroy();
      });
  })
  .controller('HistoryCtrl', function ($scope, Sessions) {
    $scope.history = Sessions.getHistory();
  })
  .controller('SessionCtrl', function ($scope, $interval, Sessions) {
    const start = Date.now();
    $scope.duration = 0;

    const updateDuration = () => $scope.duration = Date.now() - start;

    const token = $interval(updateDuration, 1000);

    $scope.stop = () => {
      updateDuration();
      $interval.cancel(token);
      Sessions.addSession({
        start: new Date(start).toJSON(),
        duration: $scope.duration,
      })
        .then(() => $scope.goTo('/'));
    };
  })
  .controller('ProfileCtrl', function ($scope) {

  });
