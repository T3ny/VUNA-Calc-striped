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

describe('ln function', () => {
  it('calculates natural log of a number', () => {
    expect(evaluateExpression('ln(1)')).toBe(0);
  });

  it('calculates ln(e) = 1', () => {
    expect(evaluateExpression('ln(2.718281828459045)')).toBeCloseTo(1, 4);
  });

  it('rejects ln of zero', () => {
    expect(() => evaluateExpression('ln(0)')).toThrow();
  });

  it('rejects ln of negative number', () => {
    expect(() => evaluateExpression('ln(-1)')).toThrow();
  });

  it('works in compound expression', () => {
    const result = evaluateExpression('ln(1)+5');
    expect(result).toBe(5);
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
