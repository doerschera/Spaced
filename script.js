$(document).ready(function() {

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
        'signInSuccessUrl': '<url-to-redirect-to-on-success>',
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

  
})
