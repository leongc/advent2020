/*
--- Day 19: Monster Messages ---
You land in an airport surrounded by dense forest. As you walk to your high-speed train, the Elves at the Mythical Information Bureau contact you again. They think their satellite has collected an image of a sea monster! Unfortunately, the connection to the satellite is having problems, and many of the messages sent back from the satellite have been corrupted.

They sent you a list of the rules valid messages should obey and a list of received messages they've collected so far (your puzzle input).

The rules for valid messages (the top part of your puzzle input) are numbered and build upon each other. For example:

0: 1 2
1: "a"
2: 1 3 | 3 1
3: "b"
Some rules, like 3: "b", simply match a single character (in this case, b).

The remaining rules list the sub-rules that must be followed; for example, the rule 0: 1 2 means that to match rule 0, the text being checked must match rule 1, and the text after the part that matched rule 1 must then match rule 2.

Some of the rules have multiple lists of sub-rules separated by a pipe (|). This means that at least one list of sub-rules must match. (The ones that match might be different each time the rule is encountered.) For example, the rule 2: 1 3 | 3 1 means that to match rule 2, the text being checked must match rule 1 followed by rule 3 or it must match rule 3 followed by rule 1.

Fortunately, there are no loops in the rules, so the list of possible matches will be finite. Since rule 1 matches a and rule 3 matches b, rule 2 matches either ab or ba. Therefore, rule 0 matches aab or aba.

Here's a more interesting example:

0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"
Here, because rule 4 matches a and rule 5 matches b, rule 2 matches two letters that are the same (aa or bb), and rule 3 matches two letters that are different (ab or ba).

Since rule 1 matches rules 2 and 3 once each in either order, it must match two pairs of letters, one pair with matching letters and one pair with different letters. This leaves eight possibilities: aaab, aaba, bbab, bbba, abaa, abbb, baaa, or babb.

Rule 0, therefore, matches a (rule 4), then any of the eight options from rule 1, then b (rule 5): aaaabb, aaabab, abbabb, abbbab, aabaab, aabbbb, abaaab, or ababbb.

The received messages (the bottom part of your puzzle input) need to be checked against the rules so you can determine which are valid and which are corrupted. Including the rules and the messages together, this might look like:

0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb
Your goal is to determine the number of messages that completely match rule 0. In the above example, ababbb and abbbab match, but bababa, aaabbb, and aaaabbb do not, producing the answer 2. The whole message must match all of rule 0; there can't be extra unmatched characters in the message. (For example, aaaabbb might appear to match rule 0 above, but it has an extra unmatched b on the end.)

How many messages completely match rule 0?
*/
function parseRule(ruleStr) {
  if (ruleStr.startsWith('"')) {
    return ruleStr[1];
  }
  if (!ruleStr.includes(' ')) {
    return parseInt(ruleStr);
  }
  if (ruleStr.includes(' | ')) {
    var choices = new Set();
    ruleStr.split(' | ').forEach( s => { choices.add(parseRule(s)); } );
    return choices;
  }
  return ruleStr.split(' ').map(parseRule);
}
console.assert(parseRule('"x"') === 'x');
console.assert(parseRule('1') === 1);
console.assert(parseRule('3 5')[0] === 3);
console.assert(parseRule('3 5')[1] === 5);
console.assert(parseRule('1 3 | 3 1').size === 2);

function parseRules(input) {
  var rules = new Map();
  for (var line of input) {
    var [ruleId, ruleStr] = line.split(': ');
    if (ruleStr === undefined) {
      continue;
    }
    rules.set(parseInt(ruleId), parseRule(ruleStr));    
  }
  return rules;
}
var day19simple = [
'0: 1 2',
'1: "a"',
'2: 1 3 | 3 1',
'3: "b"',
];
var simpleRules = parseRules(day19simple);
console.assert(simpleRules.get(0).length === 2);
console.assert(simpleRules.get(0)[0] === 1);
console.assert(simpleRules.get(0)[1] === 2);
console.assert(simpleRules.get(1) === 'a');
console.assert(simpleRules.get(2).size === 2);
console.assert(simpleRules.get(3) === 'b');

function makeValidator(rules) {
  return {
    /* returns length of str matching rule, otherwise zero */
    isValid: function(rule, str) {
      if (str.length < 1) { return 0; }
      if (typeof rule === "string") {
        return (str[0] === rule) ? 1 : 0;
      }
      if (typeof rule === "number") {
        var ruleObj = rules.get(rule);
        if (ruleObj === undefined) { return 0; }
        return this.isValid(ruleObj, str);
      }
      if (Array.prototype.isPrototypeOf(rule)) {
        var validSum = 0;
        for (var seqRule of rule) {
          var valid = this.isValid(seqRule, str.substring(validSum));
          if (valid === 0) { return 0; }
          validSum += valid;
        }
        return validSum;
      }
      if (Set.prototype.isPrototypeOf(rule)) {
        for (var choiceRule of rule) {
          var valid = this.isValid(choiceRule, str);
          if (valid > 0) { return valid; }
        }
        return 0;
      }
      console.log('Unknown rule type:', rule);
      return 0;
    } // isValid
  } // obj
} // makeValidator
var simpleValidator = makeValidator(simpleRules);
console.assert(simpleValidator.isValid(1, 'aba') === 1);
console.assert(simpleValidator.isValid(2, 'aba') === 2);
console.assert(simpleValidator.isValid(3, 'aba') === 0);
console.assert(simpleValidator.isValid(0, 'aba') === 3);

var day19test = [
'0: 4 1 5',
'1: 2 3 | 3 2',
'2: 4 4 | 5 5',
'3: 4 5 | 5 4',
'4: "a"',
'5: "b"',
];
var testValidator = makeValidator(parseRules(day19test));
console.assert(['aaab', 'aaba', 'bbab', 'bbba', 'abaa', 'abbb', 'baaa', 'babb'].every( s => testValidator.isValid(1, s) === s.length ));
console.assert(['aaaabb', 'aaabab', 'abbabb', 'abbbab', 'aabaab', 'aabbbb', 'abaaab', 'ababbb'].every( s => testValidator.isValid(0, s) === s.length ));

