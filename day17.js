/*
--- Day 17: Conway Cubes ---
As your flight slowly drifts through the sky, the Elves at the Mythical Information Bureau at the North Pole contact you. They'd like some help debugging a malfunctioning experimental energy source aboard one of their super-secret imaging satellites.

The experimental energy source is based on cutting-edge technology: a set of Conway Cubes contained in a pocket dimension! When you hear it's having problems, you can't help but agree to take a look.

The pocket dimension contains an infinite 3-dimensional grid. At every integer 3-dimensional coordinate (x,y,z), there exists a single cube which is either active or inactive.

In the initial state of the pocket dimension, almost all cubes start inactive. The only exception to this is a small flat region of cubes (your puzzle input); the cubes in this region start in the specified active (#) or inactive (.) state.

The energy source then proceeds to boot up by executing six cycles.

Each cube only ever considers its neighbors: any of the 26 other cubes where any of their coordinates differ by at most 1. For example, given the cube at x=1,y=2,z=3, its neighbors include the cube at x=2,y=2,z=2, the cube at x=0,y=2,z=3, and so on.

During a cycle, all cubes simultaneously change their state according to the following rules:

If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.
The engineers responsible for this experimental energy source would like you to simulate the pocket dimension and determine what the configuration of cubes should be at the end of the six-cycle boot process.

For example, consider the following initial state:

.#.
..#
###
Even though the pocket dimension is 3-dimensional, this initial state represents a small 2-dimensional slice of it. (In particular, this initial state defines a 3x3x1 region of the 3-dimensional space.)

Simulating a few cycles from this initial state produces the following configurations, where the result of each cycle is shown layer-by-layer at each given z coordinate:

Before any cycles:

z=0
.#.
..#
###


After 1 cycle:

z=-1
#..
..#
.#.

z=0
#.#
.##
.#.

z=1
#..
..#
.#.


After 2 cycles:

z=-2
.....
.....
..#..
.....
.....

z=-1
..#..
.#..#
....#
.#...
.....

z=0
##...
##...
#....
....#
.###.

z=1
..#..
.#..#
....#
.#...
.....

z=2
.....
.....
..#..
.....
.....


After 3 cycles:

z=-2
.......
.......
..##...
..###..
.......
.......
.......

z=-1
..#....
...#...
#......
.....##
.#...#.
..#.#..
...#...

z=0
...#...
.......
#......
.......
.....##
.##.#..
...#...

z=1
..#....
...#...
#......
.....##
.#...#.
..#.#..
...#...

z=2
.......
.......
..##...
..###..
.......
.......
.......
After the full six-cycle boot process completes, 112 cubes are left in the active state.

Starting with your given initial configuration, simulate six cycles. How many cubes are left in the active state after the sixth cycle?
*/

