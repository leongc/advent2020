/*
--- Day 22: Crab Combat ---
It only takes a few hours of sailing the ocean on a raft for boredom to sink in. Fortunately, you brought a small deck of space cards! You'd like to play a game of Combat, and there's even an opponent available: a small crab that climbed aboard your raft before you left.

Fortunately, it doesn't take long to teach the crab the rules.

Before the game starts, split the cards so each player has their own deck (your puzzle input). Then, the game consists of a series of rounds: both players draw their top card, and the player with the higher-valued card wins the round. The winner keeps both cards, placing them on the bottom of their own deck so that the winner's card is above the other card. If this causes a player to have all of the cards, they win, and the game ends.

For example, consider the following starting decks:
*/
var day22test = [
'Player 1:',
'9',
'2',
'6',
'3',
'1',
'',
'Player 2:',
'5',
'8',
'4',
'7',
'10',
];
/*
This arrangement means that player 1's deck contains 5 cards, with 9 on top and 1 on the bottom; player 2's deck also contains 5 cards, with 5 on top and 10 on the bottom.

The first round begins with both players drawing the top card of their decks: 9 and 5. Player 1 has the higher card, so both cards move to the bottom of player 1's deck such that 9 is above 5. In total, it takes 29 rounds before a player has all of the cards:

-- Round 1 --
Player 1's deck: 9, 2, 6, 3, 1
Player 2's deck: 5, 8, 4, 7, 10
Player 1 plays: 9
Player 2 plays: 5
Player 1 wins the round!

-- Round 2 --
Player 1's deck: 2, 6, 3, 1, 9, 5
Player 2's deck: 8, 4, 7, 10
Player 1 plays: 2
Player 2 plays: 8
Player 2 wins the round!

-- Round 3 --
Player 1's deck: 6, 3, 1, 9, 5
Player 2's deck: 4, 7, 10, 8, 2
Player 1 plays: 6
Player 2 plays: 4
Player 1 wins the round!

-- Round 4 --
Player 1's deck: 3, 1, 9, 5, 6, 4
Player 2's deck: 7, 10, 8, 2
Player 1 plays: 3
Player 2 plays: 7
Player 2 wins the round!

-- Round 5 --
Player 1's deck: 1, 9, 5, 6, 4
Player 2's deck: 10, 8, 2, 7, 3
Player 1 plays: 1
Player 2 plays: 10
Player 2 wins the round!

...several more rounds pass...

-- Round 27 --
Player 1's deck: 5, 4, 1
Player 2's deck: 8, 9, 7, 3, 2, 10, 6
Player 1 plays: 5
Player 2 plays: 8
Player 2 wins the round!

-- Round 28 --
Player 1's deck: 4, 1
Player 2's deck: 9, 7, 3, 2, 10, 6, 8, 5
Player 1 plays: 4
Player 2 plays: 9
Player 2 wins the round!

-- Round 29 --
Player 1's deck: 1
Player 2's deck: 7, 3, 2, 10, 6, 8, 5, 9, 4
Player 1 plays: 1
Player 2 plays: 7
Player 2 wins the round!


== Post-game results ==
Player 1's deck: 
Player 2's deck: 3, 2, 10, 6, 8, 5, 9, 4, 7, 1
Once the game ends, you can calculate the winning player's score. The bottom card in their deck is worth the value of the card multiplied by 1, the second-from-the-bottom card is worth the value of the card multiplied by 2, and so on. With 10 cards, the top card is worth the value on the card multiplied by 10. In this example, the winning player's score is:

   3 * 10
+  2 *  9
+ 10 *  8
+  6 *  7
+  8 *  6
+  5 *  5
+  9 *  4
+  4 *  3
+  7 *  2
+  1 *  1
= 306
So, once the game ends, the winning player's score is 306.

Play the small crab in a game of Combat using the two decks you just dealt. What is the winning player's score?
*/
function buildDecks(input) {
  var decks = [];
  var deck;
  for (const line of input) {
    if (line.startsWith('Player ')) {
      deck = [];
    } else if (line.length === 0) {
      if (deck) {
        decks.push(deck);
        deck = undefined;
      }
    } else { // assume card
      deck.push(parseInt(line, 10));
    }
  }
  // flush if necessary
  if (deck) {
    decks.push(deck);
    deck = undefined;
  }
  return decks;
}
console.assert(buildDecks(day22test).join(';') === '9,2,6,3,1;5,8,4,7,10');

function makeCombat(decks) {
  return {
    showDebug: false,
    roundNumber: 0,
    showDecks: function() {
      console.log("Player 1's deck:", decks[0].join(', '));
      console.log("Player 2's deck:", decks[1].join(', '));
    },
    // returns false if round cannot be played
    playRound: function() {
      if (decks[0].length === 0 || decks[1].length === 0) {
        return false;
      }
      this.roundNumber++;
      if (this.showDebug) {
        console.log('-- Round ' + this.roundNumber + ' --');
        this.showDecks();
      }
      var card1 = decks[0].shift();
      var card2 = decks[1].shift();
      var is1Winner = card1 > card2;
      if (is1Winner) {
        decks[0].push(card1);
        decks[0].push(card2);
      } else {
        decks[1].push(card2);
        decks[1].push(card1);
      }
      if (this.showDebug) {
        console.log('Player 1 plays: ' + card1);
        console.log('Player 2 plays: ' + card2);
        console.log('Player ' + (is1Winner ? 1 : 2) + ' wins the round!');
        console.log();
      }
      return true;
    },
    getScore: function() {
      var score = 0;
      var deck = decks[decks[0].length === 0 ? 1 : 0];
      var i = deck.length;
      for (const card of deck) {
        score += card * i--;
      }
      return score;
    },
  }
}
console.assert(makeCombat([[],[3, 2, 10, 6, 8, 5, 9, 4, 7, 1]]).getScore() === 306);

var testCombat = makeCombat(buildDecks(day22test));
// testCombat.showDebug = true;
while (testCombat.playRound());
// testCombat.showDecks();
console.assert(testCombat.getScore() === 306);

var day22input = [
'Player 1:',
'31',
'33',
'27',
'43',
'29',
'25',
'36',
'11',
'15',
'5',
'14',
'34',
'7',
'18',
'26',
'41',
'19',
'45',
'12',
'1',
'8',
'35',
'44',
'30',
'50',
'',
'Player 2:',
'42',
'40',
'6',
'17',
'3',
'16',
'22',
'23',
'32',
'21',
'24',
'46',
'49',
'48',
'38',
'47',
'13',
'9',
'39',
'20',
'10',
'2',
'37',
'28',
'4',
];
var combat = makeCombat(buildDecks(day22input));
while (combat.playRound());
console.log(combat.getScore());

