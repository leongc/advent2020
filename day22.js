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

/*
--- Part Two ---
You lost to the small crab! Fortunately, crabs aren't very good at recursion. To defend your honor as a Raft Captain, you challenge the small crab to a game of Recursive Combat.

Recursive Combat still starts by splitting the cards into two decks (you offer to play with the same starting decks as before - it's only fair). Then, the game consists of a series of rounds with a few changes:

Before either player deals a card, if there was a previous round in this game that had exactly the same cards in the same order in the same players' decks, the game instantly ends in a win for player 1. Previous rounds from other games are not considered. (This prevents infinite games of Recursive Combat, which everyone agrees is a bad idea.)
Otherwise, this round's cards must be in a new configuration; the players begin the round by each drawing the top card of their deck as normal.
If both players have at least as many cards remaining in their deck as the value of the card they just drew, the winner of the round is determined by playing a new game of Recursive Combat (see below).
Otherwise, at least one player must not have enough cards left in their deck to recurse; the winner of the round is the player with the higher-value card.
As in regular Combat, the winner of the round (even if they won the round by winning a sub-game) takes the two cards dealt at the beginning of the round and places them on the bottom of their own deck (again so that the winner's card is above the other card). Note that the winner's card might be the lower-valued of the two cards if they won the round due to winning a sub-game. If collecting cards by winning the round causes a player to have all of the cards, they win, and the game ends.

Here is an example of a small game that would loop forever without the infinite game prevention rule:

Player 1:
43
19

Player 2:
2
29
14
During a round of Recursive Combat, if both players have at least as many cards in their own decks as the number on the card they just dealt, the winner of the round is determined by recursing into a sub-game of Recursive Combat. (For example, if player 1 draws the 3 card, and player 2 draws the 7 card, this would occur if player 1 has at least 3 cards left and player 2 has at least 7 cards left, not counting the 3 and 7 cards that were drawn.)

To play a sub-game of Recursive Combat, each player creates a new deck by making a copy of the next cards in their deck (the quantity of cards copied is equal to the number on the card they drew to trigger the sub-game). During this sub-game, the game that triggered it is on hold and completely unaffected; no cards are removed from players' decks to form the sub-game. (For example, if player 1 drew the 3 card, their deck in the sub-game would be copies of the next three cards in their deck.)

Here is a complete example of gameplay, where Game 1 is the primary game of Recursive Combat:

=== Game 1 ===

-- Round 1 (Game 1) --
Player 1's deck: 9, 2, 6, 3, 1
Player 2's deck: 5, 8, 4, 7, 10
Player 1 plays: 9
Player 2 plays: 5
Player 1 wins round 1 of game 1!

-- Round 2 (Game 1) --
Player 1's deck: 2, 6, 3, 1, 9, 5
Player 2's deck: 8, 4, 7, 10
Player 1 plays: 2
Player 2 plays: 8
Player 2 wins round 2 of game 1!

-- Round 3 (Game 1) --
Player 1's deck: 6, 3, 1, 9, 5
Player 2's deck: 4, 7, 10, 8, 2
Player 1 plays: 6
Player 2 plays: 4
Player 1 wins round 3 of game 1!

-- Round 4 (Game 1) --
Player 1's deck: 3, 1, 9, 5, 6, 4
Player 2's deck: 7, 10, 8, 2
Player 1 plays: 3
Player 2 plays: 7
Player 2 wins round 4 of game 1!

-- Round 5 (Game 1) --
Player 1's deck: 1, 9, 5, 6, 4
Player 2's deck: 10, 8, 2, 7, 3
Player 1 plays: 1
Player 2 plays: 10
Player 2 wins round 5 of game 1!

-- Round 6 (Game 1) --
Player 1's deck: 9, 5, 6, 4
Player 2's deck: 8, 2, 7, 3, 10, 1
Player 1 plays: 9
Player 2 plays: 8
Player 1 wins round 6 of game 1!

-- Round 7 (Game 1) --
Player 1's deck: 5, 6, 4, 9, 8
Player 2's deck: 2, 7, 3, 10, 1
Player 1 plays: 5
Player 2 plays: 2
Player 1 wins round 7 of game 1!

-- Round 8 (Game 1) --
Player 1's deck: 6, 4, 9, 8, 5, 2
Player 2's deck: 7, 3, 10, 1
Player 1 plays: 6
Player 2 plays: 7
Player 2 wins round 8 of game 1!

-- Round 9 (Game 1) --
Player 1's deck: 4, 9, 8, 5, 2
Player 2's deck: 3, 10, 1, 7, 6
Player 1 plays: 4
Player 2 plays: 3
Playing a sub-game to determine the winner...

=== Game 2 ===

-- Round 1 (Game 2) --
Player 1's deck: 9, 8, 5, 2
Player 2's deck: 10, 1, 7
Player 1 plays: 9
Player 2 plays: 10
Player 2 wins round 1 of game 2!

-- Round 2 (Game 2) --
Player 1's deck: 8, 5, 2
Player 2's deck: 1, 7, 10, 9
Player 1 plays: 8
Player 2 plays: 1
Player 1 wins round 2 of game 2!

-- Round 3 (Game 2) --
Player 1's deck: 5, 2, 8, 1
Player 2's deck: 7, 10, 9
Player 1 plays: 5
Player 2 plays: 7
Player 2 wins round 3 of game 2!

-- Round 4 (Game 2) --
Player 1's deck: 2, 8, 1
Player 2's deck: 10, 9, 7, 5
Player 1 plays: 2
Player 2 plays: 10
Player 2 wins round 4 of game 2!

-- Round 5 (Game 2) --
Player 1's deck: 8, 1
Player 2's deck: 9, 7, 5, 10, 2
Player 1 plays: 8
Player 2 plays: 9
Player 2 wins round 5 of game 2!

-- Round 6 (Game 2) --
Player 1's deck: 1
Player 2's deck: 7, 5, 10, 2, 9, 8
Player 1 plays: 1
Player 2 plays: 7
Player 2 wins round 6 of game 2!
The winner of game 2 is player 2!

...anyway, back to game 1.
Player 2 wins round 9 of game 1!

-- Round 10 (Game 1) --
Player 1's deck: 9, 8, 5, 2
Player 2's deck: 10, 1, 7, 6, 3, 4
Player 1 plays: 9
Player 2 plays: 10
Player 2 wins round 10 of game 1!

-- Round 11 (Game 1) --
Player 1's deck: 8, 5, 2
Player 2's deck: 1, 7, 6, 3, 4, 10, 9
Player 1 plays: 8
Player 2 plays: 1
Player 1 wins round 11 of game 1!

-- Round 12 (Game 1) --
Player 1's deck: 5, 2, 8, 1
Player 2's deck: 7, 6, 3, 4, 10, 9
Player 1 plays: 5
Player 2 plays: 7
Player 2 wins round 12 of game 1!

-- Round 13 (Game 1) --
Player 1's deck: 2, 8, 1
Player 2's deck: 6, 3, 4, 10, 9, 7, 5
Player 1 plays: 2
Player 2 plays: 6
Playing a sub-game to determine the winner...

=== Game 3 ===

-- Round 1 (Game 3) --
Player 1's deck: 8, 1
Player 2's deck: 3, 4, 10, 9, 7, 5
Player 1 plays: 8
Player 2 plays: 3
Player 1 wins round 1 of game 3!

-- Round 2 (Game 3) --
Player 1's deck: 1, 8, 3
Player 2's deck: 4, 10, 9, 7, 5
Player 1 plays: 1
Player 2 plays: 4
Playing a sub-game to determine the winner...

=== Game 4 ===

-- Round 1 (Game 4) --
Player 1's deck: 8
Player 2's deck: 10, 9, 7, 5
Player 1 plays: 8
Player 2 plays: 10
Player 2 wins round 1 of game 4!
The winner of game 4 is player 2!

...anyway, back to game 3.
Player 2 wins round 2 of game 3!

-- Round 3 (Game 3) --
Player 1's deck: 8, 3
Player 2's deck: 10, 9, 7, 5, 4, 1
Player 1 plays: 8
Player 2 plays: 10
Player 2 wins round 3 of game 3!

-- Round 4 (Game 3) --
Player 1's deck: 3
Player 2's deck: 9, 7, 5, 4, 1, 10, 8
Player 1 plays: 3
Player 2 plays: 9
Player 2 wins round 4 of game 3!
The winner of game 3 is player 2!

...anyway, back to game 1.
Player 2 wins round 13 of game 1!

-- Round 14 (Game 1) --
Player 1's deck: 8, 1
Player 2's deck: 3, 4, 10, 9, 7, 5, 6, 2
Player 1 plays: 8
Player 2 plays: 3
Player 1 wins round 14 of game 1!

-- Round 15 (Game 1) --
Player 1's deck: 1, 8, 3
Player 2's deck: 4, 10, 9, 7, 5, 6, 2
Player 1 plays: 1
Player 2 plays: 4
Playing a sub-game to determine the winner...

=== Game 5 ===

-- Round 1 (Game 5) --
Player 1's deck: 8
Player 2's deck: 10, 9, 7, 5
Player 1 plays: 8
Player 2 plays: 10
Player 2 wins round 1 of game 5!
The winner of game 5 is player 2!

...anyway, back to game 1.
Player 2 wins round 15 of game 1!

-- Round 16 (Game 1) --
Player 1's deck: 8, 3
Player 2's deck: 10, 9, 7, 5, 6, 2, 4, 1
Player 1 plays: 8
Player 2 plays: 10
Player 2 wins round 16 of game 1!

-- Round 17 (Game 1) --
Player 1's deck: 3
Player 2's deck: 9, 7, 5, 6, 2, 4, 1, 10, 8
Player 1 plays: 3
Player 2 plays: 9
Player 2 wins round 17 of game 1!
The winner of game 1 is player 2!


== Post-game results ==
Player 1's deck: 
Player 2's deck: 7, 5, 6, 2, 4, 1, 10, 8, 9, 3
After the game, the winning player's score is calculated from the cards they have in their original deck using the same rules as regular Combat. In the above game, the winning player's score is 291.

Defend your honor as Raft Captain by playing the small crab in a game of Recursive Combat using the same two decks as before. What is the winning player's score?
*/

