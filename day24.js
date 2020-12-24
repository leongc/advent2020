/*
--- Day 24: Lobby Layout ---
Your raft makes it to the tropical island; it turns out that the small crab was an excellent navigator. You make your way to the resort.

As you enter the lobby, you discover a small problem: the floor is being renovated. You can't even reach the check-in desk until they've finished installing the new tile floor.

The tiles are all hexagonal; they need to be arranged in a hex grid with a very specific color pattern. Not in the mood to wait, you offer to help figure out the pattern.

The tiles are all white on one side and black on the other. They start with the white side facing up. The lobby is large enough to fit whatever pattern might need to appear there.

A member of the renovation crew gives you a list of the tiles that need to be flipped over (your puzzle input). Each line in the list identifies a single tile that needs to be flipped by giving a series of steps starting from a reference tile in the very center of the room. (Every line starts from the same reference tile.)

Because the tiles are hexagonal, every tile has six neighbors: east, southeast, southwest, west, northwest, and northeast. These directions are given in your list, respectively, as e, se, sw, w, nw, and ne. A tile is identified by a series of these directions with no delimiters; for example, esenee identifies the tile you land on if you start at the reference tile and then move one tile east, one tile southeast, one tile northeast, and one tile east.

Each time a tile is identified, it flips from white to black or from black to white. Tiles might be flipped more than once. For example, a line like esew flips a tile immediately adjacent to the reference tile, and a line like nwwswee flips the reference tile itself.

Here is a larger example:
*/
var day24test = [
'sesenwnenenewseeswwswswwnenewsewsw',
'neeenesenwnwwswnenewnwwsewnenwseswesw',
'seswneswswsenwwnwse',
'nwnwneseeswswnenewneswwnewseswneseene',
'swweswneswnenwsewnwneneseenw',
'eesenwseswswnenwswnwnwsewwnwsene',
'sewnenenenesenwsewnenwwwse',
'wenwwweseeeweswwwnwwe',
'wsweesenenewnwwnwsenewsenwwsesesenwne',
'neeswseenwwswnwswswnw',
'nenwswwsewswnenenewsenwsenwnesesenew',
'enewnwewneswsewnwswenweswnenwsenwsw',
'sweneswneswneneenwnewenewwneswswnese',
'swwesenesewenwneswnwwneseswwne',
'enesenwswwswneneswsenwnewswseenwsese',
'wnwnesenesenenwwnenwsewesewsesesew',
'nenewswnwewswnenesenwnesewesw',
'eneswnwswnwsenenwnwnwwseeswneewsenese',
'neswnwewnwnwseenwseesewsenwsweewe',
'wseweeenwnesenwwwswnew',
];
/*
In the above example, 10 tiles are flipped once (to black), and 5 more are flipped twice (to black, then back to white). After all of these instructions have been followed, a total of 10 tiles are black.

Go through the renovation crew's list and determine which tiles they need to flip. After all of the instructions have been followed, how many tiles are left with the black side up?
*/
function parseLine(line) {
  var result = [];
  for (var i = 0; i < line.length; i++) {
    switch (line[i]) {
      case 'e':
      case 'w':
        result.push(line[i]); break;
      case 'n':
      case 's':
        result.push(line[i] + line[++i]); break;
    }
  }
  return result;
}
console.assert(parseLine('esenee').join() === ['e','se','ne','e'].join());

// Row 3 odd       [30w, 30e][31w, 31e][32w, 32e]
// Row 2 even [20w, 20e][21w, 21e][22w, 22e]
// Row 1 odd       [10w, 10e][11w, 11e][12w, 12e]
// Row 0 even [00w, 00e][01w, 01e][02w, 02e]
// Row-1 odd       [10w, 10e][11w, 11e][12w, 12e]
// Row-2 even [20w, 20e][21w, 21e][22w, 22e]
function getTile(path) {
  var [x, y] = [0, 0];
  for (var step of path) {
    switch (step) {
      case 'w': x--; break;
      case 'e': x++; break;
      case 'nw': y++; if (y%2 !== 0) { x--; } break;
      case 'ne': y++; if (y%2 === 0) { x++; } break;
      case 'sw': y--; if (y%2 !== 0) { x--; } break;
      case 'se': y--; if (y%2 === 0) { x++; } break;
      default: console.log('Unexpected step: ', step);
    }
  }
  return [x, y].join();
}
console.assert(getTile(parseLine('esew')) === [0, -1].join());
console.assert(getTile(parseLine('nwwswee')) === [0, 0].join());

function getBlackTiles(input) {
  var blackTiles = new Set();
  for (const line of input) {
    var tile = getTile(parseLine(line));
    if (blackTiles.has(tile)) {
      blackTiles.delete(tile);
    } else {
      blackTiles.add(tile);
    }
  }
  return blackTiles;
}
console.assert(getBlackTiles(day24test).size === 10);

