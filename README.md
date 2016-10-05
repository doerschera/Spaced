# [S_paced](https://gentle-dusk-91327.herokuapp.com/)



### Background

*S_paced* is a flashcard study app that uses a spaced repetition system to help users learn and retain information. It is based on similar experiences I've had using sites and tools like [WaniKani](www.wanikani.com) and Anki. While spaced repetition is most generally used for learning new languages, it can be useful for any information that learners need to retain long-term.



### Technology

+ Google Firebase authentication and data storage
+ Moment.js
+ SASS
+ jQuery
+ Bootstrap



### Process

I started working with the user authentication, as it's crucial that users are able save their specific flashcard data and return to it at a later point. A quick HTML mockup was used to gather user input and begin writing and reading data from Firebase. Within each user object are deck objects that contain an array of corresponding cards as well as the time of the user's last review.

```javascript
userID {
  deckName: {
    cards: [{
      back: info,
      front: info,
      level: 3
      },
      {
      back: info,
      front: info,
      level: 2
      }],
    time: 2016-10-03T12:05:19-05:00
  }
}
```

The level of each card refers to when the card will be reviewed next. Level 1 cards are reviewed immediately and any card that is missed during a review is reset to level 1 and re-reviewed before the end of the session. Cards with level 2 are ready to be reviewed a few hours later, level 3 the next day and so on. Each review consists of all available cards. Moment.js is used to find the difference between the current and previous review in hours. A review difference of 26 hours corresponds to all cards <= level 3. When a card is answered correctly its level is incremented by 1.

A minimalist design is used to prevent distraction as well as mimic the idea of something that is "spaced". The four-color palete is used to differentiate the four different sections of the site: landing/log-in, user dashboard, new deck creation, and review. 



### Future

*S_paced* is currently missing the ability to edit already created decks and card, features that I would like to add in the future. Additionally, the app is not yet mobile-friendly.
      
