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
  'callbacks': {
    // Called when the user has been successfully signed in.
    'signInSuccess': function(user, credential, redirectUrl) {
      handleSignedInUser(user);
      // Do not redirect.
      return false;
    }
  },
  // Opens IDP Providers sign-in flow in a popup.
  'signInFlow': 'popup',
  'signInOptions': [
    // TODO(developer): Remove the providers you don't need for your app.
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  'tosUrl': 'https://www.google.com'
};

  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseAuth', uiConfig);

   /**
   * Displays the UI for a signed in user.
   */
  var handleSignedInUser = function(user) {
    currentUid = user.uid;
    document.getElementById('user-signed-in').style.display = 'block';
    document.getElementById('user-signed-out').style.display = 'none';
    document.getElementById('name').textContent = user.displayName;
    document.getElementById('email').textContent = user.email;
    if (user.photoURL){
      document.getElementById('photo').src = user.photoURL;
      document.getElementById('photo').style.display = 'block';
    } else {
      document.getElementById('photo').style.display = 'none';
    }
  };


  /**
   * Displays the UI for a signed out user.
   */
  var handleSignedOutUser = function() {
    document.getElementById('user-signed-in').style.display = 'none';
    document.getElementById('user-signed-out').style.display = 'block';
    ui.start('#firebaseui-container', uiConfig);
  };

  // Listen to change in auth state so it displays the correct UI for when
  // the user is signed in or not.
  firebase.auth().onAuthStateChanged(function(user) {
    // The observer is also triggered when the user's token has expired and is
    // automatically refreshed. In that case, the user hasn't changed so we should
    // not update the UI.
    if (user && user.uid == currentUid) {
      return;
    }
    document.getElementById('loading').style.display = 'none';
    document.getElementById('loaded').style.display = 'block';
    user ? handleSignedInUser(user) : handleSignedOutUser();
  });


  /**
   * Initializes the app.
   */
  var initApp = function() {
    document.getElementById('sign-in-with-redirect').addEventListener(
        'click', signInWithRedirect);
    document.getElementById('sign-in-with-popup').addEventListener(
        'click', signInWithPopup);
    document.getElementById('sign-out').addEventListener('click', function() {
      firebase.auth().signOut();
    });
    document.getElementById('delete-account').addEventListener(
        'click', function() {
          firebase.auth().currentUser.delete();
        });
  };

  window.addEventListener('load', initApp);

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
      determineLevels();
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
  }

  function cardRandom() {
    var cardsLength = cardsToDo.length;
    console.log(cardsLength);
    for(var i = 0; i < cardsLength; i++) {
      var num = Math.floor(Math.random()*cardsLength);
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
        cardRandom();
        getCard();
      })
    })


  }

})