var day24input = [
'seesweseseeeeeeeeeenweeee',
'wswneseseseswseswseseseseswsesesesesese',
'senwnesenenesenwseseswnwnwwnewnenwnew',
'neseeseseseseseseseseseenwseseeseswe',
'neswnweweeeeeeweese',
'nenenwnenwnenenenenenenenenenenesenwne',
'sesesesesenesesesesenwseseseseseewee',
'eeeeesesweeweseeeeneeeeenw',
'neswwnesenenenenenwenenenenesenesenenwne',
'wseseeseenwsesesesesesesesesesesesese',
'newneeneeseenweenenee',
'eeeneeeeneneneneneswneeneenewenw',
'nwewwnwwwwnwwwwwswnwwnwwewnww',
'wnwswswwsewnenwnwnweneswnwseenenwnwwnw',
'enwnwseswnenenwnwnwnwnwnenwnwnenwnwnwnwnw',
'swsesenewnwsenewseneswswswseseswswsesw',
'seseswseseneeenwwseeseseswse',
'sweeeeneneweeeeeeeneeseee',
'newwwswwnwsewwsewsww',
'wwswsweneswewseswswswswnwnesweswnesw',
'neneneneeenewnwnewsweeneeseeneese',
'swwwswswsewseseswseswenesewseseene',
'nweeesewwwsweseee',
'wwnwwnwnesenwsenwnwsenwwnwwnwnwswsenene',
'esesenwseswnwwseneeseenwswswswswsesese',
'wswswswswswnwswnweswnwswnwswswseswswese',
'swswnwneswswswswswswsweswswswswnewswswsw',
'seneseeswswnwswseswseseseseswswsenesew',
'swseseseseseseseeswsesesesenwsesese',
'seswswseseswswenenwswseswseseswnwsewnwse',
'seswsesesesesesesewseneseneswseseseswsese',
'sesenewnenenewneneneneenenenenenenwnene',
'wnenwenwneswsewsesenwwewwswwswe',
'swwseswswswswneseswseseswneswswsesesewse',
'nesenenenwneneeswnewneneswnenenenenenene',
'esesewseeneseneseweenwnwneseeswewe',
'nwsewwnwnwnwnwnesesenww',
'nwnwnwnenewnenwnwnwnwnwsenwwnwnwnwenwnw',
'seenenewneeneneneneneneeewneneew',
'wseswwswswswswswswswnwswswwwneswewww',
'wsenwwnwseenwwwwwwwwwnwwwww',
'eenweeeeeeweswsweeene',
'newnwseseeeseeewenesewweseeee',
'neeseseeeswseeneswweeeseeseeee',
'seseeeseeseeeseeseeesesenwseesw',
'nweswseseeenenesesweesewsesesenw',
'seswnwnwneseneneswwnenenwewnesesesenwnw',
'nwneeeneneneneenenewsweneeeeswne',
'neswsenwwnwneswnwneswswneswenwnenwnw',
'swnwnenwwnewswwnwnwswwnwewwwnwnw',
'nenenwnenenenewneneneneseneneweenww',
'seneneneneneeneswnenenweewnenene',
'eeesenweweneeeseese',
'eneneeesewnenewenewnewseseneee',
'nenenewsenenenwwnenwneseneenenenwnesee',
'wswsewwwwwwnwwneswwswwwewwwsw',
'wswswswwswwwswwwewswswwseswnew',
'seenwwseseseseesesenwsesesesesesesewne',
'wswsenwwesewnwnwwnenesenwwseewnenww',
'senwwsenwswseseswswnwswneswswswswswsenwe',
'swneseseeseeeeesewnweeeeesee',
'seeseeweeseseseeeseeseseeenee',
'eseswneseseseseswwsesesenesesewse',
'eeneeewneeeeeenweeeeseenese',
'eeseswenwnwesewnwnwese',
'seswswwswswswswswswswswswswenwseseswsw',
'enwwnwewwnwswneswnwwnwnww',
'nwwnwenwnwwnwwnwnweenwnwwsenwnwnwnw',
'senwnesewwwnwwswsesesenwsenwwenwnwne',
'eswswswswwneseswseswswswseeswnesesewsww',
'wwwwwwwnwnwwwwwnesenwnwsenwwww',
'nwnwwenewnwnenenwnwnenwsenw',
'wwwwwnwwwwsewwsewnewwnwewww',
'wwnwwwnwwwwwwweswwwwwww',
'nwwwwwwnwwwswnwwwesewnwnwwew',
'wseweswswswswneswswsw',
'nwneswneenenenwwnweneneneneneeesesene',
'nwwwnwnwnwsenenwwnwnwswnwwwnenwnwse',
'ewwsenwwnwenwenwewwneswwsenwwsw',
'esesenwswswseseswsenesesewswseseseswse',
'nenwnwnenwnwneswnenwsweneseenenenenenwnw',
'sewwewwwwwwwwswwwwnewwsw',
'swswswswswswswswswswswswswswswneswww',
'swseseswnwewwswseeswnesweswseswwswswsw',
'wnwneseswenweneswswweneeseneenenw',
'wswseseenwsesenwseseewnesesesesesese',
'eseseewwnwsweneswnwswswwswsesewswesw',
'neeneneeswneswswwenwwwseneneneene',
'neneswnwsenwswnenwnenwnwnwswnw',
'neeenweeeneeneeesweeneeeene',
'nweeeeeeeeneeeneweenweeswsesw',
'swwwnwswweswnwwwewnewwwseswwwsw',
'seseseseseswsesesesesenese',
'eswneswneewswnwswswswewnweeswwse',
'seswseswswsenwneswnwseswswswseswnwnesesesw',
'eeweeswneenweeeneneeeneswseene',
'nenwnwswnwnwenwnwenenwwnwswnenwnenwnwnw',
'enwseeneneeeeweswneneenewnee',
'enewsewwwwneewwwswswwnwwew',
'eesweenwnwnwseeesenwseswneseseseswe',
'weseneseeseewnwwswnwneswswsenesewnw',
'nwnwsenwnewwwnwsenwnwnwwnww',
'nwnewnesweneneneneneswnenenwnenwenwenwnw',
'eswswwwswswnwswswswswwswenewswsww',
'neeneenenenwswnewwsweswswneneenene',
'nwseswenwnwsenwenwwswesewsesweesw',
'nwnweeswswnwnwswewnwnenwnwswenenew',
'swseenweswnesenwswwnwnwwnwnenwswsenenw',
'eeeeeneseesewesenwnweneeneenee',
'seseseseenweseeseseeswseseeseseenese',
'senwwwswswswswswwswswwswswenwswwswsw',
'eeneeneneeeneneneeeesenewneeneew',
'wnwnwwnwswsweeseswswswswswwwwswe',
'sesesesenewseeseseseseseseesesesewse',
'nenwnwenwnwneswnwnenwenww',
'nwswswswsewwneswswwwswneenewswwwwsw',
'eswenwsweeswswnwnwenwewewswnene',
'neesweneseeeeeneeeseeeeswnwesw',
'seseeneeweeweeeeseeeewee',
'nwnwnwnwnwnwnwnwnwnwnenwsenwnwnwnwnw',
'nenwnwwnwnwnenenwnenwnenenenwseswnenwnwnwse',
'wwnesenwneneeneeseneewswnwneneeese',
'senwnwnenenwneswnwnenweswweweneseswse',
'nwnwnwwnwnwswnwswnwwnenwnwnwwenenwwnw',
'eswnenenewnenenenesenenenwseewnenwnwsw',
'wsenenwwwwnwnwwwnwwnwnwwnwnwww',
'seswseswsenwswswseseswseneswsese',
'swswswswswswswneswwswnwseseswswswswswsesw',
'enwneswswswswnenenenenenenenwneenenene',
'wsesewswwwwwwwnwnwwwswwweww',
'enwwwsewwwsewwnwnwnwwwnenwww',
'eeeeeneswsweeeeeeeeenwee',
'nwwnewnwwswewnwnwnwnwsenwwnwsenwse',
'nwnwsewwwnwwnwseenwswswenwenenwnwwnw',
'seswswswswseswswseswswswneneswswswswswswsww',
'wswnwseswewwwswwwswswswwwswwww',
'wwnwwnwwwwsenwswenwe',
'seseseseswseseswnesesw',
'swswswswswseswneewnwswswswswsw',
'seswneesewseneewswseswwnewsenesesewnw',
'nwswwenwnwswneneesenewnwswnenw',
'seeswswswswswswwswswswswwneenwswswe',
'wswwseswnenwwseswneneeswsesweseene',
'eseseeneewseseseewseseeseeseesese',
'senwnwnwnwswswwneneenwnwnenwsenenwswnese',
'wnewswnwesewwneswsewswwsewwswnw',
'sewnwnwseseeewnwesenwwswnwwwsenwww',
'swenenwswnwnenwseswnwnwnenwnwnenwnwnesew',
'wswenewwwwnwnwenesweswweswseswsw',
'eseseeeswwnesesesesesewnweenweseswne',
'nwnwnwnwnwnwenwnwnwnwwnwnwnwnwwswew',
'eenwweneeeeeneneeeesweeesee',
'newsewwwwwwwwwwswwwnewwwew',
'wsewnewwwwewswswnwwnwwwneww',
'nenenwneseneenwsewneneswneewwnwnwnw',
'nenenenenenenenenwswnwseneneewnwne',
'newnenwnwneneenenenwnenw',
'swseseseneseswswswswswnwswswswwseswswseese',
'sewwwnewnwwwwenewwnwwwswwwnwse',
'weswseseseseeseseseseswseseseesewwsw',
'swesenenesweseeswneseeswnwseesesee',
'wswwneneseeeneeeseseseneswsenwswwne',
'wenewseswsenwnenenwnewnewsesenwnew',
'swswsweswswswswswswswswswnwswswwswswe',
'seenwseswswenwwsesenwseneswenw',
'nwswswswswswseswswnwseneswsesweswwsesw',
'nwseswseswsenwnesesesweenewnwswwswse',
'swswswseswsewnweswsesesesee',
'eeneenesenenwseeneneneneneneneswnenw',
'swweswsewswnwswwswwswswswswswswswsw',
'swswseswseswswswswswsene',
'enewswwsesesewnweeneeswwswesene',
'seeeeeseweseenweseseseseesenese',
'swwswnwneswnesenwnenesenesene',
'seeseneswwswewnwseeeeesenenwwnene',
'nesesenwswswnwswnwnewnwwsenenewe',
'neewneeseeeweseeswenwseseeeee',
'nenesewneseneneneewwnenenenwwe',
'swnenwnenwnwnwnwnenwnwnenwnwnenwswnwnwe',
'wswneswseewseneswswenwseswnwswneswwsw',
'neneeeeneeneneenweseneeeneneneew',
'seneswwwwwsesenwwnewnenwenwnwew',
'enwwnwnwnwwwnwwwwsenw',
'wnewwwwnewwsewwwwsewwsweww',
'nwwwnwsenwnwnwwwwnwwwnwewwnwww',
'swswwswswseseswwswwswneswnwswswwwswe',
'nwenenesweswneenesenwenw',
'eenwenesweeneweneeweneseeswsee',
'enwneneneeswnwnewneseeeeswnwewee',
'neneewnenewwnenenesenenesenene',
'nwnenwnwenwnwsenwnwnwnenwnewnenwseewnw',
'ewwsewwswewwnwneeseneswwsweewne',
'wwnwwnenwswnwwnwnwnwnwwnw',
'nwnwswnwnwnweswenwnwswnwnwenwwnwnenw',
'swwnewnwwnwswseswwsweewewwwswwsw',
'seswswswsewswseseswswneswswswwseneswwne',
'seseesesesenesesesweseseswesewnwenwe',
'swenenwnwnenwneneneneswnenenenwnenwnw',
'nesewnewsewnewenwswsenwneeneswnwswsee',
'nenwsenwnenwseseswnenenwwnwnwnwswnenene',
'seswwwwswwswnwwsw',
'eeeesweeseseneseeeenenwsesesew',
'nwseseseswseswseseseseseeseweseneseswne',
'neneseswenewswenwswswneseswnwwswnwene',
'nwnwnwwwewwnwnwnwnewnwwswnwwwsww',
'swwwwswwswswsewneswwswswswswwww',
'wwswnwwswswswnwswswswswswwwswwwese',
'nwnwnwwnwswnwnwnwnwwnwnweenwnwnwnwnwnwnw',
'nenwnenenenwnwnwnenenwswnwnwenwnwnwne',
'seneneneneneneneneenenenweesweneenenwne',
'senwenwenwsenwnwnwwnewnenwnwsenenenw',
'esenweesesesenwsenesweneeesewswnw',
'neneenewneeeneeneneneneneneneeswnee',
'senwwwneseseseneesesewseseseseeesew',
'nwwnenwnwnwwnwsewesewwwnwnwwsww',
'seseseseseswsesenese',
'neseenenwweswnwnewwsenenwnwwnenenw',
'nwwwwwwwwwnwnwwwsesewnwwwnw',
'nweeeeeeeneeswesewsesewneese',
'nwnwenwwseeneeswswwnwnenenesenenwnwswne',
'swsesenwesesenweeeeeseseseesweesese',
'swswswwsenwswwsweswswswswwwswswswswsw',
'swswnwseseseseswseeseseesenwneseseese',
'nwnwwsewnwnwwnwnwnwnwwwwnw',
'nwswswwswswsweswswswwswwswsewswwnw',
'swnwwseewswnwwswswwsw',
'nwwnweweseswsewneneswnwswsesenenenwsw',
'nwneeswneneeeswwswnenweneneneneene',
'nwnwnenwnenenewnwenesenwnwnenenwnwnew',
'seseseseseswwseseseseneswsesesw',
'nenenwneneewnenenwnenwswnwwsenwnwenew',
'eneneneseneeneneswseenwnenewswswenenwnw',
'newwswwswwseswenwwwnwnewsenwneew',
'nwwwnwswnwnwwsenwnwnenwswnwenwnwnwenw',
'neeneeneseseeneeeneewewewewe',
'swsweseswseneswsenesenenwswene',
'wswneeswseseneeesenweseeesesesesesee',
'nenwnenwnwnwnwnwneeswnenwnwnwnwsw',
'swswneswnwnweswnwswwswnweswsweswee',
'nenenenwnenwnwnenenenwswnwnwnwnenenwsee',
'wswseseneswwwswwswnwswswswswswswwswsw',
'newnwsesesesewseeneseesesenesewswnw',
'senwnwwwswnwnwnenwnwnwwnwnwnwnwnwwnenwnw',
'nenwnenenenwnwnwnewenwnwsenwnwnenwnww',
'nwnwwwwwwnwwsewnenwwwsewsewww',
'nwnwwnwwwnwwswwnwwwenwnw',
'swwnwswnwnwnwnenwewseswnwswwneneww',
'sewseseseeeseewnwneeweesenesese',
'swswwneswnwswswswswwswneswswsewswwwse',
'neswswwseswswswseeswswneswwswneseswsw',
'swseswseseeswsesesesesenewsewseswseswswse',
'seeenweeeseeeeenwsesenwnwseee',
'esesewseswswswswseswseswswnwnwseswsene',
'wwwnwwwnwwwnwnwnwnwnenwnwsesenwnwwnw',
'swswsewswseswneswswswseeseswswseswswsw',
'newseeseeeseseeneeeeseeeewe',
'neswneswwenwesweneenenesenenweeesw',
'neeeneneneneeeeweneneneeeswnene',
'eseseswseseseseseneseeneseswenwwsese',
'neneneneneeneneenwneneneneeneneswswenw',
'senwnewnweneeneswseneswwenenewnene',
'neseeewneenesesewsenwswsenwswsenese',
'nwswnenwnwnwwenwsesenwwsewnwenese',
'swswwswneswwswswwswswswwenwswwwsw',
'nwneneneneneeneneswneeswnenenenenenenenene',
'neseswswswseseneswseseswswseswswswswsenwse',
'neswnenenesweswswnenenwneneenwsenwnene',
'swseseseswswwswswwweneswneesewwne',
'enwnwnwnwnwnwnwwenwswnwwnwwnwenwnwnw',
'wwwswwswwwwwswweswwswwwee',
'seneeeneeneneneswneswnwenwnenwnwswswse',
'nwnwnwnwnwnwwnwnwnwnenwnenwenwnwnwswnwnw',
'wwseneneseneswnwneeneneswne',
'nwwenewswnwsewswswewnwnwnenwwnwwwe',
'sesesesenwseswsesenesesesesesesesesesese',
'swenweseeeeesesenweseeseneseswsee',
'swenwswseneswwseswenwneswswwswnwswe',
'wswnwwwwwwwwwnwwewswwwwwwe',
'eseseweneeseeeswseeeseeeseenese',
'swneswnesweeewnweswnwswnenwswswswsww',
'nwnwnwseswnwewnwnw',
'neneswnweeeeneeeneneewneneneenene',
'eseseweseswsenwswesesenwsesewesenewsw',
'sesesesesewnenwwswsesesweswsesewee',
'swsewswseeswnwswseswswswswswswswswswesw',
'sewnwnwswnwwnwnwnwneswnwnenwnwnwewnwnw',
'wnwswnenenenenwneneenene',
'nwwneswswneenwnwenwnwnenwnwnenenenwnenw',
'newswswwsweenwnesenwnwsenesweeswsw',
'nwnwnwnwnwnwnwnwnwnwsenwnwnwnwsenwnwnwnw',
'nwnwwnwseenwnwwnwnwnwnwwnwnwnwwww',
'wwnwseeeneenweswswwenenesewsesenw',
'swswsesesenwseeswswswsesenwswseseseseswsw',
'wwswwwnesenewwwwswwwwnwneww',
'seseseswnwswswswswseswswswseneswnwsesw',
'weswwswwwewwenwswwwwwnwwnwww',
'eeeeeneweeeneeeeewseewee',
'seseseswneseseseneneneseseseswwsewsesw',
'neneneneneneneneneeeneneneswneewseenw',
'wnenwnwwswwnwnwewwwwnwnwswwwww',
'swenwnwnwnenwnwnenwnenwnwnenwnwnwnwnwne',
'eeenesweeeenweneeneweseeeswne',
'ewnweeeswwseneneene',
'neneswneneneneneneswnwenenenwnw',
'sewwwwenwnenwwwwwsewwwwnwse',
'wwwsesesewwnesenenwnewnwwsewwsewne',
'swswwwnewwswwswwswnewwwwwswsww',
'seseneweweswneneswseeeeswwenwnwne',
'eseseseesesweswseseseseeseneeeenw',
'neneneeeenewnenenenenwneswneneneneenene',
'nwewewwwsenewswsewswsenenewswwsene',
'neneneswnenwnwneneeeneneneeneswnenene',
'enenenwnwnwnwnwswnenwnwnwnwnenenenenwnw',
'wnewswwwswswswwswswswswswwww',
'swswswswneswswsweswnwswswswswswneseswsw',
'eeeeeeeeenweeeesw',
'seseswseseswsesesesesewsesene',
'wwwwnewswnwsenwwwwsewnewwwww',
'newsenenenenesenwenwneneneneenewnenesw',
'swswswswswswswswnweswswnesenwswswswswsesw',
'newnenenenenenenwesenenewswswnesene',
'wswnwnwnwnwseswenwseeenwnw',
'eewseseseeseseseneseeeneewsewe',
'nenenenenenenesenwenwenewnenenenwnenesw',
'wsenwsewnwwwenweseswnwnenewnwswwnw',
'seswenwswswswswswnwswswswswswswswswsesw',
'nwwnwwnwwnwnwwwswnwnwwenw',
'neenenenenenwenwwnenwnwnenewnenenene',
'eeeeneeneenwnewseeeneeeseene',
'esenwwnwsenwnwnwnwnwnwnenwnenwnwnwnwswnw',
'eeeseeseeeseeseeseeesesewsesenew',
'wweeswnewwnwsewnwwwwwwseewsw',
'seswwwwewwnwewswwswenwwwnene',
'eseeeseseseewseseeseeeesenesese',
'eenwesenwweeneswwnewneeeesenee',
'eeeneeneneswseneenenenenw',
'seseseswswseswseswesenwweswneswseswse',
'nwsewneenenwnenenenenenwnenenenewnenene',
'nwnenwnwnwnwnenwnwnwswswswnwnwnwnwnwnwe',
'neswnwnwnwenewwwnewwnwswswesenwwne',
'nwsewnwwnwnwwsenenenenwnwswwnwswnwnww',
'eeeeeeweeeseeseneeeenweene',
'seswswwswwwwwwswneswswswwnwswwwsw',
'nwnwnwnwwnwnwnwnwnenwnweswnwnwnwnwnwne',
'swweswswswswswwswswswswswwswwnweswwsw',
'nesweewnwswnenwnwnenenwnenwseeswnene',
'neseseseeeeeeswsesewseeneeeesese',
'swnwswseswneswswswswswswswswswwswseswsese',
'swwwenwnwnwwnwsenwwnwnewnwwwwnwnww',
'senwseseseesesesesesesesesese',
'senwnwnwnesewnweenwwnenenwswswnwswnenwnw',
'enenweenwnwweseesweeseseeesw',
'swseswwswenwwswsweswswswsweswweswsw',
'nenwnenenenewseswnesenwnwwneweeneese',
'esesesesesewseneseseseseseseswsesesese',
'wewnwnewsewwwwwswswwwwseenwew',
'nweeenwswsenwnewwewwnwswnwwnwnww',
'sewnwwnwwnwnesenewnenesenwnwseeenwne',
'enenewseeeeeneeeenene',
'eeeeeneeneeesenweeeeneeeesw',
'neeswwseewwneewswswnenwwswwwww',
'wswwswwwseswswwswswneww',
'nwnwnwwnenenesesesenwnwwwnwsewnwnwwnw',
'swneneenwswenwnwweswwwwnweesewse',
'nwnwnwnenwnwnwnenwnwnwnwnenwnwwnwesenenw',
'wswneswswwswswwneewwnwnwweseewne',
'swnenwsenwnwnenwnesenwnwnwnwnwnwnwnwnwnw',
'esweswsweeseeseswenwseenwenwnwnwwne',
'neswseeeeswsesenw',
'swnwswnwsesweswseswsweseswswswswswswsww',
'neswneweneneenwenweeswswnwweee',
'enwswnwenwnewswwnwnwnwnwesewnwnwesw',
'swswseswswswseseseseseseseswswswseweswne',
'eneesenweeeeeneeeenwneeswnenee',
'neneneneneenenwnenwnenenewsenenenenewne',
'neneseeswneneeneenenewneneenenenenw',
'seeswseseswseseeeenwenwseseeesenwee',
'nwnwswwnwneenwnwswsesenwnwseseeeswnw',
'nwesewnenwewseeneneeeewneeswenee',
'swseswseswswewenwswswneswswswnwnwseswse',
'eenweesesweeeseeweeseeeseeee',
'nenenenwnwnenenenewneneeswnenenenenenenw',
'sweesesenweseeeseeseeee',
'nwsenewenwnwnenenenenw',
'eneeweseneeeeeeeeeesweseese',
'nwnwnwwnwnenwnwwnwnwnwnwnwwsesewwnwnw',
'neswswswswseswswswswweswwswswsw',
'nwnenwewsenwnenwnwnwnwnwwnwnenwnwnwnwnwnw',
'seneesewsenesesesesesesesesesewsewsese',
'nenenweeneneenewwseeeenewseswnenene',
'nesesenwseeseseewneseseseewswseee',
'swwswswswswswwwwsweswswnwsww',
'sesewseseseseseesesesesewseesesesesese',
'swnwswwswwwsewseswwwneswwswwsww',
'seswswnewswswswswswswseswseeseseseseswsw',
'eeenwesesenwseseesesewweeseesee',
'swswswswswswswwswneswswseseswewswswsw',
'senwwnwnwnwnwnenwnwnwnwnwnwnwsenwnwwswenw',
'nweesweeeneeneeeneneeeewnenene',
'enwwwnwnwwnwnwwnwwnwnesenwsww',
'swseseneeeweesenwseeenewesewnenew',
'neesesesewseseesesese',
'esesenwseseswseesesesesesesesese',
'swswswswswneseseswswseseswswsenwswswsesww',
'ewwsesesewesenwnenw',
'wswwnwwnwwnenwnwnwsenwwwewnwnwnwnwnw',
'neseseeseweseseseseseesewseseesee',
'eeeneesenwesewnwsweweeeeenesw',
'neneeneeneeneeeeeeneewesenesw',
'eeneneeneneeneewneneseneneneenenwe',
'wnwnenenwnwnwsenenwnwnwnwnwneseewnwnw',
'sweswswswswswswwswnwswswswswsw',
'swneswwswwwswwswwwswswwswsw',
'wneewswneswswswseswwwnwwwwswswsenw',
'wneseneeeeneeeeeeeewneesww',
'swneseenesesweswseseneseseeenwsesese',
'nenwnwnesenenwnenwnwsenenwnenenwnwnenenwnw',
'eneneswneneneeeneene',
'neenewnenwnwnenenenwneswnenwnenenwnwnenw',
'wwwewwwwwwwsewwwnwwwwww',
'eeeeeewsesweeeeeeeenenwesw',
'wnwswwsewwswnesenesenewwwswwwesww',
'nesenwwwswwwsew',
'wnwnwneswneswnwnwnwnwnwnenwsenwnwnwesenw',
'nwneseenwwnenwnenenewnw',
'eseseeeesweeneeseeweeeseeese',
'swswseswseseseseseseswsesenewswswsenesesw',
'nwenenenenwneenenesweeeseseneneswnenww',
'wwsenesenwnenenweneneswnenwsenwwswe',
'nenenenesenenenenenenwwnenesweeneenenw',
'neswsenewnenenenewneeneseneenewnwneesw',
'swsweswswseswseswswswswseswsweswww',
'wnewwewwseswwwwwwwsenenwwsew',
'seswswnewswwwnewwweswwswwswswwsw',
'wnesweenenenwnwesewsweweeeswnw',
'wnwnwwswnwnenwwwnwnwwnwenwnwwnwnwnw',
'neswswseswwswswnwwsewseswnewwswswswsw',
'neesenwwseneswnwwese',
'wnwnwnwswnwwswnewwnwnewnwnwswnwenww',
'nwnenwswnwnenesweneneswnwneeswswnwnee',
'sesesenwseseseseseseswseseesesesesesewse',
'wwwwswewwwwnewwseswswswwswww',
'nenenwneswnwnenwnwnenenenw',
'eswwwnwnenwwwwwewswwwswnwwnew',
'wnwswwsweswswnwnwswseweswswswsweswww',
'swswswswswneswswswneswswswswswswswseswsww',
'wnwnwnwwwnwnwsenwewnwsenewnwnewsw',
'seesesesenwseswseswswsesenwseseswseswse',
'eneswsewesenwwneswwswseswswswwswswsw',
'seswnwenwsesewnwesesesesesweenenwe',
'eswseeweeswwsenwesenweeewnwe',
'seswnwnwewnwnwnwswnwenwnw',
'swwnwwswwwswwswsewswwwwwweswne',
'enwnwnwnewnwnwwnewwswwnwswsenewswsw',
'nenwnenenwnwnwnenewenenwewenwwswse',
'swewswwwswnewnwswnwseswwwswwwswsw',
'eeeeeseeewswswswnenwnweeneneene',
'nwswswswswswewseswswenwseswsweseswswne',
'neeeswneneneneneeneneneswnenwneeene',
'neenenenwnenenesweneseneeesewneseew',
'nwenenenenenwnesenesewnenenenenenewne',
'weseswwneesenewwsenwnwwsweswwsw',
'nwnwswwnewnwnwnwwwsenwwwswwneww',
'nwnwsenwnenenwnenwneenwnwswnewnwnenw',
'nenwneseswnwswwswwwnweseesesewnwsene',
'swswswswswswwsweswwswswwnwswswneswse',
'seswsenwsesweseseseseswseseseswseswswse',
'seswseseseseseseseseeseseswsenwswsesese',
'wwnenwwnwnwwwnwwwwnwnwwwwwse',
'seesesewsesesenwesese',
'swnenwwnwswsesweswnwnenesewswewwse',
'seseseswsewwwesesenwsesesweneswenw',
'senwnwnwwnwnwwnwnwswesenwnwwnwwnwe',
'wnwwwwwwwwnwwewwwwwwew',
'neeeneeenesenweeeeneneneeee',
'swwwseeeneenweeneeeenwseswnwswse',
'wwnwwswswswewseswswwswwswwnwwe',
'wswneeeeneewnwneneseseseeewwew',
'seseeseeswswseesewsenwesesenwse',
'swseneseseseseswswwesesenwswswseseswnese',
'wwnewwnwwswwnwwwnw',
'nwneswnwswswswswswseewswswswswswswesw',
'seeneseneseseweswwwsesenwwneseesee',
'wnwsenesesesesesesesenwseseseswsesese',
'sewwwwewswwwwwsewwwnwnw',
'wswswsewneeswswswswswswwswwswwwswsww',
'eeenenwwneneneneneweweneewneswnee',
'nwwnwsenwwwswwwwnwnwwnwnwnwnwnewnw',
'swswswswseswswswneswswswseswswswswswswnwsw',
'sewnenenenwnenenenenenenenenenenesenwnene',
'swnweswnwnwsenwnenenwswnwswweeeswenw',
'wnenenwneenwseswnwwswnwswwwswwnwne',
];
console.log(getBlackTiles(day24input).size);

