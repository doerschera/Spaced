$(document).ready(function() {

  // firebase variables
  var currentUser = {};

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
        'signInSuccessUrl': 'index.html',
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

  function toggleSignIn() {
    if (firebase.auth().currentUser) {
      // [START signout]
      firebase.auth().signOut();
      // [END signout]
    } else {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START authwithemail]
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
      });
      // [END authwithemail]
    }
    document.getElementById('quickstart-sign-in').disabled = true;
  }
  /**
   * Handles the sign up button press.
   */
  function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END createwithemail]
  }
  /**
   * Sends an email verification to the user.
   */
  function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
      // Email Verification sent!
      // [START_EXCLUDE]
      alert('Email Verification Sent!');
      // [END_EXCLUDE]
    });
    // [END sendemailverification]
  }
  function sendPasswordReset() {
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      // Password Reset Email Sent!
      // [START_EXCLUDE]
      alert('Password Reset Email Sent!');
      // [END_EXCLUDE]
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/invalid-email') {
        alert(errorMessage);
      } else if (errorCode == 'auth/user-not-found') {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
  }
  /**
   * initApp handles setting up UI event listeners and registering Firebase auth listeners:
   *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
   *    out, and that is where we update the UI.
   */
  function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
      // [START_EXCLUDE silent]
      document.getElementById('quickstart-verify-email').disabled = true;
      // [END_EXCLUDE]
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
        document.getElementById('quickstart-sign-in').textContent = 'Sign out';
        document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
        if (!emailVerified) {
          document.getElementById('quickstart-verify-email').disabled = false;
        }
        // [END_EXCLUDE]
      } else {
        // User is signed out.
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
        document.getElementById('quickstart-sign-in').textContent = 'Sign in';
        document.getElementById('quickstart-account-details').textContent = 'null';
        // [END_EXCLUDE]
      }
      // [START_EXCLUDE silent]
      document.getElementById('quickstart-sign-in').disabled = false;
      // [END_EXCLUDE]
    });
    // [END authstatelistener]
    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
    document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
    document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
  }
  window.onload = function() {
    initApp();
    $('#firebaseAuth').addClass('disable');
  };

  // app logic
  var signIn = true;
  var name;
  var email;
  var uid;
  var front;
  var back;
  var cardCounter = 0;
  var deckName;
  var cardIndex = 0;
  var length;
  var cardsToDo = [];
  var cardOrder = [];
  var nextCard = cardOrder[cardIndex];
  var level = 1;



  firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      var ref = firebase.auth().currentUser;
      uid = ref.uid;
      email = ref.email;
      name = ref.name;

      $('#new').removeClass('disable');
      $('#firebaseAuth').addClass('disable');
    }
  })
  // new card constructor
  function Card (front, back) {
    this.front = front;
    this.back = back;
    this.level = 1;
  }

  $('.welcome').fadeIn(1000*3);
  $('#firebaseAuth').addClass('disable');

  // sign in scroll
  // $(window).scroll(function() {
  //   $('.welcome').animate({top: '-1000px', opacity: '0'}, 1000*2)
  //     .addClass('disable');
  //   $('#firebaseAuth').removeClass('disable').animate({top: '30vh'}, 1000*2);
  // })

  // create new deck
  $('#newDeck').click(function() {
    newDeck();
  })

  // create new card
  $('#newCard').click(function() {
    writeCard();
  })

  // select deck
  $('.deck').on('click', function() {
    deckName = $(this).html().trim();
    console.log(deckName);
    $('.deck').off('click');
  })

  // select card
  $('#start').click(function() {
    $('#new').addClass('disable');
    firebase.database().ref('users/'+uid).update({
      time: 'null'
    })
    console.log(deckName);
    var cardsRef = firebase.database().ref('/users/'+uid+'/'+deckName+'/cards');
    cardsRef.once('value').then(function(snapshot) {
      length = snapshot.val().length;
      console.log(length);
      setTime();
      cardRandom();
      getCard();
    })
  })

  $('#submit').click(function() {
    checkAnswer();
  })

  function newDeck() {
    deckName = $('#deckName').val().trim();
    var decks = {};
    decks[deckName] = {
      cards: ['']
    };
    console.log(decks);
    firebase.database().ref('/users/'+uid).update(decks);
  }

  function writeCard() {
    front = $('#front').val().trim();
    back = $('#back').val().trim();
    var card = new Card(front, back);
    var ref = '/users/'+uid+'/'+deckName+'/cards'+ '/'+cardCounter;

    firebase.database().ref(ref).set(card);

    cardCounter ++;
  }

  function deckLength() {
    var cardsRef = firebase.database().ref('/users/'+uid+'/'+deckName+'/cards');
    cardsRef.once('value').then(function(snapshot) {
      length = snapshot.val().length;
      console.log(length);
    })
    setTime();
    cardRandom();
    getCard();
  }

  function cardRandom() {
    determineLevels();
    for(var i = 0; i < cardsToDo.length; i++) {
      var num = Math.floor(Math.random()*cardsToDo.length);
      if(cardOrder.length == cardsToDo.length) {
        return false;
      } else if(cardOrder.indexOf(num) == -1) {
        console.log('here');
        cardOrder.push(cardsToDo[num]);
        console.log('card order:'+cardOrder);
      } else {
        cardRandom();
      }
    }
  }

  function setTime() {
    var newView = moment().format();
    firebase.database().ref('users/' + uid).update({time: newView});
  }

  function getCard() {
    var nextCard = cardOrder[cardIndex];
    console.log('next card:'+ nextCard);
    var cardsRef = firebase.database().ref('users/'+uid+'/'+deckName+'/cards');

    cardsRef.child(nextCard).once('value').then(function(snapshot) {
      var cardFront = snapshot.child('front').val();
      console.log(cardFront);
      var newHeading = $('<h2>');
      newHeading = newHeading.html(cardFront);
      $('#cardFront').append(newHeading);
    })
  }

  function checkAnswer() {
    var nextCard = cardOrder[cardIndex];
    var answer = $('#answer').val().trim();
    var cardsRef = firebase.database().ref('/users/'+uid+'/'+deckName+'/cards');
    cardsRef.child(nextCard).once('value').then(function(snapshot) {
      var correct = snapshot.child('back').val();
      var level = snapshot.child('level').val();
      if(answer == correct) {
        console.log('correct');
        if(level < 7) {
		        level ++
        }
        cardsRef.child(nextCard).child('level').set(level)
        console.log(level);
      } else {
        console.log('incorrect');
        cardsRef.child(nextCard).child('level').set(1);
        $('#cardFront > h2').html('The correct answer is: '+correct);
      }
    })
  }

  function determineLevels() {
    length = parseInt(length);
    var cardRef = firebase.database().ref('/users/'+uid+'/'+deckName+'/cards');
    var timeRef = firebase.database().ref('/users/'+uid);

    timeRef.once('value').then(function(snapshot) {
      var lastView = snapshot.child('time').val();
      console.log(lastView);
      var now = moment();
      var diff = now.diff(lastView, 'hours');
      console.log('diff' +diff);

      if(diff <= 3) {
        level = 2;
        console.log('level: '+level);
      } else if (diff <= 24) {
        level = 3;
        console.log('level: '+level);
      } else if(diff <= 36) {
        level = 4;
        console.log('level: '+level);
      } else if(diff <= 168) {
        level = 5;
        console.log('level: '+level);
      } else if(diff <= 720) {
        level = 6;
        console.log('level: '+level);
      } else if (diff <= 2160) {
        level = 7;
        console.log('level: '+level);
      }

      cardRef.once('value').then(function(snapshot) {
        console.log(level);
        for(var i = 0; i < length; i++) {
          var cardLevel = snapshot.child(i).child('level').val();

          if(cardLevel <= level) {
            cardsToDo.push(i);
            console.log(cardsToDo);
          }
        }
      })
    })


  }

})