var day19input = [
'25: 6 54 | 28 122',
'52: 27 54 | 25 122',
'44: 118 122 | 30 54',
'37: 122 97 | 54 98',
'38: 122 22 | 54 3',
'77: 54 34 | 122 7',
'17: 122 124 | 54 47',
'1: 54 79 | 122 119',
'13: 122 121 | 54 15',
'29: 122 3 | 54 97',
'24: 54 97 | 122 62',
'80: 122 1 | 54 21',
'62: 54 54 | 122 54',
'5: 54 61 | 122 119',
'28: 54 57 | 122 36',
'101: 122 48 | 54 44',
'81: 120 54 | 14 122',
'14: 54 96 | 122 38',
'18: 40 122 | 76 54',
'27: 122 93 | 54 103',
'4: 123 122 | 90 54',
'65: 122 87 | 54 22',
'113: 54 | 122',
'23: 122 127 | 54 62',
'117: 71 54 | 119 122',
'53: 35 54 | 126 122',
'26: 122 52 | 54 108',
'125: 54 33 | 122 4',
'10: 74 122 | 53 54',
'84: 54 19 | 122 109',
'123: 122 114 | 54 115',
'42: 70 122 | 26 54',
'16: 122 39 | 54 98',
'63: 98 54 | 51 122',
'39: 54 122',
'76: 122 83 | 54 101',
'61: 122 3 | 54 39',
'50: 122 85 | 54 95',
'78: 22 122 | 3 54',
'114: 122 122',
'64: 122 122 | 122 54',
'40: 122 81 | 54 55',
'92: 127 122 | 97 54',
'119: 122 51',
'57: 98 54 | 114 122',
'3: 113 122 | 54 54',
'97: 122 113 | 54 122',
'7: 122 37 | 54 59',
'74: 54 46 | 122 56',
'2: 122 67 | 54 50',
'48: 43 122 | 65 54',
'124: 54 94 | 122 36',
'82: 54 98 | 122 64',
'93: 59 122 | 116 54',
'96: 115 122 | 97 54',
'98: 54 54',
'60: 51 54 | 22 122',
'72: 122 98 | 54 3',
'106: 39 54 | 39 122',
'41: 51 54 | 97 122',
'31: 18 54 | 69 122',
'91: 122 62 | 54 127',
'120: 105 122 | 19 54',
'56: 60 122 | 78 54',
'47: 16 122 | 91 54',
'88: 97 113',
'30: 22 122 | 115 54',
'71: 51 54 | 39 122',
'87: 122 122 | 54 122',
'21: 122 102 | 54 73',
'43: 122 22 | 54 127',
'35: 54 23 | 122 90',
'51: 113 113',
'90: 122 62 | 54 87',
'32: 54 127 | 122 97',
'115: 122 54 | 54 113',
'55: 54 84 | 122 89',
'73: 122 51 | 54 39',
'36: 22 54 | 114 122',
'68: 122 87 | 54 98',
'34: 118 54 | 32 122',
'95: 54 87',
'83: 122 117 | 54 20',
'33: 99 54 | 29 122',
'19: 122 127 | 54 98',
'46: 54 112 | 122 79',
'89: 54 72 | 122 66',
'110: 54 51 | 122 98',
'109: 64 54 | 22 122',
'9: 54 107 | 122 5',
'12: 54 80 | 122 45',
'104: 54 100 | 122 32',
'15: 75 122 | 63 54',
'69: 122 49 | 54 12',
'8: 42',
'75: 97 54 | 3 122',
'108: 122 77 | 54 125',
'103: 122 88 | 54 24',
'111: 3 54 | 39 122',
'70: 122 58 | 54 10',
'20: 122 105 | 54 68',
'0: 8 11',
'122: "a"',
'79: 62 54 | 22 122',
'102: 87 122 | 97 54',
'105: 98 54 | 98 122',
'49: 13 54 | 2 122',
'112: 54 39 | 122 62',
'58: 9 122 | 17 54',
'11: 42 31',
'107: 66 122 | 110 54',
'86: 54 106 | 122 82',
'99: 127 122 | 39 54',
'22: 54 122 | 122 54',
'118: 54 3 | 122 64',
'67: 122 59 | 54 111',
'126: 78 54 | 92 122',
'121: 54 41 | 122 38',
'66: 22 113',
'94: 54 39',
'6: 88 122 | 29 54',
'127: 122 54',
'116: 54 39 | 122 87',
'59: 54 51',
'85: 64 122 | 97 54',
'100: 98 122 | 62 54',
'54: "b"',
'45: 86 122 | 104 54',
'',
'baaabbaabababaaababaaaaababbbabaabbbabba',
'baabbbbbaababbabaaabbabb',
'abbabbaabbabbbaabbabaaaaaabaabbbabbabbaa',
'bababbaababaabbaaabbabbb',
'baaabbaababbbbaabbbaaaba',
'bababbaababbbbbbaabbbbbb',
'ababababbabbaababbaabbbabbaabababaaababbaabaaaabbbbbaaaa',
'bbabbabaaaaabaaabbaabbab',
'abbbaabbababaabbbaabaaab',
'bababaaaabbbbbaaaabbbbbb',
'bbabaabbbbabbaabbabaabbaabbbbbaa',
'babaabaaabaaabbbbbbabbababaaabbbaaaaababbaabaabb',
'abaaaaaabaaabbbabbbaaabaababaabaaabababaaabaabba',
'aabbbaaaababbaaaaababbbb',
'babaabbaaaaabaaabaabbbabbababbbb',
'aabbabbbbbabaaaabbaabbab',
'abbabaaaaaaaaaaaabaabbbbaaabbbabaaabbabb',
'aaababbbaabbabbbaaabaaba',
'babbaabbbabaaaaaaabbbbabbabaabbababbbbabaababbba',
'abababbbabbabbaabaaabbbbababbabb',
'aaaaabbbbbbbaaaabbbaaabb',
'baababaaababaaabbaabaaabaabbabbabbaaaabb',
'babaabbbababaabaaababbbb',
'babaabaababbbbbbaabbaaba',
'babaabbbbabaaaabbbabbbaaaabaaaba',
'bbbabbbabbbbbaabbbbaabba',
'aaaaaababbabbbaaaaabbabb',
'bbabbbaaaababaaaababaaab',
'baabaababbbbbbbaaaaababb',
'abaababbaaaabbbaaabbabababaababbbbaabaab',
'abbbbbaaaababaabbbbababa',
'aabbabababbbbbaabbaaabba',
'abbaaababaabbbaaaabbaaaabbbabbabbababababaaaaaaabaabaabaaaaabaabbaabaaabaababbbbbbaabbaa',
'abbabaaaaaaaababbbbaabba',
'bbabbbaaaaabaababbbbbaaabbaaaabababbbabaabbabaababaaababbaabbbbbaababbbb',
'abbabaabbbbbaababbabbbbaabbaaaab',
'baaaabababaabbabbbbbbaabbaaaaabbbabbbbba',
'abbbabbbbbabaabbaaabaabb',
'aaaaababbbbabbaabaababba',
'baabbbbaaaaabbababababba',
'bbbabbaaabbaaaaaabaabbaa',
'babbaabbbabbaabbaaababababaaabab',
'ababaabbbaaabaaabaaaababbbaababaaababaabbbbbabbaaabbaaaa',
'aabbbabaaaaaabaaaaabbbaa',
'aabaaabbbbbbbbbaaabababa',
'abbaabababbbaabbbabbbbaaaaaaabbaaaababababaabbbabbbababa',
'aabbbabbabbaaaaabbbaaabb',
'bbbabbbabbaabbbbbbbaaaba',
'bbabababaababbaaababbaab',
'abbabbbabbbbbaaaabbabaaabbabaabaababbaaaaaabbabb',
'abbbbaabbabaaababbabaaab',
'aabbbbabaaaabbbaabbaabbbbbaabaaaaaaaaabaaaabbbaabaabaaab',
'abaaabababbbbaabbbbbaaba',
'bbbbbabbbabbbaaabbaababaaaabbabbaaaaaaabaaaaaaaaabbabaaaabbabbaabbbbaaabaaaabbba',
'baabaabaabbbabbbbbaabaaaaaabbbaa',
'bbbaaaaabbbbbbaabbaabaabbbbbbbbbabbababaaabbbbbb',
'bababaabbabaabbabbbbbabababaaabb',
'abaabbabaabaaabbbbaaabba',
'babbaababbabbaababbbbaaa',
'aabaababbabaababaababbbb',
'aaababbaabbaaaaababaaabaaabbbabbbaaabababbbabbbb',
'aaaaaabaabaabbbaabaaabaa',
'babaabababbabaaaaaaababb',
'bbabaabbabaabbbaaaaaaabb',
'abbabbbbbaaabbaaaaabaaab',
'ababaaaabbabbbaabababaaaaababaabbbaabbaaaababbbb',
'babaaaaaababbbbaaabbbaaaabbbbbabbbababba',
'bbbbabbbaababbabaabaabba',
'babbabbbbaaaaabbbabbbaaaabaabaaa',
'aabaaabbaabbbbabbbbababa',
'babbabbaaaababbbaabbaaaa',
'aabaababbaaabbbbbbbaabbb',
'babaaaabbabaabbaabaaabababbaabbbbaaaabbb',
'bbaabbbbbbabbbababbbabba',
'bbbabaabbaabaabababbbaaa',
'bbabaabbbaababbaaaabbbababbaaabaaaaabababaaaabbabbbaaabb',
'ababaabababaabbbbbababaa',
'abbabbaabbbbabababbababb',
'baabbbbaaababbabaaabbaaa',
'ababaabaababababaaabbabb',
'babbbbaaabaabbbababbaaaa',
'aaaabbabbabaaabbbbbaabbb',
'babbababaabbbababbabababbababbba',
'aabbbabbbaaabbaabbbabaaa',
'aaaabbabbbbabbaaaaabbbba',
'aaabbaabaaaaabaababaabbaababaaaababaabababbbaaaababbabaa',
'babbabbabbaabbaaaaabbbbb',
'bbababbbaaaabaaaabbaababbbaabaabaababbbabbbbbbaabbbaababbbbbbaabaaaaabbbaabbbbabaabbbbba',
'aabbbabaaaaaabbbbbaabbaababbaaabaabaabbbaabaabbb',
'bababaababbbbbaaabbaabab',
'baaaaaababaaaaabbabbbbba',
'aaababbabaaaababbbabbbaabbbbaabb',
'bbabbbaabaaaababbaaaaaba',
'abbbbbaaaabbbbababbbaaba',
'bbbababbabbbaabbbbbbabaa',
'abbbbabaabababbbbabaabaabbbaabba',
'bbbbbbbaabbaabaabbbbaaaa',
'bbbbbaaabaabaaaabaababbb',
'abaaababbbbbbaaaaabbbaab',
'abaaaaabbbbaaaabaababbaa',
'baaaababbbabaabbaaabaaab',
'aaababbbaaabbaababaaaaaabbaaaabaaaaabbaa',
'bbabbaabbaaaababbbaababaaabbabba',
'abaaaaabbbbaaaabbaaabaab',
'ababbbaaabbabbabbabbaaab',
'baaabbbbaaabbaababaabbabababbabb',
'abbabbbbbbaaabbbbbaaaabb',
'baabbbaaabbbabbbbababbaabbbbbbbbabbaaaabbbaababbbaaaaabbbabaabbaaababbbbbabaaaba',
'aababbaabbbbbababbbbabbabbababbaabbaabbaaaaaaaab',
'bbbbaaabaaabababbbabbababbbaabab',
'bbaabababbaaabbbaaaababb',
'abbbaabbbaabbaabbaababba',
'aabababbbabbbbaabaaaaaabbbaabbabbabbabbb',
'babbbbbabbbbbbbaaaaaabaaababbbbaaaabbaaa',
'babaabbaaabbabababbbbbbb',
'bbbaabaaabaaaaabbabaaabbaabaabaa',
'babbababaabaababababaabaababaaab',
'bbaaaaababbabbabbbbbaabb',
'babbbabbabaaaabbabaabaaa',
'babbababbaabbaabbbaabaab',
'abbabaabbaaabaaaaabbbabbbbabbabaaababbbbbabaabba',
'bababbaabaabbbabbbabbbbb',
'babbbbbbbaaaaabbbbababaa',
'baaaaaababbabaabbaaaaaba',
'aabababbbbaababaabbaabaaaaaabaaabaababba',
'abaaababbaabbabbaaaaababaabbaabbabbaaaabbbbaababababaaba',
'bbbabbbababbbabbbbbaabaaaababbaababaaaaabaababaaabbaabababbaabab',
'aaababbbbbabaabaababbaab',
'bbbbaaabbbbabbbabbbbaaaa',
'bbbabbababaaababaaaababb',
'baabbbbbbbabaababababaabaabbaaaaaabbabaa',
'abbabbaaaaaabbbaababbbbb',
'bbaabbbbbaaabbbbbbbaabba',
'bbbaaaababbabbabbaababab',
'baaabbaababaabaaabbbabab',
'ababaaaaaabaaabbabaabbaa',
'aababaabbababbaababbababbbaabababaabbabababbabaaaaababaaaabbbaabaabaabaa',
'bbaababababbabbaababaaab',
'aaabababababbbbabbbaabab',
'aabaaaaabaaaaabbaaaaababaaabbaabbaabbbabbaababab',
'bbaaabaaaaabaabbabaaaaba',
'babbbbabbabbbbaaabbaaaaaabbaabbababababb',
'abbbbaabaaababbbbabbabbabbaabaaabbbbbbbbbaaaabaabbaaabab',
'abbaaaaaabbbbabbabaabbbbaaaabababbbbaaba',
'bababaaaababbbbaaaababbaababbaaababaaababababbbbaaabbbba',
'baaabbbbabaaaaabbbbbbbbb',
'bbbbbabbaaaabaabababbbbb',
'ababaaaaaaababbabaaaabba',
'abbbbaabbbaabbbabaaababa',
'abaaababbabababaaabaabaa',
'baaaababaaabaaabbaabaaab',
'abbbbabababbabbaaabbbabbaabaaabaaabababaabbbabab',
'babaaabaaabaabababbaaaab',
'bbabbabbbabbaabbaaaaaabababababbbaabababaaabaababbaabbab',
'abbaabbbbabaabaaaaababaa',
'bbaabbaaaaababbaabbbaabbbbabbabaaabbbababbaabbaaaabbbbaa',
'bbbbababbbbababbbbbabbaaaaaabaabbbbbaabb',
'babbabbbabbabbaaabbbbbaa',
'abababbbbbabbabbabbaaabb',
'bbaabbbabbbbababbbabbaaa',
'baabbabbbbbabbabbbabbbba',
'aabaababbabbbabbbababbbb',
'babbababbbabaababbbaabba',
'aaaabbababbbbaabbbabbabbbabaaabbbaababaabaababbb',
'abbbaabbabbbbbaababababb',
'abbaabaabbbabbaaababbabb',
'baabbabbbaabaaaaaaaaabba',
'bbaabababaaaaaabababaabaabaaaaabaabbbbbbabbbbaaa',
'babaabababbaaaababaababababbbaab',
'aaaaabbbbbabaabbbaababab',
'bbbbbaababbbbaabaaabbaba',
'abbabbaaababaabbbbbaabaabbababab',
'bbbabaabababbbabaaaababa',
'baaabbbababbaababbbbabba',
'aaaabbaabbaabbbabbbbaaaa',
'aabaaabbaabbaabbabbbbbab',
'bbbababbbababbaaabaaabba',
'abbbbbaaabbaaaaaabbaabba',
'babaaaababbbbababaaaabbb',
'baaabbbaaaababbabbbaaaaa',
'bbbababbababbaabbbabbbbb',
'aabbbbababaabbbaabaaaaaa',
'abaababbaaaaabaababbababababbbaaabaaaababbbaabbb',
'babaaaababbaabaabbbbaaaa',
'baabbabbabbbabbbaabaababbabaaaaa',
'babbbbbbabbbabbbaaabbabbaabababaaabaaaba',
'abbabbbaabbaabaabbaaaaaa',
'bbbabbaababbbbaabaaababb',
'abaabbabaababbaabbaaaabb',
'baabbabbbabbbabbabbbaaab',
'abbbbaabbababbaababaaaaaaababbaabbababaa',
'ababababbbbbabababaaaaaa',
'bbbaaaabbabbaabbbabbbabbbbababaa',
'bbbbbbbaabbabbbbbbbabbbb',
'baaaaaababbabbbabbbbbbbaaaaaaabbbaaababb',
'bbabbbababbaaabaaabbabaaabbabbbabbabbbaaababbbab',
'bbabbaabbbaaabbbabaaabbbabaabbaabbaaabba',
'abaaaaabbbaababbababbbabbbbabaabaabbaabbbbababbbababbaaaabaaabaabbaaabaa',
'bbabaabbaabbaabbaabaabbb',
'baabbaaabbabababbaababab',
'bbaababaaabbbaaababbbaba',
'babaaabaabaabaabaaabbaabbaaabbaabaabaaba',
'babaabbabaababaabbbaaaaa',
'bababbaaabababababaaaaba',
'aaaabbabbabbaababbaabbab',
'abbabababaaabbbaaaabaabbbbaabaabbababbbbbbbbaaabbaaababbabbbbaaabbaaabab',
'bababaabaaaabaaaabababbbabbaaaba',
'aabbbbabaabbaabbbbbabaabbaababbabbaaabababbbbbba',
'baabbabaaabbbbabbbaaabaa',
'bbbbbababababaabaaababaa',
'aabaabbaabaaaaabbbbbabababbababb',
'baabbabbaabbbbabbaaababa',
'aababbaabbaabababbaabaab',
'baababaabbbabbbaabaabaab',
'aaaaabaaaaaaaabaaabaaaab',
'abbabbabaabbabbbabaabbbabaababaababbbbbbaaabbaaaabaaabaa',
'aabbbbabbbaabababaababbb',
'aabaababbababaaaabbaabba',
'aabbaabbbabaabaabbabbbbb',
'bababaaaabbbbbaabbbaabbb',
'babbbaaababbbaaaaaaabbbb',
'aabbbabaabbbabaabbbaabbb',
'aaaabbaabbbbabbbbbabaabaabaaabaa',
'abbabbaaabbabbbaabbbaaba',
'ababaabbbbabababaaabbaaa',
'aaabababaaaaabaaaaaaabbbbbbbabababbaaabaabbbaaab',
'baaaababbaababaaabababaa',
'aaaabbaaabbbabbbbaaaabba',
'abaabbbbbaaaaaabaababbaaababbaabaabababa',
'abbabbbbababbbaabaabbaaabbbbbbaabbbbabaa',
'bbabbabbbbabaabbabbbaaab',
'aabbbababbbaaaabaabaabbb',
'bbbabaabbaaabbbbbaabaabb',
'ababaabaaaaaababaaabbaaa',
'baaaaaabbabbabbaabbbaaab',
'bbabaabaababaaaaabbabaaaabababba',
'aabbbaaaaaabbaabbbabbaabbaabaaaa',
'abaaabbbbbaaabbbbaaabbab',
'bbabbabbabaaabbbbabbbbbbabbbbbbaababaaaaabbbbbabaaababbabbbabaababaabbbbabbabbab',
'babaabaababababaaaabbbba',
'bbaabaaababbbbbbbaabaabb',
'baabbbabababaaaaaabbbbaabbbaabab',
'abbbaaaababaabbabaabbbabbabbaaabaaabbaababbbbaaa',
'abbbabaabaababaaabbaaaab',
'ababababaabbbbabbbbbbbabbbbabbbaaaaaaabbbaabbabaabaaaabb',
'abaaabbbabaabbababbaabaaaaaabbbaaaabbbba',
'baaaaabbababababbaaabbab',
'babaaabaaabbbaaabaaabbaa',
'babbbabbbabaabaabbbbbbbb',
'aabbbabbabaaababaaabbabb',
'bbaabbaaaaababbaaabbbaab',
'aabbbbabbbbabbbaaabaaaab',
'abaabbbaababababbabaaabbbabbbaba',
'abbaaaaabbabbbabbbaaabba',
'aabaababbaabbabbabbaabba',
'bbabbabbbabbbbaabaababba',
'bbabaabbbbabaabbbbbbaaaa',
'abbbbabaabbbaabbaaababbaabbbabbaaaaababb',
'bbaaabbbbabaabbaabbbbbbb',
'abaaaabababbaaababbbbbbaababbaab',
'abaabbbbababaaaabbbaaabb',
'aaabaabbaababbbbbbbaaaaaabbbaaba',
'aaaaababbaabbaabbabbabbb',
'aaaaaaabaabababbbbbaaaaa',
'bbbbbaaaababaaaaaaabbaba',
'ababbaaababbbaaaaaabbbba',
'babaabbbbbabababbaabaaab',
'aabbbababbbabaabaabbaaab',
'abbbabaaabbbaabbabbaabba',
'baabbaababaabbabaabaaaab',
'baabbabbaabaababbaababbb',
'bbbaaaabaabbbaaaaaaaaaaabaaabbbaabbaaaaaabbbaababaabababababbaabaaabbbab',
'baabbabaaaaabbaaabbbabba',
'babaaabbabbbaabbabbababa',
'bbabbabbaaababbbbbbaaabb',
'aaaaababbabababaaaaababa',
'babaabbbbbbbbbbababbbbbbbbbaaaabaababaaa',
'aaabababaababbaabaaababa',
'ababaabbbabaabaabbaaaaaa',
'aaaabaaaabbabaaababaabaabababaabbaabbbbbaabbbbba',
'baaaaaabbabaabaabbaababb',
'aaabababaaabababaabaabba',
'abbabaaaabbabbbbbbbbbabbaaaaabab',
'bababaaaaababbabbbbbbbbb',
'ababbaaabbbbababbaaaaaba',
'ababaaaabbbaabaabbaaabaa',
'baaabbaabbbaababbaabaaabaaaaabababaabaaabababaaa',
'aaabbaabbaabbabbbbbababbabaaaababaaabaab',
'bbbbbaaabbaabbaababababb',
'aabbbbabaaaaabbbbaabaabb',
'abbabbaaaabbaabaaaaababbabbabbbaabbbbbbaabbabaaababbaabaaabbabab',
'abbabbababbbbababbbaabaabbbaaababbbaaabb',
'bababbaaabaabbabababaaaaabbbabbbaaaaabbb',
'babbaabaaabbaabbbbaaabaa',
'ababbaaababababaabababbbbbaababaabbbbbbb',
'aababaabbbabbaabababababbbbabbbaaaabaaabaaabbabb',
'baabaaaabababaaaababbbbb',
'bbbbabbbabaaabbbbbbababa',
'bbabbbaaaabbbaaabaababbb',
'bbbabbabbaabbabbbaababbb',
'baabaabaaaaaababaabaaaab',
'aabaabbaabaabbbbaaaabaaabbaababbbbbababbbabbbababaaabaabbaabbaabababaaab',
'babbababbbbababbabbbbbaaaaabbbaa',
'bbaabbbaaabaaabbbaababba',
'bbabbbabbbbabbbabbbbaaababbabaaaababbaabaaabaabbabaaabaa',
'abbaabbbabbbbabbbaaabbaaaabaabba',
'baaaaabbbabaaabababaaabbbabababaaababaaabaaaabbaabbaaababababbbaabbbbaaa',
'babbbaaabaaabbbbbbababba',
'aabbbbabbaabaaaababbabbb',
'baabbbbababbbbbbbbbbaaba',
'baabbbabbbaabaaababbaabbabbbababbbabaaab',
'bbabbbababbabbbbababbaaabababbbbabaabbaa',
'aaabababbbbbababaabababbbbbabbbbbabbbaba',
'bbbbabbbbaabbbabbababaaabbbaaabaabbababb',
'ababbbbaababbbabbbababba',
'abbaaaaabaabaaaabbbbaaba',
'aaababababaabbabbbbbbaaaaaaababa',
'bbbabbbabaaabbbbbbabbaabbbbabaaa',
'bababaabbabbbabbaaabbbaa',
'abbbbabbaaaaabbbbababababbbbabbbaaaaabaaaabbaaaa',
'bbabbbaaaabaaabbaaaabbaabbabaaab',
'abbabaaaaaaaaaaaaaabbabb',
'babbbabbbbabaabaabaaaaba',
'babbaabaabaaabbbbbbbbbaa',
'ababbbbabbbbabbbbababaaaabbaaabbbbbaabba',
'aabaababababaabbbbbaaaaa',
'abbbbbaaabbbbabbaaaababa',
'aaabaaabaabbbaabaabababaaaabaaba',
'babbbabbbbaabaaabababbbbbabbababbaabaabb',
'babaabbbbbbabbabaaaabbbaabaaabaaaabaabba',
'bababaabbabaababbabbbabbbbbbababbabbaaaaaabbabaa',
'babaaaabaababaabbbbaabba',
'bbaabbbbbaaabbbaaabbbbabbbaaaaabbabbabbababbabaabaaabababbabbbba',
'baabbaabbbabbababbbabaaa',
'aaaaaaaaababbbababababbbbbabaaaabaaaaababaabbbbb',
'aaaabaaabaabbbbbbbabbbabbabbabaabbbbaaabaaaabbbbbabaabaa',
'aabaabababbbaabbbbabaabbbbaabababbabbabaaaabaabb',
'aabaababbbabaabababbbbab',
'bbaabbbabbbabbbabbabbbba',
'bbaaaaabaaaabbaaaaaaabba',
'bbaaaaabaababbaababbbabbabbabbaa',
'aaabaabbbabaabaaaaabbbabaabbbbbabbbaabaa',
'aaabbbaabbbbaaabababbbbbabbbbbbbbbbabbbaabbabbbbaaaaaababbbbabbaabbabbaaaababbbb',
'aababaabaabbababbababbba',
'babaaaaaaaaaaaabaabaabba',
'aaabbaabbabbaabbbaabbbbbaabbaaba',
'aaababbabbabbabbababbbbb',
'abaaabbbbbaabaaaabbaaaba',
'bbaababaababbbabaabbbaab',
'abbbaabbbaaabbbabaabbbbbaaaaaaabbaaaaabbbbbbabaaabbaaaba',
'babaaaabbabaaaaababbabaa',
'bbbbaaababbbbaabababbbbb',
'abbababbaabaababbbaaaaabaabaabbbbabbabaababababaaaaaabbababbabbbbabbaaaabbbbabaa',
'babaaababbabaaaabbaaaaba',
'bbabbabaabbbbababbbaaabb',
'bbaababaaaaabbbaaaabbaaa',
'babaaaaaaabaababbabbabbaabababbbaaabbbaaaabbbbbabbbbaaaa',
'babaabbababaaabbbaaaabbb',
'aabaababbabbbabababbbbaabaaabaaaaaabbababbbabaaaabaaaaabaaaababaaabbbaaabbaaabbb',
'abbbabaabbbaaaabaaabaabb',
'bbbbbbbaaaabababaabbbbbb',
'ababaaaabbababababbaaabb',
'abbabbabbabbaabbbaaaaabbaabababa',
'bbabbabaababbbabaaaababb',
'babbabbababaaabbabbaaaba',
'aabbaaababbaaabbbbaabaabbbbabbbaaabbbbababbbabbaaabaaaabaaaabaabaabbbaab',
'bbbbbbbaaabbbabbbbaaaabb',
'bbabbaabbbbaabaabbbaaaaa',
'bbbabaabbaabbaaabaaabaaabbbbbbbb',
'aaabababbaabbbbaaababbbb',
'abbbbbbbabaaaaaaabbbbababbababaa',
'bbbaaaabaabaaaaabbaabbab',
'bbbbabbbaaaababbaabaaaab',
'bbaaabbbababbbabbbbbabaa',
'aaaabbaaabaababbbbabbabbbbbbbaaaabbbbbba',
'aabbbabbaaaaabbbbaaabaab',
'abbabbbbbaaaaaabaaabbaaa',
'baaaabababbbbaabaababaaaabaaabbbbbbaaaababbababa',
'bbbbabbbbbbbabbbbabbabbb',
'abbabaaaaabbaabbabaaaaaa',
'abbabbaaaababbaaababaababbbaabbbabbaaaab',
'abbaabaaaaaaabaaaaabbbaa',
'bbbaaaabbaabaabaaabababa',
'bbbaababbbbabaaabbbabaabaabababa',
'baabaababbabababbbbaaaaa',
'baaaabababbaabbbbaabbbabbbbaabab',
'baabbbbaababbaaaabbaabbb',
'babbbbbbabbbbabbabbabbabaabaaabbaaabbbab',
'ababaabbbabbaabbabaababbbbbbbaba',
'baabbabbaaabababbaabaabb',
'ababababbbabbbabbbababaa',
'abbaababaabbbbbabbaaabbabbabaaab',
'babbbbaaababbbabbbababba',
'abababbbabaaababaabbbbbbbbabbbbbbaaaabbbaabaaababababbba',
'aabbaabbbabaabbbbabbbbab',
'baabbbbabbbbabbbbaaababa',
'aaababbbbbbabbaabbbaaabb',
'bbbaaababaabaaabaababbbabaaaaabaaaabbbaa',
'baaabaabbabbaaabbaaababa',
'bbabaabbaababaaaababbbbb',
'ababbbbababbabbababaabaaaaaaaaababababbbaabbbaab',
'bbbbbabaabbbaabbaaaaabba',
'aaabababbbabbaabbbaabaab',
'bbabbabbbabaabbabaababbb',
'aaaaaaababbabbabbabbabaa',
'abbabaaaaaaaaaaaababbbbb',
'babaababbaabbabbabbabbaabababbbaabaabbaa',
'aabbbbaaaababbbbabababbabbbababa',
'bbbabbaabbabaaaaaaabaaaa',
'bbabbabaabbaaaabbbaaaaaa',
'bbaabaaabbabaaaabbbbaabb',
'bbabbaababbabbaaabbbabbbababbaab',
'bbbbababbabbaabbaabbaaab',
'aaaabbababbabaaababbbbbbbbbbbababbbababbabbbaabaaaabbaba',
'abbbaaaababbbbbaaaabababababbaabaabbbbaabaabaabbbabababa',
'bbbbabbbbbbbabbbbbbbbbab',
'bbabababbbabaaaababababb',
'abbabaaaaaaabbbaaaabbbbb',
'baababaaabababbbbabbaaaa',
'bbabbabbbabbabbaabaaabba',
'aaabababbabaabbaaaabbbbb',
'abaaababbaabbbbaaaaabbaaaaaabaaabbabbbabbbabbbbb',
'bbaaabbbbbbababbabababba',
'bbbbaaabbbabbbabbabaaabbbabaabaaaaaaababbabababbbbbbabaababbabbb',
'babbbabbbaaabbabbbabaaabababbaba',
'bbbabbbbbbabbabbaababbbb',
'baaabaaabbaabbaabaaabbabbababbab',
'bbabaaaaabbabbaaabbabaab',
'abbaabaabaaaaabbbbbaabba',
'aabbbbbaaaabbbbaabaaabbbbbaaabbaaababbbaaabbbaababababbaaabbbaabbbabaaab',
'bbbabbbaabbbbababaaabbabaabaabbbbababbaaaaaaabbbaaabbbabaababbaabbaaabaaabababba',
'aaaaababbbbbbaaaabaababbabbbbabaaaabbaabaabaabbabbabbbbbaaaaabba',
'babbabbabaabbbababaaabaa',
'aabaaaaabbbbaaabababbaab',
'babaaabbbabaabbbaaabaaba',
'bababaaabbaabababbbbaabb',
'aabbbababbaabbbaabbababb',
'babaabaabbbbaabbaaaaabababaaababaababbabbabbabbaabbbbbaababbaabbaaaabaaa',
'aabbbbabaaababbabbaaaaaa',
'ababaabbabaababbbbbaaaaa',
'aaababbbbaabbbabbbabaabbaabbbabaabbaababaaabbaaa',
'bbbbaaabbbaabababaababbb',
'ababababaabababbbbababaa',
'baaabaaaabaaabbbabbbbbaababaaabaabaaaabaaabaabaaaaabaaaa',
'abaabbbabaaabaaaababbbababbbbbaaaabaabaa',
'bbaabaaabbbbbbbbbaaabaaababbbbbabababbaabaaaaaba',
'babbababaabaaaaaaabaabba',
'bbbabaaaabbaabbbaabaabbbaaabababaaababaabbbabaaabbbbaababaaaaaabbabbbaba',
'aabaaaaaaabbabbbaabbbbba',
'abbbbababbabaaaaaaaaaaaaaabbbaaababbabbabbbbabaa',
'aaababbabababaaaabbaabba',
'bbbbabababbabbbaabbbabab',
'aaababbbbaabaaaabbbaabbb',
'bbbaaaabaabaaabbbbaaabab',
'ababbbaabaabaabababbbbab',
'babaabababbabbbbbbbbabba',
'abbbabbbabaaabbaaaaaabbbabababbabaaaaaab',
'baaabbbbbababaababbbbbbb',
'aabbbaaaaabaaaaaabbababb',
'aaaaabaaabababababbbbaaa',
'ababaabbaaaabbababaaaaaa',
'bbbaaaabaaaabbaabaaabaab',
'baaabbbbbbbabbaaabbaaaaababbabbbbbbaabbbbbbabbbabbbaaaab',
'bbbbbaabaaaabbabaaaaaaaabbbabbbb',
'bbbaabaaaabbabbbabbaabaaaaabbbbbabbababbaabbbababbababab',
'bbabbabbbaabbaaaabbabbaaabbbabaababbabbaaaabbbab',
'baaabbbababbbabbaabaabbb',
'aaaabbaababababaaabbbbbb',
'abbbbbaabbbabaabbababbba',
'bbbbbbbababbaabbabaaabba',
'abbbaabbbabaababbbaaaaabaabbbbaa',
'babbaabaabbbbababaaabbab',
'baaabbbabaabbbbabbbbaaabaaabbabb',
'aabbbabbabbbbabbababaabababaabaabbaaabaabbbbbbbbaabababa',
'bbbaabaaababaaaabbaabbaaaabbbabaabababaa',
'bababbaababbababaabbabaa',
];
var validator = makeValidator(parseRules(day19input));
console.log([...day19input.filter( s => s.length > 0 && validator.isValid(0, s) === s.length )].length);

