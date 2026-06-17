'use strict';

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
    for (var i = 0; i < degree; i++) {
      var denominator = new Complex(1, 0);
      for (var j = 0; j < degree; j++) {
        if (i === j) continue;
        denominator = denominator.mul(roots[i].sub(roots[j]));
      }
      var value = evaluatePolynomialComplex(coeffs, roots[i]);
      var correction = value.div(denominator);
      var nextRoot = roots[i].sub(correction);
      if (roots[i].sub(nextRoot).abs() > 1e-12) {
        converged = false;
      }
      roots[i] = nextRoot;
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
