/*
--- Day 21: Allergen Assessment ---
You reach the train's last stop and the closest you can get to your vacation island without getting wet. There aren't even any boats here, but nothing can stop you now: you build a raft. You just need a few days' worth of food for your journey.

You don't speak the local language, so you can't read any ingredients lists. However, sometimes, allergens are listed in a language you do understand. You should be able to use this information to determine which ingredient contains which allergen and work out which foods are safe to take with you on your trip.

You start by compiling a list of foods (your puzzle input), one food per line. Each line includes that food's ingredients list followed by some or all of the allergens the food contains.

Each allergen is found in exactly one ingredient. Each ingredient contains zero or one allergen. Allergens aren't always marked; when they're listed (as in (contains nuts, shellfish) after an ingredients list), the ingredient that contains each listed allergen will be somewhere in the corresponding ingredients list. However, even if an allergen isn't listed, the ingredient that contains that allergen could still be present: maybe they forgot to label it, or maybe it was labeled in a language you don't know.

For example, consider the following list of foods:
*/
var day21test = [
'mxmxvkd kfcds sqjhc nhms (contains dairy, fish)',
'trh fvjkl sbzzf mxmxvkd (contains dairy)',
'sqjhc fvjkl (contains soy)',
'sqjhc mxmxvkd sbzzf (contains fish)',
];
/*
The first food in the list has four ingredients (written in a language you don't understand): mxmxvkd, kfcds, sqjhc, and nhms. While the food might contain other allergens, a few allergens the food definitely contains are listed afterward: dairy and fish.

The first step is to determine which ingredients can't possibly contain any of the allergens in any food in your list. In the above example, none of the ingredients kfcds, nhms, sbzzf, or trh can contain an allergen. Counting the number of times any of these ingredients appear in any ingredients list produces 5: they all appear once each except sbzzf, which appears twice.

Determine which ingredients cannot possibly contain any of the allergens in your list. How many times do any of those ingredients appear?
*/
function parseFoods(input) {
  var foods = []
  for (const line of input) {
    var [ingredientStr, allergenStr] = line.split(' (contains ', 2);
    var ingredients = new Set(ingredientStr.split(' '));
    var allergens = new Set(allergenStr.replace('\)', '').split(', '));
    foods.push({ ingredients, allergens });
  }
  return foods;
}
var testFoods = parseFoods(day21test);
console.assert(testFoods.length === 4);

function getAllAllergens(foods) {
  return new Set(foods.flatMap( food => Array.from(food.allergens.values()) ));
}
var testAllergens = getAllAllergens(testFoods);
console.assert(testAllergens.size === 3);
console.assert(testAllergens.has('fish'));

