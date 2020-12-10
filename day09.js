/*
--- Day 9: Encoding Error ---
With your neighbor happily enjoying their video game, you turn your attention to an open data port on the little screen in the seat in front of you.

Though the port is non-standard, you manage to connect it to your computer through the clever use of several paperclips. Upon connection, the port outputs a series of numbers (your puzzle input).

The data appears to be encrypted with the eXchange-Masking Addition System (XMAS) which, conveniently for you, is an old cypher with an important weakness.

XMAS starts by transmitting a preamble of 25 numbers. After that, each number you receive should be the sum of any two of the 25 immediately previous numbers. The two numbers will have different values, and there might be more than one such pair.

For example, suppose your preamble consists of the numbers 1 through 25 in a random order. To be valid, the next number must be the sum of two of those numbers:

26 would be a valid next number, as it could be 1 plus 25 (or many other pairs, like 2 and 24).
49 would be a valid next number, as it is the sum of 24 and 25.
100 would not be valid; no two of the previous 25 numbers sum to 100.
50 would also not be valid; although 25 appears in the previous 25 numbers, the two numbers in the pair must be different.
Suppose the 26th number is 45, and the first number (no longer an option, as it is more than 25 numbers ago) was 20. Now, for the next number to be valid, there needs to be some pair of numbers among 1-19, 21-25, or 45 that add up to it:

26 would still be a valid next number, as 1 and 25 are still within the previous 25 numbers.
65 would not be valid, as no two of the available numbers sum to it.
64 and 66 would both be valid, as they are the result of 19+45 and 21+45 respectively.
Here is a larger example which only considers the previous 5 numbers (and has a preamble of length 5):

35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576
In this example, after the 5-number preamble, almost every number is the sum of two of the previous 5 numbers; the only number that does not follow this rule is 127.

The first step of attacking the weakness in the XMAS data is to find the first number in the list (after the preamble) which is not the sum of two of the 25 numbers before it. What is the first number that does not have this property?
*/
var day09test = [
35,
20,
15,
25,
47,
40,
62,
55,
65,
95,
102,
117,
150,
182,
127,
219,
299,
277,
309,
576,
];
function get2sumSet(i, preambleSize, input) {
  var result = new Set();
  if (i < 1) {
    return result;
  }
  for (var j = Math.max(0, i - preambleSize); j < i; j++) {
    result.add(input[i] + input[j]);
  }
  return result;
}
function not2sum(preambleSize, input) {
  var sets = [];
  for (var i = 0; i < preambleSize; i++) {
    sets[i] = get2sumSet(i, preambleSize, input);
  }
  for (var i = preambleSize; i < input.length; i++) {
    if (sets.find( sums => sums.has(input[i]) ) === undefined) {
      return input[i];
    }
    sets[i % preambleSize] = get2sumSet(i, preambleSize, input);
  }
}
console.assert(not2sum(5, day09test) === 127);