/*
--- Part Two ---
As you look over the list of messages, you realize your matching rules aren't quite right. To fix them, completely replace rules 8: 42 and 11: 42 31 with the following:

8: 42 | 42 8
11: 42 31 | 42 11 31
This small change has a big impact: now, the rules do contain loops, and the list of messages they could hypothetically match is infinite. You'll need to determine how these changes affect which messages are valid.

Fortunately, many of the rules are unaffected by this change; it might help to start by looking at which rules always match the same set of values and how those rules (especially rules 42 and 31) are used by the new versions of rules 8 and 11.

(Remember, you only need to handle the rules you have; building a solution that could handle any hypothetical combination of rules would be significantly more difficult.)

For example:

42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba
Without updating rules 8 and 11, these rules only match three messages: bbabbbbaabaabba, ababaaaaaabaaab, and ababaaaaabbbaba.

However, after updating rules 8 and 11, a total of 12 messages match:

bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba
After updating rules 8 and 11, how many messages completely match rule 0?
*/

var day19test2 = [
'42: 9 14 | 10 1',
'9: 14 27 | 1 26',
'10: 23 14 | 28 1',
'1: "a"',
'11: 42 31',
'5: 1 14 | 15 1',
'19: 14 1 | 14 14',
'12: 24 14 | 19 1',
'16: 15 1 | 14 14',
'31: 14 17 | 1 13',
'6: 14 14 | 1 14',
'2: 1 24 | 14 4',
'0: 8 11',
'13: 14 3 | 1 12',
'15: 1 | 14',
'17: 14 2 | 1 7',
'23: 25 1 | 22 14',
'28: 16 1',
'4: 1 1',
'20: 14 14 | 1 15',
'3: 5 14 | 16 1',
'27: 1 6 | 14 18',
'14: "b"',
'21: 14 1 | 1 14',
'25: 1 1 | 1 14',
'22: 14 14',
'8: 42',
'26: 14 22 | 1 20',
'18: 15 15',
'7: 14 5 | 1 21',
'24: 14 1',
'',
'abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa',
'bbabbbbaabaabba',
'babbbbaabbbbbabbbbbbaabaaabaaa',
'aaabbbbbbaaaabaababaabababbabaaabbababababaaa',
'bbbbbbbaaaabbbbaaabbabaaa',
'bbbababbbbaaaaaaaabbababaaababaabab',
'ababaaaaaabaaab',
'ababaaaaabbbaba',
'baabbaaaabbaaaababbaababb',
'abbbbabbbbaaaababbbbbbaaaababb',
'aaaaabbaabaaaaababaa',
'aaaabbaaaabbaaa',
'aaaabbaabbaaaaaaabbbabbbaaabbaabaaa',
'babaaabbbaaabaababbaabababaaab',
'aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba',
];
var testRules2 = parseRules(day19test2);
var testValidator2 = makeValidator(testRules2);
console.assert([...day19test2.filter( s => s.length > 0 && testValidator2.isValid(0, s) === s.length )].length === 3);

