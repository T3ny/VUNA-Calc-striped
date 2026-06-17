var currentExpression = "";
var lastResult = 0;
var polynomialDegree = 2;

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
  setPolynomialDegree(2);
});

function appendToResult(value) {
  currentExpression += value.toString();
  updateResult();
}

function bracketToResult(value) {
  currentExpression += value;
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
  clearPolynomialInputs();
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
  var display = document.getElementById("result");
  if (display) {
    display.value = currentExpression || "0";
  }
}

function setPolynomialDegree(degree) {
  polynomialDegree = degree;
  var dCol = document.getElementById("coeff-d-col");
  var eCol = document.getElementById("coeff-e-col");
  var label = document.getElementById("poly-mode-label");

  if (dCol && eCol && label) {
    if (degree === 2) {
      dCol.style.display = "none";
      eCol.style.display = "none";
      label.textContent = "Quadratic solver";
    } else if (degree === 3) {
      dCol.style.display = "block";
      eCol.style.display = "none";
      label.textContent = "Cubic solver";
    } else if (degree === 4) {
      dCol.style.display = "block";
      eCol.style.display = "block";
      label.textContent = "Quartic solver";
    }
  }
}

function clearPolynomialInputs() {
  var ids = ["coeff-a", "coeff-b", "coeff-c", "coeff-d", "coeff-e"];
  ids.forEach(function (id) {
    var input = document.getElementById(id);
    if (input) {
      input.value = "";
    }
  });
  updateResult();
}

function solvePolynomial() {
  var a = parseFloat(document.getElementById("coeff-a").value);
  var b = parseFloat(document.getElementById("coeff-b").value);
  var c = parseFloat(document.getElementById("coeff-c").value);
  var d = parseFloat(document.getElementById("coeff-d").value);
  var e = parseFloat(document.getElementById("coeff-e").value);
  var display = document.getElementById("result");

  if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(c)) {
    display.value = "Enter coefficients";
    return;
  }
  if (a === 0) {
    display.value = "Leading coeff ≠ 0";
    return;
  }

  var roots = [];
  if (polynomialDegree === 2) {
    roots = solveQuadratic(a, b, c);
  } else if (polynomialDegree === 3) {
    if (Number.isNaN(d)) {
      display.value = "Enter d coefficient";
      return;
    }
    roots = findPolynomialRoots([a, b, c, d]);
  } else if (polynomialDegree === 4) {
    if (Number.isNaN(d) || Number.isNaN(e)) {
      display.value = "Enter d and e coefficients";
      return;
    }
    roots = findPolynomialRoots([a, b, c, d, e]);
  }

  if (!roots.length) {
    display.value = "No roots found";
    return;
  }

  display.value = roots.map(formatRoot).join(" | ");
  currentExpression = display.value;
}

function formatRoot(root) {
  if (Math.abs(root.im) < 1e-9) {
    return Number(root.re.toFixed(10)).toString();
  }
  var re = Number(root.re.toFixed(6));
  var im = Number(root.im.toFixed(6));
  return re + (im >= 0 ? " + " : " - ") + Math.abs(im) + "i";
}

function solveQuadratic(a, b, c) {
  var discriminant = b * b - 4 * a * c;
  if (discriminant >= 0) {
    var root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    var root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    return [{ re: root1, im: 0 }, { re: root2, im: 0 }];
  }
  var real = -b / (2 * a);
  var imag = Math.sqrt(-discriminant) / (2 * a);
  return [{ re: real, im: imag }, { re: real, im: -imag }];
}

function findPolynomialRoots(coeffs) {
  return durandKerner(coeffs);
}

function durandKerner(coeffs) {
  var degree = coeffs.length - 1;
  var roots = [];
  var radius = 1 + Math.max.apply(null, coeffs.slice(1).map(function (c) {
    return Math.abs(c / coeffs[0]);
  }));

  for (var i = 0; i < degree; i++) {
    var angle = (2 * Math.PI * i) / degree;
    roots.push(new Complex(radius * Math.cos(angle), radius * Math.sin(angle)));
  }

  for (var iteration = 0; iteration < 1000; iteration++) {
    var converged = true;
    for (var k = 0; k < degree; k++) {
      var denominator = new Complex(1, 0);
      for (var j = 0; j < degree; j++) {
        if (k === j) continue;
        denominator = denominator.mul(roots[k].sub(roots[j]));
      }
      var value = evaluatePolynomialComplex(coeffs, roots[k]);
      var correction = value.div(denominator);
      var nextRoot = roots[k].sub(correction);
      if (roots[k].sub(nextRoot).abs() > 1e-12) {
        converged = false;
      }
      roots[k] = nextRoot;
    }
    if (converged) {
      break;
    }
  }

  return roots;
}

function evaluatePolynomialComplex(coeffs, z) {
  var result = new Complex(0, 0);
  for (var i = 0; i < coeffs.length; i++) {
    var exponent = coeffs.length - 1 - i;
    var term = z.pow(exponent).mul(new Complex(coeffs[i], 0));
    result = result.add(term);
  }
  return result;
}

function Complex(re, im) {
  this.re = re;
  this.im = im;
}

Complex.prototype.add = function (other) {
  return new Complex(this.re + other.re, this.im + other.im);
};

Complex.prototype.sub = function (other) {
  return new Complex(this.re - other.re, this.im - other.im);
};

Complex.prototype.mul = function (other) {
  return new Complex(this.re * other.re - this.im * other.im, this.re * other.im + this.im * other.re);
};

Complex.prototype.div = function (other) {
  var denom = other.re * other.re + other.im * other.im;
  return new Complex((this.re * other.re + this.im * other.im) / denom, (this.im * other.re - this.re * other.im) / denom);
};

Complex.prototype.abs = function () {
  return Math.sqrt(this.re * this.re + this.im * this.im);
};

Complex.prototype.pow = function (exponent) {
  if (exponent === 0) return new Complex(1, 0);
  var result = new Complex(this.re, this.im);
  for (var i = 1; i < exponent; i++) {
    result = result.mul(this);
  }
  return result;
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    solveQuadratic,
    findPolynomialRoots,
    durandKerner,
    Complex,
  };
}
