var currentExpression = "";
var lastResult = 0;

function toggleTheme() {
  var body = document.body;
  var btn = document.getElementById("theme-toggle");
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    btn.innerHTML = "☀️";
    btn.title = "Switch to light mode";
    localStorage.setItem("theme", "dark");
  } else {
    btn.innerHTML = "🌙";
    btn.title = "Switch to dark mode";
    localStorage.setItem("theme", "light");
  }
}

window.addEventListener("DOMContentLoaded", function () {
  var theme = localStorage.getItem("theme");
  var body = document.body;
  var btn = document.getElementById("theme-toggle");
  if (btn) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      btn.innerHTML = "☀️";
      btn.title = "Switch to light mode";
    } else {
      btn.innerHTML = "🌙";
      btn.title = "Switch to dark mode";
    }
  }
});

function appendToResult(value) {
  currentExpression += value.toString();
  updateResult();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateResult();
}

function operatorToResult(value) {
  currentExpression += value;
  updateResult();
}

function clearResult() {
  currentExpression = "";
  updateResult();
}

function insertLn() {
  currentExpression += "ln(";
  updateResult();
}

function calculateResult() {
  if (!currentExpression) return;
  try {
    var display = document.getElementById("result");
    var result = evaluateExpression(currentExpression, lastResult);
    lastResult = result;
    display.value = result;
    currentExpression = result.toString();
  } catch (e) {
    document.getElementById("result").value = "Error";
    currentExpression = "";
  }
}

function updateResult() {
  document.getElementById("result").value = currentExpression || "0";
}