function getAllIngredients(foods) {
  return new Set(foods.flatMap( food => Array.from(food.ingredients.values()) ));
}
function makeIngredientAllergenMap(allIngredients, allAllergens) {
  var map = new Map();
  for (const ingredient of allIngredients) {
    map.set(ingredient, new Set(allAllergens));
  }
  return map;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Implementing_basic_set_operations
function difference(setA, setB) {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

function checkIngredientAllergens(ingredient, ingredientAllergenMap, allergenCandidateMap, knownIngredients, knownAllergens) {
  if (ingredientAllergenMap.get(ingredient).size > 0) {
    return;
  }
  // console.log(ingredient + ' is SAFE!');
  knownIngredients.set(ingredient, 'SAFE');
  // remove this safe ingredient from all allergen candidate sets
  var deletedAllergens = new Set();
  for (const [allergen, candidates] of allergenCandidateMap.entries()) {
    if (candidates.delete(ingredient)) {
      deletedAllergens.add(allergen);
    }
  }
  
  // check if any allergens have been identified
  for (const allergen of deletedAllergens) {
    checkAllergenCandidates(allergen, ingredientAllergenMap, allergenCandidateMap, knownIngredients, knownAllergens);
  }
}

function checkAllergenCandidates(allergen, ingredientAllergenMap, allergenCandidateMap, knownIngredients, knownAllergens) {
  if (allergenCandidateMap.has(allergen) && allergenCandidateMap.get(allergen).size > 1) {
    return;
  }
  var ingredient = allergenCandidateMap.get(allergen).values().next().value;
  // console.log(ingredient + ' is ' + allergen); // by elimination
  knownAllergens.set(allergen, ingredient);
  knownIngredients.set(ingredient, allergen);
  var deletedOtherIngredients = new Set();
  for (const [otherIngredient, allergens] of ingredientAllergenMap.entries()) {
    if (ingredient === otherIngredient) {
      // ingredient must be this allergen
      allergens.clear();
      allergens.add(allergen);
    } else if (allergens.delete(allergen)) { // other ingredients cannot be this allergen
      deletedOtherIngredients.add(otherIngredient);
    }
  }
  
  // check if other ingredients are now safe
  for (const otherIngredient of deletedOtherIngredients) {
    checkIngredientAllergens(otherIngredient, ingredientAllergenMap, allergenCandidateMap, knownIngredients, knownAllergens);
  }
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Implementing_basic_set_operations
function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

function getSafeIngredientUses(foods, allAllergens) {
  allAllergens ||= getAllAllergens(foods);
  var allIngredients = getAllIngredients(foods);
  var ingredientAllergenMap = makeIngredientAllergenMap(allIngredients, allAllergens);
  var allergenCandidateMap = new Map();
  var knownAllergens = new Map();
  var knownIngredients = new Map();

  for (const food of foods) {    
    // remove food.allergens from non-ingredients; 
    // listed allergens are definitely on the listed ingredients
    var nonIngredients = difference(allIngredients, food.ingredients);
    var deletedIngredients = new Set();
    for (const ni of nonIngredients) {
      for (const allergen of food.allergens) {
        if (ingredientAllergenMap.get(ni).delete(allergen)) {
          deletedIngredients.add(ni);
        }
      }
    }

    // intersect candidate ingredients with previous candidates per allergen
    for (const allergen of food.allergens) {
      if (knownAllergens.has(allergen)) { continue; }
      var unknownIngredients = difference(new Set(food.ingredients), knownIngredients.keys());
      if (allergenCandidateMap.has(allergen)) {
        var existingCandidates = allergenCandidateMap.get(allergen);
        allergenCandidateMap.set(allergen, intersection(existingCandidates, unknownIngredients));
        // clear allergen from non-intersecting candidates
        for (const eliminatedIngredient of difference(existingCandidates, unknownIngredients)) {
          if (ingredientAllergenMap.get(eliminatedIngredient).delete(allergen)) {
            deletedIngredients.add(eliminatedIngredient);
          }
        }
      } else {
        allergenCandidateMap.set(allergen, unknownIngredients);
      }
      checkAllergenCandidates(allergen, ingredientAllergenMap, allergenCandidateMap, knownIngredients, knownAllergens);
    }
    
    // check on deleted ingredients to see if any are now safe
    for (const ingredient of deletedIngredients) {
      checkIngredientAllergens(ingredient, ingredientAllergenMap, allergenCandidateMap, knownIngredients, knownAllergens);
    }
  }
  
  var safeIngredients = new Set(Array.from(knownIngredients.entries())
    .filter(([k,v]) => v === 'SAFE')
    .map(([k,v]) => k));
  return Array.from(
    foods.flatMap( food => Array.from(food.ingredients) )
         .filter( ingredient => safeIngredients.has(ingredient) )
    ).length;
}
console.assert(getSafeIngredientUses(testFoods) === 5);

var day21input = [
'cptr jjxp zzkq jtqt jmvzd mxgv mbgvjc rrqmh pvhcsn ltbj rvqjz sgtd gjnspc nnkfbt rzft nqv hhbn mxz dsntb ckdz mjbv mdgq dmjqb jxbnb rkhzrzq vqkcm bmgg ctmzb kmcj lgmtk dcplpl szhtvc nvxkrv qlqz bplgbt fkzqq nqncqb ntz jqnhd hfsmp czpfj kzlmds nb blsqq mrmjpg zgdr chpdjkf vvsjq dz xhnc zntsz kbmxb ntszq xdrkv xtxsd knlsxvd flrqnz bxns pzvkjv ssfnz lzzc (contains sesame)',
'ntszq nrfmm rtlg ckdfvz flrqnz ztpqkt kzlmds glxk kcktpbkr dz fppzs njbkq ltbj jxbnb nnkfbt skqzs ksk dvpmjzv rmvrtcrf rrqmh jxlzhm phnzt zntsz pvhcsn jkdv vjbrstq sfmqbl bplgbt kbmxb vsqjf dcplpl gmlm chpdjkf jzcv drmhm djggpdlf fksjj zzkq cstcb rzft kbfcck xxftp xrd gsfmr mskp zvhcv bhvzg qjvzrv hgjmbqj cmhfx tjbbb cptr ssfnz mmgdmql mgcfqsm hlrkh llpqf zfzzt bhtvt xmpdtf zgdr mqxrzv scrqn zjfls nxffgkd jfj jtqt jfzm dktj ntxnp cg gpsr mrmjpg rkhzrzq dvvkd mnvvt (contains dairy, peanuts)',
'htfb rrqmh nphh pvhcsn svppj knlsxvd bplgbt rzfcs ltbj bxns fdfzgq hsdc phnzt jfzm sfjzfn kbmxb mrmjpg chpdjkf sfmqbl rtkjgl mdgq qvrqrj mxgv vsqjf hlqq bsnqhfg xrd lzzc tsddn kcktpbkr ntxnp xtxsd bmgg dvpmjzv mskp nqv vqkcm jtqt mqh flrqnz bhvzg mgcfqsm nrfmm jqnhd vcll fppzs pjn dmjqb zjfls slmr mxs qtztn jxlzhm hjsjb ssfnz jxbnb dvvkd mztlt cmhfx qfdjlq hgjmbqj jmvzd pmdqks ctmzb (contains sesame, dairy)',
'kbmxb ntszq mdgq knlsxvd mqxrzv ktb fdfzgq ztpqkt qtztn hbxhrb svppj njbkq jkdv xmpdtf fnrb xxftp gsfmr lgmz nqncqb jrjdg rzft ntz zts ssfnz gjnspc chpdjkf hjsjb vclhj bhvzg pvhcsn vcll jqnhd tkmsp llpqf lnshn zqrz bxns gmlm hfsmp fksjj tvfb vjtlvq nnkfbt mxgv hsdc ltbj fkzqq rmvrtcrf cptr nphh hlrkh czpfj jtqt hktr bmgg htfb kdvbxj sfmqbl jxbnb cstcb nrfmm glxk pjm zjfls rtkjgl kzlmds smkdlqs jfzm (contains sesame)',
'jzcv tvfb dcplpl chst zqrz chpdjkf zgdr tbhhf bhvzg xdrkv zkhrz jxbnb jfj svppj mxgv mqh lnshn pjm zfzzt ktb pvprzd ntz bmgg rrqmh gdpvd nvxkrv nphh vjbrstq dvpmjzv dz cxf jxmb tsddn tptjhd gcxqfv zjfls sgtd dzmkz tkmsp cqpqbr fkzqq qtztn cptr qvrqrj nrfmm rtkjgl vzzfj ntbr zntsz bxns hbxhrb skqzs xt dktj dmjqb jtqt rhzb vbl ltbj xxftp jkqdv nmnr mjbv hjsjb pvhcsn cmddh jqnhd kcktpbkr nb xmpdtf qfdjlq lgmtk kbmxb mrmjpg sbvx lfnl gkkc tjbbb hgjmbqj ntszq lrbfd mxs gmlm scrvrrbf zvbjx hlqq ztpqkt djggpdlf lpdfbg zts mqxrzv gsfmr vcll (contains sesame, fish)',
'vzzfj mjbv vjbrstq mrmjpg vqkcm qvrqrj mqxrzv nxffgkd mbgvjc ckdfvz jkdv qjvzrv lgmfmp gcxqfv lgmz gfvhp dsntb bplgbt jkqdv dzmkz nqv glxk zzkq drmhm pzvkjv zkhrz nxkr vcll jqnhd gpsr jrjdg mskp tptjhd hbxhrb xt pvhcsn svppj zjfls knlsxvd rzft hfsmp tbhhf mxz chst scrvrrbf jxbnb zbhvl mmgdmql zfzzt jtqt tmrss ksk djggpdlf qtztn xdrkv slmr sgtd gkcnh nrfmm jfzm dvvkd cmhfx rmvrtcrf chpdjkf mxgv mztlt pjn (contains sesame, soy, shellfish)',
'kjcrdp ntbr mxgv dsntb tbhhf nphh qjvzrv nnkfbt nqv rmvrtcrf mztlt mjbv jxbnb fdfzgq phnzt jtqt vbl mqh jxmb xhnc zfzzt vvsjq chpdjkf vjtlvq dz jzcv vxjt cmhfx nxffgkd jkqdv pzvkjv jqnhd hhbn pkscpx nmnr pvhcsn xrd ckdz ltbj hlrkh dvpmjzv fnrb nvxkrv nrfmm vzzfj hktr llpqf vclhj gkkc lzzc tsddn cnxbq rhzb sfmqbl zvbjx mrmjpg rvmqk sgtd zqrz vjbrstq mbgvjc jfzm mmgdmql bhvzg cmddh jrjdg zntsz xdrkv kdvbxj rvqjz vsqjf tvfb blsqq (contains peanuts, wheat)',
'mxz ltbj nnkfbt fnrb htfb jkqdv cqpqbr vjbrstq bsnqhfg jtqt vclhj bxns pkscpx zntsz pvhcsn jxbnb ztpqkt mbgvjc zvhcv mztlt zzkq mmgdmql tkmsp jzcv mmszz gdpvd dvpmjzv qfdjlq gfvhp nrfmm chpdjkf rvqjz pjm fppzs hbxhrb dmjqb kjcrdp mskp nb zvbjx ntszq gsfmr fksjj (contains sesame, nuts)',
'trbgcv tptjhd vjbrstq mnvvt vjtlvq zzkq cmddh xrd rmvrtcrf kdvbxj tsddn pvprzd zvhcv flrqnz rrqmh gdpvd djggpdlf pkscpx kbmxb hhbn nphh mqh ltbj smkdlqs lzzc vzzfj lgmfmp dz jmvzd ksk mgcfqsm jqnhd rvmqk dvpmjzv gkcnh qnzxp bsnqhfg gjnspc jjxp skqzs gpsr vnmkhgt ffcbf chpdjkf sgtd czpfj rtkjgl jtqt sbvx jfj szhtvc qtztn ntxnp phnzt qlqz cmhfx pvhcsn xtxsd fnrb jzcv lnshn bxns lgmtk slmr fppzs fkzqq pmdqks zvbjx jxbnb mxz bmgg (contains peanuts, dairy)',
'sbvx dvpmjzv gfvhp scrqn mztlt cptr pjm gkcnh tvfb gjnspc trbgcv gdpvd dktj fksjj lgmtk mrmjpg dmjqb lzzc jkdv jzcv vsqjf slmr hjsjb vzzfj jxmb mxz mdgq jmvzd lpdfbg ntszq pvprzd jqnhd llpqf jxbnb jtqt xmpdtf bmgg zzkq vclhj rrqmh ntxnp scrvrrbf tbhhf ltbj zfzzt vqkcm hbxhrb jkqdv chpdjkf rzfcs bhtvt xdrkv fppzs cmddh vbl nnkfbt zvbjx jfzm zbhvl blsqq tgvrbl nb gkkc skqzs chst cmhfx cjv kbfcck pvhcsn (contains nuts)',
'nrfmm gdpvd rvqjz zfzzt qfdjlq jqnhd mxs jtqt sfjzfn gkkc djggpdlf bplgbt sfmqbl nxkr pzvkjv pvhcsn jjxp hgjmbqj dmjqb ltbj ntszq zkhrz jxbnb tkmsp nqncqb cxf lpdfbg cnxbq zzkq nvxkrv hfsmp chst mqxrzv vcll dcplpl bmgg vbl nqv vnmkhgt fkzqq qvrqrj (contains shellfish)',
'xdrkv lfnl ntxnp nvxkrv nrfmm gkkc smkdlqs mxs jrjdg jtqt jxbnb chpdjkf knlsxvd hsdc xtxsd rhzb jmvzd gcxqfv phnzt rvmqk pkscpx bxns zqrz gjnspc xrd ntz cmddh qvrqrj cptr cnxbq vvsjq trbgcv hjsjb slmr qnzxp mbgvjc sbvx xt jqnhd hgjmbqj dsntb drmhm tjbbb tptjhd hktr lpdfbg ksk vsqjf gfvhp jzcv kjcrdp fksjj hfsmp dz zfzzt gkcnh czpfj sfjzfn ltbj dzmkz hbxhrb mjbv blsqq tvfb jfzm bhvzg pjn cxf mmszz htfb bplgbt nxffgkd mqh zzkq ssfnz rkhzrzq lrbfd gmlm zvbjx vcll (contains dairy)',
'jkqdv nxffgkd jqnhd xhnc ntxnp nrfmm nphh kdvbxj htfb njbkq jxbnb xt vxjt dvpmjzv fdfzgq nxkr gfvhp hbxhrb jjxp fkzqq pvhcsn dz dcplpl jxlzhm cptr lzzc pkscpx cg jfj pmdqks flrqnz cjv zzkq ltbj dzmkz vjbrstq vjtlvq mdgq jtqt vsqjf (contains soy, fish)',
'mmgdmql ntbr zts gjnspc xdrkv lfnl qjvzrv tsddn hsdc cmhfx vqkcm cptr njbkq sfjzfn nxkr jzcv pzvkjv vcll rhzb ssfnz smkdlqs hlrkh zntsz cqpqbr pvprzd zgdr chpdjkf xxftp jtqt nnkfbt ktb jjxp mrmjpg mgcfqsm slmr nb qtztn dzmkz jxbnb ltbj hjsjb jqnhd rvqjz gpsr pvhcsn nvxkrv tvfb nrfmm dz lgmz mqh vclhj hhbn svppj vnmkhgt (contains nuts, wheat, dairy)',
'ctmzb jjxp phnzt zbhvl jrjdg nqncqb vnmkhgt chpdjkf mdgq pkscpx ffcbf nqv zjfls gcxqfv mqh rmvrtcrf ckdz llpqf tptjhd jxmb rtkjgl pvhcsn glxk bjvks jqnhd vsqjf fnrb lpdfbg drmhm mrmjpg zntsz vzzfj lrbfd ntbr ltbj dmjqb rkhzrzq njbkq bxns lfnl dzmkz qfdjlq zgdr jtqt cg xmpdtf pmdqks jfzm mmgdmql qjvzrv bhvzg jzcv ntz lgmtk gpsr kmcj vxjt vvsjq vbl nphh qtztn ktb kzlmds hgjmbqj tjbbb ksk vclhj mjbv ztpqkt hhbn tvfb flrqnz smkdlqs zzkq tsddn nrfmm xdrkv vjtlvq hktr (contains dairy, fish)',
'bplgbt bmgg tgvrbl ffcbf zzkq dvvkd nphh htfb svppj kdvbxj pkscpx jfj kzlmds phnzt mgcfqsm qlqz ntxnp mxgv cmhfx gkkc zkhrz pjm qjvzrv lzzc jrjdg fksjj zqrz rmvrtcrf lpdfbg nvxkrv kjcrdp vbl dz mdgq vqkcm szhtvc xtxsd mnvvt chpdjkf bsnqhfg rrqmh vsqjf nrfmm nqncqb bjvks jtqt jxbnb xt nxffgkd rhzb lgmfmp nmnr bhtvt ckdfvz tptjhd ntszq cstcb jqnhd jzcv lgmtk qtztn flrqnz rtlg czpfj hlqq kcktpbkr hktr njbkq pzvkjv ntbr scrqn qfdjlq ltbj (contains sesame, wheat, soy)',
'tmrss scrvrrbf ffcbf mmgdmql nrfmm dcplpl zzkq vzzfj tsddn nxffgkd jtqt gdpvd blsqq tvfb jxlzhm kjcrdp jqnhd chpdjkf jxbnb zvbjx nqncqb smkdlqs tgvrbl ntbr kbfcck rzfcs ntxnp pvprzd zvhcv kzlmds mnvvt lgmfmp hktr nnkfbt hhbn zkhrz cstcb mxgv kbmxb hlqq jmvzd cg xmpdtf mrmjpg nqv flrqnz lgmtk pvhcsn mxz mqxrzv pjm lgmz chst ctmzb gfvhp dktj qfdjlq cmddh vsqjf tkmsp vqkcm qjvzrv gkcnh gjnspc hgjmbqj xxftp drmhm cjv szhtvc rvmqk hfsmp trbgcv zfzzt tjbbb mgcfqsm vnmkhgt svppj (contains soy)',
'zvhcv kdvbxj xdrkv glxk vcll ltbj jtqt dz lrbfd qvrqrj trbgcv gcxqfv kzlmds nphh gdpvd zntsz vqkcm ntxnp jfzm pzvkjv xt mxz hlqq zzkq jkdv nrfmm pvhcsn vzzfj ctmzb qtztn dktj nb xxftp zts kjcrdp bmgg rkhzrzq cmhfx rmvrtcrf hhbn gmlm skqzs rtkjgl nnkfbt dsntb pmdqks mxs zjfls xrd bjvks mmszz nqv ckdfvz rzft lgmz mgcfqsm zfzzt pkscpx jxbnb jxmlx slmr jfj szhtvc fdfzgq pjm kbfcck cqpqbr vbl lgmtk xhnc mxgv jqnhd fppzs fxfphm ckdz chst ztpqkt (contains nuts)',
'knlsxvd nrfmm chst zfzzt phnzt qtztn dktj cmddh gkcnh blsqq jqnhd pvhcsn zjfls pmdqks nphh pjm ltbj lpdfbg dcplpl zzkq mmszz jxbnb jfzm tmrss bhvzg scrqn nnkfbt hlqq xrd mxs mztlt mxz trbgcv nmnr rvmqk kmcj rzft nb pjn rtlg vnmkhgt rvqjz lzzc chpdjkf zqrz lgmtk gfvhp kbfcck qnzxp cxf mqxrzv mrmjpg kcktpbkr nxffgkd pzvkjv mbgvjc (contains soy)',
'chpdjkf bsnqhfg ckdfvz pkscpx hlrkh bhtvt mskp cg qvrqrj jxmlx vcll mgcfqsm ltbj knlsxvd mmszz chst lgmfmp fkzqq hgjmbqj svppj llpqf vsqjf fnrb rtkjgl jqnhd ztpqkt rtlg ntszq kmcj bhvzg nrfmm xhnc ckdz jxbnb ssfnz lnshn vjtlvq nxffgkd zjfls zzkq nnkfbt zgdr lfnl czpfj pvhcsn cptr rvqjz rmvrtcrf nqncqb dsntb trbgcv mxz jkqdv jkdv nb pzvkjv (contains fish, peanuts, soy)',
'gcxqfv zvhcv djggpdlf qtztn xdrkv jrjdg zts njbkq sfjzfn pjn dmjqb nrfmm trbgcv dktj zfzzt hlqq ltbj lzzc gjnspc jtqt jxmlx nb xrd jqnhd tgvrbl zzkq ztpqkt drmhm cmhfx vbl dz jxbnb zvbjx ktb qnzxp jzcv tptjhd hgjmbqj lpdfbg kcktpbkr llpqf svppj mxz chpdjkf xxftp jjxp hjsjb tsddn (contains soy, fish)',
'bhtvt kjcrdp htfb nrfmm pjm phnzt jkdv jtqt ksk qvrqrj gpsr dktj vjbrstq nnkfbt jxmb pkscpx kmcj ntbr cxf qnzxp fxfphm gcxqfv mqh vqkcm mxz dsntb gkcnh vvsjq xrd xmpdtf hsdc tmrss lgmfmp mmszz tbhhf chpdjkf jqnhd ntxnp tjbbb nmnr vnmkhgt kbfcck cg svppj mskp gsfmr gjnspc pvhcsn kbmxb pzvkjv mnvvt mztlt tptjhd glxk mjbv nxkr cqpqbr trbgcv zzkq fppzs jxbnb ffcbf sfmqbl hlqq gfvhp bplgbt xxftp bsnqhfg zts jxmlx sbvx rzfcs zbhvl scrqn fdfzgq pmdqks cmhfx (contains shellfish)',
'skqzs pvhcsn cg zts qjvzrv zzkq xdrkv cjv ltbj jxlzhm jxbnb vvsjq jjxp tsddn jkdv jmvzd tvfb nrfmm zntsz vnmkhgt nnkfbt cptr chpdjkf pkscpx rhzb htfb ctmzb kbmxb chst dsntb hlrkh nmnr jfzm sgtd bjvks jxmlx tmrss ntxnp ntbr bmgg dzmkz rkhzrzq rtkjgl hgjmbqj kcktpbkr bplgbt mdgq vcll lgmtk gcxqfv jqnhd (contains sesame, wheat, dairy)',
'ltbj nmnr cmddh zkhrz tjbbb vnmkhgt bmgg zjfls jqnhd ckdfvz mztlt cjv xmpdtf gdpvd mxgv chpdjkf bhvzg kjcrdp vzzfj nqv gpsr pzvkjv rzft rvmqk llpqf fksjj jzcv zntsz gcxqfv hsdc zzkq gsfmr mdgq kbmxb scrvrrbf jjxp cqpqbr dz nrfmm vbl pvhcsn sfjzfn cstcb nxkr svppj jfzm zvbjx nphh htfb qfdjlq gjnspc zts fxfphm fkzqq hlqq pkscpx jkdv mqxrzv dcplpl lnshn kbfcck rzfcs pjm qlqz hbxhrb bxns jxbnb trbgcv (contains soy, wheat, fish)',
'gpsr zgdr dz mbgvjc bjvks gsfmr flrqnz tjbbb llpqf dvvkd sgtd mgcfqsm ssfnz dsntb ztpqkt scrvrrbf jzcv pjn nnkfbt jxbnb bhvzg ntbr chpdjkf zvhcv kbmxb sbvx smkdlqs xtxsd jkqdv zzkq zvbjx jxmlx jtqt slmr xt lgmz pvhcsn szhtvc tvfb vxjt nrfmm qtztn gcxqfv fksjj nmnr nphh hbxhrb mxs xrd knlsxvd qfdjlq fppzs mxz lnshn vvsjq jqnhd ctmzb lrbfd lgmfmp zbhvl (contains shellfish, sesame, peanuts)',
'vxjt lpdfbg nvxkrv fkzqq hhbn nb vclhj mgcfqsm mmszz cxf bxns pzvkjv hgjmbqj ctmzb kbfcck mskp ltbj lgmfmp ntszq nrfmm dktj phnzt mxs bhvzg cptr jrjdg lgmtk dz jtqt jfzm xxftp gkcnh pvprzd gkkc gmlm mxz mqh rtkjgl kmcj jxmb pjn ckdfvz bhtvt mdgq mztlt zntsz gjnspc lgmz zqrz vcll cmhfx jxbnb ffcbf ksk kbmxb nnkfbt tgvrbl bplgbt qjvzrv nxkr htfb lnshn dcplpl pvhcsn jxlzhm chpdjkf kcktpbkr rhzb bmgg cstcb qlqz xtxsd gdpvd sbvx jqnhd ckdz (contains nuts, dairy, wheat)',
'xhnc rzfcs pvhcsn ntxnp zzkq xdrkv lpdfbg kmcj dktj trbgcv mqxrzv ntszq pvprzd vclhj hktr nphh vzzfj rkhzrzq bhtvt lgmtk gjnspc hfsmp mrmjpg mbgvjc lnshn kbfcck chpdjkf scrvrrbf jxmb fxfphm ntbr glxk sfjzfn rtlg blsqq czpfj cnxbq jtqt vjtlvq flrqnz ckdfvz fnrb gfvhp nxffgkd svppj mskp nrfmm rzft ssfnz zjfls pkscpx bjvks vxjt mnvvt zvhcv gdpvd bplgbt skqzs ktb lfnl hjsjb fppzs zkhrz hsdc vvsjq ltbj nvxkrv mztlt tvfb tmrss bxns kcktpbkr lrbfd mxgv llpqf htfb jkqdv xxftp zfzzt mxz rvmqk cxf phnzt cstcb tkmsp vqkcm jqnhd jfzm (contains dairy, soy, wheat)',
'jxbnb jqnhd skqzs mxz jjxp rzft ctmzb xrd ffcbf ztpqkt pjm blsqq rzfcs zvhcv cmhfx tvfb vnmkhgt jfzm kmcj jxlzhm nphh mjbv dmjqb nrfmm vclhj lpdfbg lnshn vzzfj zzkq pvhcsn ntszq lgmfmp tkmsp ltbj lgmtk djggpdlf czpfj chpdjkf kcktpbkr rtlg jxmb hgjmbqj gsfmr bplgbt jmvzd rvmqk slmr xmpdtf rkhzrzq mnvvt vjbrstq (contains dairy, nuts)',
'xdrkv jqnhd trbgcv kbfcck lzzc zzkq rzfcs mnvvt pjn mxz pvhcsn dktj ztpqkt jkdv mqxrzv skqzs jtqt zts fdfzgq chpdjkf qlqz mbgvjc xhnc mgcfqsm hbxhrb zfzzt rzft kbmxb qnzxp fnrb bplgbt gfvhp cnxbq smkdlqs qvrqrj ntszq kmcj tvfb jkqdv mmszz cmhfx ntbr lgmtk hgjmbqj pmdqks nrfmm jxbnb ksk qfdjlq knlsxvd jjxp vnmkhgt bhvzg jmvzd lpdfbg tgvrbl flrqnz hlrkh drmhm dvvkd ntz ffcbf cstcb jfj jzcv nqv zgdr mztlt dz kzlmds xmpdtf gpsr tsddn (contains fish, sesame)',
'vsqjf vqkcm hktr rtlg pvhcsn djggpdlf hlrkh cg jfj mxgv jkqdv mqxrzv gsfmr jxmlx jqnhd lrbfd ksk nqncqb kmcj fnrb dz vjbrstq zvbjx hgjmbqj chpdjkf kcktpbkr rvqjz nrfmm ntxnp gpsr kjcrdp jrjdg drmhm ltbj slmr phnzt scrvrrbf ntszq bhtvt trbgcv rmvrtcrf bjvks ckdfvz zzkq xt xmpdtf dvvkd bplgbt smkdlqs jtqt (contains nuts, wheat, fish)',
'pvhcsn bsnqhfg knlsxvd kdvbxj tbhhf scrvrrbf ssfnz zkhrz hfsmp nmnr kmcj gpsr xmpdtf qnzxp vxjt rrqmh drmhm hjsjb mgcfqsm hktr mjbv zvbjx zzkq jtqt svppj jfzm jrjdg djggpdlf lpdfbg lgmz lfnl htfb czpfj gfvhp mxgv xtxsd llpqf jqnhd ckdfvz jxbnb bplgbt fppzs ktb lgmfmp flrqnz rzft mxs xrd mztlt tkmsp mbgvjc chpdjkf jkdv chst ltbj dz vclhj (contains dairy, wheat, shellfish)',
'pvhcsn jqnhd ckdz zkhrz lgmtk kbfcck ntz lnshn zfzzt mrmjpg vcll hhbn ckdfvz mxz nrfmm tgvrbl dcplpl xdrkv ntbr qvrqrj vsqjf slmr ltbj bhvzg jtqt lzzc mmszz jxmlx nxkr sfjzfn fdfzgq xtxsd scrqn gpsr zvbjx qtztn hsdc szhtvc czpfj mbgvjc pjm chpdjkf kcktpbkr fppzs kzlmds kjcrdp zzkq cjv qlqz gkcnh smkdlqs mztlt rvmqk rzft bsnqhfg rtlg jkqdv (contains soy, sesame, nuts)',
'zntsz cxf cmddh mxgv xxftp glxk qnzxp ltbj qfdjlq lgmtk vvsjq rmvrtcrf vxjt dzmkz ctmzb sgtd chpdjkf jxbnb pvhcsn knlsxvd lpdfbg hktr slmr szhtvc xrd tptjhd gdpvd gkkc lrbfd tgvrbl xhnc qvrqrj bjvks hfsmp fksjj mztlt nmnr vjtlvq jxlzhm drmhm cstcb xdrkv zjfls jtqt mbgvjc mnvvt nrfmm jqnhd rhzb (contains fish, nuts, sesame)',
'zkhrz pvhcsn jxbnb jtqt pzvkjv nvxkrv hsdc vbl djggpdlf lnshn xtxsd bjvks jfzm vcll mqh sgtd kbfcck tmrss jmvzd cnxbq pmdqks hjsjb nrfmm ntszq dmjqb pjm rzft lzzc rkhzrzq gdpvd cmhfx pkscpx fkzqq zzkq nnkfbt xmpdtf cmddh bhvzg hktr dz kbmxb czpfj vjbrstq lrbfd mbgvjc rmvrtcrf ssfnz sbvx xt rtlg mnvvt fdfzgq qfdjlq kcktpbkr mrmjpg llpqf ksk gmlm ntz trbgcv jqnhd jxmlx mmszz qjvzrv nphh cqpqbr ltbj fksjj (contains peanuts)',
'mqh nqncqb pvhcsn mxs tptjhd chpdjkf jzcv rtkjgl qnzxp mdgq lgmfmp gpsr dcplpl dz vqkcm cstcb tbhhf mmszz xrd slmr ztpqkt mnvvt zbhvl bhtvt jqnhd xt glxk rtlg mxgv rzfcs jtqt pjm djggpdlf rvqjz smkdlqs cxf ntz vxjt pkscpx lpdfbg xxftp vzzfj zqrz gsfmr xhnc qtztn dsntb drmhm tjbbb ntszq flrqnz fxfphm ltbj qfdjlq hhbn pmdqks tvfb vcll xtxsd pzvkjv pjn kzlmds mrmjpg jkdv nvxkrv sgtd hktr nmnr cg jxbnb scrvrrbf lrbfd kjcrdp jmvzd zzkq nphh gfvhp zvbjx rkhzrzq rmvrtcrf jkqdv hsdc (contains nuts)',
'dzmkz lgmfmp vxjt jtqt chpdjkf htfb lzzc mqh kbmxb bxns cjv fkzqq cqpqbr ltbj dktj mskp zfzzt jrjdg mrmjpg kdvbxj tkmsp dvpmjzv rzft vvsjq vjbrstq cmddh jfzm kcktpbkr hjsjb qlqz vnmkhgt drmhm mxz dcplpl hktr ntszq zjfls gkcnh zvhcv jzcv kjcrdp lrbfd pmdqks skqzs fppzs xrd nvxkrv rhzb scrvrrbf mxgv dsntb sfmqbl pvhcsn vcll ntbr hbxhrb phnzt rtkjgl rvmqk zzkq jmvzd kzlmds lpdfbg smkdlqs cptr rmvrtcrf nrfmm zkhrz chst gsfmr kbfcck nqv fnrb rrqmh dmjqb ktb pkscpx sgtd zqrz rtlg ffcbf hlqq rvqjz jqnhd czpfj mjbv gcxqfv (contains dairy, wheat)',
'tmrss pkscpx rrqmh ckdfvz nnkfbt nrfmm njbkq rhzb ckdz tjbbb bplgbt ffcbf hsdc qfdjlq dmjqb zvhcv kbmxb jxmb mrmjpg jtqt hktr pjm jxmlx bxns bjvks jxlzhm vzzfj ssfnz fppzs mmszz hjsjb mqh mdgq kmcj czpfj pmdqks cg pvhcsn dsntb tvfb zzkq mxgv xxftp mxs jjxp bsnqhfg gfvhp zqrz gkcnh llpqf xt chpdjkf lgmfmp rmvrtcrf jqnhd ltbj zts nmnr dvvkd trbgcv zgdr vnmkhgt nqv tsddn (contains sesame)',
'zgdr jfzm cmhfx ltbj vvsjq lgmz xdrkv mbgvjc mgcfqsm qtztn jqnhd mxz cxf rkhzrzq bplgbt jmvzd ntbr vxjt sfmqbl llpqf fdfzgq xrd zbhvl rvqjz svppj zts mztlt hfsmp zvbjx lpdfbg czpfj fnrb pvprzd vclhj nxffgkd smkdlqs sfjzfn hsdc zvhcv ckdz cmddh bjvks mqh fksjj jzcv gfvhp rzfcs jtqt ntz rrqmh bsnqhfg mjbv jjxp kdvbxj chpdjkf ntxnp jxbnb nrfmm jfj nxkr jxmlx jkqdv phnzt tkmsp cjv vjbrstq rmvrtcrf mskp ctmzb pvhcsn dcplpl ksk zjfls xtxsd (contains shellfish, sesame)',
'htfb ntszq dktj sfmqbl nrfmm vqkcm hhbn mqxrzv cmhfx ctmzb jkdv lgmz zts jrjdg cxf bplgbt fdfzgq pjm nxffgkd jfzm ckdz jxbnb mjbv kzlmds mnvvt pvhcsn cstcb slmr sgtd cjv vsqjf xxftp zgdr cnxbq phnzt pjn kbmxb dsntb bxns nmnr vjtlvq rvmqk hfsmp tvfb pvprzd qfdjlq gsfmr pmdqks blsqq chpdjkf bjvks zqrz jxmlx mskp xmpdtf jqnhd ltbj xhnc nb mbgvjc rtlg bsnqhfg bhvzg gfvhp gdpvd ktb xrd mmszz drmhm nphh zzkq fkzqq (contains dairy, nuts)',
'sfjzfn mztlt hgjmbqj gkcnh lzzc gpsr cmhfx rvqjz tvfb htfb qfdjlq sfmqbl ntbr jqnhd nrfmm pjn dvpmjzv cmddh qjvzrv zntsz lgmfmp ltbj xmpdtf pjm cstcb xdrkv scrvrrbf jtqt vjbrstq jkqdv rrqmh mmszz nvxkrv szhtvc jxbnb pvprzd pkscpx tkmsp bxns jxlzhm ktb hktr pzvkjv xtxsd hsdc lfnl ckdfvz tgvrbl jjxp vbl gdpvd lgmz llpqf tptjhd lpdfbg jfj phnzt fdfzgq dktj zgdr scrqn vjtlvq jrjdg fksjj vclhj vnmkhgt zzkq drmhm mqxrzv ztpqkt fkzqq pvhcsn mmgdmql njbkq hjsjb mgcfqsm jkdv pmdqks mqh dzmkz cqpqbr mskp jzcv lnshn zvhcv glxk vxjt qtztn mdgq (contains shellfish, wheat)',
'dmjqb scrqn kbfcck mgcfqsm xdrkv pzvkjv zzkq kbmxb hbxhrb zjfls tbhhf rzfcs zbhvl nrfmm cstcb tjbbb lfnl qvrqrj hsdc hgjmbqj gmlm sfjzfn skqzs mqh mnvvt jrjdg vvsjq dz chst pkscpx scrvrrbf xt ltbj sbvx lgmfmp pmdqks rvmqk xrd vnmkhgt ktb nphh vqkcm fkzqq rmvrtcrf fdfzgq ksk ckdz hlqq mskp vsqjf gjnspc cjv nxffgkd jzcv qtztn njbkq pjm mdgq ztpqkt vbl svppj fppzs pvhcsn qjvzrv czpfj tkmsp ntz tmrss hhbn zkhrz nnkfbt jxbnb sfmqbl rtlg chpdjkf ctmzb rrqmh kjcrdp bhtvt bplgbt ntbr pvprzd hfsmp zqrz kcktpbkr flrqnz jqnhd zvhcv (contains nuts, wheat)',
];
console.log(getSafeIngredientUses(parseFoods(day21input)));