var game = 0;
function makeRecursiveCombat(decks) {
  game++;
  return {
    game,
    showDebug: false,
    roundNumber: 0,
    previousRounds: new Set(),
    showDecks: function() {
      console.log("Player 1's deck:", decks[0].join(', '));
      console.log("Player 2's deck:", decks[1].join(', '));
    },
    // returns false if round cannot be played
    playRound: function() {
      if (decks[0].length === 0 || decks[1].length === 0 || this.previousRounds.has(decks.join(';'))) {
        return false;
      }
      // record this round to prevent infinte games
      this.previousRounds.add(decks.join(';'))

      this.roundNumber++;
      if (this.showDebug) {
        console.log('-- Round ' + this.roundNumber + ' (Game ' + this.game + ') --');
        this.showDecks();
      }
      var card1 = decks[0].shift();
      var card2 = decks[1].shift();
      if (this.showDebug) {
        console.log('Player 1 plays: ' + card1);
        console.log('Player 2 plays: ' + card2);
      }
      var is1Winner = (decks[0].length >= card1 && decks[1].length >= card2) 
        ? this.is1SubWinner([decks[0].slice(0, card1), decks[1].slice(0, card2)])
        : card1 > card2;
      if (is1Winner) {
        decks[0].push(card1);
        decks[0].push(card2);
      } else {
        decks[1].push(card2);
        decks[1].push(card1);
      }
      if (this.showDebug) {
        console.log('Player ' + (is1Winner ? 1 : 2) + ' wins round ' + this.roundNumber + ' of game ' + this.game + '!');
        console.log();
      }
      return true;
    },
    is1SubWinner: function(subdecks) {
      var subCombat = makeRecursiveCombat(subdecks);
      subCombat.showDebug = this.showDebug;
      if (subCombat.showDebug) {
        console.log('=== Game ' + subCombat.game + ' ===');
      }
      while (subCombat.playRound());
      var sub1Winner = subCombat.is1Winner();
      if (subCombat.showDebug) {
        console.log('The winner of game ' + subCombat.game + ' is player ' + (sub1Winner ? 1 : 2) + '!');
      }
      return sub1Winner;
    },
    is1Winner: function() {
      return decks[0].length > 0; // Player 1 has all the cards, or infinite game, so Player 1 wins
    },
    getScore: function() {
      var score = 0;
      var deck = decks[this.is1Winner() ? 0 : 1];
      var i = deck.length;
      for (const card of deck) {
        score += card * i;
        i--;
      }
      return score;
    },
  }
}
var inf = makeRecursiveCombat([[43,19], [2,29,14]]);
for (var i = 0; i < 7; i++) { inf.playRound(); }
console.assert(!inf.playRound()); // should only be able to play six rounds
console.assert(inf.roundNumber === 6);
console.assert(inf.is1Winner()); // Player 1 wins infinite loops

var rc = makeRecursiveCombat(buildDecks(day22test));
while (rc.playRound());
console.assert(rc.getScore() === 291);

rc = makeRecursiveCombat(buildDecks(day22input));
while (rc.playRound());
console.log(rc.getScore());
