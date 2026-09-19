const $ = id => document.getElementById(id);

let queue = [];
let index = 0;
let mistakes = [];
let currentMistake = false;
let lastRange = null;

function render() {
  const item = queue[index];
  $("progress").textContent = `${index + 1} / ${queue.length}`;
  $("meaning").textContent = item.meaning;
  $("word").textContent = "·".repeat(item.word.length);
  $("answer").value = "";
  $("hint").textContent = "";
  currentMistake = false;
  $("answer").focus();
}

function start() {
  const from = Math.max(1, Math.min(1900, Number($("from").value) || 1));
  const to = Math.max(from, Math.min(1900, Number($("to").value) || from));

  lastRange = {from, to};
  queue = window.TARGET1900.filter(x => x.number >= from && x.number <= to);
  index = 0;
  mistakes = [];

  if (!queue.length) return;

  $("result").hidden = true;
  $("game").hidden = false;
  render();
}

function finish() {
  $("game").hidden = true;
  $("score").textContent =
    `${queue.length - mistakes.length} / ${queue.length} correct`;

  $("mistakes").textContent = mistakes.length
    ? mistakes.map(x => x.word).join(", ")
    : "なし";

  $("result").hidden = false;
}

$("start").addEventListener("click", start);

$("retry").addEventListener("click", () => {
  if (!lastRange) return;
  $("from").value = lastRange.from;
  $("to").value = lastRange.to;
  start();
});

$("answer").addEventListener("input", () => {
  const item = queue[index];
  if (!item) return;

  const typed = $("answer").value;
  const expected = item.word;

  if (!expected.startsWith(typed)) {
    if (!currentMistake) {
      mistakes.push(item);
      currentMistake = true;
    }
    $("hint").textContent = "wrong";
    return;
  }

  $("hint").textContent = "";

  if (typed === expected) {
    index++;
    if (index >= queue.length) finish();
    else render();
  }
});
