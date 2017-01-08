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
  .module('mediti', ['firebase'])
  .config(() => {
    console.log('hello from config');
  })
  .controller('SimpleCtrl', ($scope, $firebaseObject) => {
    var ref = firebase.database().ref().child("data");
    var syncObject = $firebaseObject(ref);
    // synchronize the object with a three-way data binding
    // click on `index.html` above to see it used in the DOM!
    syncObject.$bindTo($scope, "data");
  })
;
