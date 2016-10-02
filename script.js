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
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: ['https://www.googleapis.com/auth/plus.login']
    },
    {
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      scopes :[
        'public_profile',
        'email',
        'user_likes',
        'user_friends'
      ]
    },
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  'tosUrl': 'https://www.google.com'
};

  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseAuth', uiConfig);

  function toggleSignIn() {
    if (firebase.auth().currentUser) {
      // [START signout]
      firebase.auth().signOut();
      signOutShow();
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
        $('.quickstart-sign-in').removeAttr('disabled', false);

        // [END_EXCLUDE]
      });
      // [END authwithemail]
    }
    $('.quickstart-sign-in').attr('disabled', 'disabled');
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
  // function sendEmailVerification() {
  //   // [START sendemailverification]
  //   firebase.auth().currentUser.sendEmailVerification().then(function() {
  //     // Email Verification sent!
  //     // [START_EXCLUDE]
  //     alert('Email Verification Sent!');
  //     // [END_EXCLUDE]
  //   });
  //   // [END sendemailverification]
  // }
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
      // document.getElementById('quickstart-verify-email').disabled = true;
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
        $('.quickstart-sign-in').html('Sign_Out');
        // document.getElementsByClassName('quickstart-sign-in')[1].textContent = 'Sign out';

        $(document).off('scroll');
        $('.welcome').css('display', 'none');
        // document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
        // if (!emailVerified) {
        //   document.getElementById('quickstart-verify-email').disabled = false;
        // }
        // [END_EXCLUDE]
      } else {
        // User is signed out.
        // [START_EXCLUDE silent]

        // document.getElementsByClassName('quickstart-sign-in')[0].textContent = 'Sign in';
        $('.quickstart-sign-in').html('Sign_In');
        // document.getElementById('quickstart-account-details').textContent = 'null';
        // [END_EXCLUDE]
      }
      // [START_EXCLUDE silent]
      // document.getElementsByClassName('quickstart-sign-in')[0].disabled = false;
      $('.quickstart-sign-in').removeAttr('disabled');
      // [END_EXCLUDE]
    });
    // [END authstatelistener]
    // document.getElementsByClassName('quickstart-sign-in')[0].addEventListener('click', toggleSignIn, false);
    $('.quickstart-sign-in').on('click', function() {
      toggleSignIn();
      signOut();
    });
    document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
    // document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
    // document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
  }
  window.onload = function() {
    initApp();
  };

  // app logic
  var signIn = true;
  var name;
  var email;
  var uid;
  var front;
  var back;
  var cardCounter = 0;
  var cardNumOf = 1;
  var deckName;
  var clickedDeck = [];
  var deckClick = 0;
  var cardIndex = 0;
  var length;
  var cardsToDo = [];
  var cardOrder = [];
  var nextCard = cardOrder[cardIndex];
  var level = 1;
  var keypressF = true;
  var keypressB = true;
  var keypressA = true;
  var red = '#990000';
  var teal = '#008080';
  var pruple = '#660066';
  var blue = '#66ccff';



  firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      var ref = firebase.auth().currentUser;
      uid = ref.uid;
      email = ref.email;
      name = ref.name;

      $('.welcome').css({height: '0', width: '0', margin: 0});
      $('.main').removeClass('disable');
      $('.authBox, #landingHead').addClass('disable');
      $('#landingHead').css('display', 'none');
      populateDash();
    }
  })
  // new card constructor
  function Card (front, back) {
    this.front = front;
    this.back = back;
    this.level = 1;
  }

  $('.welcome').fadeIn(1000*3);

  // sign in scroll
  $(document).scroll(function() {
    $(document).scrollTop(0);
    $('.welcome').animate({top: '-1000px', opacity: '0'}, 1000*1.5)
      .addClass('disable');
    $('.authBox').removeClass('disable').animate({top: '30vh'}, 1000*2);
    $('#landingHead').fadeIn(1000*1.5);
    $(window).unbind('scroll');
  })


  // dash menu link
  $('#dashboard').on('click', function() {
    showDash('.newDeck, .cardDisplay');
  });

  // create new deck
  $('#newDeck').click(function() {
    hideDash('.newDeck');
    changeColor(red);
  })

  $('#addDeckName').click(function() {
    $('.addName').addClass('disable');
    $('.cardInput').removeClass('disable');
    $('.cardInput:first').prepend('<h3>');
    $('.cardInput h3').html($('#deckName').val());
    newDeck();
  })

  $(document).on('keypress', '#front', function() {
      contentEditable('#front', keypressF, red);
      keypressF = false;
  })

  $(document).on('keypress', '#back', function() {
    contentEditable('#back', keypressB, red);
    keypressB =false;
  })

  $(document).on('keypress', '#answer', function() {
    contentEditable('#answer', keypressA, blue);
    keypressA =false;
  })

  // create new card
  $('#newCard').click(function() {
    writeCard();
    displayNewCard();
    addCardReset();
  })

  // done adding cards to new deck
  $('#done').click(function() {
    showDash('.newDeck, .cardDisplay');
    changeColor(teal);
    populateDash();
  })

  // select deck
  $(document).on('click', '.deck', function() {
    deckName = $(this).find('h2').html().trim();
    clickedDeck.push(deckName);
    console.log(deckName);
    var contentDiv = $(this).children('div');
    var height = $(this).height();
    removeDeckInfo();
    deckInfo();

    function deckInfo() {
      var monthDay;
      var year;
      var timeRef = firebase.database().ref('users/'+uid+'/'+deckName);

      timeRef.once('value').then(function(snapshot) {
        var lastDate = snapshot.child('time').child('time').val();
        length = snapshot.child('cards').val().length;
        console.log(lastDate);
        monthDay = moment(lastDate).format('MMMM Do');
        year = moment(lastDate).format('YYYY');

        contentDiv.addClass('clickedDeck');
        contentDiv.css({
          'max-height': height*2,
          'padding': '10px 0px',
        });
        contentDiv.animate({height: height*2}, 'slow');
        contentDiv.empty();
        contentDiv.append('<h6>cards</h6>');
        contentDiv.append('<h3>'+length+'</h3>');
        contentDiv.append('<h6>last viewed</h6>');
        contentDiv.append('<h4>'+monthDay+'<br>'+year+'</h4>');
        contentDiv.append('<button type="button" class="btn" id="start">start</button');
      })
    }


    function removeDeckInfo() {
      $('.clickedDeck').empty();
      $('.clickedDeck').removeAttr('style');
      $('.clickedDeck').append('<a href="#"><h2>'+clickedDeck[0]+'</h2></a>');
      $('.clickedDeck').removeClass('clickedDeck');
      if(deckClick != 0) {
        clickedDeck.shift();
      }
      deckClick ++;
    }


    $('.deck').off('click');
  })

  // select card
  $(document).on('click', '#start', function() {
    cardNumOf = 1;
    changeColor(blue);
    $('.userDash, #landingHead').addClass('disable');
    $('.cardReview').removeClass('disable');
      setTime();
      determineLevels();
  })

  // submit answer
  $('#submit').click(function() {
    checkAnswer();
  })

  // next card
  $(document).on('click', '#next', function() {
    console.log('next');
    $('.reviewContent').empty();
    $('#answer').html('Your Answer');
    $('#answer').removeAttr('style');
    $('#submit').removeClass('disable');
    keypressA = true;
    getCard();
  });

  // logo and menu match page color
  function changeColor(color) {
    $('#mainHeader h1').css('color', color);
    $('#mainHeader .btn').css({
      'color': color,
      'border-color': color
    });
  }

  // sign out
  function signOutShow() {
    $('.main').addClass('disable');
    $('#landingHead, .welcome, .authBox').removeClass('disable');
    $('.authBox').css('top', '200px');
  }

  // hide dash, show new deck
  function hideDash(page) {
    $('.userDash').addClass('disable');
    $(page).removeClass('disable');
  }

  function showDash(page) {
    $('.userDash').removeClass('disable');
    $(page).addClass('disable');
  }

  function populateDash() {
    var ref = firebase.database().ref('/users/'+uid);
    $('.deck').remove();
    ref.once('value').then(function(snapshot) {
      var decksNum = snapshot.numChildren();
      snapshot.forEach(function(snapshotChild) {
        var deckTitle = snapshotChild.key;
        var wrapperDiv = $('<div class="deck col-xs-6 col-sm-4"></div>')
        var newDeckDiv = $('<div><a href="#"><h2>'+deckTitle+'</h2></a></div>');
        var wrappedDeck = $(wrapperDiv).append(newDeckDiv);
        $('.userDecks').prepend(wrappedDeck);
      })
    })
  }

  function newDeck() {
    deckName = $('#deckName').val().trim();
    var decks = {};
    decks[deckName] = {
      cards: ['']
    };

    $('.deckHeading h3').html(deckName);
    console.log(decks);
    firebase.database().ref('/users/'+uid).update(decks);
    setTime();
  }

  function contentEditable(id, keypress, color) {
    if(keypress) {
      $(id).off('keypress');
      $(id).html(' ');
      $(id).css('color', color);
    }
  }

  function writeCard() {
    front = $('#front').html().trim().toLowerCase();
    back = $('#back').html().trim().toLowerCase();
    var card = new Card(front, back);
    var ref = '/users/'+uid+'/'+deckName+'/cards'+ '/'+cardCounter;

    firebase.database().ref(ref).set(card);
  }

  function addCardReset() {
    keypressF = true;
    keypressB = true;
    cardCounter ++;

    $('#front').html('Card Front');
    $('#back').html('Card Back');
    $('#front, #back').css('color', '#8c8c8c');
    $('.cardInput > p').html('Card_'+(cardCounter+1));
  }

  function displayNewCard() {
    var frontDiv = $('<div class="col-xs-6"></div>');
    var backDiv = $('<div class="col-xs-6"></div>');

    $('.cardDisplay').removeClass('disable');

    $(frontDiv).append('<p>Front:</p>');
    $(frontDiv).append('<p>'+$('#front').html()+'</p>');
    $('.cardDisplay').append(frontDiv);

    $(backDiv).append('<p>Back:</p>');
    $(backDiv).append('<p>'+$('#back').html()+'</p>');
    $('.cardDisplay').append(backDiv);

    var divWidth = $('.cardDisplay > div').width();
    $('.cardDisplay > div').css('height', divWidth+'px');
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
    firebase.database().ref('users/' + uid+'/'+deckName+'/time').update({time: newView});
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
      $('.reviewContent').append(newHeading);
      $('#cardNumOf').html(cardNumOf+' of '+length);
      cardNumOf++;
    })
  }

  function checkAnswer() {
    var nextCard = cardOrder[cardIndex];
    var answer = $('#answer').html().toLowerCase();
    answer = answer.replace(/&nbsp/g, '');
    answer = answer.trim();
    console.log(answer);
    cardIndex++;
    var cardsRef = firebase.database().ref('/users/'+uid+'/'+deckName+'/cards');
    cardsRef.child(nextCard).once('value').then(function(snapshot) {
      var correct = snapshot.child('back').val();
      var level = snapshot.child('level').val();
      var nextButton = $('<button type="button" class="btn" id="next">next</button>');
      if(answer == correct) {
        console.log('correct');
        if(level < 7) {
		        level ++
        }
        cardsRef.child(nextCard).child('level').set(level)
        console.log(level);
        $('#check').fadeIn('slow').delay(1000).fadeOut('slow', function() {
          $('.reviewContent > h2').html('You\'re correct!');
          $('.reviewContent').append(nextButton)
        });
      } else {
        console.log('incorrect');
        cardsRef.child(nextCard).child('level').set(1);
        $('#x').fadeIn('slow').delay(1000).fadeOut('slow', function() {
          $('.reviewContent > h2').html('The correct answer is: '+correct);
          $('.reviewContent').append(nextButton);
        })
      }
      $('#submit').addClass('disable');
    })
  }

  function getNextCard() {
    $('.reviewContent').empty();
    $('#answer').html('Your Answer');
    $('#answer').removeAttr('style');
    $('#submit').removeClass('disable');
    $('#next').addClass('disable');
    keypressA = true;
    getCard();
  }

  function determineLevels() {
    length = parseInt(length);
    var cardRef = firebase.database().ref('/users/'+uid+'/'+deckName+'/cards');
    var timeRef = firebase.database().ref('/users/'+uid+'/time');

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