var day09input = [
16,
45,
42,
47,
31,
38,
4,
7,
44,
10,
18,
24,
48,
28,
19,
23,
32,
1,
37,
9,
36,
8,
41,
49,
13,
15,
11,
27,
5,
6,
12,
45,
14,
7,
34,
10,
21,
50,
29,
16,
17,
18,
19,
20,
31,
52,
22,
23,
26,
42,
13,
24,
28,
46,
25,
30,
58,
27,
53,
49,
35,
91,
47,
54,
74,
51,
98,
55,
33,
40,
59,
36,
76,
37,
38,
100,
52,
107,
57,
60,
67,
81,
62,
68,
69,
73,
117,
132,
70,
71,
143,
77,
74,
105,
122,
75,
88,
196,
89,
145,
114,
146,
155,
119,
127,
142,
148,
130,
137,
160,
237,
141,
207,
147,
229,
219,
152,
162,
365,
163,
164,
253,
288,
203,
233,
241,
246,
269,
249,
257,
267,
271,
278,
284,
325,
423,
293,
299,
309,
549,
314,
526,
326,
512,
396,
653,
436,
444,
449,
562,
575,
495,
506,
634,
524,
566,
804,
952,
583,
758,
613,
763,
608,
623,
640,
762,
1145,
722,
1305,
1010,
1263,
939,
1019,
955,
1370,
1001,
1191,
1768,
1090,
1107,
1149,
1853,
1223,
1196,
1221,
1231,
1248,
1772,
1362,
1723,
1907,
2311,
2109,
1894,
1940,
1956,
2187,
2419,
2091,
2960,
2150,
3046,
5379,
2321,
2355,
2469,
3142,
2427,
2417,
4373,
2479,
2610,
3085,
3471,
3630,
3801,
3834,
3850,
3896,
4031,
4047,
5233,
4836,
6277,
4471,
8269,
8101,
8502,
7556,
4772,
6365,
4906,
6510,
4896,
5564,
11282,
6240,
6556,
7367,
10541,
7635,
8305,
7897,
12148,
8078,
14443,
11598,
22521,
11146,
12541,
12120,
9802,
9668,
9678,
10336,
12531,
10460,
11136,
11452,
11804,
12796,
13607,
13923,
21242,
15713,
17699,
16202,
15975,
17746,
28882,
19346,
25515,
19470,
21922,
23572,
20004,
19480,
20014,
22264,
32142,
21596,
26403,
22940,
44995,
24600,
26719,
27530,
29898,
31688,
36206,
32177,
35455,
46417,
37760,
38816,
49912,
38950,
39474,
39484,
49975,
62414,
56777,
41610,
54441,
44536,
47540,
53122,
49659,
86618,
51319,
54249,
57428,
61586,
63865,
67632,
88027,
73215,
136277,
76576,
97199,
78424,
78434,
100662,
224304,
111405,
86146,
142923,
96051,
126337,
92076,
98859,
100978,
118114,
125060,
105568,
134004,
223682,
131497,
137080,
140847,
223226,
173877,
156858,
155000,
164570,
197644,
186808,
212067,
178222,
182197,
194910,
188127,
221111,
193054,
256557,
259064,
289630,
239572,
298622,
324551,
309719,
467852,
268577,
277927,
328877,
348054,
464735,
343666,
319570,
392554,
360419,
394264,
366349,
370324,
383037,
555329,
381181,
432626,
710015,
496129,
498636,
559142,
517499,
664971,
546504,
578296,
743456,
588147,
721431,
1086783,
663236,
685919,
679989,
689894,
726768,
730743,
1401420,
736673,
751505,
813807,
877310,
879817,
1598741,
1013628,
1353130,
1329801,
1452174,
2325509,
1211475,
1124800,
3046940,
1268136,
1251383,
1343225,
1393979,
1349155,
1365908,
1740396,
2215227,
1457511,
2145446,
1631322,
1488178,
1565312,
1691117,
2207111,
2392936,
2138428,
2281764,
2817979,
2336275,
2582311,
2376183,
2462858,
3179295,
2519519,
3573019,
3644319,
2831403,
2715063,
2806666,
2823419,
2945689,
3633624,
3850447,
4720739,
3053490,
4319581,
3256429,
3829545,
4657947,
5326185,
4420192,
5949202,
5641398,
4799133,
4839041,
4895702,
4982377,
5234582,
7630536,
5630085,
7150984,
5538482,
6652964,
5752355,
8725247,
5999179,
6309919,
10419371,
6883035,
11579287,
7085974,
7676621,
9470943,
13986540,
9219325,
9259233,
9878079,
9694835,
16418550,
9734743,
18420082,
12283049,
12652143,
11290837,
11168567,
11537661,
11751534,
12062274,
22346978,
17847580,
16004754,
21911376,
13969009,
14559656,
14762595,
16305299,
16895946,
18478558,
18914160,
32883169,
31646119,
19429578,
36325524,
26824869,
24345323,
22706228,
33637815,
22459404,
36407597,
22920101,
23289195,
37265884,
45626329,
39107918,
57586476,
37682696,
28528665,
28731604,
29322251,
31067894,
33201245,
45379505,
48161182,
38343738,
42349679,
41888982,
42718773,
66839060,
45165632,
57260269,
67838909,
45748599,
46209296,
51448766,
71247438,
51817860,
57850916,
58053855,
62523496,
61729910,
99412606,
61932849,
99979042,
60390145,
88467372,
71544983,
81062511,
103618892,
80232720,
84238661,
84607755,
87884405,
106599441,
133274893,
91957895,
97197365,
104060212,
142165569,
113972262,
109668776,
109871715,
115904771,
149614315,
122120055,
153890744,
122322994,
131935128,
140622865,
144628806,
164471381,
151777703,
161295231,
236586701,
172492160,
188298873,
286794375,
194483846,
189155260,
236295256,
353626641,
206866141,
301918096,
231991770,
219540491,
292400568,
225776486,
238227765,
244443049,
254258122,
274100697,
262945859,
355779077,
309100187,
332927679,
313072934,
480966838,
333787391,
425450516,
360791033,
493660516,
383639106,
552468170,
396021401,
432642627,
426406632,
438857911,
445316977,
889681917,
499877183,
464004251,
470219535,
482670814,
498701171,
517203981,
537046556,
572046046,
622173121,
948489571,
646860325,
673863967,
890410883,
694578424,
744430139,
968920706,
1391290464,
779660507,
1139377102,
822428033,
982363533,
865264543,
902862162,
909321228,
934223786,
998578354,
946675065,
1159219677,
981371985,
1015905152,
1089250027,
1512584004,
1728150078,
1556181553,
1712838916,
1537271208,
1368442391,
1474238931,
1439008563,
1524090646,
1602088540,
2292244511,
1644925050,
1687692576,
1725290195,
1907899582,
2804144727,
2881026395,
2420913996,
1880898851,
3633189777,
1928047050,
2105155179,
2457692418,
2539995798,
3833305257,
5435393797,
2089807806,
2924623944,
3119163981,
3076327471,
3013367441,
7540548976,
2963099209,
3568591427,
3970706657,
4658292491,
4108606572,
4420894649,
3830445374,
3808945901,
3986054030,
4033202229,
4017854856,
6132531422,
4194962985,
4385739468,
4562847597,
4547500224,
6581958868,
5014431750,
6984074098,
5052907015,
8251340023,
5976466650,
7399106909,
6531690636,
6772045110,
6793544583,
7377537328,
7639391275,
8194685369,
11594069894,
7794999931,
7816499404,
7826800757,
10726653621,
18971607222,
15194036732,
8580702453,
9438646483,
8933239692,
15979809362,
9561931974,
21775995600,
10990898400,
11029373665,
12847906946,
14171081911,
25161980311,
13303735746,
13325235219,
13565589693,
14432935858,
15016928603,
15455890679,
17388732731,
15611499335,
15621800688,
21717552021,
31156198504,
19000578457,
34593407910,
24913049054,
17513942145,
18371886175,
22258474911,
24354608884,
40776574057,
24316133619,
25423834258,
27736671604,
26151642692,
33433514315,
26628970965,
26869325439,
26890824912,
27998525551,
29888826537,
36514520602,
49127800350,
31233300023,
33125441480,
33135742833,
44383267584,
67729150743,
41868551029,
42937776403,
35885828320,
39772417056,
40630361086,
57788123199,
49739967877,
50467776311,
51185459058,
78823604723,
62776653232,
52780613657,
53498296404,
57862270988,
92065576753,
58124124935,
57887352088,
136710956811,
64358741503,
90240193367,
82875710710,
66261184313,
102245538572,
75658245376,
89512384933,
86353604631,
80402778142,
155026152229,
110642884645,
131588237200,
100207744188,
100925426935,
101653235369,
110667965745,
106278910061,
110904738592,
148102464355,
166756382773,
115749623076,
133545597464,
259007202947,
144761519645,
168506722885,
185121249282,
149136895023,
141919429689,
146663962455,
202578662304,
156061023518,
197258343223,
210850628833,
180610522330,
211112482780,
322817406291,
217183648653,
201133171123,
211593392680,
207932145430,
303537253284,
222028533137,
244450336056,
332933271729,
329882768927,
249295220540,
275465027153,
286680949334,
334258144305,
288583392144,
455562818836,
410510807734,
349851575119,
302724985973,
403711833427,
336671545848,
377868865553,
699094199878,
492648675806,
640208799132,
562145976487,
412726563803,
409065316553,
508709482471,
579002280437,
737099011862,
466478869193,
1261240176365,
618466161071,
1034565099273,
524760247693,
933825564246,
575264341478,
925115916597,
864870962460,
711790302526,
639396531821,
706436819400,
898817522335,
1355565172933,
714540411401,
1223854447571,
821791880356,
1331349831653,
875544185746,
879205432996,
1033469730164,
917774799024,
1084945030264,
991239116886,
1143226408764,
1041743210671,
1333006572472,
1100024589171,
1811814891697,
1164156779514,
1214660873299,
1287054644004,
1345833351221,
1353936943222,
1697336066102,
2002719829288,
1909013915910,
1536332291757,
1906736910620,
1590084597147,
3252570261841,
1700997313352,
1796980232020,
1754749618742,
2184969619435,
1951244529188,
2141767799842,
2032982327557,
2091263706057,
2205899990185,
3610011229262,
2264181368685,
2314685462470,
4112636900805,
3703717142640,
3472024263439,
2640991587226,
2699770294443,
3150917175242,
3126416888904,
3539052121045,
3291081910499,
3497977545372,
3344834215889,
3387064829167,
3455746932094,
5561255758450,
3551729850762,
3787731946299,
3984226856745,
5654961671828,
7313728371902,
4124246033614,
4297163696242,
4470081358870,
7771958803044,
7135144031987,
8906089974339,
9126985935267,
6180043708271,
5767408476130,
5340761881669,
5826187183347,
9100307879495,
14441069761164,
6635916126388,
8727826710836,
6731899045056,
6842811761261,
6938794679929,
8021811209632,
7339461797061,
7535956707507,
7911977979913,
9779207705442,
8421409729856,
8594327392484,
8767245055112,
11809543155931,
15119969587111,
11520805589940,
12006230891618,
20621113469435,
17118669502503,
11108170357799,
11166949065016,
14378768468768,
15736224005883,
13367815171444,
13478727887649,
14071360842117,
15933789189545,
14182273558322,
13781606441190,
14278256476990,
14875418504568,
15251439776974,
15447934687420,
16333387709769,
20946156770458,
22628975947739,
17361572447596,
20288050645052,
22687754654956,
32466962360398,
30404748551886,
22275119422815,
24475985529243,
25179531199916,
35996791119183,
24534764236460,
26846543059093,
31185228966519,
27439176013561,
27260334328839,
27852967283307,
27963879999512,
28657024945758,
28059862918180,
47914897047818,
30126858281542,
30699374464394,
38608507132584,
33694960157365,
70543872995557,
49121662481908,
37649623092648,
42563170067867,
49714295436376,
52026074259009,
58759237382574,
54106877387932,
49010749765703,
51381307295553,
51795098565299,
79286408587848,
101036824024712,
57387192610381,
54699510342400,
97367744515158,
];
var part1 = not2sum(25, day09input);
console.log(part1);

/*
--- Part Two ---
The final step in breaking the XMAS encryption relies on the invalid number you just found: you must find a contiguous set of at least two numbers in your list which sum to the invalid number from step 1.

Again consider the above example:

35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576
In this list, adding up all of the numbers from 15 through 40 produces the invalid number from step 1, 127. (Of course, the contiguous set of numbers in your actual list might be much longer.)

To find the encryption weakness, add together the smallest and largest number in this contiguous range; in this example, these are 15 and 47, producing 62.

What is the encryption weakness in your XMAS-encrypted list of numbers?
*/
function rangeSum(target, input) {
  for (var i = input.indexOf(target) - 1; i>1; i--) {
    var sum = input[i];
    // console.log('reset', sum);
    for (var j = i - 1; j>0; j--) {
      sum += input[j];
      // console.log(input[j], sum);
      if (sum === target) {
        var range = input.slice(j, i+1);
        // console.log(range);
        return Math.min(...range) + Math.max(...range);
      }
      if (sum > target) {
        break;
      }
    }
  }
}
console.assert(rangeSum(127, day09test) === 62);

console.log(rangeSum(part1, day09input));
