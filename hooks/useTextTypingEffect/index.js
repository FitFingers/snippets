Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

// ===================================================
// TYPING EFFECT PARAMETERS
// ===================================================

const options = {
  typeSpeed: 70,
  deleteSpeed: 45,
  pauseDuration: 500,
  delayFirstAnimate: 4000,
};

// ===================================================
// UTILS
// ===================================================

// Match the longest common substring. Used for when only half the text
// should type, i.e. Bürowelt, Bürouniversen, Büroidee
function getCommonSubstring(array) {
  let A = array.concat().sort(),
    a1 = A[0],
    a2 = A[A.length - 1],
    L = a1.length,
    i = 0;
  while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
  return a1.substring(0, i);
}

// Async function to create a pause / timing
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// Animate the typing of the word
async function typeWord(word, handler, pauseOnComplete) {
  for (const char of [...word]) {
    await sleep(options.typeSpeed);
    handler((str) => {
      return `${str}${char}`;
    });
  }
  await sleep(pauseOnComplete);
}

// Animate the deleting of the word
async function deleteWord(word, handler, pauseOnComplete) {
  for (const char of [...word]) {
    await sleep(options.deleteSpeed);
    handler((str) => str.slice(0, str.length - 1));
  }
  await sleep(pauseOnComplete);
}

// ===================================================
// THE HOOK
// ===================================================

const useTextTypingEffect = function ({ texts = [], infiniteLoop = false }) {
  const [string, setString] = react.useState("");

  // RESET
  react.useLayoutEffect(() => setString(""), []);

  // ANIMATE
  react.useLayoutEffect(() => {
    const commonPrefix = getCommonSubstring(
      texts?.map(({ text = "" }) => text)
    );

    async function animate(recursiveRun) {
      if (!recursiveRun) {
        // Delay start of animation
        await sleep(options.delayFirstAnimate);

        // Type the common prefix (this will always stay once first typed)
        await typeWord(commonPrefix, setString, 0);
      }

      // Loop all but the last text and type, then delete them
      for (const text of texts?.slice(
        0,
        texts?.length - (infiniteLoop ? 0 : 1)
      )) {
        await typeWord(
          text?.text?.slice(commonPrefix?.length),
          setString,
          options.pauseDuration
        );
        await deleteWord(
          text?.text?.slice(commonPrefix?.length),
          setString,
          options.pauseDuration
        );
      }

      if (!recursiveRun && !infiniteLoop) {
        // Type the final line of text without deleting
        await typeWord(
          texts?.[texts?.length - 1]?.text?.slice(commonPrefix?.length),
          setString,
          true
        );
      }

      if (infiniteLoop) animate(true);

      return () => console.log("DEBUG REMOVED");
    }

    animate();
  }, []);

  return string;
};

exports['default'] = useTextTypingEffect;
//# sourceMappingURL=index.js.map