function makeCube(input) {
  var t = 0;
  var current = [input];
  return {
    t,
    current,
    step: function() {
      var spikes = [];
      for (var z = 0; z < this.current.length + 2; z++) {
        var cols = [];
        for (var y = 0; y < this.current[0].length + 2; y++) {
          var rows = [];
          for (var x = 0; x < this.current[0][0].length + 2; x++) {
            rows.push(this.isNextActive(x, y, z) ? '#' : '.');
          } // x
          cols.push(rows);
        } // y
        spikes.push(cols);
      } // z
      this.t++;
      this.current = spikes;
    },
    isNextActive: function(nextX, nextY, nextZ) {
      var activeNeighbors = this.countActiveNeighbors(nextX - 1, nextY - 1, nextZ -1);
      return activeNeighbors === 3 || (activeNeighbors === 2 && this.isActive(nextX - 1, nextY - 1, nextZ -1));
    },
    isActive: function(x, y, z) {
      return 0 <= z && z < this.current.length &&
             0 <= y && y < this.current[0].length &&
             0 <= x && x < this.current[0][0].length &&
             this.current[z][y][x] === '#';
    },
    countActiveNeighbors: function(x, y, z) {
      var count = 0;
      for (var i = x-1; i <= x+1; i++) {
        for (var j = y-1; j <= y+1; j++) {
          for (var k = z-1; k <= z+1; k++) {
            if (i === x && j === y && k === z) {
              continue; // do not count self as neighbor
            }
            if (this.isActive(i, j, k)) {
              count++;
            }
            // optimization: 4+ neighbors are equally overcrowded
            if (count > 3) {
              return count;
            }
          } // k
        } // j
      } // i
      return count;
    },
    countActive: function() {
      return [...this.current.join('').matchAll(/#/g)].length;
    },
  }
}
var day17test = [
'.#.',
'..#',
'###',
];
var testCube = makeCube(day17test);
console.assert(testCube.isActive(1,0,0));
console.assert(testCube.countActive() === 5);
console.assert(testCube.countActiveNeighbors(0,0,0) === 1);
console.assert(testCube.countActiveNeighbors(2,0,0) === 2);
console.assert(testCube.countActiveNeighbors(0,1,0) === 3);
console.assert(testCube.countActiveNeighbors(1,1,0) > 3); // >3 as optimization

function stepAndCount(cube, steps=6) {
  for (var i = 0; i < steps; i++) {
    cube.step();
  }
  return cube.countActive();
}
console.assert(stepAndCount(testCube, 1) === 11);
console.assert(stepAndCount(testCube, 5) === 112);

var day17input = [
'.##..#.#',
'##.#...#',
'##.#.##.',
'..#..###',
'####.#..',
'...##..#',
'#.#####.',
'#.#.##.#',
];
console.log(stepAndCount(makeCube(day17input)));

/*
--- Part Two ---
For some reason, your simulated results don't match what the experimental energy source engineers expected. Apparently, the pocket dimension actually has four spatial dimensions, not three.

The pocket dimension contains an infinite 4-dimensional grid. At every integer 4-dimensional coordinate (x,y,z,w), there exists a single cube (really, a hypercube) which is still either active or inactive.

Each cube only ever considers its neighbors: any of the 80 other cubes where any of their coordinates differ by at most 1. For example, given the cube at x=1,y=2,z=3,w=4, its neighbors include the cube at x=2,y=2,z=3,w=3, the cube at x=0,y=2,z=3,w=4, and so on.

The initial state of the pocket dimension still consists of a small flat region of cubes. Furthermore, the same rules for cycle updating still apply: during each cycle, consider the number of active neighbors of each cube.

For example, consider the same initial state as in the example above. Even though the pocket dimension is 4-dimensional, this initial state represents a small 2-dimensional slice of it. (In particular, this initial state defines a 3x3x1x1 region of the 4-dimensional space.)

Simulating a few cycles from this initial state produces the following configurations, where the result of each cycle is shown layer-by-layer at each given z and w coordinate:

Before any cycles:

z=0, w=0
.#.
..#
###


After 1 cycle:

z=-1, w=-1
#..
..#
.#.

z=0, w=-1
#..
..#
.#.

z=1, w=-1
#..
..#
.#.

z=-1, w=0
#..
..#
.#.

z=0, w=0
#.#
.##
.#.

z=1, w=0
#..
..#
.#.

z=-1, w=1
#..
..#
.#.

z=0, w=1
#..
..#
.#.

z=1, w=1
#..
..#
.#.


After 2 cycles:

z=-2, w=-2
.....
.....
..#..
.....
.....

z=-1, w=-2
.....
.....
.....
.....
.....

z=0, w=-2
###..
##.##
#...#
.#..#
.###.

z=1, w=-2
.....
.....
.....
.....
.....

z=2, w=-2
.....
.....
..#..
.....
.....

z=-2, w=-1
.....
.....
.....
.....
.....

z=-1, w=-1
.....
.....
.....
.....
.....

z=0, w=-1
.....
.....
.....
.....
.....

z=1, w=-1
.....
.....
.....
.....
.....

z=2, w=-1
.....
.....
.....
.....
.....

z=-2, w=0
###..
##.##
#...#
.#..#
.###.

z=-1, w=0
.....
.....
.....
.....
.....

z=0, w=0
.....
.....
.....
.....
.....

z=1, w=0
.....
.....
.....
.....
.....

z=2, w=0
###..
##.##
#...#
.#..#
.###.

z=-2, w=1
.....
.....
.....
.....
.....

z=-1, w=1
.....
.....
.....
.....
.....

z=0, w=1
.....
.....
.....
.....
.....

z=1, w=1
.....
.....
.....
.....
.....

z=2, w=1
.....
.....
.....
.....
.....

z=-2, w=2
.....
.....
..#..
.....
.....

z=-1, w=2
.....
.....
.....
.....
.....

z=0, w=2
###..
##.##
#...#
.#..#
.###.

z=1, w=2
.....
.....
.....
.....
.....

z=2, w=2
.....
.....
..#..
.....
.....
After the full six-cycle boot process completes, 848 cubes are left in the active state.

Starting with your given initial configuration, simulate six cycles in a 4-dimensional space. How many cubes are left in the active state after the sixth cycle?
*/
function makeCube2(input) {
  var t = 0;
  var current = [[input.map(line => line.split(''))]];
  return {
    t,
    current,
    step: function() {
      var times = [];
      for (var w = 0; w < this.current.length + 2; w++) {
        var spikes = [];
        for (var z = 0; z < this.current[0].length + 2; z++) {
          var cols = [];
          for (var y = 0; y < this.current[0][0].length + 2; y++) {
            var rows = [];
            for (var x = 0; x < this.current[0][0][0].length + 2; x++) {
              rows.push(this.isNextActive(x, y, z, w) ? '#' : '.');
            } // x
            cols.push(rows);
          } // y
          spikes.push(cols);
        } // z
        times.push(spikes);
      } // w
      this.t++;
      this.current = times;
    },
    isNextActive: function(nextX, nextY, nextZ, nextW) {
      var activeNeighbors = this.countActiveNeighbors(nextX - 1, nextY - 1, nextZ - 1, nextW - 1);
      return activeNeighbors === 3 || (activeNeighbors === 2 && this.isActive(nextX - 1, nextY - 1, nextZ - 1, nextW - 1));
    },
    isActive: function(x, y, z, w) {
      return 0 <= w && w < this.current.length &&
             0 <= z && z < this.current[0].length &&
             0 <= y && y < this.current[0][0].length &&
             0 <= x && x < this.current[0][0][0].length &&
             this.current[w][z][y][x] === '#';
    },
    countActiveNeighbors: function(x, y, z, w) {
      var count = 0;
      for (var i = x-1; i <= x+1; i++) {
        for (var j = y-1; j <= y+1; j++) {
          for (var k = z-1; k <= z+1; k++) {
            for (var l = w-1; l <= w+1; l++) {
              if (i === x && j === y && k === z && l === w) {
                continue; // do not count self as neighbor
              }
              if (this.isActive(i, j, k, l)) {
                count++;
              }
              // optimization: 4+ neighbors are equally overcrowded
              if (count > 3) {
                return count;
              }
            } // l
          } // k
        } // j
      } // i
      return count;
    },
    countActive: function() {
      return [...this.printCurrent().matchAll(/#/g)].length;
    },
    printCurrent: function() {
      return '\n'+this.current.map(l => l.map( c=> c.map( r=> r.join('') ).join('\n') ).join('\n\n')).join('\nwWwWwWwWw\n');
    },
  }
}
var testCube2 = makeCube2(day17test);
console.assert(testCube2.isActive(1,0,0,0));
console.assert(testCube2.countActive() === 5);
console.assert(testCube2.countActiveNeighbors(0,0,0,0) === 1);
console.assert(testCube2.countActiveNeighbors(2,0,0,0) === 2);
console.assert(testCube2.countActiveNeighbors(0,1,0,0) === 3);
console.assert(testCube2.countActiveNeighbors(1,1,0,0) > 3); // >3 as optimization
console.assert(stepAndCount(testCube2, 1) === 29);
console.assert(stepAndCount(testCube2, 5) === 848);

console.log(stepAndCount(makeCube2(day17input)));
