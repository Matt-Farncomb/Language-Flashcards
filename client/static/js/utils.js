// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  function nodeListContains(nodeList, element) {
    console.log("run");
    for (const node of nodeList) {
      if (element == node.value) {
        return true;
      }
    }
    return false;
    // let val = false;
    // nodeList.forEach(node => {
    //   if (element == node.value) {
    //     val = true;
    //   }
    // });
    // return val;
    
  }