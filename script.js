$(document).ready(function() {

  // variables
  var name;
  var email;
  var uid;
  var signedIn = false;

  // Firebase initialization

  var config = {
    apiKey: "AIzaSyCgvHxrA7zOhzvOSU9oZ--mO4LNUKO6P3w",
    authDomain: "spaced-dde4d.firebaseapp.com",
    databaseURL: "https://spaced-dde4d.firebaseio.com",
    storageBucket: "spaced-dde4d.appspot.com",
  };
  firebase.initializeApp(config);

  // Firebase auth UI

  var uiConfig = {
        'signInSuccessUrl': 'main.html',
        'signInOptions': [
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        // 'tosUrl': '<your-tos-url>',
      };

  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseAuth', uiConfig);

  // firebase sign in auth
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function() {
    // error handling
    console.log(error);
  })

  firebase.auth().onAuthStateChange(function(user) {
    if(user) {
      name = user.displayName;
      email = user.email;
      uid = user.uid;
      signedIn = true;
    }
  })

  if(signedIn) {
    $('#firebaseAuth').addClass('disable');
    $('#input').removeClass('disable');
  }

  var front = $('#front').val().trim();
  var back = $('#back').val().trim();
  var cardCounter = 0;

  function Card (front, back) {
    this.front = front;
    this.back = back;
    this.level = 1;
  }

  $('#newCard').click(function() {
    var card = new Card(font, back);
    console.log(card);
  })



})
