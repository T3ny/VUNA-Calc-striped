const { evaluateExpression } = require('../src/calculator');

describe('arithmetic', () => {
  it('adds two numbers', () => {
    expect(evaluateExpression('2+3')).toBe(5);
  });

  it('subtracts two numbers', () => {
    expect(evaluateExpression('5-3')).toBe(2);
  });

  it('multiplies two numbers', () => {
    expect(evaluateExpression('4*3')).toBe(12);
  });

  it('divides two numbers', () => {
    expect(evaluateExpression('10/2')).toBe(5);
  });

  it('respects operator precedence', () => {
    expect(evaluateExpression('2+3*4')).toBe(14);
  });

  it('handles parentheses', () => {
    expect(evaluateExpression('(2+3)*4')).toBe(20);
  });

  it('handles decimal numbers', () => {
    expect(evaluateExpression('3.5+2.1')).toBeCloseTo(5.6);
  });

  it('handles negative numbers', () => {
    expect(evaluateExpression('-5+3')).toBe(-2);
  });

  it('handles chained operations', () => {
    expect(evaluateExpression('2+3+4')).toBe(9);
  });

  it('rejects division by zero', () => {
    expect(() => evaluateExpression('5/0')).toThrow();
  });

  it('rejects invalid characters', () => {
    expect(() => evaluateExpression('2&3')).toThrow();
  });
});

describe('ans feature', () => {
  it('uses last result in expression', () => {
    expect(evaluateExpression('ans+5', 10)).toBe(15);
  });

  it('handles ans with no previous result', () => {
    expect(evaluateExpression('ans+2')).toBe(2);
  });
});

describe('polynomial roots', () => {
  const { solveQuadratic, findPolynomialRoots, Complex } = require('../src/polynomial.js');

  it('solves quadratic with two real roots', () => {
    const roots = solveQuadratic(1, -3, 2);
    expect(roots.length).toBe(2);
    const values = roots.map((r) => r.re).sort((a, b) => a - b);
    expect(values).toEqual([1, 2]);
    expect(roots[0].im).toBe(0);
    expect(roots[1].im).toBe(0);
  });

  it('solves quadratic with complex roots', () => {
    const roots = solveQuadratic(1, 0, 1);
    expect(roots.length).toBe(2);
    expect(roots[0].re).toBeCloseTo(0);
    expect(Math.abs(roots[0].im)).toBeCloseTo(1);
    expect(Math.abs(roots[1].im)).toBeCloseTo(1);
  });

  it('finds cubic roots with Durand-Kerner', () => {
    const roots = findPolynomialRoots([1, -6, 11, -6]);
    const rootValues = roots.map((r) => Number(r.re.toFixed(6))).sort((a, b) => a - b);
    expect(rootValues).toEqual([1, 2, 3]);
  });

  it('finds quartic roots with Durand-Kerner', () => {
    const roots = findPolynomialRoots([1, -10, 35, -50, 24]);
    const rootValues = roots.map((r) => Number(r.re.toFixed(6))).sort((a, b) => a - b);
    expect(rootValues).toEqual([1, 2, 3, 4]);
  });

  it('computes complex power correctly', () => {
    const z = new Complex(0, 1);
    const squared = z.pow(2);
    expect(squared.re).toBeCloseTo(-1);
    expect(squared.im).toBeCloseTo(0);
  });
});