/*
--- Part Two ---
The tile floor in the lobby is meant to be a living art exhibit. Every day, the tiles are all flipped according to the following rules:

Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.
Here, tiles immediately adjacent means the six tiles directly touching the tile in question.

The rules are applied simultaneously to every tile; put another way, it is first determined which tiles need to be flipped, then they are all flipped at the same time.

In the above example, the number of black tiles that are facing up after the given number of days has passed is as follows:

Day 1: 15
Day 2: 12
Day 3: 25
Day 4: 14
Day 5: 23
Day 6: 28
Day 7: 41
Day 8: 37
Day 9: 49
Day 10: 37

Day 20: 132
Day 30: 259
Day 40: 406
Day 50: 566
Day 60: 788
Day 70: 1106
Day 80: 1373
Day 90: 1844
Day 100: 2208
After executing this process a total of 100 times, there would be 2208 black tiles facing up.

How many tiles will be black after 100 days?
*/
function getNeighbors(tile) {
  var [x, y] = tile.split(',').map(e => parseInt(e, 10));
  return ((y%2 === 0) 
            ? [[x-1, y], [x+1, y], [x, y-1], [x, y+1], [x-1, y-1], [x-1, y+1]]
            : [[x-1, y], [x+1, y], [x, y-1], [x, y+1], [x+1, y-1], [x+1, y+1]]
          ).map(xy => xy.join());
}
function printTiles(tiles) {
  var xs = Array.from(tiles).map(t => parseInt(t, 10));
  var ys = Array.from(tiles).map(t => parseInt(t.split(',')[1], 10));
  // bounding box
  var minX = Math.min(...xs);
  var maxX = Math.max(...xs);
  var minY = Math.min(...ys);
  var maxY = Math.max(...ys);
  
  var width = (maxX - minX + 1) * 2 + 1; // (box + edge inclusive) * two chars per hex + odd row offset
  var height = maxY - minY + 1; // box + edge inclusive
 
  var rowTemplate = new Array(width);
  rowTemplate.fill('.');
  var grid = new Array();
  for (var j = 0; j < height; j++) {
    grid.push(rowTemplate.slice());
  }
  for (var tile of tiles) {
    var [x, y] = tile.split(',', 2).map(e => parseInt(e, 10));
    var i = (x - minX) * 2 + (y%2===0 ? 0 : 1); // 2 chars per hex + odd row offset
    var j = y - minY;
    grid[j][i] = '[';
    grid[j][i+1] = ']';
  }
  console.log(String(minX).padStart(6) + String(maxX).padStart(width-4));
  for (var j = grid.length; j-->0;) {
    console.log(String(minY+j).padStart(4), grid[j].join(''));
  }
}
function makeFloor(tiles) {
  return {
    today: tiles,
    day: 0,
    step: function() {
      var todayArray = Array.from(this.today);
      var tilesToCheck = new Set(todayArray.flatMap(tile => getNeighbors(tile))
                                           .concat(todayArray));
      var tomorrow = Array.from(tilesToCheck).filter(tile => {
        var blackNeighbors = this.countBlackNeighbors(tile);
        // console.log(tile, blackNeighbors, this.isBlack(tile));
        return blackNeighbors === 2 ||
              (blackNeighbors === 1 && this.isBlack(tile));
      });
      this.today = new Set(tomorrow);
      this.day++;
      return this.today.size;
    },
    stepTo: function(targetDay) {
      var result;
      while (this.day < targetDay) {
        result = this.step();
      }
      return result;
    },
    countBlackNeighbors: function(tile) {
      return getNeighbors(tile).filter(t => this.isBlack(t)).length;
    },
    isBlack: function(tile) {
      return this.today.has(tile);
    },
  };
}
var testFloor = makeFloor(getBlackTiles(day24test));
console.assert(testFloor.step() === 15);
console.assert(testFloor.stepTo(2) === 12);
console.assert(testFloor.stepTo(3) === 25);
console.assert(testFloor.stepTo(4) === 14);
console.assert(testFloor.stepTo(5) === 23);
console.assert(testFloor.stepTo(6) === 28);
console.assert(testFloor.stepTo(7) === 41);
console.assert(testFloor.stepTo(8) === 37);
console.assert(testFloor.stepTo(9) === 49);
console.assert(testFloor.stepTo(10) === 37);
console.assert(testFloor.stepTo(20) === 132);
console.assert(testFloor.stepTo(30) === 259);
console.assert(testFloor.stepTo(40) === 406);
console.assert(testFloor.stepTo(50) === 566);
console.assert(testFloor.stepTo(60) === 788);
console.assert(testFloor.stepTo(70) === 1106);
console.assert(testFloor.stepTo(80) === 1373);
console.assert(testFloor.stepTo(90) === 1844);
console.assert(testFloor.stepTo(100) === 2208);

console.log(makeFloor(getBlackTiles(day24input)).stepTo(100));