function expandRule(rule, rules, prefixSet) {
  if (prefixSet === undefined) {
    prefixSet = new Set();
    prefixSet.add('');
  }
  var result = new Set();
  if (typeof rule === "string") {
    for (var p of prefixSet) {
      result.add(p + rule);
    }
  } else if (typeof rule === "number") {
    var ruleObj = rules.get(rule);
    if (ruleObj === undefined) { return result; }
    return expandRule(ruleObj, rules, prefixSet);
  } else if (Array.prototype.isPrototypeOf(rule)) {
    if (rule.length === 0) {
      return prefixSet;
    }
    var expandHead = expandRule(rule[0], rules, prefixSet);
    return expandRule(rule.slice(1), rules, expandHead);
  } else if (Set.prototype.isPrototypeOf(rule)) {
    for (var choiceRule of rule) {
      for (var e of expandRule(choiceRule, rules, prefixSet)) {
        result.add(e);
      }
    }
  }
  return result;
}

// Add loop rules, and expand terminators for faster searching
// 8: 42 | 42 8
// 11: 42 31 | 42 11 31
function addLoopRules(rules) {
//   rules.set(8, parseRule('42 | 42 8'));
//   rules.set(11, parseRule('42 31 | 42 11 31'));
// expand a finite number of times. 
// 42 and 31 are 8 chars long & longest input is 89 chars => max 10 42s or 5 pairs of 42/31
  rules.set(8, parseRule('42 | 42 42 | 42 42 42 | 42 42 42 42 | 42 42 42 42 42 | 42 42 42 42 42 42 | 42 42 42 42 42 42 42 | 42 42 42 42 42 42 42 42 | 42 42 42 42 42 42 42 42 42'));
  rules.set(11, parseRule('42 31 | 42 42 31 31 | 42 42 42 31 31 31 | 42 42 42 42 31 31 31 31 | 42 42 42 42 42 31 31 31 31 31'));
  rules.set(42, expandRule(42, rules));
  rules.set(31, expandRule(31, rules));
  return rules;
}

