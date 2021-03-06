/*
https://adventofcode.com/2020/day/1
--- Day 1: Report Repair ---
After saving Christmas five years in a row, you've decided to take a vacation at a nice resort on a tropical island. Surely, Christmas will go on without you.

The tropical island has its own currency and is entirely cash-only. The gold coins used there have a little picture of a starfish; the locals just call them stars. None of the currency exchanges seem to have heard of them, but somehow, you'll need to find fifty of these coins by the time you arrive so you can pay the deposit on your room.

To save your vacation, you need to get all fifty stars by December 25th.

Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

Before you leave, the Elves in accounting just need you to fix your expense report (your puzzle input); apparently, something isn't quite adding up.

Specifically, they need you to find the two entries that sum to 2020 and then multiply those two numbers together.

For example, suppose your expense report contained the following:

1721
979
366
299
675
1456
In this list, the two entries that sum to 2020 are 1721 and 299. Multiplying them together produces 1721 * 299 = 514579, so the correct answer is 514579.

Of course, your expense report is much larger. Find the two entries that sum to 2020; what do you get if you multiply them together?
https://adventofcode.com/2020/day/1/input
*/

const day01input = [
1962,
1577,
1750,
1836,
1762,
1691,
1726,
1588,
1370,
1043,
1307,
1552,
1813,
1804,
1765,
1893,
1610,
764,
1512,
1404,
1711,
1000,
1694,
1546,
1880,
1721,
2006,
1787,
1510,
1850,
1420,
1712,
1926,
1707,
1983,
1680,
1436,
389,
1448,
1875,
1333,
1733,
1935,
1794,
1337,
1863,
1769,
1635,
1499,
1807,
1326,
1989,
1705,
1673,
1829,
1684,
1716,
456,
1696,
1398,
1942,
1851,
1690,
1328,
1356,
1775,
1564,
1466,
1273,
1896,
766,
1814,
1810,
1537,
1463,
1755,
1341,
1665,
1520,
1366,
1387,
1976,
1717,
1737,
1551,
1760,
1496,
1664,
1450,
1319,
1674,
1630,
1301,
1330,
1658,
1637,
1655,
1439,
1832,
1948,
1339,
1656,
1449,
1296,
1489,
1758,
1939,
1857,
1402,
1394,
1882,
1446,
1412,
1430,
1212,
1377,
1501,
1873,
1812,
1667,
1560,
1654,
1575,
1999,
1581,
1792,
1299,
1843,
1383,
1351,
1297,
1822,
1801,
1977,
1316,
1477,
1980,
1693,
1220,
1554,
1607,
1903,
1669,
1593,
1955,
1286,
1909,
1280,
1854,
2005,
1820,
1803,
1763,
1660,
1410,
1974,
1808,
1816,
1723,
1936,
1423,
1818,
1800,
1294,
857,
496,
1248,
1670,
1993,
1929,
1966,
1381,
1259,
1285,
1797,
1644,
1919,
1267,
1509,
399,
1300,
1662,
1556,
1747,
1517,
1972,
1729,
1506,
1544,
1957,
1930,
1956,
1753,
1284,
1389,
1689,
1709,
1627,
1770,
847,
];

function multiply2020(input) {
  var s = new Set();
  for (var i = 0; i < input.length; i++) {
    var first = input[i];
    var second = 2020 - first;
    if (s.has(first)) {
      return first * second;
    }
    s.add(second);
  }
  return s;
}

console.assert(multiply2020([1721,979,366,299,675,1456]) === 514579);

console.log(multiply2020(day01input));

/*
--- Part Two ---
The Elves in accounting are thankful for your help; one of them even offers you a starfish coin they had left over from a past vacation. They offer you a second one if you can find three numbers in your expense report that meet the same criteria.

Using the above example again, the three entries that sum to 2020 are 979, 366, and 675. Multiplying them together produces the answer, 241861950.

In your expense report, what is the product of the three entries that sum to 2020?
*/

function tri2020(input) {
  var m = new Map();
  for (var i = 0; i < input.length; i++) {
    var first = input[i];
    var second, third;
    if (m.has(first)) {
      [second, third] = m.get(first);
      return first * second * third;
    }
    for (var j = i + 1; j < input.length; j++) {
      second = input[j];
      third = 2020 - (first + second);
      m.set(third, [first, second]);
    }
  }
  return m;
}

console.assert(tri2020([1721,979,366,299,675,1456]) === 241861950);
console.log(tri2020(day01input));