function makeLoopValidator(rules) {
  return {
    /* returns Set of lengths of str that can match rule */
    validLengths: function(rule, str, prefixSet) {
      if (prefixSet === undefined) {
        prefixSet = new Set();
        prefixSet.add(0);
      }
      var result = new Set();
      if (typeof rule === "string") {
        for (var p of prefixSet) {
          if (str.substring(p, p + rule.length) === rule) {
            result.add(p + rule.length);
          }
        }
      }
      if (typeof rule === "number") {
        var ruleObj = rules.get(rule);
        if (ruleObj === undefined) { return result; }
        return this.validLengths(ruleObj, str, prefixSet);
      }
      if (Array.prototype.isPrototypeOf(rule)) {
        if (rule.length === 0) {
          return prefixSet;
        }
        var validHeads = this.validLengths(rule[0], str, prefixSet);
        for (var valid of this.validLengths(rule.slice(1), str, validHeads)) {
          result.add(valid);
        }
      }
      if (Set.prototype.isPrototypeOf(rule)) {
        for (var choiceRule of rule) {
          for (var valid of this.validLengths(choiceRule, str, prefixSet)) {
            result.add(valid);
          }
        }
      }
      return result;
    } // isValid
  } // obj
} // makeLoopValidator

var testLoopRules = addLoopRules(parseRules(day19test2));
var testLoopValidator = makeLoopValidator(testLoopRules);
console.assert([...day19test2.filter( s => s.length > 0 && testLoopValidator.validLengths(0, s).has(s.length) )].length === 12);

var loopRules = addLoopRules(parseRules(day19input));
var loopValidator = makeLoopValidator(loopRules);
console.log([...day19input.filter( s => s.length > 0 && loopValidator.validLengths(0, s).has(s.length) )].length);
