// ── Question Bank ── EOT Grade 9 Advanced Mathematics ──────
// Parameterized templates: 20 MCQ tiles × 12 + 5 FRQ tiles × 5 = 265 questions

// ── Seeded RNG ─────────────────────────────────────────────
function seededRandom(seed) {
  let s = Math.abs(seed | 0) || 1;
  function next() {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  }
  return {
    next,
    nextInt(min, max) { return min + Math.floor(next() * (max - min + 1)); },
    nextFloat(min, max) { return min + next() * (max - min); },
    pick(arr) { return arr[Math.floor(next() * arr.length)]; },
    shuffle(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    nextIntNonZero(min, max) {
      let v;
      do { v = min + Math.floor(next() * (max - min + 1)); } while (v === 0);
      return v;
    }
  };
}

// Helper: format fraction
function fmtFrac(n, d) {
  if (d === 1) return `${n}`;
  if (d === -1) return `${-n}`;
  if (n === 0) return '0';
  const sign = (n < 0) !== (d < 0) ? '-' : '';
  const an = Math.abs(n), ad = Math.abs(d);
  const g = gcd(an, ad);
  const sn = an / g, sd = ad / g;
  if (sd === 1) return `${sign}${sn}`;
  return `${sign}\\frac{${sn}}{${sd}}`;
}
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

// Helper: shuffle options and reassign letters
function makeOptions(correct, wrongs, rng) {
  const all = [
    { text: correct.text, correct: true, whyWrong: '' },
    ...wrongs.map(w => ({ text: w.text, correct: false, whyWrong: w.why }))
  ];
  const shuffled = rng.shuffle(all);
  const letters = ['A', 'B', 'C', 'D'];
  return shuffled.map((o, i) => ({ letter: letters[i], ...o }));
}

// Helper: sign display
function signStr(n) { return n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`; }
function signCoef(n) {
  if (n === 1) return '';
  if (n === -1) return '-';
  return String(n);
}
function termStr(coef, v) {
  if (coef === 0) return '';
  if (coef === 1) return v;
  if (coef === -1) return `-${v}`;
  return `${coef}${v}`;
}
function addTermStr(coef, v) {
  if (coef === 0) return '';
  if (coef > 0) return `+ ${coef === 1 ? '' : coef}${v}`;
  if (coef === -1) return `- ${v}`;
  return `- ${Math.abs(coef)}${v}`;
}

const QUESTION_BANK = {};

// ═══════════════════════════════════════════════════════════
// TILE 1: Solve multi-step equations (p.88, L 2-3)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[1] = { tile: 1, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[1].questions;

  // Pattern 1: ax + b = c
  Q.push({ id:'q1_1', generate(seed) {
    const r = seededRandom(seed);
    const a = r.nextIntNonZero(2,9);
    const x = r.nextInt(-10,10);
    const b = r.nextInt(-15,15);
    const c = a*x + b;
    return {
      text: `Solve: $${a}x ${signStr(b)} = ${c}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${x + a}$`, why: `Added ${a} instead of dividing by it.` },
          { text: `$x = ${-x}$`, why: 'Sign error — forgot to account for the sign when dividing.' },
          { text: `$x = ${Math.round((c+b)/a)}$`, why: `Added $${b}$ instead of subtracting it.` }
        ], r),
      hints: [
        `Start by isolating the term with $x$. Subtract $${b}$ from both sides.`,
        `After subtracting: $${a}x = ${c - b}$. Now divide both sides by $${a}$.`,
        `<b>Worked example:</b> Solve $3x + 5 = 20$.<br>Subtract 5: $3x = 15$.<br>Divide by 3: $x = 5$.`
      ],
      explanation: `Subtract $${b}$ from both sides: $${a}x = ${c - b}$.<br>Divide by $${a}$: $x = ${x}$.`
    };
  }});

  // Pattern 2: ax - b = c
  Q.push({ id:'q1_2', generate(seed) {
    const r = seededRandom(seed);
    const a = r.nextIntNonZero(2,8);
    const x = r.nextInt(-8,12);
    const b = r.nextInt(1,15);
    const c = a*x - b;
    return {
      text: `Solve: $${a}x - ${b} = ${c}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${x - 1}$`, why: 'Arithmetic error in the final division step.' },
          { text: `$x = ${(c-b)/a !== x ? Math.round((c-b)/a) : x+2}$`, why: `Subtracted $${b}$ instead of adding it.` },
          { text: `$x = ${-x}$`, why: 'Sign error when dividing.' }
        ], r),
      hints: [
        `Add $${b}$ to both sides to isolate the variable term.`,
        `$${a}x = ${c + b}$. Divide both sides by $${a}$.`,
        `<b>Worked example:</b> Solve $4x - 3 = 17$.<br>Add 3: $4x = 20$.<br>Divide by 4: $x = 5$.`
      ],
      explanation: `Add $${b}$: $${a}x = ${c+b}$.<br>Divide by $${a}$: $x = ${x}$.`
    };
  }});

  // Pattern 3: x/a + b = c
  Q.push({ id:'q1_3', generate(seed) {
    const r = seededRandom(seed);
    const a = r.pick([2,3,4,5,6]);
    const x = a * r.nextInt(-5,8);
    const b = r.nextInt(-10,10);
    const c = x/a + b;
    return {
      text: `Solve: $\\frac{x}{${a}} ${signStr(b)} = ${c}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${c - b}$`, why: `Forgot to multiply by $${a}$ after subtracting.` },
          { text: `$x = ${a*(c+b)}$`, why: `Added $${b}$ instead of subtracting it.` },
          { text: `$x = ${-x}$`, why: 'Sign error.' }
        ], r),
      hints: [
        `Subtract $${b}$ from both sides first.`,
        `$\\frac{x}{${a}} = ${c - b}$. Multiply both sides by $${a}$.`,
        `<b>Worked example:</b> Solve $\\frac{x}{3} + 4 = 7$.<br>Subtract 4: $\\frac{x}{3} = 3$.<br>Multiply by 3: $x = 9$.`
      ],
      explanation: `Subtract $${b}$: $\\frac{x}{${a}} = ${c-b}$.<br>Multiply by $${a}$: $x = ${x}$.`
    };
  }});

  // Pattern 4: -ax + b = c
  Q.push({ id:'q1_4', generate(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2,7);
    const x = r.nextInt(-8,8);
    const b = r.nextInt(1,15);
    const c = -a*x + b;
    return {
      text: `Solve: $-${a}x + ${b} = ${c}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${-x}$`, why: `Forgot the negative sign on $${a}$.` },
          { text: `$x = ${x+1}$`, why: 'Arithmetic error in division.' },
          { text: `$x = ${Math.round((c+b)/a)}$`, why: 'Added instead of subtracted, then divided by positive.' }
        ], r),
      hints: [
        `Subtract $${b}$ from both sides.`,
        `$-${a}x = ${c - b}$. Divide both sides by $-${a}$.`,
        `<b>Worked example:</b> Solve $-2x + 9 = 3$.<br>Subtract 9: $-2x = -6$.<br>Divide by $-2$: $x = 3$.`
      ],
      explanation: `Subtract $${b}$: $-${a}x = ${c-b}$.<br>Divide by $-${a}$: $x = \\frac{${c-b}}{-${a}} = ${x}$.`
    };
  }});

  // Pattern 5: a(x + b) = c
  Q.push({ id:'q1_5', generate(seed) {
    const r = seededRandom(seed);
    const a = r.nextIntNonZero(2,6);
    const x = r.nextInt(-8,8);
    const b = r.nextIntNonZero(-9,9);
    const c = a*(x + b);
    return {
      text: `Solve: $${a}(x ${signStr(b)}) = ${c}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${x + b}$`, why: 'Divided but forgot to subtract the constant inside the parentheses.' },
          { text: `$x = ${c/a}$`, why: `Divided by $${a}$ but did not subtract $${b}$.` },
          { text: `$x = ${-x}$`, why: 'Sign error.' }
        ], r),
      hints: [
        `Divide both sides by $${a}$ first, or distribute $${a}$.`,
        `Dividing: $x ${signStr(b)} = ${c/a}$. Then subtract $${b}$.`,
        `<b>Worked example:</b> Solve $3(x + 2) = 21$.<br>Divide by 3: $x + 2 = 7$.<br>Subtract 2: $x = 5$.`
      ],
      explanation: `Divide by $${a}$: $x ${signStr(b)} = ${c/a}$.<br>Subtract $${b}$: $x = ${x}$.`
    };
  }});

  // Pattern 6: ax + b = cx + d → combine
  Q.push({ id:'q1_6', generate(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(3,8);
    const x = r.nextInt(-6,10);
    const b = r.nextInt(-12,12);
    const c2 = a - r.nextIntNonZero(1,4);
    const d = (a - c2)*x + b;
    return {
      text: `Solve: $${a}x ${signStr(b)} = ${c2}x + ${d}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${-x}$`, why: 'Sign error when combining like terms.' },
          { text: `$x = ${x+2}$`, why: 'Arithmetic mistake.' },
          { text: `$x = ${Math.round(d/(a+c2))}$`, why: 'Added coefficients instead of subtracting.' }
        ], r),
      hints: [
        `Subtract $${c2}x$ from both sides to get the $x$ terms on one side.`,
        `$${a-c2}x ${signStr(b)} = ${d}$. Then subtract $${b}$.`,
        `<b>Worked example:</b> Solve $5x + 3 = 2x + 12$.<br>Subtract $2x$: $3x + 3 = 12$.<br>Subtract 3: $3x = 9$. Divide by 3: $x = 3$.`
      ],
      explanation: `Subtract $${c2}x$: $${a-c2}x ${signStr(b)} = ${d}$.<br>Subtract $${b}$: $${a-c2}x = ${d-b}$.<br>Divide by $${a-c2}$: $x = ${x}$.`
    };
  }});

  // Pattern 7: 2(x - b) + c = d
  Q.push({ id:'q1_7', generate(seed) {
    const r = seededRandom(seed);
    const a = r.pick([2,3,4]);
    const x = r.nextInt(-5,10);
    const b = r.nextInt(1,8);
    const c = r.nextInt(-10,10);
    const d = a*(x - b) + c;
    return {
      text: `Solve: $${a}(x - ${b}) + ${c} = ${d}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${x + b}$`, why: 'Forgot to add back $b$ after distributing.' },
          { text: `$x = ${-x}$`, why: 'Sign error.' },
          { text: `$x = ${Math.round((d-c)/a)}$`, why: 'Divided by $a$ but forgot the $-b$ inside.' }
        ], r),
      hints: [
        `Distribute $${a}$: $${a}x - ${a*b} + ${c} = ${d}$.`,
        `Combine constants: $${a}x ${signStr(-a*b + c)} = ${d}$.`,
        `<b>Worked example:</b> Solve $2(x - 3) + 4 = 10$.<br>Distribute: $2x - 6 + 4 = 10$.<br>Combine: $2x - 2 = 10$. Add 2: $2x = 12$. Divide: $x = 6$.`
      ],
      explanation: `Distribute: $${a}x - ${a*b} + ${c} = ${d}$.<br>Combine: $${a}x ${signStr(-a*b+c)} = ${d}$.<br>Add $${a*b-c}$: $${a}x = ${d + a*b - c}$.<br>$x = ${x}$.`
    };
  }});

  // Pattern 8: decimal: 0.5x + b = c
  Q.push({ id:'q1_8', generate(seed) {
    const r = seededRandom(seed);
    const coefs = [0.5, 0.25, 1.5, 2.5];
    const a = r.pick(coefs);
    const x = r.nextInt(-8,8) * 2; // ensure integer answer
    const b = r.nextInt(-10,10);
    const c = a*x + b;
    return {
      text: `Solve: $${a}x ${signStr(b)} = ${c}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${x * 2}$`, why: `Multiplied instead of dividing by $${a}$.` },
          { text: `$x = ${-x}$`, why: 'Sign error.' },
          { text: `$x = ${Math.round(c/a)}$`, why: `Forgot to subtract $${b}$ first.` }
        ], r),
      hints: [
        `Subtract $${b}$ from both sides.`,
        `$${a}x = ${c - b}$. Divide by $${a}$.`,
        `<b>Worked example:</b> Solve $0.5x + 3 = 7$.<br>Subtract 3: $0.5x = 4$.<br>Divide by 0.5: $x = 8$.`
      ],
      explanation: `Subtract $${b}$: $${a}x = ${c-b}$.<br>Divide by $${a}$: $x = ${x}$.`
    };
  }});

  // Pattern 9: a - bx = c
  Q.push({ id:'q1_9', generate(seed) {
    const r = seededRandom(seed);
    const b = r.nextInt(2,7);
    const x = r.nextInt(-6,8);
    const a = r.nextInt(5,20);
    const c = a - b*x;
    return {
      text: `Solve: $${a} - ${b}x = ${c}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${-x}$`, why: 'Forgot to divide by negative.' },
          { text: `$x = ${Math.round((a+c)/b)}$`, why: 'Added instead of subtracting $a$.' },
          { text: `$x = ${x - 1}$`, why: 'Arithmetic error.' }
        ], r),
      hints: [
        `Subtract $${a}$ from both sides to get $-${b}x = ${c - a}$.`,
        `Divide by $-${b}$: $x = \\frac{${c-a}}{-${b}}$.`,
        `<b>Worked example:</b> Solve $10 - 3x = 4$.<br>Subtract 10: $-3x = -6$.<br>Divide by $-3$: $x = 2$.`
      ],
      explanation: `Subtract $${a}$: $-${b}x = ${c-a}$.<br>Divide by $-${b}$: $x = ${x}$.`
    };
  }});

  // Pattern 10: (x + a)/b = c
  Q.push({ id:'q1_10', generate(seed) {
    const r = seededRandom(seed);
    const b = r.pick([2,3,4,5]);
    const x = r.nextInt(-10,10);
    const a = r.nextIntNonZero(-8,8);
    const c = (x + a)/b;
    const cx = b * Math.round(c); // ensure clean
    const xClean = cx - a;
    return {
      text: `Solve: $\\frac{x ${signStr(a)}}{${b}} = ${cx/b}$`,
      options: makeOptions(
        { text: `$x = ${xClean}$` },
        [
          { text: `$x = ${cx}$`, why: `Multiplied by $${b}$ but forgot to subtract $${a}$.` },
          { text: `$x = ${xClean + a}$`, why: 'Added instead of subtracting.' },
          { text: `$x = ${-xClean}$`, why: 'Sign error.' }
        ], r),
      hints: [
        `Multiply both sides by $${b}$.`,
        `$x ${signStr(a)} = ${cx}$. Subtract $${a}$.`,
        `<b>Worked example:</b> Solve $\\frac{x + 3}{4} = 5$.<br>Multiply by 4: $x + 3 = 20$.<br>Subtract 3: $x = 17$.`
      ],
      explanation: `Multiply by $${b}$: $x ${signStr(a)} = ${cx}$.<br>Subtract $${a}$: $x = ${xClean}$.`
    };
  }});

  // Pattern 11: a(bx + c) = d
  Q.push({ id:'q1_11', generate(seed) {
    const r = seededRandom(seed);
    const a = r.pick([2,3,4,5]);
    const b = r.pick([2,3]);
    const x = r.nextInt(-5,8);
    const c = r.nextIntNonZero(-6,6);
    const d = a*(b*x + c);
    return {
      text: `Solve: $${a}(${b}x ${signStr(c)}) = ${d}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${x + c}$`, why: 'Did not properly isolate $x$.' },
          { text: `$x = ${Math.round(d/a)}$`, why: 'Divided by $a$ but did not handle the constant or $b$.' },
          { text: `$x = ${-x}$`, why: 'Sign error.' }
        ], r),
      hints: [
        `Divide both sides by $${a}$, or distribute.`,
        `$${b}x ${signStr(c)} = ${d/a}$. Subtract $${c}$: $${b}x = ${d/a - c}$.`,
        `<b>Worked example:</b> Solve $2(3x + 1) = 20$.<br>Divide by 2: $3x + 1 = 10$.<br>Subtract 1: $3x = 9$. Divide by 3: $x = 3$.`
      ],
      explanation: `Divide by $${a}$: $${b}x ${signStr(c)} = ${d/a}$.<br>Subtract $${c}$: $${b}x = ${d/a - c}$.<br>Divide by $${b}$: $x = ${x}$.`
    };
  }});

  // Pattern 12: ax/b + c = d (fraction coefficient)
  Q.push({ id:'q1_12', generate(seed) {
    const r = seededRandom(seed);
    const b = r.pick([2,3,4,5]);
    const a = r.nextIntNonZero(1,4) * (r.next() > 0.5 ? 1 : -1);
    const x = b * r.nextInt(-4,6);
    const c = r.nextInt(-10,10);
    const d = (a*x)/b + c;
    return {
      text: `Solve: $${fmtFrac(a,b)}x ${signStr(c)} = ${d}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${(d-c)*b}$`, why: 'Multiplied by $b$ but did not divide by $a$.' },
          { text: `$x = ${-x}$`, why: 'Sign error.' },
          { text: `$x = ${Math.round((d+c)*b/a)}$`, why: 'Added instead of subtracting the constant.' }
        ], r),
      hints: [
        `Subtract $${c}$ from both sides.`,
        `$${fmtFrac(a,b)}x = ${d-c}$. Multiply by the reciprocal $${fmtFrac(b,a)}$.`,
        `<b>Worked example:</b> Solve $\\frac{2}{3}x + 1 = 5$.<br>Subtract 1: $\\frac{2}{3}x = 4$.<br>Multiply by $\\frac{3}{2}$: $x = 6$.`
      ],
      explanation: `Subtract $${c}$: $${fmtFrac(a,b)}x = ${d-c}$.<br>Multiply by $${fmtFrac(b,a)}$: $x = ${x}$.`
    };
  }});
})();

// ═══════════════════════════════════════════════════════════
// TILE 2: Translate sentences into equations (p.71, L 2-1)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[2] = { tile: 2, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[2].questions;
  const patterns = [
    { tmpl: (a,b,c) => ({ sentence: `${a} more than ${b} times a number is ${c}`, eq: `${b}x + ${a} = ${c}`, x: (c-a)/b }),
      wrongEqs: (a,b,c) => [
        { text: `$${b}x - ${a} = ${c}$`, why: '"more than" means addition, not subtraction.' },
        { text: `$${a}x + ${b} = ${c}$`, why: 'Swapped the coefficient and the constant.' },
        { text: `$${b}x + ${a} = ${c-a}$`, why: 'Incorrectly subtracted from the result side.' }
      ]},
    { tmpl: (a,b,c) => ({ sentence: `${a} less than ${b} times a number equals ${c}`, eq: `${b}x - ${a} = ${c}`, x: (c+a)/b }),
      wrongEqs: (a,b,c) => [
        { text: `$${b}x + ${a} = ${c}$`, why: '"less than" means subtraction, not addition.' },
        { text: `$${a} - ${b}x = ${c}$`, why: 'Reversed the order of subtraction.' },
        { text: `$${b}x - ${a} = ${c+a}$`, why: 'Incorrectly modified the right side.' }
      ]},
    { tmpl: (a,b,c) => ({ sentence: `The sum of ${b} times a number and ${a} is ${c}`, eq: `${b}x + ${a} = ${c}`, x: (c-a)/b }),
      wrongEqs: (a,b,c) => [
        { text: `$${b}(x + ${a}) = ${c}$`, why: '"sum of $bx$ and $a$" is $bx + a$, not $b(x+a)$.' },
        { text: `$${b}x - ${a} = ${c}$`, why: '"sum" means addition.' },
        { text: `$${a}x + ${b} = ${c}$`, why: 'Swapped $a$ and $b$.' }
      ]},
    { tmpl: (a,b,c) => ({ sentence: `Twice a number decreased by ${a} gives ${c}`, eq: `2x - ${a} = ${c}`, x: (c+a)/2 }),
      wrongEqs: (a,b,c) => [
        { text: `$2x + ${a} = ${c}$`, why: '"decreased by" means subtraction.' },
        { text: `$2(x - ${a}) = ${c}$`, why: 'Distributed 2 into the subtraction incorrectly.' },
        { text: `$x - ${a} = ${c}$`, why: 'Forgot "twice" means multiply by 2.' }
      ]},
    { tmpl: (a,b,c) => ({ sentence: `The product of ${b} and a number, increased by ${a}, is ${c}`, eq: `${b}x + ${a} = ${c}`, x: (c-a)/b }),
      wrongEqs: (a,b,c) => [
        { text: `$${b} + ${a}x = ${c}$`, why: 'Confused which value is the coefficient.' },
        { text: `$${b}x \\cdot ${a} = ${c}$`, why: '"increased by" means addition, not multiplication.' },
        { text: `$${b}x - ${a} = ${c}$`, why: '"increased" means add, not subtract.' }
      ]},
    { tmpl: (a,b,c) => ({ sentence: `A number divided by ${b}, plus ${a}, equals ${c}`, eq: `\\frac{x}{${b}} + ${a} = ${c}`, x: (c-a)*b }),
      wrongEqs: (a,b,c) => [
        { text: `$\\frac{x}{${b}} - ${a} = ${c}$`, why: '"plus" means add, not subtract.' },
        { text: `$${b}x + ${a} = ${c}$`, why: '"divided by" means $\\div$, not $\\times$.' },
        { text: `$\\frac{x + ${a}}{${b}} = ${c}$`, why: 'Only $x$ is divided, then $a$ is added.' }
      ]},
    { tmpl: (a,b,c) => ({ sentence: `Three times the difference of a number and ${a} is ${c}`, eq: `3(x - ${a}) = ${c}`, x: c/3 + a }),
      wrongEqs: (a,b,c) => [
        { text: `$3x - ${a} = ${c}$`, why: '"three times the difference" means $3(x - a)$, not $3x - a$.' },
        { text: `$3(x + ${a}) = ${c}$`, why: '"difference" means subtraction.' },
        { text: `$3x - 3 = ${c}$`, why: 'Replaced $a$ with the multiplier.' }
      ]},
    { tmpl: (a,b,c) => ({ sentence: `Half of a number added to ${a} gives ${c}`, eq: `\\frac{x}{2} + ${a} = ${c}`, x: (c-a)*2 }),
      wrongEqs: (a,b,c) => [
        { text: `$2x + ${a} = ${c}$`, why: '"half" means $\\div 2$, not $\\times 2$.' },
        { text: `$\\frac{x}{2} - ${a} = ${c}$`, why: '"added to" means $+$.' },
        { text: `$\\frac{x + ${a}}{2} = ${c}$`, why: 'Only $x$ is halved, then $a$ is added.' }
      ]},
    { tmpl: (a,b,c) => ({ sentence: `${a} subtracted from ${b} times a number is ${c}`, eq: `${b}x - ${a} = ${c}`, x: (c+a)/b }),
      wrongEqs: (a,b,c) => [
        { text: `$${a} - ${b}x = ${c}$`, why: '"$a$ subtracted from $bx$" is $bx - a$, not $a - bx$.' },
        { text: `$${b}x + ${a} = ${c}$`, why: '"subtracted" means minus.' },
        { text: `$${b}x - ${a} = ${c+1}$`, why: 'Arithmetic error on the right side.' }
      ]},
    { tmpl: (a,b,c) => ({ sentence: `The quotient of a number and ${b}, decreased by ${a}, equals ${c}`, eq: `\\frac{x}{${b}} - ${a} = ${c}`, x: (c+a)*b }),
      wrongEqs: (a,b,c) => [
        { text: `$\\frac{x}{${b}} + ${a} = ${c}$`, why: '"decreased by" means subtraction.' },
        { text: `$${b}x - ${a} = ${c}$`, why: '"quotient" means division, not multiplication.' },
        { text: `$\\frac{x - ${a}}{${b}} = ${c}$`, why: 'The decrease happens after the division.' }
      ]},
    { tmpl: (a,b,c) => ({ sentence: `If you add ${a} to four times a number, the result is ${c}`, eq: `4x + ${a} = ${c}`, x: (c-a)/4 }),
      wrongEqs: (a,b,c) => [
        { text: `$4(x + ${a}) = ${c}$`, why: 'Only $x$ is multiplied by 4, then $a$ is added separately.' },
        { text: `$4x - ${a} = ${c}$`, why: '"add" means $+$, not $-$.' },
        { text: `$${a}x + 4 = ${c}$`, why: 'Swapped $a$ and 4.' }
      ]},
    { tmpl: (a,b,c) => ({ sentence: `The difference between five times a number and ${a} is ${c}`, eq: `5x - ${a} = ${c}`, x: (c+a)/5 }),
      wrongEqs: (a,b,c) => [
        { text: `$${a} - 5x = ${c}$`, why: '"five times a number" comes first in "difference between A and B".' },
        { text: `$5x + ${a} = ${c}$`, why: '"difference" means subtraction.' },
        { text: `$5(x - ${a}) = ${c}$`, why: 'Only $x$ is multiplied by 5, then $a$ is subtracted.' }
      ]},
  ];

  patterns.forEach((p, idx) => {
    Q.push({ id: `q2_${idx+1}`, generate(seed) {
      const r = seededRandom(seed);
      // Choose numbers that give integer answers
      let a, b, c, data;
      for (let tries = 0; tries < 20; tries++) {
        b = r.pick([2,3,4,5,6]);
        a = r.nextInt(1, 12);
        const x = r.nextInt(-5, 10);
        c = b * x + a; // for "more than" pattern
        data = p.tmpl(a, b, c);
        if (Number.isInteger(data.x) && Math.abs(data.x) < 50) break;
      }
      const wrongs = p.wrongEqs(a, b, c);
      return {
        text: `Which equation represents: "${data.sentence}"?`,
        options: makeOptions(
          { text: `$${data.eq}$` },
          wrongs, r),
        hints: [
          'Identify the operation words: "more than" = add, "less than" = subtract, "times" = multiply, "quotient/divided" = divide.',
          `Translate piece by piece. The unknown number is $x$.`,
          `<b>Worked example:</b> "7 more than 2 times a number is 19"<br>→ $2x + 7 = 19$<br>Solve: $2x = 12$, $x = 6$.`
        ],
        explanation: `"${data.sentence}" translates to $${data.eq}$.`
      };
    }});
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 3: Solve equations with variable on each side (p.97, L 2-4)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[3] = { tile: 3, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[3].questions;

  // Patterns 1-8: normal solutions, patterns 9-10: no solution, 11-12: identity
  function makeQ3(idx, genFn) { Q.push({ id: `q3_${idx}`, generate: genFn }); }

  // 1: ax + b = cx + d
  makeQ3(1, function(seed) {
    const r = seededRandom(seed);
    const x = r.nextInt(-8, 10);
    const a = r.nextInt(3, 9);
    const c = r.nextInt(1, a - 1);
    const b = r.nextInt(-12, 12);
    const d = (a - c) * x + b;
    return {
      text: `Solve: $${a}x ${signStr(b)} = ${c}x + ${d}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${-x}$`, why: 'Sign error when moving terms.' },
          { text: `$x = ${x + 1}$`, why: 'Arithmetic error in division.' },
          { text: `$x = ${Math.round((d-b)/(a+c))}$`, why: 'Added coefficients instead of subtracting.' }
        ], r),
      hints: [
        `Move all $x$ terms to one side: subtract $${c}x$ from both sides.`,
        `$${a-c}x ${signStr(b)} = ${d}$. Now subtract $${b}$.`,
        `<b>Worked example:</b> Solve $7x + 2 = 3x + 18$.<br>Subtract $3x$: $4x + 2 = 18$.<br>Subtract 2: $4x = 16$. $x = 4$.`
      ],
      explanation: `$${a}x - ${c}x ${signStr(b)} = ${d}$<br>$${a-c}x = ${d - b}$<br>$x = ${x}$`
    };
  });

  // 2: ax - b = cx + d
  makeQ3(2, function(seed) {
    const r = seededRandom(seed);
    const x = r.nextInt(-6, 10);
    const a = r.nextInt(4, 9);
    const c = r.nextInt(1, a - 1);
    const b = r.nextInt(1, 12);
    const d = (a - c) * x - b;
    return {
      text: `Solve: $${a}x - ${b} = ${c}x + ${d}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${-x}$`, why: 'Sign error.' },
          { text: `$x = ${Math.round((d+b)/(a-c+2))}$`, why: 'Error subtracting coefficients.' },
          { text: `$x = ${x - 1}$`, why: 'Off by one from arithmetic error.' }
        ], r),
      hints: [
        `Subtract $${c}x$ from both sides.`,
        `$${a-c}x - ${b} = ${d}$. Add $${b}$ to both sides.`,
        `<b>Worked example:</b> Solve $6x - 5 = 2x + 7$.<br>Subtract $2x$: $4x - 5 = 7$. Add 5: $4x = 12$. $x = 3$.`
      ],
      explanation: `$${a-c}x - ${b} = ${d}$<br>$${a-c}x = ${d+b}$<br>$x = ${x}$`
    };
  });

  // 3-8: More variations
  makeQ3(3, function(seed) {
    const r = seededRandom(seed);
    const x = r.nextInt(-5, 8);
    const a = r.nextIntNonZero(-6, -2);
    const c = r.nextInt(1, 5);
    const b = r.nextInt(1, 12);
    const d = (a - c) * x + b;
    return {
      text: `Solve: $${a}x + ${b} = ${c}x + ${d}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${-x}$`, why: 'Sign error with negative coefficients.' },
          { text: `$x = ${x + 2}$`, why: 'Arithmetic error.' },
          { text: `$x = 0$`, why: 'Incorrect simplification.' }
        ], r),
      hints: [
        `Subtract $${c}x$ from both sides (careful with the negative on the left).`,
        `Combine: $${a-c}x + ${b} = ${d}$. Subtract $${b}$.`,
        `<b>Worked example:</b> Solve $-3x + 4 = 2x - 11$. Subtract $2x$: $-5x + 4 = -11$. Subtract 4: $-5x = -15$. $x = 3$.`
      ],
      explanation: `$${a-c}x + ${b} = ${d}$<br>$${a-c}x = ${d-b}$<br>$x = ${x}$`
    };
  });

  makeQ3(4, function(seed) {
    const r = seededRandom(seed);
    const x = r.nextInt(-8, 8);
    const a = r.nextInt(2, 6);
    const b = r.nextInt(1, 10);
    const c = r.nextInt(1, 5);
    const d = r.nextInt(1, 10);
    const rhs = a * x + b;
    const lhsConst = rhs - c * x - d;
    // a*x + b = c*x + (a-c)*x + b = rhs. Let's just set it up properly.
    const ans = (d + b) !== 0 ? x : x + 1;
    const A = r.nextInt(2,7); const C = r.nextInt(1, A-1 > 0 ? A-1 : 1);
    const B = r.nextInt(-10,10);
    const D = (A-C)*ans + B;
    return {
      text: `Solve: $${A}x ${signStr(B)} = ${C}x + ${D}$`,
      options: makeOptions(
        { text: `$x = ${ans}$` },
        [
          { text: `$x = ${ans + 1}$`, why: 'Arithmetic error.' },
          { text: `$x = ${-ans}$`, why: 'Sign error.' },
          { text: `$x = ${ans * 2}$`, why: 'Forgot to combine like terms correctly.' }
        ], r),
      hints: [
        `Subtract $${C}x$ from both sides.`,
        `$${A-C}x ${signStr(B)} = ${D}$. Solve the two-step equation.`,
        `<b>Worked example:</b> Solve $5x + 1 = 3x + 9$. Subtract $3x$: $2x + 1 = 9$. Subtract 1: $2x = 8$. $x = 4$.`
      ],
      explanation: `Subtract $${C}x$: $${A-C}x ${signStr(B)} = ${D}$.<br>Subtract $${B}$: $${A-C}x = ${D-B}$.<br>$x = ${ans}$.`
    };
  });

  makeQ3(5, function(seed) {
    const r = seededRandom(seed);
    // 2(x + a) = x + b
    const x = r.nextInt(-5, 10);
    const a = r.nextIntNonZero(-8, 8);
    const b = 2*(x+a) - x;
    return {
      text: `Solve: $2(x ${signStr(a)}) = x + ${b}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${b - 2*a}$`, why: 'Did not distribute 2 correctly.' },
          { text: `$x = ${-x}$`, why: 'Sign error.' },
          { text: `$x = ${x + a}$`, why: 'Forgot to subtract the constant.' }
        ], r),
      hints: [
        `Distribute the 2: $2x ${signStr(2*a)} = x + ${b}$.`,
        `Subtract $x$ from both sides: $x ${signStr(2*a)} = ${b}$.`,
        `<b>Worked example:</b> Solve $2(x + 3) = x + 10$. Distribute: $2x + 6 = x + 10$. Subtract $x$: $x + 6 = 10$. $x = 4$.`
      ],
      explanation: `Distribute: $2x ${signStr(2*a)} = x + ${b}$.<br>Subtract $x$: $x ${signStr(2*a)} = ${b}$.<br>$x = ${x}$.`
    };
  });

  makeQ3(6, function(seed) {
    const r = seededRandom(seed);
    // a(x + b) = c(x + d)
    const a = r.pick([2,3]);
    const c = r.pick([4,5]);
    const x = r.nextInt(-6, 8);
    const b = r.nextIntNonZero(-5, 5);
    const d = (a*(x+b) - c*x) / c;
    const dClean = Math.round(d);
    const xClean = (c*dClean - a*b) / (a - c);
    if (!Number.isInteger(xClean)) {
      // Fallback
      const xx = r.nextInt(-4, 6);
      const bb = r.nextInt(1, 5);
      const dd = (a*(xx+bb))/c - xx;
      return {
        text: `Solve: $${a}(x + ${bb}) = ${c}x + ${a*(xx+bb) - c*xx}$`,
        options: makeOptions(
          { text: `$x = ${xx}$` },
          [
            { text: `$x = ${-xx}$`, why: 'Sign error.' },
            { text: `$x = ${xx+1}$`, why: 'Arithmetic error.' },
            { text: `$x = ${xx-1}$`, why: 'Off by one.' }
          ], r),
        hints: ['Distribute and collect terms.','Move $x$ terms to one side.','<b>Worked example:</b> $2(x+3)=5x-3$ → $2x+6=5x-3$ → $9=3x$ → $x=3$.'],
        explanation: `Distribute and solve.`
      };
    }
    return {
      text: `Solve: $${a}(x ${signStr(b)}) = ${c}(x ${signStr(dClean)})$`,
      options: makeOptions(
        { text: `$x = ${xClean}$` },
        [
          { text: `$x = ${-xClean}$`, why: 'Sign error.' },
          { text: `$x = ${xClean + 1}$`, why: 'Arithmetic error.' },
          { text: `$x = ${Math.round(xClean/2)}$`, why: 'Divided incorrectly.' }
        ], r),
      hints: [
        `Distribute on both sides: $${a}x ${signStr(a*b)} = ${c}x ${signStr(c*dClean)}$.`,
        `Move $x$ terms to one side: $${a-c}x = ${c*dClean - a*b}$.`,
        `<b>Worked example:</b> $2(x+3) = 4(x-1)$ → $2x+6=4x-4$ → $10=2x$ → $x=5$.`
      ],
      explanation: `Distribute: $${a}x ${signStr(a*b)} = ${c}x ${signStr(c*dClean)}$.<br>$${a-c}x = ${c*dClean - a*b}$.<br>$x = ${xClean}$.`
    };
  });

  // 7-8: more
  makeQ3(7, function(seed) {
    const r = seededRandom(seed);
    const x = r.nextInt(-6,8);
    const a = r.nextInt(2,5); const b = r.nextInt(1,8);
    const c = r.nextInt(1,3); const d = (a+c)*x + b;
    return {
      text: `Solve: $${a}x + ${b} = -${c}x + ${d}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${-x}$`, why: 'Sign error.' },
          { text: `$x = ${x+1}$`, why: 'Arithmetic mistake.' },
          { text: `$x = ${Math.round((d-b)/(a-c))}$`, why: 'Subtracted $c$ instead of adding when moving terms.' }
        ], r),
      hints: ['Add $'+c+'x$ to both sides.','$'+(a+c)+'x + '+b+' = '+d+'$. Subtract $'+b+'$.','<b>Worked example:</b> $3x+2=-2x+17$ → $5x+2=17$ → $5x=15$ → $x=3$.'],
      explanation: `Add $${c}x$: $${a+c}x + ${b} = ${d}$. Subtract $${b}$: $${a+c}x = ${d-b}$. $x=${x}$.`
    };
  });

  makeQ3(8, function(seed) {
    const r = seededRandom(seed);
    const x = r.nextInt(-5,8);
    const a = r.nextInt(2,6);
    const b = r.nextIntNonZero(-8,8);
    const rhs = a*x + b + x;
    return {
      text: `Solve: $${a}x ${signStr(b)} = -x + ${rhs}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${-x}$`, why: 'Sign error.' },
          { text: `$x = ${x+2}$`, why: 'Arithmetic error.' },
          { text: `$x = ${Math.round(rhs/(a-1))}$`, why: 'Subtracted instead of adding $x$.' }
        ], r),
      hints: ['Add $x$ to both sides.','$'+(a+1)+'x '+signStr(b)+' = '+rhs+'$.','<b>Worked example:</b> $4x+3=-x+18$ → $5x+3=18$ → $x=3$.'],
      explanation: `Add $x$: $${a+1}x ${signStr(b)} = ${rhs}$. $${a+1}x = ${rhs-b}$. $x = ${x}$.`
    };
  });

  // 9-10: No solution
  makeQ3(9, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2,7);
    const b = r.nextInt(1,10);
    const c = r.nextInt(1,10);
    while (b === c) c = b + r.nextInt(1,5);
    return {
      text: `Solve: $${a}x + ${b} = ${a}x + ${b + r.nextInt(1,5)}$`,
      options: makeOptions(
        { text: 'No solution' },
        [
          { text: `$x = 0$`, why: 'When both sides have the same $x$ coefficient but different constants, there is no $x$ that works.' },
          { text: `$x = ${b}$`, why: 'This is a constant from the equation, not the solution.' },
          { text: 'All real numbers', why: 'That would require both sides to be identical, but the constants differ.' }
        ], r),
      hints: [
        `Subtract $${a}x$ from both sides. What happens?`,
        'You get a false statement like $5 = 8$. What does that mean?',
        '<b>Worked example:</b> $3x + 4 = 3x + 9$. Subtract $3x$: $4 = 9$ — false! → No solution.'
      ],
      explanation: `Subtracting $${a}x$ from both sides gives $${b} = ${b + r.nextInt(1,5)}$, which is false. <b>No solution.</b>`
    };
  });

  makeQ3(10, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2,6);
    const b = r.nextInt(1,8);
    const diff = r.nextInt(2,6);
    return {
      text: `Solve: $${a}(x + ${b}) = ${a}x + ${a*b + diff}$`,
      options: makeOptions(
        { text: 'No solution' },
        [
          { text: `$x = ${diff}$`, why: 'After distributing, the $x$ terms cancel and you get a false statement.' },
          { text: `$x = 0$`, why: 'The $x$ terms cancel — there is no valid $x$.' },
          { text: 'All real numbers', why: 'Both sides are NOT identical after distributing.' }
        ], r),
      hints: [
        `Distribute $${a}$: $${a}x + ${a*b} = ${a}x + ${a*b+diff}$.`,
        `Subtract $${a}x$: $${a*b} = ${a*b+diff}$ — is this true?`,
        '<b>Worked example:</b> $2(x+3) = 2x+10$ → $2x+6=2x+10$ → $6=10$ — false → No solution.'
      ],
      explanation: `Distribute: $${a}x + ${a*b} = ${a}x + ${a*b+diff}$. Subtract $${a}x$: $${a*b} = ${a*b+diff}$ is false. <b>No solution.</b>`
    };
  });

  // 11-12: Identity (all real numbers)
  makeQ3(11, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2,5);
    const b = r.nextIntNonZero(-8,8);
    return {
      text: `Solve: $${a}(x ${signStr(b)}) = ${a}x ${signStr(a*b)}$`,
      options: makeOptions(
        { text: 'All real numbers' },
        [
          { text: `$x = 0$`, why: 'While $x=0$ works, ALL values of $x$ work — this is an identity.' },
          { text: `$x = ${b}$`, why: 'This is a constant, not the solution. The equation is true for every $x$.' },
          { text: 'No solution', why: 'After distributing, both sides are identical, so every $x$ is a solution.' }
        ], r),
      hints: [
        `Distribute $${a}$ on the left side.`,
        `You get $${a}x ${signStr(a*b)} = ${a}x ${signStr(a*b)}$. Both sides are identical!`,
        '<b>Worked example:</b> $3(x+2)=3x+6$ → $3x+6=3x+6$ → $0=0$ (always true) → All real numbers.'
      ],
      explanation: `Distributing gives $${a}x ${signStr(a*b)} = ${a}x ${signStr(a*b)}$, which is always true. <b>All real numbers.</b>`
    };
  });

  makeQ3(12, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2,4);
    const b = r.nextIntNonZero(-6,6);
    const c = r.nextInt(1,3);
    const d = a*b - c*b;
    return {
      text: `Solve: $${a}x ${signStr(a*b)} = ${a}x ${signStr(a*b)}$`,
      options: makeOptions(
        { text: 'All real numbers (identity)' },
        [
          { text: `$x = ${a*b}$`, why: 'The equation is true for every $x$, not just one value.' },
          { text: 'No solution', why: 'Both sides are the same, so it is always true — infinitely many solutions.' },
          { text: `$x = 0$`, why: '$x = 0$ works, but so does every other number.' }
        ], r),
      hints: [
        'Look at both sides carefully — are they the same expression?',
        'Subtract everything from one side. You get $0 = 0$.',
        '<b>Worked example:</b> $5x - 3 = 5x - 3$ → $0 = 0$ → True for all $x$.'
      ],
      explanation: 'Both sides are identical. Subtracting gives $0 = 0$, always true. <b>All real numbers.</b>'
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 4: Solve absolute value equations (p.106, L 2-5)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[4] = { tile: 4, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[4].questions;

  // |ax + b| = c → two solutions
  function absEq(idx, style) { Q.push({ id: `q4_${idx}`, generate: style }); }

  absEq(1, function(seed) {
    const r = seededRandom(seed);
    const a = r.pick([1,2,3]);
    const b = r.nextIntNonZero(-9,9);
    const c = r.nextInt(2,15);
    const x1 = (c - b) / a, x2 = (-c - b) / a;
    const x1c = Number.isInteger(x1) ? x1 : null;
    const x2c = Number.isInteger(x2) ? x2 : null;
    // Ensure integer solutions
    const A = 1, B = r.nextIntNonZero(-8,8), C = r.nextInt(2,12);
    const s1 = C - B, s2 = -C - B;
    return {
      text: `Solve: $|x ${signStr(B)}| = ${C}$`,
      options: makeOptions(
        { text: `$x = ${s1}$ or $x = ${s2}$` },
        [
          { text: `$x = ${s1}$`, why: `There are TWO solutions. You also need $x ${signStr(B)} = -${C}$.` },
          { text: `$x = ${s2}$`, why: 'This is only one of two solutions.' },
          { text: `$x = ${C}$ or $x = ${-C}$`, why: `Forgot to subtract $${B}$ from both solutions.` }
        ], r),
      hints: [
        `If $|E| = ${C}$, then $E = ${C}$ or $E = -${C}$.`,
        `Case 1: $x ${signStr(B)} = ${C}$ → $x = ${s1}$. Case 2: $x ${signStr(B)} = -${C}$ → $x = ${s2}$.`,
        `<b>Worked example:</b> $|x - 3| = 5$. Case 1: $x-3=5 → x=8$. Case 2: $x-3=-5 → x=-2$. Solutions: $x=8$ or $x=-2$.`
      ],
      explanation: `$x ${signStr(B)} = ${C} \\Rightarrow x = ${s1}$<br>$x ${signStr(B)} = -${C} \\Rightarrow x = ${s2}$`
    };
  });

  absEq(2, function(seed) {
    const r = seededRandom(seed);
    const a = 2, b = r.nextIntNonZero(-7,7);
    const c = r.nextInt(2,10) * 2; // ensure even for integer solutions
    const s1 = (c - b) / a, s2 = (-c - b) / a;
    return {
      text: `Solve: $|${a}x ${signStr(b)}| = ${c}$`,
      options: makeOptions(
        { text: `$x = ${s1}$ or $x = ${s2}$` },
        [
          { text: `$x = ${s1}$ or $x = ${-s1}$`, why: 'The second solution comes from $-c$, not negating $x_1$.' },
          { text: `$x = ${s1}$`, why: 'There are two cases to consider with absolute value.' },
          { text: `$x = ${c/a}$ or $x = ${-c/a}$`, why: `Forgot to account for $${b}$ inside the absolute value.` }
        ], r),
      hints: [
        `Split into: $${a}x ${signStr(b)} = ${c}$ OR $${a}x ${signStr(b)} = -${c}$.`,
        `Case 1: $${a}x = ${c-b}$, $x = ${s1}$. Case 2: $${a}x = ${-c-b}$, $x = ${s2}$.`,
        `<b>Worked example:</b> $|2x+1|=7$. Case 1: $2x+1=7→x=3$. Case 2: $2x+1=-7→x=-4$.`
      ],
      explanation: `Case 1: $${a}x ${signStr(b)} = ${c}$ → $x = ${s1}$.<br>Case 2: $${a}x ${signStr(b)} = -${c}$ → $x = ${s2}$.`
    };
  });

  absEq(3, function(seed) {
    const r = seededRandom(seed);
    const a = 3;
    const b = r.pick([-6,-3,3,6,9]);
    const c = r.nextInt(1,8)*3;
    const s1 = (c-b)/a, s2 = (-c-b)/a;
    return {
      text: `Solve: $|${a}x ${signStr(b)}| = ${c}$`,
      options: makeOptions(
        { text: `$x = ${s1}$ or $x = ${s2}$` },
        [
          { text: `$x = ${s1}$`, why: 'Only one of two solutions.' },
          { text: `$x = ${s2}$`, why: 'Only one of two solutions.' },
          { text: `$x = ${c/a}$ or $x = ${-c/a}$`, why: 'Forgot the constant term inside the absolute value.' }
        ], r),
      hints: [
        `Write two equations: $${a}x ${signStr(b)} = ${c}$ and $${a}x ${signStr(b)} = -${c}$.`,
        `Solve each: subtract $${b}$, then divide by $${a}$.`,
        `<b>Worked example:</b> $|3x-6|=9$. Case 1: $3x-6=9→3x=15→x=5$. Case 2: $3x-6=-9→3x=-3→x=-1$.`
      ],
      explanation: `Case 1: $x = ${s1}$. Case 2: $x = ${s2}$.`
    };
  });

  // |x + a| + b = c → |x + a| = c - b
  absEq(4, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextIntNonZero(-8,8);
    const b = r.nextInt(1,6);
    const c = b + r.nextInt(2,10);
    const inner = c - b;
    const s1 = inner - a, s2 = -inner - a;
    return {
      text: `Solve: $|x ${signStr(a)}| + ${b} = ${c}$`,
      options: makeOptions(
        { text: `$x = ${s1}$ or $x = ${s2}$` },
        [
          { text: `$x = ${c-a}$ or $x = ${-c-a}$`, why: `Forgot to subtract $${b}$ first. The absolute value equals $${inner}$, not $${c}$.` },
          { text: `$x = ${s1}$`, why: 'Only one of two solutions.' },
          { text: 'No solution', why: `$${c} - ${b} = ${inner} > 0$, so there are solutions.` }
        ], r),
      hints: [
        `First isolate the absolute value: subtract $${b}$ from both sides.`,
        `$|x ${signStr(a)}| = ${inner}$. Now split into two cases.`,
        `<b>Worked example:</b> $|x+2|+3=8$. Subtract 3: $|x+2|=5$. Case 1: $x+2=5→x=3$. Case 2: $x+2=-5→x=-7$.`
      ],
      explanation: `Subtract $${b}$: $|x ${signStr(a)}| = ${inner}$.<br>$x = ${s1}$ or $x = ${s2}$.`
    };
  });

  // No solution: |x + a| = negative
  absEq(5, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextIntNonZero(-8,8);
    const c = r.nextInt(-8,-1);
    return {
      text: `Solve: $|x ${signStr(a)}| = ${c}$`,
      options: makeOptions(
        { text: 'No solution' },
        [
          { text: `$x = ${c - a}$`, why: 'An absolute value can never equal a negative number.' },
          { text: `$x = ${-c - a}$ or $x = ${c - a}$`, why: 'No value of $x$ can make an absolute value negative.' },
          { text: `$x = ${-a}$`, why: '$|0| = 0$, not a negative number.' }
        ], r),
      hints: [
        'What is the smallest value an absolute value can have?',
        'Absolute value is always $\\geq 0$. Can it equal a negative number?',
        '<b>Worked example:</b> $|x+5| = -3$. Since $|\\cdot| \\geq 0$ and $-3 < 0$, there is no solution.'
      ],
      explanation: `Absolute value is always $\\geq 0$. Since $${c} < 0$, there is <b>no solution</b>.`
    };
  });

  // No solution: |ax + b| + c = d where c > d
  absEq(6, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(1,3);
    const b = r.nextIntNonZero(-6,6);
    const c = r.nextInt(5,12);
    const d = r.nextInt(0, c-1);
    return {
      text: `Solve: $|${a === 1 ? '' : a}x ${signStr(b)}| + ${c} = ${d}$`,
      options: makeOptions(
        { text: 'No solution' },
        [
          { text: `$x = ${d - c}$`, why: 'Subtracting gives a negative absolute value, which is impossible.' },
          { text: `$x = 0$`, why: 'Check: does $x=0$ satisfy the equation?' },
          { text: `$x = ${-b}$ or $x = ${b}$`, why: 'The absolute value would need to be $' + (d-c) + '$, which is negative — impossible.' }
        ], r),
      hints: [
        `Isolate: $|${a===1?'':a}x ${signStr(b)}| = ${d - c}$.`,
        `Is $${d-c}$ a valid value for an absolute value?`,
        '<b>Worked example:</b> $|x-1|+7=3$ → $|x-1|=-4$. Negative → No solution.'
      ],
      explanation: `$|${a===1?'':a}x ${signStr(b)}| = ${d-c}$. Since $${d-c} < 0$, <b>no solution</b>.`
    };
  });

  // More standard ones
  absEq(7, function(seed) {
    const r = seededRandom(seed);
    const b = r.nextIntNonZero(-10,10);
    const c = r.nextInt(1,15);
    const s1 = c - b, s2 = -c - b;
    return {
      text: `Solve: $|x ${signStr(b)}| = ${c}$`,
      options: makeOptions(
        { text: `$x = ${s1}$ or $x = ${s2}$` },
        [
          { text: `$x = ${s1}$ or $x = ${-s1}$`, why: 'The second case uses $-${c}$, not the negation of the first answer.' },
          { text: `$x = ${c}$ or $x = -${c}$`, why: 'Forgot to subtract $' + b + '$ from both sides.' },
          { text: `$x = ${s1 + s2}$`, why: 'You can\'t combine the two solutions into one.' }
        ], r),
      hints: [
        'Split into two cases.','Solve each linear equation.','<b>Worked example:</b> $|x-4|=6$ → $x=10$ or $x=-2$.'
      ],
      explanation: `$x ${signStr(b)} = ${c}$ → $x = ${s1}$. $x ${signStr(b)} = -${c}$ → $x = ${s2}$.`
    };
  });

  absEq(8, function(seed) {
    const r = seededRandom(seed);
    const a = 2;
    const b = r.pick([-4,-2,2,4,6,8]);
    const c = r.nextInt(2,10) * 2;
    const s1 = (c-b)/a, s2 = (-c-b)/a;
    return {
      text: `Solve: $|2x ${signStr(b)}| = ${c}$`,
      options: makeOptions(
        { text: `$x = ${s1}$ or $x = ${s2}$` },
        [
          { text: `$x = ${s1}$`, why: 'Missing the second solution.' },
          { text: `$x = ${c/2}$ or $x = -${c/2}$`, why: 'Ignored the constant $'+b+'$ inside.' },
          { text: `$x = ${s1}$ or $x = ${-s1}$`, why: 'Second solution should come from the negative case of the absolute value.' }
        ], r),
      hints: [
        `Two cases: $2x ${signStr(b)} = ${c}$ or $2x ${signStr(b)} = -${c}$.`,
        `Solve each for $x$.`,
        `<b>Worked example:</b> $|2x+4|=10$ → $2x+4=10→x=3$ or $2x+4=-10→x=-7$.`
      ],
      explanation: `Case 1: $x=${s1}$. Case 2: $x=${s2}$.`
    };
  });

  // |x| = ax + b type (careful setup)
  absEq(9, function(seed) {
    const r = seededRandom(seed);
    const b = r.nextIntNonZero(-8,8);
    const c = r.nextInt(3,12);
    const s1 = c - b, s2 = -c - b;
    return {
      text: `What are the solutions of $|x ${signStr(b)}| = ${c}$?`,
      options: makeOptions(
        { text: `$x = ${s1},\\; x = ${s2}$` },
        [
          { text: `$x = ${s1}$ only`, why: 'There is a second solution from the negative case.' },
          { text: `$x = ${-b}$ only`, why: '$x = ' + (-b) + '$ makes the expression inside equal to 0, not $' + c + '$.' },
          { text: `$x = ${c}$ or $x = ${-c}$`, why: 'Must subtract $' + b + '$ after splitting.' }
        ], r),
      hints: ['Set up two equations.','Solve both linear equations.','<b>Worked example:</b> $|x+1|=4$ → $x=3$ or $x=-5$.'],
      explanation: `$x ${signStr(b)}=${c}$ → $x=${s1}$. $x ${signStr(b)}=-${c}$ → $x=${s2}$.`
    };
  });

  absEq(10, function(seed) {
    const r = seededRandom(seed);
    const a = r.pick([2,4]);
    const b = r.pick([-6,-4,-2,2,4,6]);
    const k = r.nextInt(1,5);
    const c = k * a + r.nextInt(1,8);
    const inner = c - r.nextInt(1,5);
    // Simpler: |ax + b| = c
    const C = r.nextInt(2,10) * a;
    const s1 = (C-b)/a, s2 = (-C-b)/a;
    return {
      text: `Find all values of $x$: $|${a}x ${signStr(b)}| = ${C}$`,
      options: makeOptions(
        { text: `$x = ${s1}$ or $x = ${s2}$` },
        [
          { text: `$x = ${s1}$`, why: 'Missing second solution.' },
          { text: `$x = ${C/a}$`, why: 'Forgot the constant $'+b+'$.' },
          { text: 'No solution', why: '$'+C+' > 0$, so solutions exist.' }
        ], r),
      hints: ['Two cases.','Solve each two-step equation.','<b>Worked example:</b> $|4x-8|=12$ → $4x-8=12→x=5$ or $4x-8=-12→x=-1$.'],
      explanation: `Case 1: $${a}x ${signStr(b)}=${C}$ → $x=${s1}$. Case 2: $→ x=${s2}$.`
    };
  });

  absEq(11, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextIntNonZero(-5, 5);
    const c = -r.nextInt(1, 8);
    return {
      text: `Solve: $|x ${signStr(a)}| = ${c}$`,
      options: makeOptions(
        { text: 'No solution' },
        [
          { text: `$x = ${c - a}$`, why: 'Absolute value cannot equal a negative number.' },
          { text: `$x = ${-a}$`, why: '$|-a+a|=0$, not $' + c + '$.' },
          { text: `$x = ${c-a}$ or $x = ${-c-a}$`, why: 'Cannot split — the right side is negative.' }
        ], r),
      hints: ['Can absolute value be negative?','$|\\text{anything}| \\geq 0$, but the right side is negative.','<b>Worked example:</b> $|x+3|=-2$ → impossible → No solution.'],
      explanation: `$${c} < 0$, so $|x ${signStr(a)}|$ can never equal it. <b>No solution.</b>`
    };
  });

  absEq(12, function(seed) {
    const r = seededRandom(seed);
    const b = r.nextIntNonZero(-8,8);
    const d = r.nextInt(2,8);
    const c = d + r.nextInt(1,8);
    const inner = c - d;
    const s1 = inner - b, s2 = -inner - b;
    return {
      text: `Solve: $|x ${signStr(b)}| + ${d} = ${c}$`,
      options: makeOptions(
        { text: `$x = ${s1}$ or $x = ${s2}$` },
        [
          { text: `$x = ${c-b}$ or $x = ${-c-b}$`, why: 'Forgot to subtract $' + d + '$ first.' },
          { text: `$x = ${s1}$`, why: 'Missing the second solution.' },
          { text: 'No solution', why: '$' + c + ' - ' + d + ' = ' + inner + ' > 0$, so solutions exist.' }
        ], r),
      hints: [
        'First isolate: subtract $' + d + '$ from both sides.',
        '$|x ' + signStr(b) + '| = ' + inner + '$. Now split.',
        '<b>Worked example:</b> $|x-2|+3=10$ → $|x-2|=7$ → $x=9$ or $x=-5$.'
      ],
      explanation: `$|x ${signStr(b)}| = ${inner}$. Then $x = ${s1}$ or $x = ${s2}$.`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 5: Find the slope of a line (p.227, Lesson 4-2, ex.50–52)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[5] = { tile: 5, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[5].questions;

  function makeSlopeQ(idx, genFn) { Q.push({ id: `q5_${idx}`, generate: genFn }); }

  // 1: Positive integer slope
  makeSlopeQ(1, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 6);
    const x1 = r.nextInt(-5, 5), y1 = r.nextInt(-5, 5);
    const dx = r.nextInt(1, 4);
    const x2 = x1 + dx, y2 = y1 + m * dx;
    return {
      text: `Find the slope of the line passing through the points $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`,
      options: makeOptions(
        { text: `$m = ${m}$` },
        [
          { text: `$m = -${m}$`, why: 'Sign error: $\\frac{y_2 - y_1}{x_2 - x_1}$ yields a positive result.' },
          { text: `$m = ${fmtFrac(1, m)}$`, why: 'Inverted the slope formula as $\\frac{x_2 - x_1}{y_2 - y_1}$ (run over rise instead of rise over run).' },
          { text: `$m = ${m + 1}$`, why: 'Arithmetic error in calculating the difference.' }
        ], r),
      hints: [
        'Use the slope formula: $m = \\frac{y_2 - y_1}{x_2 - x_1}$.',
        `Substitute: $m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${y2 - y1}}{${x2 - x1}}$.`,
        '<b>Worked example:</b> Points $(1, 3)$ and $(3, 9)$.<br>$m = \\frac{9 - 3}{3 - 1} = \\frac{6}{2} = 3$.'
      ],
      explanation: `$m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${y2 - y1}}{${dx}} = ${m}$.`
    };
  });

  // 2: Negative integer slope
  makeSlopeQ(2, function(seed) {
    const r = seededRandom(seed);
    const m = -r.nextInt(2, 5);
    const x1 = r.nextInt(-4, 4), y1 = r.nextInt(-3, 6);
    const dx = r.nextInt(1, 3);
    const x2 = x1 + dx, y2 = y1 + m * dx;
    return {
      text: `Find the slope of the line passing through $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`,
      options: makeOptions(
        { text: `$m = ${m}$` },
        [
          { text: `$m = ${Math.abs(m)}$`, why: 'Forgot the negative sign; the line falls from left to right.' },
          { text: `$m = ${fmtFrac(1, m)}$`, why: 'Inverted the slope formula (used $\\Delta x / \\Delta y$).' },
          { text: `$m = ${m - 1}$`, why: 'Calculation error in subtraction.' }
        ], r),
      hints: [
        'Recall $m = \\frac{y_2 - y_1}{x_2 - x_1}$.',
        `Compute the rise: $${y2} - (${y1}) = ${y2 - y1}$. Compute the run: $${x2} - (${x1}) = ${dx}$.`,
        '<b>Worked example:</b> Points $(2, 7)$ and $(5, 1)$.<br>$m = \\frac{1 - 7}{5 - 2} = \\frac{-6}{3} = -2$.'
      ],
      explanation: `$m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${y2 - y1}}{${dx}} = ${m}$.`
    };
  });

  // 3: Positive fraction slope
  makeSlopeQ(3, function(seed) {
    const r = seededRandom(seed);
    const pairs = [[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5]];
    const [num, den] = r.pick(pairs);
    const x1 = r.nextInt(-5, 3), y1 = r.nextInt(-4, 4);
    const x2 = x1 + den, y2 = y1 + num;
    return {
      text: `Find the slope of the line through the points $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`,
      options: makeOptions(
        { text: `$m = ${fmtFrac(num, den)}$` },
        [
          { text: `$m = ${fmtFrac(den, num)}$`, why: 'Inverted the slope formula: placed run over rise.' },
          { text: `$m = -${fmtFrac(num, den)}$`, why: 'Sign error: both differences have the same sign.' },
          { text: `$m = ${fmtFrac(num + 1, den)}$`, why: 'Arithmetic error when subtracting coordinates.' }
        ], r),
      hints: [
        'Slope is rise over run: $m = \\frac{y_2 - y_1}{x_2 - x_1}$.',
        `$m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${num}}{${den}}$.`,
        '<b>Worked example:</b> Points $(1, 2)$ and $(4, 4)$.<br>$m = \\frac{4 - 2}{4 - 1} = \\frac{2}{3}$.'
      ],
      explanation: `$m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${num}}{${den}}$.`
    };
  });

  // 4: Negative fraction slope
  makeSlopeQ(4, function(seed) {
    const r = seededRandom(seed);
    const pairs = [[1, 2], [1, 3], [2, 3], [3, 4], [1, 4], [2, 5]];
    const [num, den] = r.pick(pairs);
    const x1 = r.nextInt(-4, 3), y1 = r.nextInt(-2, 6);
    const x2 = x1 + den, y2 = y1 - num;
    return {
      text: `What is the slope of the line passing through $(${x1}, ${y1})$ and $(${x2}, ${y2})$?`,
      options: makeOptions(
        { text: `$m = -${fmtFrac(num, den)}$` },
        [
          { text: `$m = ${fmtFrac(num, den)}$`, why: 'Ignored the negative sign when subtracting $y_2 - y_1$.' },
          { text: `$m = -${fmtFrac(den, num)}$`, why: 'Inverted rise and run.' },
          { text: `$m = -${fmtFrac(num, den + 1)}$`, why: 'Error in finding the horizontal distance.' }
        ], r),
      hints: [
        'Slope formula: $m = \\frac{y_2 - y_1}{x_2 - x_1}$.',
        `$m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${-num}}{${den}}$.`,
        '<b>Worked example:</b> Points $(0, 5)$ and $(4, 2)$.<br>$m = \\frac{2 - 5}{4 - 0} = \\frac{-3}{4} = -\\frac{3}{4}$.'
      ],
      explanation: `$m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${-num}}{${den}} = -${fmtFrac(num, den)}$.`
    };
  });

  // 5: Zero slope (horizontal line)
  makeSlopeQ(5, function(seed) {
    const r = seededRandom(seed);
    const yVal = r.nextInt(-8, 8);
    const x1 = r.nextInt(-7, 0);
    const x2 = x1 + r.nextInt(2, 8);
    return {
      text: `Find the slope of the line passing through $(${x1}, ${yVal})$ and $(${x2}, ${yVal})$.`,
      options: makeOptions(
        { text: '$m = 0$' },
        [
          { text: 'Undefined', why: 'Undefined slope occurs when $x_1 = x_2$ (vertical line). Here, the line is horizontal.' },
          { text: `$m = ${yVal !== 0 ? yVal : 1}$`, why: 'The slope is not the $y$-coordinate; $m = \\frac{0}{\\Delta x} = 0$.' },
          { text: `$m = ${x2 - x1}$`, why: 'This is the run $\\Delta x$, but the rise is 0.' }
        ], r),
      hints: [
        'Calculate the change in $y$: $y_2 - y_1$. Notice they are equal!',
        '$m = \\frac{0}{x_2 - x_1}$. Zero divided by any non-zero number is 0.',
        '<b>Worked example:</b> Points $(2, 4)$ and $(6, 4)$.<br>$m = \\frac{4 - 4}{6 - 2} = \\frac{0}{4} = 0$. Horizontal line.'
      ],
      explanation: `$m = \\frac{${yVal} - ${yVal}}{${x2} - (${x1})} = \\frac{0}{${x2 - x1}} = 0$. Horizontal lines have slope $0$.`
    };
  });

  // 6: Undefined slope (vertical line)
  makeSlopeQ(6, function(seed) {
    const r = seededRandom(seed);
    const xVal = r.nextInt(-8, 8);
    const y1 = r.nextInt(-6, 0);
    const y2 = y1 + r.nextInt(2, 9);
    return {
      text: `Find the slope of the line passing through $(${xVal}, ${y1})$ and $(${xVal}, ${y2})$.`,
      options: makeOptions(
        { text: 'Undefined' },
        [
          { text: '$m = 0$', why: 'Zero slope is for horizontal lines ($y_1 = y_2$). Here, division by zero occurs.' },
          { text: `$m = ${xVal}$`, why: 'This is the $x$-intercept/coordinate, not the slope.' },
          { text: `$m = ${y2 - y1}$`, why: 'Forgot that the denominator $x_2 - x_1 = 0$, making division impossible.' }
        ], r),
      hints: [
        'Examine the $x$-coordinates: what is $x_2 - x_1$?',
        'Division by zero is undefined in mathematics.',
        '<b>Worked example:</b> Points $(3, 1)$ and $(3, 7)$.<br>$m = \\frac{7 - 1}{3 - 3} = \\frac{6}{0}$ → Undefined (vertical line).'
      ],
      explanation: `$m = \\frac{${y2} - (${y1})}{${xVal} - ${xVal}} = \\frac{${y2 - y1}}{0}$. Division by zero is <b>undefined</b>.`
    };
  });

  // 7: Points with negative coordinates (rise/run with double negatives)
  makeSlopeQ(7, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(1, 4);
    const x1 = -r.nextInt(3, 8), y1 = -r.nextInt(3, 8);
    const dx = r.nextInt(2, 5);
    const x2 = x1 + dx, y2 = y1 + m * dx;
    return {
      text: `Determine the slope of the line containing $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`,
      options: makeOptions(
        { text: `$m = ${m}$` },
        [
          { text: `$m = -${m}$`, why: 'Watch the signs when subtracting negative numbers: $-(-c) = +c$.' },
          { text: `$m = ${fmtFrac(1, m)}$`, why: 'Inverted the slope formula.' },
          { text: `$m = ${m + 2}$`, why: 'Sign error in subtraction.' }
        ], r),
      hints: [
        'Be careful subtracting negatives: $a - (-b) = a + b$.',
        `$m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${y2 - y1}}{${dx}}$.`,
        '<b>Worked example:</b> $(-5, -4)$ and $(-2, 2)$.<br>$m = \\frac{2 - (-4)}{-2 - (-5)} = \\frac{6}{3} = 2$.'
      ],
      explanation: `$m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${y2} + ${Math.abs(y1)}}{${x2} + ${Math.abs(x1)}} = \\frac{${y2 - y1}}{${dx}} = ${m}$.`
    };
  });

  // 8: Slope from a table of values
  makeSlopeQ(8, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 5);
    const b = r.nextInt(-4, 4);
    const xVals = [0, 1, 2, 3];
    const yVals = xVals.map(x => m * x + b);
    return {
      text: `Find the rate of change (slope) from the table:<br>
<div style="margin:8px 0;overflow-x:auto;">
<table style="border-collapse:collapse;margin:0 auto;text-align:center;">
<tr style="border-bottom:1px solid #1b2a4a;"><th style="padding:4px 12px;">$x$</th>${xVals.map(x => `<td style="padding:4px 12px;">${x}</td>`).join('')}</tr>
<tr><th style="padding:4px 12px;">$y$</th>${yVals.map(y => `<td style="padding:4px 12px;">${y}</td>`).join('')}</tr>
</table></div>`,
      options: makeOptions(
        { text: `$m = ${m}$` },
        [
          { text: `$m = ${b}$`, why: 'This is the $y$-intercept where $x=0$, not the rate of change.' },
          { text: `$m = ${fmtFrac(1, m)}$`, why: 'Divided change in $x$ by change in $y$ instead of $\\Delta y / \\Delta x$.' },
          { text: `$m = -${m}$`, why: 'The table shows $y$ increases as $x$ increases, so the slope is positive.' }
        ], r),
      hints: [
        'Pick any two points from the table, for instance $(0, ' + yVals[0] + ')$ and $(1, ' + yVals[1] + ')$.',
        'Calculate $\\frac{\\Delta y}{\\Delta x} = \\frac{' + yVals[1] + ' - ' + yVals[0] + '}{1 - 0}$.',
        '<b>Worked example:</b> Points $(0, 2)$ and $(1, 5)$ → $m = \\frac{5 - 2}{1 - 0} = 3$.'
      ],
      explanation: `Choose $(0, ${yVals[0]})$ and $(1, ${yVals[1]})$.<br>$m = \\frac{${yVals[1]} - (${yVals[0]})}{1 - 0} = ${m}$.`
    };
  });

  // 9: Slope of 1 or -1
  makeSlopeQ(9, function(seed) {
    const r = seededRandom(seed);
    const sign = r.pick([1, -1]);
    const x1 = r.nextInt(-6, 4), y1 = r.nextInt(-5, 5);
    const d = r.nextInt(2, 7);
    const x2 = x1 + d, y2 = y1 + sign * d;
    return {
      text: `Calculate the slope of the line passing through $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`,
      options: makeOptions(
        { text: `$m = ${sign}$` },
        [
          { text: `$m = ${-sign}$`, why: 'Sign error in computing rise over run.' },
          { text: `$m = 0$`, why: 'The points have different $y$-values, so the slope is not zero.' },
          { text: `$m = ${d}$`, why: 'This is the change $\\Delta x$, not the ratio $\\Delta y / \\Delta x$.' }
        ], r),
      hints: [
        'Use $m = \\frac{y_2 - y_1}{x_2 - x_1}$.',
        `Numerator: $${y2} - (${y1}) = ${sign * d}$. Denominator: $${x2} - (${x1}) = ${d}$.`,
        '<b>Worked example:</b> Points $(2, 3)$ and $(6, 7)$ → $m = \\frac{4}{4} = 1$.'
      ],
      explanation: `$m = \\frac{${y2 - y1}}{${d}} = ${sign}$.`
    };
  });

  // 10: Real-world rate of change (metric AED context)
  makeSlopeQ(10, function(seed) {
    const r = seededRandom(seed);
    const rate = r.pick([15, 20, 25, 30, 40]);
    const fixed = r.nextInt(10, 30);
    const h1 = 2, c1 = fixed + rate * h1;
    const h2 = 5, c2 = fixed + rate * h2;
    return {
      text: `A tutor in Abu Dhabi charges AED $${c1}$ for $${h1}$ hours of instruction and AED $${c2}$ for $${h2}$ hours. What is the hourly rate (slope)?`,
      options: makeOptions(
        { text: `$${rate}$ AED/h` },
        [
          { text: `$${fixed}$ AED/h`, why: 'This is the base initial fee, not the hourly rate.' },
          { text: `$${Math.round(c1 / h1)}$ AED/h`, why: 'Divided total cost by hours without subtracting the base fee.' },
          { text: `$${rate + 5}$ AED/h`, why: 'Calculation error in finding rate of change.' }
        ], r),
      hints: [
        `Write as coordinate points: $(hours, cost) \\rightarrow (${h1}, ${c1})$ and $(${h2}, ${c2})$.`,
        `Rate of change = $\\frac{\\Delta \\text{cost}}{\\Delta \\text{hours}} = \\frac{${c2} - ${c1}}{${h2} - ${h1}}$.`,
        '<b>Worked example:</b> 1 h costs 50 AED, 3 h costs 110 AED.<br>Rate = $\\frac{110 - 50}{3 - 1} = \\frac{60}{2} = 30$ AED/h.'
      ],
      explanation: `Slope $m = \\frac{${c2} - ${c1}}{${h2} - ${h1}} = \\frac{${c2 - c1}}{${h2 - h1}} = ${rate}$ AED/hour.`
    };
  });

  // 11: Fraction slope simplified
  makeSlopeQ(11, function(seed) {
    const r = seededRandom(seed);
    const num = 3, den = 2;
    const k = r.nextInt(2, 3);
    const x1 = r.nextInt(-4, 2), y1 = r.nextInt(-4, 2);
    const x2 = x1 + den * k, y2 = y1 + num * k;
    return {
      text: `Find the slope in simplest form for the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`,
      options: makeOptions(
        { text: `$m = \\frac{3}{2}$` },
        [
          { text: `$m = \\frac{2}{3}$`, why: 'Inverted the slope formula (run over rise).' },
          { text: `$m = -\\frac{3}{2}$`, why: 'Sign error; both changes are positive.' },
          { text: `$m = ${num * k}$`, why: 'Only found the rise $\\Delta y$ without dividing by run $\\Delta x$.' }
        ], r),
      hints: [
        `$m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${num * k}}{${den * k}}$.`,
        'Simplify the fraction by dividing numerator and denominator by their greatest common factor.',
        '<b>Worked example:</b> Points $(0, 0)$ and $(4, 6)$ → $m = \\frac{6}{4} = \\frac{3}{2}$.'
      ],
      explanation: `$m = \\frac{${num * k}}{${den * k}} = \\frac{3}{2}$.`
    };
  });

  // 12: Negative slope from intercepts
  makeSlopeQ(12, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 6);
    const b = r.nextInt(2, 6);
    return {
      text: `A line has an $x$-intercept at $(${a}, 0)$ and a $y$-intercept at $(0, ${b})$. What is the slope of the line?`,
      options: makeOptions(
        { text: `$m = -${fmtFrac(b, a)}$` },
        [
          { text: `$m = ${fmtFrac(b, a)}$`, why: 'Forgot that lines with positive intercepts have a negative slope.' },
          { text: `$m = -${fmtFrac(a, b)}$`, why: 'Inverted: slope is $\\frac{\\Delta y}{\\Delta x} = \\frac{b - 0}{0 - a} = -\\frac{b}{a}$.' },
          { text: `$m = -${b}$`, why: 'Only used the $y$-intercept without dividing by $-a$.' }
        ], r),
      hints: [
        `Use the two points $(${a}, 0)$ and $(0, ${b})$.`,
        `$m = \\frac{${b} - 0}{0 - ${a}} = \\frac{${b}}{-${a}}$.`,
        '<b>Worked example:</b> $x$-intercept $(3, 0)$, $y$-intercept $(0, 6)$ → $m = \\frac{6 - 0}{0 - 3} = -2$.'
      ],
      explanation: `$m = \\frac{${b} - 0}{0 - ${a}} = -${fmtFrac(b, a)}$.`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 6: Solve proportions (p.113, Lesson 2-6, ex.19–26)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[6] = { tile: 6, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[6].questions;
  function makePropQ(idx, genFn) { Q.push({ id: `q6_${idx}`, generate: genFn }); }

  // 1: x / b = c / d
  makePropQ(1, function(seed) {
    const r = seededRandom(seed);
    const d = r.pick([2, 3, 4, 5, 6]);
    const k = r.nextInt(2, 5);
    const b = d * k;
    const c = r.nextInt(1, 9);
    const x = c * k;
    return {
      text: `Solve the proportion: $\\frac{x}{${b}} = \\frac{${c}}{${d}}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${x + d}$`, why: 'Arithmetic error when cross-multiplying.' },
          { text: `$x = ${Math.round((c * d) / b) || 1}$`, why: 'Incorrect cross-multiplication setup.' },
          { text: `$x = ${c * b}$`, why: 'Multiplied $c \\cdot b$ but forgot to divide by $d$.' }
        ], r),
      hints: [
        'Use cross multiplication: if $\\frac{x}{b} = \\frac{c}{d}$, then $x \\cdot d = b \\cdot c$.',
        `$${d}x = ${b} \\cdot ${c} = ${b * c}$. Now divide both sides by $${d}$.`,
        '<b>Worked example:</b> $\\frac{x}{12} = \\frac{3}{4}$ → $4x = 36$ → $x = 9$.'
      ],
      explanation: `Cross multiply: $${d}x = ${b * c} \\Rightarrow x = \\frac{${b * c}}{${d}} = ${x}$.`
    };
  });

  // 2: a / x = c / d
  makePropQ(2, function(seed) {
    const r = seededRandom(seed);
    const c = r.pick([2, 3, 4, 5]);
    const k = r.nextInt(2, 6);
    const a = c * k;
    const d = r.nextInt(3, 8);
    const x = d * k;
    return {
      text: `Solve the proportion: $\\frac{${a}}{x} = \\frac{${c}}{${d}}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${Math.round((a * c) / d)}$`, why: 'Cross-multiplied incorrectly: multiplied $a$ and $c$ instead of $a$ and $d$.' },
          { text: `$x = ${x - 1}$`, why: 'Calculation slip in division.' },
          { text: `$x = ${a * d}$`, why: 'Forgot to divide by $c$.' }
        ], r),
      hints: [
        `Cross multiply: $${c}x = ${a} \\cdot ${d}$.`,
        `$${c}x = ${a * d}$. Divide both sides by $${c}$.`,
        '<b>Worked example:</b> $\\frac{6}{x} = \\frac{2}{5}$ → $2x = 30$ → $x = 15$.'
      ],
      explanation: `$${c}x = ${a} \\cdot ${d} = ${a * d} \\Rightarrow x = ${x}$.`
    };
  });

  // 3: (x + a) / b = c / d
  makePropQ(3, function(seed) {
    const r = seededRandom(seed);
    const d = r.pick([2, 3, 4, 5]);
    const k = r.nextInt(2, 4);
    const b = d * k;
    const a = r.nextInt(1, 8);
    const c = r.nextInt(3, 9);
    const x = c * k - a;
    return {
      text: `Solve: $\\frac{x + ${a}}{${b}} = \\frac{${c}}{${d}}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${x + 2 * a}$`, why: `Added $${a}$ instead of subtracting it after multiplying.` },
          { text: `$x = ${c * k}$`, why: `Forgot to subtract $${a}$ from the result.` },
          { text: `$x = ${-x}$`, why: 'Sign error.' }
        ], r),
      hints: [
        `Cross multiply: $${d}(x + ${a}) = ${b} \\cdot ${c}$.`,
        `Distribute: $${d}x + ${d * a} = ${b * c}$, or multiply both sides by $${b}$.`,
        '<b>Worked example:</b> $\\frac{x + 2}{6} = \\frac{5}{2}$ → $x + 2 = 15$ → $x = 13$.'
      ],
      explanation: `Multiply by $${b}$: $x + ${a} = \\frac{${b} \\cdot ${c}}{${d}} = ${c * k} \\Rightarrow x = ${x}$.`
    };
  });

  // 4: (x - a) / b = c / d
  makePropQ(4, function(seed) {
    const r = seededRandom(seed);
    const d = r.pick([3, 4, 5]);
    const k = r.nextInt(2, 4);
    const b = d * k;
    const a = r.nextInt(2, 8);
    const c = r.nextInt(2, 7);
    const x = c * k + a;
    return {
      text: `Solve for $x$: $\\frac{x - ${a}}{${b}} = \\frac{${c}}{${d}}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${c * k - a}$`, why: `Subtracted $${a}$ instead of adding it.` },
          { text: `$x = ${c * k}$`, why: `Forgot to add $${a}$.` },
          { text: `$x = ${x + 1}$`, why: 'Arithmetic error.' }
        ], r),
      hints: [
        `Cross multiply: $${d}(x - ${a}) = ${b * c}$.`,
        `$x - ${a} = ${c * k}$. Add $${a}$ to both sides.`,
        '<b>Worked example:</b> $\\frac{x - 3}{8} = \\frac{1}{2}$ → $x - 3 = 4$ → $x = 7$.'
      ],
      explanation: `$x - ${a} = \\frac{${b * c}}{${d}} = ${c * k} \\Rightarrow x = ${x}$.`
    };
  });

  // 5: a / (x + b) = c / d
  makePropQ(5, function(seed) {
    const r = seededRandom(seed);
    const c = r.pick([2, 3, 4]);
    const k = r.nextInt(2, 5);
    const a = c * k;
    const b = r.nextInt(1, 6);
    const d = r.nextInt(3, 8);
    const x = d * k - b;
    return {
      text: `Solve the proportion: $\\frac{${a}}{x + ${b}} = \\frac{${c}}{${d}}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${x + 2 * b}$`, why: `Added $${b}$ instead of subtracting it.` },
          { text: `$x = ${d * k}$`, why: `Forgot to account for $+ ${b}$.` },
          { text: `$x = ${Math.round((a * c) / d)}$`, why: 'Set up cross multiplication incorrectly.' }
        ], r),
      hints: [
        `Cross multiply: $${a} \\cdot ${d} = ${c}(x + ${b})$.`,
        `$${a * d} = ${c}x + ${c * b}$. Subtract $${c * b}$ and divide by $${c}$.`,
        '<b>Worked example:</b> $\\frac{8}{x + 1} = \\frac{2}{3}$ → $2(x+1) = 24$ → $x+1=12$ → $x=11$.'
      ],
      explanation: `$${c}(x + ${b}) = ${a * d} \\Rightarrow x + ${b} = ${d * k} \\Rightarrow x = ${x}$.`
    };
  });

  // 6: (x + a) / (x - b) = c / d
  makePropQ(6, function(seed) {
    const r = seededRandom(seed);
    const c = 3, d = 2;
    const b = r.nextInt(1, 5);
    const a = r.nextInt(1, 5);
    // 2(x + a) = 3(x - b) => 2x + 2a = 3x - 3b => x = 2a + 3b
    const x = 2 * a + 3 * b;
    return {
      text: `Solve for $x$: $\\frac{x + ${a}}{x - ${b}} = \\frac{${c}}{${d}}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${Math.abs(2 * a - 3 * b)}$`, why: 'Sign error when collecting constants.' },
          { text: `$x = ${x + 2}$`, why: 'Arithmetic error in distribution.' },
          { text: `$x = ${-x}$`, why: 'Sign error when moving variable terms.' }
        ], r),
      hints: [
        `Cross multiply: $${d}(x + ${a}) = ${c}(x - ${b})$.`,
        `Distribute: $${d}x + ${d * a} = ${c}x - ${c * b}$.`,
        '<b>Worked example:</b> $\\frac{x+1}{x-2} = \\frac{3}{2}$ → $2(x+1) = 3(x-2)$ → $2x+2 = 3x-6$ → $x = 8$.'
      ],
      explanation: `$${d}x + ${2 * a} = ${c}x - ${3 * b} \\Rightarrow x = ${2 * a} + ${3 * b} = ${x}$.`
    };
  });

  // 7: Real-world map scale (metric km context)
  makePropQ(7, function(seed) {
    const r = seededRandom(seed);
    const scaleCm = 2;
    const scaleKm = r.pick([25, 30, 40, 50]);
    const mapCm = r.pick([6, 8, 10, 12]);
    const actualKm = (mapCm / scaleCm) * scaleKm;
    return {
      text: `On a UAE map, $${scaleCm}\\text{ cm}$ represents $${scaleKm}\\text{ km}$. If the distance between Dubai and Fujairah measures $${mapCm}\\text{ cm}$ on the map, what is the actual distance?`,
      options: makeOptions(
        { text: `$${actualKm}\\text{ km}$` },
        [
          { text: `$${Math.round(mapCm * scaleKm)}\\text{ km}$`, why: `Forgot to divide by the scale factor of $${scaleCm}\\text{ cm}$.` },
          { text: `$${Math.round(actualKm / 2)}\\text{ km}$`, why: 'Divided by scale factor twice.' },
          { text: `$${actualKm + 10}\\text{ km}$`, why: 'Estimation error.' }
        ], r),
      hints: [
        `Set up a proportion: $\\frac{${scaleCm}\\text{ cm}}{${scaleKm}\\text{ km}} = \\frac{${mapCm}\\text{ cm}}{x\\text{ km}}$.`,
        `Cross multiply: $${scaleCm}x = ${scaleKm} \\cdot ${mapCm}$.`,
        '<b>Worked example:</b> $1\\text{ cm} : 20\\text{ km}$. Distance $5\\text{ cm} \\rightarrow x = 5 \\cdot 20 = 100\\text{ km}$.'
      ],
      explanation: `$\\frac{${scaleCm}}{${scaleKm}} = \\frac{${mapCm}}{x} \\Rightarrow ${scaleCm}x = ${scaleKm * mapCm} \\Rightarrow x = ${actualKm}\\text{ km}$.`
    };
  });

  // 8: Currency exchange / price proportion (AED context)
  makePropQ(8, function(seed) {
    const r = seededRandom(seed);
    const books = r.pick([3, 4, 5]);
    const cost = books * r.nextInt(12, 18);
    const targetBooks = books + r.pick([2, 3, 4]);
    const targetCost = (cost / books) * targetBooks;
    return {
      text: `At a school book fair in Sharjah, $${books}$ notebooks cost AED $${cost}$. At this rate, how much will $${targetBooks}$ notebooks cost?`,
      options: makeOptions(
        { text: `AED $${targetCost}$` },
        [
          { text: `AED $${targetCost + 5}$`, why: 'Rounding or arithmetic slip.' },
          { text: `AED $${cost + (cost / books)}$`, why: 'Added the cost of only 1 book instead of the target quantity.' },
          { text: `AED $${Math.round((cost * books) / targetBooks)}$`, why: 'Inverted the proportion.' }
        ], r),
      hints: [
        `Set up: $\\frac{${cost}\\text{ AED}}{${books}\\text{ books}} = \\frac{x\\text{ AED}}{${targetBooks}\\text{ books}}$.`,
        `Unit price = $\\frac{${cost}}{${books}} = ${cost / books}$ AED per notebook.`,
        '<b>Worked example:</b> 2 pens cost 6 AED. 5 pens cost $5 \\times 3 = 15$ AED.'
      ],
      explanation: `Unit price $= \\frac{${cost}}{${books}} = ${cost / books}$ AED. Total for $${targetBooks}$ notebooks $= ${targetBooks} \\times ${cost / books} = ${targetCost}$ AED.`
    };
  });

  // 9: Proportion with negative numbers
  makePropQ(9, function(seed) {
    const r = seededRandom(seed);
    const d = r.pick([3, 5]);
    const k = r.nextInt(2, 4);
    const b = d * k;
    const c = -r.nextInt(2, 6);
    const x = c * k;
    return {
      text: `Solve the proportion: $\\frac{x}{${b}} = \\frac{${c}}{${d}}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${-x}$`, why: 'Sign error: positive divided by negative or vice versa.' },
          { text: `$x = ${x - 1}$`, why: 'Arithmetic error.' },
          { text: `$x = ${c * b}$`, why: 'Forgot to divide by the denominator.' }
        ], r),
      hints: [
        'Pay close attention to the negative sign in the fraction.',
        `$${d}x = ${b} \\cdot (${c}) = ${b * c}$.`,
        '<b>Worked example:</b> $\\frac{x}{6} = \\frac{-2}{3}$ → $3x = -12$ → $x = -4$.'
      ],
      explanation: `$${d}x = ${b * c} \\Rightarrow x = \\frac{${b * c}}{${d}} = ${x}$.`
    };
  });

  // 10: 2x / b = c / d
  makePropQ(10, function(seed) {
    const r = seededRandom(seed);
    const b = 6;
    const c = r.pick([2, 4, 6]);
    const d = 3;
    const x = (b * c) / (2 * d);
    return {
      text: `Solve for $x$: $\\frac{2x}{${b}} = \\frac{${c}}{${d}}$`,
      options: makeOptions(
        { text: `$x = ${x}$` },
        [
          { text: `$x = ${2 * x}$`, why: 'Forgot to divide by the coefficient $2$ on $x$.' },
          { text: `$x = ${-x}$`, why: 'Sign error.' },
          { text: `$x = ${x + 1}$`, why: 'Arithmetic mistake.' }
        ], r),
      hints: [
        `Cross multiply: $2x \\cdot ${d} = ${b} \\cdot ${c}$.`,
        `$${2 * d}x = ${b * c}$. Divide both sides by $${2 * d}$.`,
        '<b>Worked example:</b> $\\frac{2x}{4} = \\frac{3}{1}$ → $2x = 12$ → $x = 6$.'
      ],
      explanation: `$${2 * d}x = ${b * c} \\Rightarrow x = \\frac{${b * c}}{${2 * d}} = ${x}$.`
    };
  });

  // 11: Fraction proportion yielding decimal/fraction
  makePropQ(11, function(seed) {
    const r = seededRandom(seed);
    const b = 4, c = 3, d = 8;
    // x / 4 = 3 / 8 => 8x = 12 => x = 12/8 = 1.5
    const val = '1.5';
    return {
      text: `Solve: $\\frac{x}{${b}} = \\frac{${c}}{${d}}$`,
      options: makeOptions(
        { text: `$x = ${val}$` },
        [
          { text: '$x = 2$', why: 'Rounded incorrectly: $\\frac{12}{8} = 1.5$, not $2$.' },
          { text: '$x = 0.75$', why: 'Divided incorrectly.' },
          { text: '$x = 6$', why: 'Inverted the multiplication.' }
        ], r),
      hints: [
        'Cross multiply: $8x = 4 \\times 3 = 12$.',
        'Divide $12$ by $8$.',
        '<b>Worked example:</b> $\\frac{x}{6} = \\frac{1}{4}$ → $4x = 6$ → $x = 1.5$.'
      ],
      explanation: `$8x = 12 \\Rightarrow x = \\frac{12}{8} = \\frac{3}{2} = 1.5$.`
    };
  });

  // 12: Proportion with binomial numerator: (2x - 1) / 3 = 5 / 1
  makePropQ(12, function(seed) {
    const r = seededRandom(seed);
    const b = r.pick([2, 4, 6]);
    const ans = r.nextInt(2, 6);
    const num = 2 * ans - b;
    return {
      text: `Solve: $\\frac{2x - ${b}}{3} = \\frac{${num}}{3}$`,
      options: makeOptions(
        { text: `$x = ${ans}$` },
        [
          { text: `$x = ${ans + b}$`, why: 'Arithmetic error when isolating $x$.' },
          { text: `$x = ${-ans}$`, why: 'Sign error.' },
          { text: `$x = ${ans * 2}$`, why: 'Forgot to divide by 2.' }
        ], r),
      hints: [
        'Since the denominators are both $3$, the numerators must be equal!',
        `$2x - ${b} = ${num}$. Add $${b}$ and divide by $2$.`,
        '<b>Worked example:</b> $\\frac{2x - 4}{5} = \\frac{6}{5}$ → $2x - 4 = 6$ → $2x = 10$ → $x = 5$.'
      ],
      explanation: `Equating numerators: $2x - ${b} = ${num} \\Rightarrow 2x = ${num + b} \\Rightarrow x = ${ans}$.`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 7: Rewrite linear equations in slope-intercept form (p.235, Lesson 4-3, ex.1–12)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[7] = { tile: 7, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[7].questions;
  function makeSIQ(idx, genFn) { Q.push({ id: `q7_${idx}`, generate: genFn }); }

  // 1: Ax + y = C
  makeSIQ(1, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 6);
    const c = r.nextIntNonZero(-10, 10);
    return {
      text: `Rewrite in slope-intercept form ($y = mx + b$):<br>$$${a}x + y = ${c}$$`,
      options: makeOptions(
        { text: `$y = -${a}x ${signStr(c)}$` },
        [
          { text: `$y = ${a}x ${signStr(c)}$`, why: 'When moving $' + a + 'x$ to the right side, its sign becomes negative.' },
          { text: `$y = -${a}x - ${c}$`, why: 'Changed the sign of the constant term on the right side unnecessarily.' },
          { text: `$y = -\\frac{1}{${a}}x ${signStr(c)}$`, why: 'Divided by $' + a + '$ instead of subtracting it.' }
        ], r),
      hints: [
        'Slope-intercept form has $y$ isolated on the left: $y = mx + b$.',
        `Subtract $${a}x$ from both sides of the equation.`,
        '<b>Worked example:</b> $3x + y = 7$ → Subtract $3x$: $y = -3x + 7$.'
      ],
      explanation: `Subtract $${a}x$ from both sides:<br>$y = -${a}x ${signStr(c)}$.`
    };
  });

  // 2: Ax - y = C
  makeSIQ(2, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 6);
    const c = r.nextIntNonZero(-9, 9);
    return {
      text: `Write in slope-intercept form: $${a}x - y = ${c}$`,
      options: makeOptions(
        { text: `$y = ${a}x ${signStr(-c)}$` },
        [
          { text: `$y = -${a}x ${signStr(c)}$`, why: 'Forgot to multiply/divide by $-1$ to isolate positive $y$.' },
          { text: `$y = ${a}x ${signStr(c)}$`, why: 'Divided by $-1$ on the $x$-term but forgot to change the sign of the constant.' },
          { text: `$y = -${a}x ${signStr(-c)}$`, why: 'Sign error on both terms.' }
        ], r),
      hints: [
        `First subtract $${a}x$: $-y = -${a}x ${signStr(c)}$.`,
        'Now multiply or divide the entire equation by $-1$.',
        '<b>Worked example:</b> $4x - y = 5$ → $-y = -4x + 5$ → $y = 4x - 5$.'
      ],
      explanation: `$-y = -${a}x ${signStr(c)}$<br>Multiply by $-1$: $y = ${a}x ${signStr(-c)}$.`
    };
  });

  // 3: Ax + By = C (divisible)
  makeSIQ(3, function(seed) {
    const r = seededRandom(seed);
    const b = r.pick([2, 3, 4]);
    const m = r.nextInt(1, 4);
    const a = b * m;
    const k = r.nextIntNonZero(-4, 4);
    const c = b * k;
    return {
      text: `Convert to slope-intercept form: $${a}x + ${b}y = ${c}$`,
      options: makeOptions(
        { text: `$y = -${m}x ${signStr(k)}$` },
        [
          { text: `$y = ${m}x ${signStr(k)}$`, why: 'Moving $' + a + 'x$ makes the slope negative.' },
          { text: `$y = -${a}x ${signStr(c)}$`, why: 'Forgot to divide the right side by $' + b + '$.' },
          { text: `$y = -${m}x ${signStr(c)}$`, why: 'Divided the $x$-term by $' + b + '$ but forgot to divide the constant.' }
        ], r),
      hints: [
        `Subtract $${a}x$: $${b}y = -${a}x ${signStr(c)}$.`,
        `Divide every term by $${b}$: $y = -\\frac{${a}}{${b}}x + \\frac{${c}}{${b}}$.`,
        '<b>Worked example:</b> $6x + 2y = 8$ → $2y = -6x + 8$ → $y = -3x + 4$.'
      ],
      explanation: `$${b}y = -${a}x ${signStr(c)} \\Rightarrow y = -\\frac{${a}}{${b}}x + \\frac{${c}}{${b}} = -${m}x ${signStr(k)}$.`
    };
  });

  // 4: Ax - By = C
  makeSIQ(4, function(seed) {
    const r = seededRandom(seed);
    const b = r.pick([2, 3, 5]);
    const m = r.nextInt(1, 3);
    const a = b * m;
    const k = r.nextIntNonZero(-4, 4);
    const c = b * k;
    return {
      text: `Rewrite in slope-intercept form: $${a}x - ${b}y = ${c}$`,
      options: makeOptions(
        { text: `$y = ${m}x ${signStr(-k)}$` },
        [
          { text: `$y = -${m}x ${signStr(k)}$`, why: 'Dividing $-' + a + 'x$ by $-' + b + '$ gives a POSITIVE slope.' },
          { text: `$y = ${m}x ${signStr(k)}$`, why: 'Sign error when dividing $' + c + '$ by $-' + b + '$.' },
          { text: `$y = ${a}x - ${c}$`, why: 'Forgot to divide by $' + b + '$.' }
        ], r),
      hints: [
        `Subtract $${a}x$: $-${b}y = -${a}x ${signStr(c)}$.`,
        `Divide every term by $-${b}$. Negative divided by negative is positive!`,
        '<b>Worked example:</b> $4x - 2y = 10$ → $-2y = -4x + 10$ → $y = 2x - 5$.'
      ],
      explanation: `$-${b}y = -${a}x ${signStr(c)} \\Rightarrow y = \\frac{-${a}}{-${b}}x + \\frac{${c}}{-${b}} = ${m}x ${signStr(-k)}$.`
    };
  });

  // 5: Fraction slope (cannot simplify completely)
  makeSIQ(5, function(seed) {
    const r = seededRandom(seed);
    const b = r.pick([3, 4, 5]);
    const a = r.pick([1, 2]);
    const k = r.nextIntNonZero(-4, 4);
    const c = b * k;
    return {
      text: `Identify the slope and $y$-intercept by rewriting in slope-intercept form:<br>$$${a}x + ${b}y = ${c}$$`,
      options: makeOptions(
        { text: `$y = -\\frac{${a}}{${b}}x ${signStr(k)}$` },
        [
          { text: `$y = \\frac{${a}}{${b}}x ${signStr(k)}$`, why: 'Moving $' + a + 'x$ across the equals sign makes it negative.' },
          { text: `$y = -\\frac{${b}}{${a}}x ${signStr(k)}$`, why: 'Inverted the slope: divided run by rise.' },
          { text: `$y = -${a}x ${signStr(k)}$`, why: 'Forgot to divide the $x$-coefficient by $' + b + '$.' }
        ], r),
      hints: [
        `Isolate $y$: subtract $${a}x$, then divide by $${b}$.`,
        `$${b}y = -${a}x ${signStr(c)} \\Rightarrow y = -\\frac{${a}}{${b}}x + \\frac{${c}}{${b}}$.`,
        '<b>Worked example:</b> $2x + 3y = 9$ → $3y = -2x + 9$ → $y = -\\frac{2}{3}x + 3$.'
      ],
      explanation: `$${b}y = -${a}x ${signStr(c)} \\Rightarrow y = -\\frac{${a}}{${b}}x + ${k}$.`
    };
  });

  // 6: Identify slope and y-intercept from standard form
  makeSIQ(6, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 5);
    const b = r.pick([2, 3]);
    const c = b * r.nextIntNonZero(-4, 4);
    const slope = fmtFrac(-a, b);
    const yInt = c / b;
    return {
      text: `What are the slope ($m$) and $y$-intercept ($b$) of the line $${a}x + ${b}y = ${c}$?`,
      options: makeOptions(
        { text: `$m = ${slope},\\; b = ${yInt}$` },
        [
          { text: `$m = ${fmtFrac(a, b)},\\; b = ${yInt}$`, why: 'Sign error on the slope: $m = -A/B$.' },
          { text: `$m = ${slope},\\; b = ${c}$`, why: 'Forgot to divide the constant by $B$ to find the $y$-intercept.' },
          { text: `$m = -${a},\\; b = ${c}$`, why: 'Did not rewrite into slope-intercept form.' }
        ], r),
      hints: [
        'Rewrite the equation in $y = mx + b$ form.',
        `$${b}y = -${a}x ${signStr(c)} \\Rightarrow y = -\\frac{${a}}{${b}}x + ${yInt}$.`,
        '<b>Worked example:</b> $3x + 2y = 6$ → $y = -\\frac{3}{2}x + 3$ → $m = -\\frac{3}{2}$, $b = 3$.'
      ],
      explanation: `Rewriting: $y = ${slope}x ${signStr(yInt)}$. Thus $m = ${slope}$ and $b = ${yInt}$.`
    };
  });

  // 7: y already on right: C = Ax + By
  makeSIQ(7, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 5);
    const bVal = r.nextInt(-8, 8);
    return {
      text: `Express in slope-intercept form: $y ${signStr(-bVal)} = ${m}x$`,
      options: makeOptions(
        { text: `$y = ${m}x ${signStr(bVal)}$` },
        [
          { text: `$y = ${m}x ${signStr(-bVal)}$`, why: 'Sign error when moving the constant to the right side.' },
          { text: `$y = -${m}x ${signStr(bVal)}$`, why: 'The $x$-term is already on the correct side; its sign does not change.' },
          { text: `$y = \\frac{1}{${m}}x ${signStr(bVal)}$`, why: 'Inverted the slope.' }
        ], r),
      hints: [
        'Add or subtract the constant to isolate $y$.',
        `$y = ${m}x ${signStr(bVal)}$.`,
        '<b>Worked example:</b> $y - 4 = 3x$ → Add 4: $y = 3x + 4$.'
      ],
      explanation: `Add $${bVal}$ to both sides: $y = ${m}x ${signStr(bVal)}$.`
    };
  });

  // 8: Horizontal line y = c
  makeSIQ(8, function(seed) {
    const r = seededRandom(seed);
    const k = r.nextIntNonZero(-9, 9);
    return {
      text: `What is the slope-intercept form of the horizontal line $y = ${k}$?`,
      options: makeOptions(
        { text: `$y = 0x ${signStr(k)}$ (or $y = ${k}$)` },
        [
          { text: `$y = 1x ${signStr(k)}$`, why: 'The slope of a horizontal line is 0, not 1.' },
          { text: `$x = 0y ${signStr(k)}$`, why: 'Horizontal lines are functions of the form $y = c$.' },
          { text: 'Undefined slope form', why: 'Horizontal lines have slope 0; vertical lines have undefined slope.' }
        ], r),
      hints: [
        'What is the slope $m$ of any horizontal line?',
        'Since $m = 0$, $y = 0x + b$.',
        '<b>Worked example:</b> $y = 5$ has slope $m = 0$ and $y$-intercept $b = 5$.'
      ],
      explanation: `Horizontal lines have slope $m = 0$. In slope-intercept form: $y = 0x ${signStr(k)}$ or simply $y = ${k}$.`
    };
  });

  // 9: Point-slope converted to slope-intercept: y - y1 = m(x - x1)
  makeSIQ(9, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 4);
    const x1 = r.nextInt(1, 4);
    const y1 = r.nextInt(1, 6);
    const b = -m * x1 + y1;
    return {
      text: `Rewrite the point-slope equation in slope-intercept form:<br>$$y - ${y1} = ${m}(x - ${x1})$$`,
      options: makeOptions(
        { text: `$y = ${m}x ${signStr(b)}$` },
        [
          { text: `$y = ${m}x ${signStr(-m * x1)}$`, why: 'Forgot to add $' + y1 + '$ to both sides.' },
          { text: `$y = ${m}x ${signStr(b + 2 * y1)}$`, why: 'Sign error when moving $' + y1 + '$.' },
          { text: `$y = ${m}x - ${x1} + ${y1}$`, why: 'Forgot to multiply $' + m + '$ by $-' + x1 + '$ when distributing.' }
        ], r),
      hints: [
        `Distribute $${m}$: $y - ${y1} = ${m}x - ${m * x1}$.`,
        `Add $${y1}$ to both sides to isolate $y$.`,
        '<b>Worked example:</b> $y - 3 = 2(x - 4)$ → $y - 3 = 2x - 8$ → $y = 2x - 5$.'
      ],
      explanation: `$y - ${y1} = ${m}x - ${m * x1} \\Rightarrow y = ${m}x - ${m * x1} + ${y1} = ${m}x ${signStr(b)}$.`
    };
  });

  // 10: -x + By = C
  makeSIQ(10, function(seed) {
    const r = seededRandom(seed);
    const b = r.pick([2, 3, 4]);
    const k = r.nextIntNonZero(-4, 4);
    const c = b * k;
    return {
      text: `Convert $-x + ${b}y = ${c}$ into slope-intercept form:`,
      options: makeOptions(
        { text: `$y = \\frac{1}{${b}}x ${signStr(k)}$` },
        [
          { text: `$y = -\\frac{1}{${b}}x ${signStr(k)}$`, why: 'Adding $x$ to the right side gives $+x$, so the slope is positive.' },
          { text: `$y = ${b}x ${signStr(k)}$`, why: 'Divided incorrectly by $' + b + '$.' },
          { text: `$y = \\frac{1}{${b}}x ${signStr(c)}$`, why: 'Forgot to divide the constant by $' + b + '$.' }
        ], r),
      hints: [
        `Add $x$ to both sides: $${b}y = x ${signStr(c)}$.`,
        `Divide by $${b}$: $y = \\frac{1}{${b}}x + \\frac{${c}}{${b}}$.`,
        '<b>Worked example:</b> $-x + 3y = 6$ → $3y = x + 6$ → $y = \\frac{1}{3}x + 2$.'
      ],
      explanation: `$${b}y = x ${signStr(c)} \\Rightarrow y = \\frac{1}{${b}}x ${signStr(k)}$.`
    };
  });

  // 11: Real-world linear model interpretation
  makeSIQ(11, function(seed) {
    const r = seededRandom(seed);
    const rate = r.pick([2, 3, 4, 5]);
    const init = r.pick([20, 25, 30, 50]);
    return {
      text: `A phone plan charges a base fee of AED $${init}$ per month plus AED $${rate}$ per gigabyte of data ($x$). Which slope-intercept equation represents the total monthly cost $y$?`,
      options: makeOptions(
        { text: `$y = ${rate}x + ${init}$` },
        [
          { text: `$y = ${init}x + ${rate}$`, why: 'Swapped the rate of change and the initial value.' },
          { text: `$y = -${rate}x + ${init}$`, why: 'Cost increases with data usage, so the slope must be positive.' },
          { text: `$y = ${rate}x - ${init}$`, why: 'The base fee adds to the cost, not subtracts.' }
        ], r),
      hints: [
        'Rate of change (per gigabyte) is the slope $m$.',
        'Initial fixed fee is the $y$-intercept $b$.',
        '<b>Worked example:</b> Base 30 AED + 5 AED/GB → $y = 5x + 30$.'
      ],
      explanation: `Rate $= ${rate}$ (slope $m$), initial fee $= ${init}$ ($y$-intercept $b$). Thus $y = ${rate}x + ${init}$.`
    };
  });

  // 12: Ax + By = 0 (proportional line passing through origin)
  makeSIQ(12, function(seed) {
    const r = seededRandom(seed);
    const b = r.pick([2, 3, 4]);
    const a = r.pick([1, 2, 3]);
    return {
      text: `Rewrite $${a}x - ${b}y = 0$ in slope-intercept form:`,
      options: makeOptions(
        { text: `$y = \\frac{${a}}{${b}}x$` },
        [
          { text: `$y = -\\frac{${a}}{${b}}x$`, why: 'Dividing $-' + a + 'x$ by $-' + b + '$ yields a positive slope.' },
          { text: `$y = \\frac{${b}}{${a}}x$`, why: 'Inverted the slope.' },
          { text: `$y = ${a}x$`, why: 'Forgot to divide by $' + b + '$.' }
        ], r),
      hints: [
        `$-${b}y = -${a}x$.`,
        `Divide both sides by $-${b}$. The $y$-intercept is $0$.`,
        '<b>Worked example:</b> $2x - 5y = 0$ → $-5y = -2x$ → $y = \\frac{2}{5}x$.'
      ],
      explanation: `$-${b}y = -${a}x \\Rightarrow y = \\frac{${a}}{${b}}x$. The line passes through the origin ($b = 0$).`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 8: Apply translations to absolute value functions (p.267, Lesson 4-7, Example 1)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[8] = { tile: 8, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[8].questions;
  function makeTransQ(idx, genFn) { Q.push({ id: `q8_${idx}`, generate: genFn }); }

  // 1: Horizontal right translation
  makeTransQ(1, function(seed) {
    const r = seededRandom(seed);
    const h = r.nextInt(2, 6);
    return {
      text: `Which equation represents the graph of $f(x) = |x|$ translated $${h}$ units to the right?`,
      options: makeOptions(
        { text: `$g(x) = |x - ${h}|$` },
        [
          { text: `$g(x) = |x + ${h}|$`, why: 'Horizontal shift right is $|x - h|$, while $|x + h|$ shifts left.' },
          { text: `$g(x) = |x| + ${h}$`, why: 'This represents a vertical shift UP, not a horizontal shift.' },
          { text: `$g(x) = |x| - ${h}$`, why: 'This represents a vertical shift DOWN.' }
        ], r),
      hints: [
        'A horizontal translation of $h$ units right replaces $x$ with $(x - h)$.',
        'Inside the absolute value: minus shifts right, plus shifts left.',
        '<b>Worked example:</b> $f(x) = |x|$ shifted 4 units right is $g(x) = |x - 4|$.'
      ],
      explanation: `Horizontal translation right by $h$ gives $g(x) = |x - h|$. Therefore, $g(x) = |x - ${h}|$.`
    };
  });

  // 2: Horizontal left translation
  makeTransQ(2, function(seed) {
    const r = seededRandom(seed);
    const h = r.nextInt(2, 6);
    return {
      text: `Which function represents $f(x) = |x|$ translated $${h}$ units to the left?`,
      options: makeOptions(
        { text: `$g(x) = |x + ${h}|$` },
        [
          { text: `$g(x) = |x - ${h}|$`, why: '$|x - h|$ shifts the graph to the right.' },
          { text: `$g(x) = |x| + ${h}$`, why: 'Adding outside the absolute value shifts the graph up.' },
          { text: `$g(x) = |x| - ${h}$`, why: 'Subtracting outside shifts the graph down.' }
        ], r),
      hints: [
        'A horizontal shift left by $h$ units is given by $|x - (-h)| = |x + h|$.',
        'Think of the vertex: $|x + h| = 0 \\Rightarrow x = -h$ (to the left of 0).',
        '<b>Worked example:</b> Shifting $|x|$ left by 3 units gives $g(x) = |x + 3|$.'
      ],
      explanation: `Shift left by $${h}$ units: $g(x) = |x - (-${h})| = |x + ${h}|$.`
    };
  });

  // 3: Vertical up translation
  makeTransQ(3, function(seed) {
    const r = seededRandom(seed);
    const k = r.nextInt(2, 7);
    return {
      text: `The graph of $f(x) = |x|$ is shifted vertically upward by $${k}$ units. What is the equation of the transformed function?`,
      options: makeOptions(
        { text: `$g(x) = |x| + ${k}$` },
        [
          { text: `$g(x) = |x + ${k}|$`, why: 'Adding inside the absolute value shifts the graph LEFT, not up.' },
          { text: `$g(x) = |x| - ${k}$`, why: 'Subtracting outside shifts the graph DOWN.' },
          { text: `$g(x) = |x - ${k}|$`, why: 'Subtracting inside shifts the graph RIGHT.' }
        ], r),
      hints: [
        'A vertical shift affects the output $y$-values: $g(x) = f(x) + k$.',
        'The constant is added OUTSIDE the absolute value bars.',
        '<b>Worked example:</b> Shift $|x|$ up by 5 units gives $g(x) = |x| + 5$.'
      ],
      explanation: `Vertical shift up by $k$ units is $g(x) = |x| + k = |x| + ${k}$.`
    };
  });

  // 4: Vertical down translation
  makeTransQ(4, function(seed) {
    const r = seededRandom(seed);
    const k = r.nextInt(2, 7);
    return {
      text: `Which function represents $f(x) = |x|$ translated $${k}$ units downward?`,
      options: makeOptions(
        { text: `$g(x) = |x| - ${k}$` },
        [
          { text: `$g(x) = |x - ${k}|$`, why: 'Subtracting inside shifts the graph RIGHT, not down.' },
          { text: `$g(x) = |x| + ${k}$`, why: 'Adding outside shifts the graph UP.' },
          { text: `$g(x) = |x + ${k}|$`, why: 'Adding inside shifts the graph LEFT.' }
        ], r),
      hints: [
        'Vertical shifts are added or subtracted outside: $g(x) = |x| + k$.',
        'Downward means $k$ is negative: $g(x) = |x| - ' + k + '$.',
        '<b>Worked example:</b> Shifting $|x|$ down 2 units gives $g(x) = |x| - 2$.'
      ],
      explanation: `A downward shift of $${k}$ units subtracts from the entire function: $g(x) = |x| - ${k}$.`
    };
  });

  // 5: Both right and up
  makeTransQ(5, function(seed) {
    const r = seededRandom(seed);
    const h = r.nextInt(2, 5);
    const k = r.nextInt(2, 6);
    return {
      text: `Describe the transformation from $f(x) = |x|$ to $g(x) = |x - ${h}| + ${k}$:`,
      options: makeOptions(
        { text: `Translated $${h}$ units right and $${k}$ units up` },
        [
          { text: `Translated $${h}$ units left and $${k}$ units up`, why: 'Inside $- ' + h + '$ shifts right, not left.' },
          { text: `Translated $${h}$ units right and $${k}$ units down`, why: 'Outside $+ ' + k + '$ shifts up, not down.' },
          { text: `Translated $${h}$ units left and $${k}$ units down`, why: 'Both directions are reversed.' }
        ], r),
      hints: [
        'In $g(x) = |x - h| + k$, the vertex moves to $(h, k)$.',
        `Here $h = ${h}$ (right) and $k = ${k}$ (up).`,
        '<b>Worked example:</b> $g(x) = |x - 3| + 2$ has vertex $(3, 2)$ → 3 right, 2 up.'
      ],
      explanation: `In $|x - h| + k$, $- ${h}$ inside shifts $${h}$ units right, and $+ ${k}$ outside shifts $${k}$ units up.`
    };
  });

  // 6: Both left and down
  makeTransQ(6, function(seed) {
    const r = seededRandom(seed);
    const h = r.nextInt(2, 5);
    const k = r.nextInt(2, 6);
    return {
      text: `What is the vertex of the function $g(x) = |x + ${h}| - ${k}$?`,
      options: makeOptions(
        { text: `$(-${h}, -${k})$` },
        [
          { text: `$(${h}, -${k})$`, why: 'Inside $|x + ' + h + '|$ means $x - (-' + h + ')$, so the $x$-coordinate is $-' + h + '$.' },
          { text: `$(-${h}, ${k})$`, why: 'The constant outside is $-' + k + '$, so the $y$-coordinate is $-' + k + '$.' },
          { text: `$(${h}, ${k})$`, why: 'Both signs are reversed.' }
        ], r),
      hints: [
        'The vertex of $y = |x - h| + k$ is $(h, k)$.',
        `Write $|x + ${h}|$ as $|x - (-${h})|$. Thus $h = -${h}$ and $k = -${k}$.`,
        '<b>Worked example:</b> $g(x) = |x + 4| - 1$ has vertex $(-4, -1)$.'
      ],
      explanation: `Set the inside to zero: $x + ${h} = 0 \\Rightarrow x = -${h}$. The minimum value is $y = -${k}$. The vertex is $(-${h}, -${k})$.`
    };
  });

  // 7: Identify equation given translation description
  makeTransQ(7, function(seed) {
    const r = seededRandom(seed);
    const h = r.nextInt(1, 5);
    const k = r.nextInt(1, 5);
    return {
      text: `Which equation represents $f(x) = |x|$ translated $${h}$ units left and $${k}$ units down?`,
      options: makeOptions(
        { text: `$g(x) = |x + ${h}| - ${k}$` },
        [
          { text: `$g(x) = |x - ${h}| - ${k}$`, why: '$|x - ' + h + '|$ shifts right, not left.' },
          { text: `$g(x) = |x + ${h}| + ${k}$`, why: '$+ ' + k + '$ shifts up, not down.' },
          { text: `$g(x) = |x - ${h}| + ${k}$`, why: 'Reversed both horizontal and vertical shifts.' }
        ], r),
      hints: [
        `Left by $${h}$ units means replace $x$ with $(x + ${h})$.`,
        `Down by $${k}$ units means subtract $${k}$ outside.`,
        '<b>Worked example:</b> Left 2, Down 3: $g(x) = |x + 2| - 3$.'
      ],
      explanation: `Left $${h}$ $\\rightarrow |x + ${h}|$; down $${k}$ $\\rightarrow - ${k}$. Result: $g(x) = |x + ${h}| - ${k}$.`
    };
  });

  // 8: Translation with reflection: -|x|
  makeTransQ(8, function(seed) {
    const r = seededRandom(seed);
    const k = r.nextInt(2, 6);
    return {
      text: `How does the graph of $g(x) = -|x| + ${k}$ differ from $f(x) = |x|$?`,
      options: makeOptions(
        { text: `Reflected across the $x$-axis and translated $${k}$ units up` },
        [
          { text: `Reflected across the $y$-axis and translated $${k}$ units up`, why: 'A negative sign in front of the entire function reflects over the $x$-axis.' },
          { text: `Reflected across the $x$-axis and translated $${k}$ units down`, why: '$+ ' + k + '$ shifts the graph upward.' },
          { text: `Translated $${k}$ units left with no reflection`, why: 'The negative sign reflects the graph downward.' }
        ], r),
      hints: [
        'The negative sign outside reflects the V-shape downward across the $x$-axis.',
        `The $+ ${k}$ shifts the vertex vertically upward to $(0, ${k})$.`,
        '<b>Worked example:</b> $-|x| + 3$ opens downward with vertex at $(0, 3)$.'
      ],
      explanation: `The negative sign reflects $f(x)$ across the $x$-axis (opening downward), and $+ ${k}$ translates it $${k}$ units up.`
    };
  });

  // 9: Identify translation from graph points (vertex)
  makeTransQ(9, function(seed) {
    const r = seededRandom(seed);
    const h = r.nextInt(1, 6);
    const k = r.nextInt(1, 6);
    return {
      text: `An absolute value function has its vertex at $(${h}, ${k})$ and opens upward with slope $\\pm 1$. What is its equation?`,
      options: makeOptions(
        { text: `$g(x) = |x - ${h}| + ${k}$` },
        [
          { text: `$g(x) = |x + ${h}| + ${k}$`, why: 'Vertex at $(' + h + ', ' + k + ')$ requires $|x - ' + h + '|$, not $|x + ' + h + '|$.' },
          { text: `$g(x) = |x - ${h}| - ${k}$`, why: 'The $y$-coordinate of the vertex is positive, so it must be $+ ' + k + '$.' },
          { text: `$g(x) = |x + ${h}| - ${k}$`, why: 'Both signs in the vertex form are incorrect.' }
        ], r),
      hints: [
        'Vertex form: $g(x) = a|x - h| + k$, where $(h, k)$ is the vertex.',
        `Substitute $h = ${h}$ and $k = ${k}$ with $a = 1$.`,
        '<b>Worked example:</b> Vertex $(2, 5)$ → $g(x) = |x - 2| + 5$.'
      ],
      explanation: `With vertex $(h, k) = (${h}, ${k})$, the equation is $g(x) = |x - ${h}| + ${k}$.`
    };
  });

  // 10: Horizontal shift only, identify domain/range
  makeTransQ(10, function(seed) {
    const r = seededRandom(seed);
    const h = r.nextInt(2, 6);
    return {
      text: `What is the range of the function $g(x) = |x - ${h}|$?`,
      options: makeOptions(
        { text: `$\\{y \\mid y \\geq 0\\}$` },
        [
          { text: `$\\{y \\mid y \\geq ${h}\\}$`, why: 'A horizontal shift does not change the range; the minimum $y$-value is still $0$.' },
          { text: `All real numbers`, why: 'Absolute value is never negative, so $y$ cannot be less than $0$.' },
          { text: `$\\{y \\mid y \\leq 0\\}$`, why: 'The graph opens upward, so $y$ is greater than or equal to $0$.' }
        ], r),
      hints: [
        'A horizontal shift changes where the vertex is along $x$, but does it change the lowest $y$-value?',
        'The lowest point is at $x = ' + h + '$, where $g(' + h + ') = |0| = 0$.',
        '<b>Worked example:</b> $g(x) = |x - 4|$ has vertex $(4, 0)$, so its range is $y \\geq 0$.'
      ],
      explanation: `Horizontal shifts do not affect the range. Since the vertex is on the $x$-axis and the graph opens upward, the range is $\\{y \\mid y \\geq 0\\}$.`
    };
  });

  // 11: Vertical shift only, identify range
  makeTransQ(11, function(seed) {
    const r = seededRandom(seed);
    const k = r.nextInt(1, 6);
    return {
      text: `What is the range of $g(x) = |x| - ${k}$?`,
      options: makeOptions(
        { text: `$\\{y \\mid y \\geq -${k}\\}$` },
        [
          { text: `$\\{y \\mid y \\geq 0\\}$`, why: 'The graph has been shifted down by $' + k + '$, so the minimum $y$-value is $-' + k + '$.' },
          { text: `$\\{y \\mid y \\leq -${k}\\}$`, why: 'The graph opens upward, so $y$ is greater than or equal to the vertex.' },
          { text: `$\\{y \\mid y \\geq ${k}\\}$`, why: 'Sign error: subtracting $' + k + '$ shifts down to $-' + k + '$.' }
        ], r),
      hints: [
        'The parent function has minimum $0$. Subtracting $' + k + '$ lowers the minimum.',
        `The vertex is at $(0, -${k})$.`,
        '<b>Worked example:</b> $g(x) = |x| - 3$ has vertex $(0, -3)$ → Range: $y \\geq -3$.'
      ],
      explanation: `The minimum value occurs at $x = 0$, where $g(0) = -${k}$. Thus the range is $\\{y \\mid y \\geq -${k}\\}$.`
    };
  });

  // 12: Comparing two transformed functions
  makeTransQ(12, function(seed) {
    const r = seededRandom(seed);
    const h1 = 2, h2 = 5;
    return {
      text: `How is the graph of $g(x) = |x - ${h2}|$ related to the graph of $f(x) = |x - ${h1}|$?`,
      options: makeOptions(
        { text: `Shifted $${h2 - h1}$ units to the right` },
        [
          { text: `Shifted $${h2 - h1}$ units to the left`, why: 'The vertex moved from $x = ' + h1 + '$ to $x = ' + h2 + '$, which is to the right.' },
          { text: `Shifted $${h2 - h1}$ units upward`, why: 'The change is inside the absolute value, so it is a horizontal shift.' },
          { text: `Shifted $${h2}$ units to the right`, why: 'The shift from $f$ to $g$ is the difference: $' + h2 + ' - ' + h1 + ' = ' + (h2 - h1) + '$.' }
        ], r),
      hints: [
        `Find the vertex of $f(x)$: $x = ${h1}$.`,
        `Find the vertex of $g(x)$: $x = ${h2}$.`,
        `From $x = ${h1}$ to $x = ${h2}$ is a move of $${h2 - h1}$ units to the right.`
      ],
      explanation: `Vertex of $f$ is at $(${h1}, 0)$ and vertex of $g$ is at $(${h2}, 0)$. Moving from $x = ${h1}$ to $x = ${h2}$ is $${h2 - h1}$ units to the right.`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 9: Solve linear inequalities by using subtraction (p.347, Lesson 6-1, ex.1–30)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[9] = { tile: 9, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[9].questions;
  function makeIneqQ(idx, genFn) { Q.push({ id: `q9_${idx}`, generate: genFn }); }

  // 1: x + a > b
  makeIneqQ(1, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(3, 15);
    const ans = r.nextInt(-10, 15);
    const b = ans + a;
    return {
      text: `Solve the inequality: $$x + ${a} > ${b}$$`,
      options: makeOptions(
        { text: `$x > ${ans}$` },
        [
          { text: `$x < ${ans}$`, why: 'Subtracting a number from both sides does NOT flip the inequality symbol.' },
          { text: `$x > ${b + a}$`, why: `Added $${a}$ instead of subtracting it from both sides.` },
          { text: `$x \\geq ${ans}$`, why: 'Changed a strict inequality ($>$) to inclusive ($\\geq$).' }
        ], r),
      hints: [
        `Use the Subtraction Property of Inequality: subtract $${a}$ from both sides.`,
        `$x + ${a} - ${a} > ${b} - ${a}$.`,
        '<b>Worked example:</b> Solve $x + 4 > 11$ → Subtract 4: $x > 7$.'
      ],
      explanation: `Subtract $${a}$ from both sides: $x > ${b} - ${a} \\Rightarrow x > ${ans}$.`
    };
  });

  // 2: x + a <= b
  makeIneqQ(2, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(4, 18);
    const ans = r.nextInt(-12, 10);
    const b = ans + a;
    return {
      text: `Solve: $$x + ${a} \\leq ${b}$$`,
      options: makeOptions(
        { text: `$x \\leq ${ans}$` },
        [
          { text: `$x \\geq ${ans}$`, why: 'Flipped the inequality symbol; subtraction does not reverse the inequality.' },
          { text: `$x \\leq ${b + a}$`, why: `Added $${a}$ instead of subtracting.` },
          { text: `$x < ${ans}$`, why: 'Removed the equal-to condition.' }
        ], r),
      hints: [
        `Subtract $${a}$ from both sides.`,
        `$x \\leq ${b} - ${a}$.`,
        '<b>Worked example:</b> $x + 9 \\leq 5$ → Subtract 9: $x \\leq -4$.'
      ],
      explanation: `Subtract $${a}$ from both sides: $x \\leq ${ans}$.`
    };
  });

  // 3: a + x >= b
  makeIneqQ(3, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(5, 20);
    const ans = r.nextInt(-8, 12);
    const b = a + ans;
    return {
      text: `Solve: $$${a} + x \\geq ${b}$$`,
      options: makeOptions(
        { text: `$x \\geq ${ans}$` },
        [
          { text: `$x \\leq ${ans}$`, why: 'The inequality sign only reverses when multiplying or dividing by a negative number.' },
          { text: `$x \\geq ${b + a}$`, why: `Added $${a}$ instead of subtracting.` },
          { text: `$x > ${ans}$`, why: 'The original inequality is $\\geq$, so the solution must include $\\geq$.' }
        ], r),
      hints: [
        `Subtract $${a}$ from both sides to isolate $x$.`,
        `$x \\geq ${b} - ${a}$.`,
        '<b>Worked example:</b> $8 + x \\geq 15$ → $x \\geq 7$.'
      ],
      explanation: `Subtract $${a}$: $x \\geq ${b} - ${a} \\Rightarrow x \\geq ${ans}$.`
    };
  });

  // 4: x + a < b with negative numbers
  makeIneqQ(4, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(3, 12);
    const b = -r.nextInt(2, 12);
    const ans = b - a;
    return {
      text: `Solve the inequality: $$x + ${a} < ${b}$$`,
      options: makeOptions(
        { text: `$x < ${ans}$` },
        [
          { text: `$x > ${ans}$`, why: 'Subtracting does not flip the inequality sign.' },
          { text: `$x < ${b + a}$`, why: `Added $${a}$ instead of subtracting.` },
          { text: `$x < ${-ans}$`, why: 'Sign error: a negative minus a positive stays negative.' }
        ], r),
      hints: [
        `Subtract $${a}$ from both sides: $x < ${b} - ${a}$.`,
        `Remember: negative minus positive becomes more negative.`,
        '<b>Worked example:</b> $x + 5 < -3$ → $x < -3 - 5 \\Rightarrow x < -8$.'
      ],
      explanation: `Subtract $${a}$: $x < ${b} - ${a} \\Rightarrow x < ${ans}$.`
    };
  });

  // 5: Graph interpretation (open circle vs closed circle)
  makeIneqQ(5, function(seed) {
    const r = seededRandom(seed);
    const val = r.nextInt(-5, 8);
    const isGreater = r.pick([true, false]);
    const symbol = isGreater ? '>' : '<';
    const circleType = 'open circle';
    const direction = isGreater ? 'right' : 'left';
    return {
      text: `Which statement correctly describes the graph of the solution to $x + 4 ${symbol} ${val + 4}$ on a number line?`,
      options: makeOptions(
        { text: `An ${circleType} at $${val}$ with an arrow pointing to the ${direction}` },
        [
          { text: `A closed circle at $${val}$ with an arrow pointing to the ${direction}`, why: 'Strict inequalities ($<$ and $>$) use an OPEN circle, not closed.' },
          { text: `An ${circleType} at $${val}$ with an arrow pointing to the ${isGreater ? 'left' : 'right'}`, why: `For $x ${symbol} ${val}$, the arrow must point to the ${direction}.` },
          { text: `A closed circle at $${val + 4}$ with an arrow pointing to the ${direction}`, why: 'Forgot to solve the inequality before graphing.' }
        ], r),
      hints: [
        `First solve: $x + 4 ${symbol} ${val + 4} \\Rightarrow x ${symbol} ${val}$.`,
        `Strict inequalities ($<$ or $>$) use an OPEN circle.`,
        `Values ${isGreater ? 'greater' : 'less'} than $${val}$ lie to the ${direction}.`
      ],
      explanation: `Subtracting 4 gives $x ${symbol} ${val}$. Because it is strict (${symbol}), use an open circle at $${val}$ shaded to the ${direction}.`
    };
  });

  // 6: Real-world budget problem (AED context)
  makeIneqQ(6, function(seed) {
    const r = seededRandom(seed);
    const budget = r.pick([100, 150, 200, 250]);
    const spent = r.nextInt(35, 75);
    const remaining = budget - spent;
    return {
      text: `Rashid has a maximum shopping budget of AED $${budget}$. He has already spent AED $${spent}$. Let $x$ represent the additional amount he can spend. Which inequality and solution represent this situation?`,
      options: makeOptions(
        { text: `$x + ${spent} \\leq ${budget} \\Rightarrow x \\leq ${remaining}$` },
        [
          { text: `$x + ${spent} \\geq ${budget} \\Rightarrow x \\geq ${remaining}$`, why: '"Maximum budget" means total cost cannot exceed the budget ($\leq$), not $\geq$.' },
          { text: `$x - ${spent} \\leq ${budget} \\Rightarrow x \\leq ${budget + spent}$`, why: 'The amounts add together, they do not subtract.' },
          { text: `$x + ${spent} < ${budget} \\Rightarrow x < ${remaining}$`, why: 'He can spend up to and including the exact budget ($\leq$).' }
        ], r),
      hints: [
        '"Maximum" means less than or equal to: $\\leq$.',
        `Current spent ($${spent}$) plus additional ($x$) must be $\\leq ${budget}$.`,
        '<b>Worked example:</b> Budget 100 AED, spent 40 AED: $x + 40 \\leq 100 \\Rightarrow x \\leq 60$.'
      ],
      explanation: `Total spending $x + ${spent}$ cannot exceed $${budget}$: $x + ${spent} \\leq ${budget} \\Rightarrow x \\leq ${remaining}$ AED.`
    };
  });

  // 7: Real-world weight capacity (metric kg context)
  makeIneqQ(7, function(seed) {
    const r = seededRandom(seed);
    const maxCapacity = r.pick([400, 500, 600]);
    const cargo = r.nextInt(150, 250);
    const allowed = maxCapacity - cargo;
    return {
      text: `An elevator in a Dubai complex can hold at most $${maxCapacity}\\text{ kg}$. The cargo inside already weighs $${cargo}\\text{ kg}$. How much additional passenger weight ($w$) is allowed?`,
      options: makeOptions(
        { text: `$w \\leq ${allowed}\\text{ kg}$` },
        [
          { text: `$w \\geq ${allowed}\\text{ kg}$`, why: '"At most" means $\\leq$, not $\\geq$.' },
          { text: `$w < ${allowed}\\text{ kg}$`, why: 'The elevator can carry exactly the maximum weight.' },
          { text: `$w \\leq ${maxCapacity + cargo}\\text{ kg}$`, why: 'Added instead of subtracting the existing cargo weight.' }
        ], r),
      hints: [
        `"At most" translates to $\\leq$.`,
        `Set up: $w + ${cargo} \\leq ${maxCapacity}$. Subtract $${cargo}$.`,
        '<b>Worked example:</b> Max 500 kg, cargo 200 kg: $w + 200 \\leq 500 \\Rightarrow w \\leq 300\\text{ kg}$.'
      ],
      explanation: `$w + ${cargo} \\leq ${maxCapacity} \\Rightarrow w \\leq ${maxCapacity} - ${cargo} = ${allowed}\\text{ kg}$.`
    };
  });

  // 8: Decimal inequality
  makeIneqQ(8, function(seed) {
    const r = seededRandom(seed);
    const a = r.pick([1.5, 2.5, 3.2, 4.5]);
    const ans = r.pick([5.0, 6.5, 7.2, 8.4]);
    const b = (ans + a).toFixed(1);
    return {
      text: `Solve: $$x + ${a} > ${b}$$`,
      options: makeOptions(
        { text: `$x > ${ans}$` },
        [
          { text: `$x < ${ans}$`, why: 'Did not flip the inequality; subtraction does not change direction.' },
          { text: `$x > ${(parseFloat(b) + a).toFixed(1)}$`, why: 'Added instead of subtracting.' },
          { text: `$x \\geq ${ans}$`, why: 'Strict inequality must remain strict.' }
        ], r),
      hints: [
        `Subtract $${a}$ from both sides.`,
        `$${b} - ${a} = ${ans}$.`,
        '<b>Worked example:</b> $x + 2.5 > 7.0$ → $x > 4.5$.'
      ],
      explanation: `Subtract $${a}$: $x > ${b} - ${a} \\Rightarrow x > ${ans}$.`
    };
  });

  // 9: Set-builder notation
  makeIneqQ(9, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 9);
    const ans = r.nextInt(-6, 8);
    const b = ans + a;
    return {
      text: `Write the solution of $x + ${a} \\geq ${b}$ in set-builder notation:`,
      options: makeOptions(
        { text: `$\\{x \\mid x \\geq ${ans}\\}$` },
        [
          { text: `$\\{x \\mid x \\leq ${ans}\\}$`, why: 'Reversed the inequality symbol.' },
          { text: `$\\{x \\mid x > ${ans}\\}$`, why: 'Lost the $\\geq$ condition.' },
          { text: `$\\{x \\mid x \\geq ${b}\\}$`, why: `Forgot to subtract $${a}$.` }
        ], r),
      hints: [
        `Solve the inequality: subtract $${a}$ to get $x \\geq ${ans}$.`,
        'Set-builder notation wraps the condition: $\\{x \\mid \\text{condition}\\}$.',
        '<b>Worked example:</b> $x + 3 \\geq 8 \\Rightarrow \\{x \\mid x \\geq 5\\}$.'
      ],
      explanation: `Subtracting $${a}$ yields $x \\geq ${ans}$. In set-builder notation: $\\{x \\mid x \\geq ${ans}\\}$.`
    };
  });

  // 10: Variable on right: b < x + a
  makeIneqQ(10, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(3, 10);
    const ans = r.nextInt(1, 10);
    const b = ans + a;
    return {
      text: `Solve: $$${b} < x + ${a}$$`,
      options: makeOptions(
        { text: `$x > ${ans}$` },
        [
          { text: `$x < ${ans}$`, why: '$b < x + a$ means $x + a > b$, so $x > b - a$.' },
          { text: `$x > ${b + a}$`, why: `Added $${a}$ instead of subtracting it.` },
          { text: `$x < ${b + a}$`, why: 'Reversed inequality and added incorrectly.' }
        ], r),
      hints: [
        `Subtract $${a}$ from both sides: $${b} - ${a} < x$, which means $${ans} < x$.`,
        `Rewrite with $x$ on the left: $${ans} < x$ is equivalent to $x > ${ans}$.`,
        '<b>Worked example:</b> $10 < x + 4 \\Rightarrow 6 < x \\Rightarrow x > 6$.'
      ],
      explanation: `$${b} - ${a} < x \\Rightarrow ${ans} < x \\Rightarrow x > ${ans}$.`
    };
  });

  // 11: Fraction subtraction inequality: x + 1/2 <= 5/2
  makeIneqQ(11, function(seed) {
    const r = seededRandom(seed);
    const numA = 1, den = r.pick([2, 4]);
    const numB = r.pick([3, 5, 7]);
    const ans = (numB - numA) / den;
    return {
      text: `Solve: $$x + \\frac{${numA}}{${den}} \\leq \\frac{${numB}}{${den}}$$`,
      options: makeOptions(
        { text: `$x \\leq ${ans}$` },
        [
          { text: `$x \\geq ${ans}$`, why: 'Flipped the inequality symbol without reason.' },
          { text: `$x \\leq \\frac{${numB + numA}}{${den}}$`, why: 'Added the fractions instead of subtracting.' },
          { text: `$x < ${ans}$`, why: 'Removed the equal-to condition.' }
        ], r),
      hints: [
        `Subtract $\\frac{${numA}}{${den}}$ from both sides.`,
        `$\\frac{${numB}}{${den}} - \\frac{${numA}}{${den}} = \\frac{${numB - numA}}{${den}} = ${ans}$.`,
        '<b>Worked example:</b> $x + \\frac{1}{3} \\leq \\frac{7}{3} \\Rightarrow x \\leq 2$.'
      ],
      explanation: `$x \\leq \\frac{${numB} - ${numA}}{${den}} = \\frac{${numB - numA}}{${den}} = ${ans}$.`
    };
  });

  // 12: Combined words to inequality
  makeIneqQ(12, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(3, 9);
    const b = r.nextInt(10, 25);
    const ans = b - a;
    return {
      text: `Which inequality translates the sentence: "The sum of a number and $${a}$ is at least $${b}$"?`,
      options: makeOptions(
        { text: `$x + ${a} \\geq ${b} \\Rightarrow x \\geq ${ans}$` },
        [
          { text: `$x + ${a} \\leq ${b} \\Rightarrow x \\leq ${ans}$`, why: '"At least" means greater than or equal to ($\\geq$), not $\\leq$.' },
          { text: `$x + ${a} > ${b} \\Rightarrow x > ${ans}$`, why: '"At least" includes the value itself ($\\geq$).' },
          { text: `$x - ${a} \\geq ${b} \\Rightarrow x \\geq ${b + a}$`, why: '"Sum" indicates addition, not subtraction.' }
        ], r),
      hints: [
        '"Sum" means $+$. "At least" means $\\geq$.',
        `Equation: $x + ${a} \\geq ${b}$. Subtract $${a}$ to solve.`,
        '<b>Worked example:</b> "Sum of a number and 2 is at least 10" → $x + 2 \\geq 10 \\Rightarrow x \\geq 8$.'
      ],
      explanation: `"Sum of a number and ${a}$" is $x + ${a}$. "At least ${b}$" is $\\geq ${b}$. Subtracting ${a}$ gives $x \\geq ${ans}$.`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 10: Equation through a point parallel to a given line (p.304, Lesson 5-2, ex.25–29)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[10] = { tile: 10, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[10].questions;
  function makeParQ(idx, genFn) { Q.push({ id: `q10_${idx}`, generate: genFn }); }

  // 1: Given y = mx + b, integer slope
  makeParQ(1, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 5);
    const x1 = r.nextInt(1, 4), y1 = r.nextInt(-4, 6);
    const bGiven = r.nextIntNonZero(-8, 8);
    const bNew = y1 - m * x1;
    return {
      text: `Write the equation in slope-intercept form of the line that passes through $(${x1}, ${y1})$ and is parallel to $y = ${m}x ${signStr(bGiven)}$.`,
      options: makeOptions(
        { text: `$y = ${m}x ${signStr(bNew)}$` },
        [
          { text: `$y = -\\frac{1}{${m}}x ${signStr(y1 + Math.round(x1 / m))}$`, why: 'Used the perpendicular slope (negative reciprocal) instead of parallel (same slope).' },
          { text: `$y = ${m}x ${signStr(bGiven)}$`, why: 'Kept the original line\'s $y$-intercept instead of calculating the new one for the given point.' },
          { text: `$y = -${m}x ${signStr(bNew)}$`, why: 'Changed the sign of the slope; parallel lines have the EXACT same slope.' }
        ], r),
      hints: [
        `Parallel lines have identical slopes: $m = ${m}$.`,
        `Use point-slope form: $y - ${y1} = ${m}(x - ${x1})$.`,
        '<b>Worked example:</b> Through $(1, 5)$ parallel to $y = 3x - 2$.<br>$m = 3$. $y - 5 = 3(x - 1) \\Rightarrow y = 3x + 2$.'
      ],
      explanation: `Parallel slope $m = ${m}$. Using $y = mx + b$: $${y1} = ${m}(${x1}) + b \\Rightarrow b = ${y1} - ${m * x1} = ${bNew}$. Equation: $y = ${m}x ${signStr(bNew)}$.`
    };
  });

  // 2: Negative slope
  makeParQ(2, function(seed) {
    const r = seededRandom(seed);
    const m = -r.nextInt(2, 4);
    const x1 = r.nextInt(1, 4), y1 = r.nextInt(1, 6);
    const bGiven = r.nextIntNonZero(-6, 6);
    const bNew = y1 - m * x1;
    return {
      text: `What is the equation of the line passing through $(${x1}, ${y1})$ and parallel to the line $y = ${m}x ${signStr(bGiven)}$?`,
      options: makeOptions(
        { text: `$y = ${m}x ${signStr(bNew)}$` },
        [
          { text: `$y = ${Math.abs(m)}x ${signStr(bNew)}$`, why: 'Parallel lines have the same sign for their slope.' },
          { text: `$y = ${m}x ${signStr(bGiven)}$`, why: 'Did not compute the new $y$-intercept.' },
          { text: `$y = \\frac{1}{${Math.abs(m)}}x ${signStr(bNew)}$`, why: 'Used perpendicular slope.' }
        ], r),
      hints: [
        `Parallel lines have the same slope: $m = ${m}$.`,
        `Substitute $(${x1}, ${y1})$ into $y - y_1 = m(x - x_1)$.`,
        '<b>Worked example:</b> Through $(2, 1)$ parallel to $y = -2x + 4$.<br>$y - 1 = -2(x - 2) \\Rightarrow y = -2x + 5$.'
      ],
      explanation: `$m = ${m}$. $y - (${y1}) = ${m}(x - ${x1}) \\Rightarrow y = ${m}x - ${m * x1} + ${y1} = ${m}x ${signStr(bNew)}$.`
    };
  });

  // 3: Fraction slope: y = (1/2)x + b
  makeParQ(3, function(seed) {
    const r = seededRandom(seed);
    const den = r.pick([2, 3, 4]);
    const num = 1;
    const x1 = den * r.nextInt(1, 3);
    const y1 = r.nextInt(-3, 5);
    const bGiven = r.nextIntNonZero(-5, 5);
    const bNew = y1 - (num / den) * x1;
    return {
      text: `Find the equation of the line parallel to $y = \\frac{1}{${den}}x ${signStr(bGiven)}$ passing through $(${x1}, ${y1})$.`,
      options: makeOptions(
        { text: `$y = \\frac{1}{${den}}x ${signStr(bNew)}$` },
        [
          { text: `$y = -${den}x ${signStr(y1 + den * x1)}$`, why: 'Used the perpendicular slope $-' + den + '$.' },
          { text: `$y = \\frac{1}{${den}}x ${signStr(bGiven)}$`, why: 'Reused the old $y$-intercept.' },
          { text: `$y = -\\frac{1}{${den}}x ${signStr(bNew)}$`, why: 'Sign error on the slope.' }
        ], r),
      hints: [
        `Slope is $m = \\frac{1}{${den}}$.`,
        `Substitute $x = ${x1}$ and $y = ${y1}$ into $y = mx + b$.`,
        '<b>Worked example:</b> Through $(4, 3)$ parallel to $y = \\frac{1}{2}x + 1$.<br>$3 = \\frac{1}{2}(4) + b \\Rightarrow 3 = 2 + b \\Rightarrow b = 1$. Equation: $y = \\frac{1}{2}x + 1$.'
      ],
      explanation: `$m = \\frac{1}{${den}}$. $b = ${y1} - \\frac{1}{${den}}(${x1}) = ${bNew}$. Equation: $y = \\frac{1}{${den}}x ${signStr(bNew)}$.`
    };
  });

  // 4: Given standard form Ax + By = C
  makeParQ(4, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 4);
    const x1 = r.nextInt(1, 4), y1 = r.nextInt(1, 5);
    const c = r.nextInt(6, 15);
    // Line: ax + y = c => y = -ax + c => m = -a
    const m = -a;
    const bNew = y1 - m * x1;
    return {
      text: `Write an equation of the line that passes through $(${x1}, ${y1})$ and is parallel to $${a}x + y = ${c}$.`,
      options: makeOptions(
        { text: `$y = -${a}x ${signStr(bNew)}$` },
        [
          { text: `$y = ${a}x ${signStr(bNew)}$`, why: 'Rewrite $Ax + y = C$ as $y = -Ax + C$; the slope is $-' + a + '$, not $' + a + '$.' },
          { text: `$y = \\frac{1}{${a}}x ${signStr(bNew)}$`, why: 'This is the perpendicular slope.' },
          { text: `$y = -${a}x + ${c}$`, why: 'Kept the original constant.' }
        ], r),
      hints: [
        `First find the slope of $${a}x + y = ${c}$ by solving for $y$: $y = -${a}x + ${c}$. Slope $m = -${a}$.`,
        `Use $m = -${a}$ with point $(${x1}, ${y1})$.`,
        '<b>Worked example:</b> $2x + y = 6$ → $m = -2$. Through $(1, 3)$: $y - 3 = -2(x - 1) \\Rightarrow y = -2x + 5$.'
      ],
      explanation: `Original line has $m = -${a}$. Parallel line: $y - ${y1} = -${a}(x - ${x1}) \\Rightarrow y = -${a}x ${signStr(bNew)}$.`
    };
  });

  // 5: Point-slope form requested
  makeParQ(5, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 6);
    const x1 = r.nextInt(2, 7), y1 = r.nextInt(1, 8);
    const bGiven = r.nextIntNonZero(-5, 5);
    return {
      text: `Which equation in point-slope form represents the line through $(${x1}, ${y1})$ parallel to $y = ${m}x ${signStr(bGiven)}$?`,
      options: makeOptions(
        { text: `$y - ${y1} = ${m}(x - ${x1})$` },
        [
          { text: `$y + ${y1} = ${m}(x + ${x1})$`, why: 'Point-slope form uses subtraction: $y - y_1 = m(x - x_1)$.' },
          { text: `$y - ${x1} = ${m}(x - ${y1})$`, why: 'Swapped $x_1$ and $y_1$ in the formula.' },
          { text: `$y - ${y1} = -\\frac{1}{${m}}(x - ${x1})$`, why: 'Used perpendicular slope.' }
        ], r),
      hints: [
        'Point-slope formula is $y - y_1 = m(x - x_1)$.',
        `Parallel line has $m = ${m}$. Substitute $x_1 = ${x1}$ and $y_1 = ${y1}$.`,
        '<b>Worked example:</b> Through $(3, 4)$ parallel to $y = 5x$: $y - 4 = 5(x - 3)$.'
      ],
      explanation: `Parallel slope is $m = ${m}$. Point-slope form: $y - ${y1} = ${m}(x - ${x1})$.`
    };
  });

  // 6: Point with negative coordinates
  makeParQ(6, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 4);
    const x1 = -r.nextInt(2, 5), y1 = r.nextInt(1, 5);
    const bNew = y1 - m * x1;
    return {
      text: `Find the equation of the line parallel to $y = ${m}x + 9$ that passes through the point $(${x1}, ${y1})$.`,
      options: makeOptions(
        { text: `$y = ${m}x ${signStr(bNew)}$` },
        [
          { text: `$y = ${m}x ${signStr(y1 - m * Math.abs(x1))}$`, why: 'Sign error when substituting negative $x_1$: $m(x - (-c)) = m(x + c)$.' },
          { text: `$y = -${m}x ${signStr(bNew)}$`, why: 'Parallel lines have the same slope.' },
          { text: `$y = ${m}x + 9$`, why: 'The new line has a different $y$-intercept.' }
        ], r),
      hints: [
        `$m = ${m}$. Watch signs with $x_1 = ${x1}$: $x - (${x1}) = x + ${Math.abs(x1)}$.`,
        `$y - ${y1} = ${m}(x + ${Math.abs(x1)}) \\Rightarrow y = ${m}x + ${m * Math.abs(x1)} + ${y1}$.`,
        '<b>Worked example:</b> Through $(-2, 3)$ parallel to $y = 3x$: $y - 3 = 3(x + 2) \\Rightarrow y = 3x + 9$.'
      ],
      explanation: `$y - ${y1} = ${m}(x - (${x1})) \\Rightarrow y = ${m}x + ${m * (-x1)} + ${y1} = ${m}x ${signStr(bNew)}$.`
    };
  });

  // 7: Horizontal line parallel
  makeParQ(7, function(seed) {
    const r = seededRandom(seed);
    const yVal = r.nextInt(-6, 6);
    const xPoint = r.nextInt(-5, 5);
    const yPoint = r.nextIntNonZero(-6, 6);
    return {
      text: `What is the equation of the line parallel to $y = ${yVal}$ that passes through $(${xPoint}, ${yPoint})$?`,
      options: makeOptions(
        { text: `$y = ${yPoint}$` },
        [
          { text: `$x = ${xPoint}$`, why: '$x = c$ is vertical and perpendicular to a horizontal line, not parallel.' },
          { text: `$y = ${yVal}$`, why: 'That is the original line, which does not pass through the given point.' },
          { text: `$y = 0x + ${xPoint}$`, why: 'The horizontal line takes the $y$-coordinate of the point, not $x$.' }
        ], r),
      hints: [
        `The line $y = ${yVal}$ is horizontal (slope $0$).`,
        `Any line parallel to it must also be horizontal: $y = k$.`,
        '<b>Worked example:</b> Parallel to $y = 4$ through $(3, -2)$ is $y = -2$.'
      ],
      explanation: `Parallel to a horizontal line is another horizontal line: $y = y_1 = ${yPoint}$.`
    };
  });

  // 8: Vertical line parallel
  makeParQ(8, function(seed) {
    const r = seededRandom(seed);
    const xVal = r.nextInt(-6, 6);
    const xPoint = r.nextIntNonZero(-5, 5);
    const yPoint = r.nextInt(-5, 5);
    return {
      text: `Which equation represents the line passing through $(${xPoint}, ${yPoint})$ and parallel to the vertical line $x = ${xVal}$?`,
      options: makeOptions(
        { text: `$x = ${xPoint}$` },
        [
          { text: `$y = ${yPoint}$`, why: '$y = c$ is horizontal and perpendicular to $x = c$.' },
          { text: `$x = ${xVal}$`, why: 'This is the original line, not the one through the new point.' },
          { text: `$x + y = ${xPoint + yPoint}$`, why: 'Parallel to a vertical line must have the form $x = c$.' }
        ], r),
      hints: [
        'A line parallel to a vertical line is also vertical.',
        'Vertical lines have equations of the form $x = c$.',
        '<b>Worked example:</b> Parallel to $x = 1$ through $(-4, 5)$ is $x = -4$.'
      ],
      explanation: `Vertical lines have undefined slope and take the form $x = x_1$. Therefore, $x = ${xPoint}$.`
    };
  });

  // 9: Parallel line passing through origin (0, 0)
  makeParQ(9, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 6);
    const bGiven = r.nextIntNonZero(-8, 8);
    return {
      text: `Write an equation of the line passing through the origin $(0, 0)$ and parallel to $y = ${m}x ${signStr(bGiven)}$.`,
      options: makeOptions(
        { text: `$y = ${m}x$` },
        [
          { text: `$y = ${m}x ${signStr(bGiven)}$`, why: 'Passing through $(0,0)$ means the $y$-intercept is $0$.' },
          { text: `$y = -\\frac{1}{${m}}x$`, why: 'This is the perpendicular line.' },
          { text: `$y = x$`, why: 'The slope must match the parallel line ($m = ' + m + '$).' }
        ], r),
      hints: [
        `The slope is $m = ${m}$.`,
        'Passing through $(0, 0)$ means the $y$-intercept is $b = 0$.',
        '<b>Worked example:</b> Parallel to $y = 4x - 7$ through $(0, 0)$ is $y = 4x$.'
      ],
      explanation: `Slope is $m = ${m}$, and passing through $(0, 0)$ means $b = 0$. Thus $y = ${m}x$.`
    };
  });

  // 10: Identify which pair of lines are parallel
  makeParQ(10, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 5);
    const b1 = r.nextInt(1, 4), b2 = r.nextInt(5, 9);
    return {
      text: `Which pair of linear equations represents two parallel lines?`,
      options: makeOptions(
        { text: `$y = ${m}x + ${b1}$ and $y = ${m}x + ${b2}$` },
        [
          { text: `$y = ${m}x + ${b1}$ and $y = -\\frac{1}{${m}}x + ${b2}$`, why: 'Slopes are negative reciprocals, so these lines are perpendicular.' },
          { text: `$y = ${m}x + ${b1}$ and $y = -${m}x + ${b2}$`, why: 'Opposite slopes are not equal; these lines intersect.' },
          { text: `$y = ${m}x + ${b1}$ and $y = \\frac{1}{${m}}x + ${b2}$`, why: 'Reciprocal slopes are not equal.' }
        ], r),
      hints: [
        'Parallel lines have the EXACT same slope ($m_1 = m_2$) and different $y$-intercepts.',
        `Look for two equations with the same coefficient of $x$.`,
        '<b>Worked example:</b> $y = 3x + 1$ and $y = 3x - 5$ are parallel because both have slope 3.'
      ],
      explanation: `Both equations have slope $m = ${m}$ and different $y$-intercepts, so they are parallel.`
    };
  });

  // 11: Standard form result: Ax + By = C
  makeParQ(11, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 4), b = r.pick([1, 2]);
    const x1 = r.nextInt(1, 4), y1 = r.nextInt(1, 5);
    const cNew = a * x1 + b * y1;
    return {
      text: `Write an equation in standard form ($Ax + By = C$) for the line through $(${x1}, ${y1})$ parallel to $${a}x + ${b === 1 ? '' : b}y = 12$.`,
      options: makeOptions(
        { text: `$${a}x + ${b === 1 ? '' : b}y = ${cNew}$` },
        [
          { text: `$${a}x + ${b === 1 ? '' : b}y = 12$`, why: 'Must substitute the point to find the new constant $C$.' },
          { text: `$${b === 1 ? '' : b}x - ${a}y = ${cNew}$`, why: 'This represents a perpendicular line.' },
          { text: `$${a}x - ${b === 1 ? '' : b}y = ${cNew}$`, why: 'Changing the sign changes the slope.' }
        ], r),
      hints: [
        `Parallel lines in standard form share the same coefficients $Ax + By$: $${a}x + ${b === 1 ? '' : b}y = C$.`,
        `Substitute $x = ${x1}$ and $y = ${y1}$ to find $C$: $${a}(${x1}) + ${b}(${y1}) = ${cNew}$.`,
        '<b>Worked example:</b> Parallel to $3x + y = 5$ through $(2, 4)$: $3(2) + 4 = 10 \\Rightarrow 3x + y = 10$.'
      ],
      explanation: `Parallel lines have the same $A$ and $B$. $C = ${a}(${x1}) + ${b}(${y1}) = ${cNew}$. Equation: $${a}x + ${b === 1 ? '' : b}y = ${cNew}$.`
    };
  });

  // 12: Real-world parallel paths
  makeParQ(12, function(seed) {
    const r = seededRandom(seed);
    const m = r.pick([2, 3]);
    const x1 = 4, y1 = r.nextInt(5, 12);
    const bNew = y1 - m * x1;
    return {
      text: `A railway track follows the line $y = ${m}x + 10$. A parallel service road must pass through point $(${x1}, ${y1})$. What is the equation of the service road?`,
      options: makeOptions(
        { text: `$y = ${m}x ${signStr(bNew)}$` },
        [
          { text: `$y = ${m}x + 10$`, why: 'The service road does not pass through $(4, 10)$ unless $y_1 = 10$.' },
          { text: `$y = -\\frac{1}{${m}}x ${signStr(bNew)}$`, why: 'Service road runs parallel, not perpendicular.' },
          { text: `$y = -${m}x ${signStr(bNew)}$`, why: 'Parallel paths share the same positive slope.' }
        ], r),
      hints: [
        `Service road is parallel, so $m = ${m}$.`,
        `$y - ${y1} = ${m}(x - ${x1})$.`,
        '<b>Worked example:</b> $y = 2x + 8$ through $(3, 1)$ → $y - 1 = 2(x - 3) \\Rightarrow y = 2x - 5$.'
      ],
      explanation: `Slope $m = ${m}$. New intercept: $b = ${y1} - ${m}(${x1}) = ${bNew}$. Equation: $y = ${m}x ${signStr(bNew)}$.`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 11: Solve linear inequalities involving more than one operation (p.354, Lesson 6-2, Ex.2–3)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[11] = { tile: 11, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[11].questions;
  function makeMultiIneq(idx, genFn) { Q.push({ id: `q11_${idx}`, generate: genFn }); }

  // 1: ax + b > c (positive a)
  makeMultiIneq(1, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 6);
    const ans = r.nextInt(-8, 8);
    const b = r.nextIntNonZero(-12, 12);
    const c = a * ans + b;
    return {
      text: `Solve: $$${a}x ${signStr(b)} > ${c}$$`,
      options: makeOptions(
        { text: `$x > ${ans}$` },
        [
          { text: `$x < ${ans}$`, why: `Dividing by a positive number ($${a}$) does NOT flip the inequality.` },
          { text: `$x > ${ans + 1}$`, why: 'Arithmetic error in division.' },
          { text: `$x > ${Math.round((c + b) / a)}$`, why: `Added $${b}$ instead of subtracting it.` }
        ], r),
      hints: [
        `Subtract $${b}$ from both sides: $${a}x > ${c - b}$.`,
        `Divide both sides by $${a}$. Since $${a} > 0$, the inequality sign remains $>$.`,
        '<b>Worked example:</b> $3x + 5 > 20$ → $3x > 15$ → $x > 5$.'
      ],
      explanation: `Subtract $${b}$: $${a}x > ${c - b}$.<br>Divide by $${a}$: $x > ${ans}$.`
    };
  });

  // 2: -ax + b <= c (negative a -> FLIP SIGN!)
  makeMultiIneq(2, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 6);
    const ans = r.nextInt(-6, 6);
    const b = r.nextInt(1, 15);
    const c = -a * ans + b;
    return {
      text: `Solve: $$-${a}x + ${b} \\leq ${c}$$`,
      options: makeOptions(
        { text: `$x \\geq ${ans}$` },
        [
          { text: `$x \\leq ${ans}$`, why: `CRITICAL: When dividing by a negative number ($-${a}$), the inequality symbol MUST flip from $\\leq$ to $\\geq$.` },
          { text: `$x \\geq ${-ans}$`, why: 'Sign error when dividing by negative.' },
          { text: `$x > ${ans}$`, why: 'The inequality includes equality ($\\geq$, not $>$).' }
        ], r),
      hints: [
        `Subtract $${b}$ from both sides: $-${a}x \\leq ${c - b}$.`,
        `Now divide both sides by $-${a}$. Remember: REVERSE the inequality sign!`,
        '<b>Worked example:</b> $-2x + 7 \\leq 1$ → $-2x \\leq -6$ → Divide by $-2$: $x \\geq 3$.'
      ],
      explanation: `$-${a}x \\leq ${c - b}$<br>Divide by $-${a}$ and flip sign: $x \\geq ${ans}$.`
    };
  });

  // 3: -ax - b > c (negative a, negative b -> FLIP SIGN)
  makeMultiIneq(3, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 5);
    const ans = r.nextInt(-5, 5);
    const b = r.nextInt(2, 10);
    const c = -a * ans - b;
    return {
      text: `Solve the inequality: $$-${a}x - ${b} > ${c}$$`,
      options: makeOptions(
        { text: `$x < ${ans}$` },
        [
          { text: `$x > ${ans}$`, why: `Forgot to reverse the inequality sign when dividing by $-${a}$.` },
          { text: `$x < ${-ans}$`, why: 'Sign error.' },
          { text: `$x \\leq ${ans}$`, why: 'Strict inequality ($<$) must remain strict.' }
        ], r),
      hints: [
        `Add $${b}$ to both sides: $-${a}x > ${c + b}$.`,
        `Divide by $-${a}$ and flip $>$ to $<$.`,
        '<b>Worked example:</b> $-4x - 3 > 9$ → $-4x > 12$ → Divide by $-4$: $x < -3$.'
      ],
      explanation: `Add $${b}$: $-${a}x > ${c + b}$. Divide by $-${a}$ and flip: $x < ${ans}$.`
    };
  });

  // 4: a(x + b) <= c
  makeMultiIneq(4, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 5);
    const b = r.nextIntNonZero(-6, 6);
    const ans = r.nextInt(-6, 8);
    const c = a * (ans + b);
    return {
      text: `Solve: $$${a}(x ${signStr(b)}) \\leq ${c}$$`,
      options: makeOptions(
        { text: `$x \\leq ${ans}$` },
        [
          { text: `$x \\geq ${ans}$`, why: 'Dividing by positive $' + a + '$ does not flip the sign.' },
          { text: `$x \\leq ${ans + b}$`, why: 'Forgot to subtract $' + b + '$ after dividing.' },
          { text: `$x \\leq ${-ans}$`, why: 'Sign error.' }
        ], r),
      hints: [
        `Divide both sides by $${a}$ first: $x ${signStr(b)} \\leq ${c / a}$.`,
        `Subtract $${b}$ from both sides.`,
        '<b>Worked example:</b> $3(x - 2) \\leq 12$ → $x - 2 \\leq 4$ → $x \\leq 6$.'
      ],
      explanation: `Divide by $${a}$: $x ${signStr(b)} \\leq ${c / a}$. Subtract $${b}$: $x \\leq ${ans}$.`
    };
  });

  // 5: Variables on both sides: ax + b < cx + d
  makeMultiIneq(5, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(4, 8);
    const c = r.nextInt(1, a - 1);
    const ans = r.nextInt(-5, 8);
    const b = r.nextInt(-10, 10);
    const d = (a - c) * ans + b;
    return {
      text: `Solve: $$${a}x ${signStr(b)} < ${c}x + ${d}$$`,
      options: makeOptions(
        { text: `$x < ${ans}$` },
        [
          { text: `$x > ${ans}$`, why: 'The coefficient on $x$ after subtracting is positive, so the sign stays $<$.' },
          { text: `$x < ${-ans}$`, why: 'Sign error.' },
          { text: `$x \\leq ${ans}$`, why: 'Strict inequality must remain strict.' }
        ], r),
      hints: [
        `Subtract $${c}x$ from both sides: $${a - c}x ${signStr(b)} < ${d}$.`,
        `Subtract $${b}$, then divide by $${a - c}$.`,
        '<b>Worked example:</b> $5x + 2 < 2x + 11$ → $3x + 2 < 11$ → $3x < 9$ → $x < 3$.'
      ],
      explanation: `$${a - c}x ${signStr(b)} < ${d} \\Rightarrow ${a - c}x < ${d - b} \\Rightarrow x < ${ans}$.`
    };
  });

  // 6: Variables on both sides requiring sign flip: ax + b >= cx + d where a < c
  makeMultiIneq(6, function(seed) {
    const r = seededRandom(seed);
    const c = r.nextInt(4, 7);
    const a = r.nextInt(1, c - 1);
    const ans = r.nextInt(-5, 6);
    const b = r.nextInt(1, 10);
    const d = (a - c) * ans + b;
    return {
      text: `Solve: $$${a}x + ${b} \\geq ${c}x + ${d}$$`,
      options: makeOptions(
        { text: `$x \\leq ${ans}$` },
        [
          { text: `$x \\geq ${ans}$`, why: `Subtracting $${c}x$ leaves a negative coefficient ($${a - c}x$), so dividing by it MUST flip $\\geq$ to $\\leq$.` },
          { text: `$x \\leq ${-ans}$`, why: 'Sign error when dividing negative by negative.' },
          { text: `$x < ${ans}$`, why: 'The original sign includes equality.' }
        ], r),
      hints: [
        `Subtract $${c}x$: $${a - c}x + ${b} \\geq ${d}$.`,
        `Subtract $${b}$: $${a - c}x \\geq ${d - b}$.`,
        `Divide by $${a - c}$ and REVERSE the inequality symbol to $\\leq$.`,
        '<b>Worked example:</b> $2x + 1 \\geq 5x - 8$ → $-3x \\geq -9$ → $x \\leq 3$.'
      ],
      explanation: `$${a - c}x \\geq ${d - b}$. Divide by negative $${a - c}$ and flip: $x \\leq ${ans}$.`
    };
  });

  // 7: x/a + b >= c (fraction with negative a)
  makeMultiIneq(7, function(seed) {
    const r = seededRandom(seed);
    const a = r.pick([2, 3, 4, 5]);
    const ans = r.nextInt(-4, 6) * a;
    const b = r.nextInt(1, 8);
    const c = -(ans / a) + b;
    return {
      text: `Solve: $$-\\frac{x}{${a}} + ${b} \\geq ${c}$$`,
      options: makeOptions(
        { text: `$x \\leq ${ans}$` },
        [
          { text: `$x \\geq ${ans}$`, why: `Multiplying by $-${a}$ flips the inequality from $\\geq$ to $\\leq$.` },
          { text: `$x \\leq ${-ans}$`, why: 'Sign error.' },
          { text: `$x \\leq ${ans / a}$`, why: `Forgot to multiply by $${a}$.` }
        ], r),
      hints: [
        `Subtract $${b}$ from both sides: $-\\frac{x}{${a}} \\geq ${c - b}$.`,
        `Multiply both sides by $-${a}$ and REVERSE the sign to $\\leq$.`,
        '<b>Worked example:</b> $-\\frac{x}{3} + 2 \\geq 5$ → $-\\frac{x}{3} \\geq 3$ → $x \\leq -9$.'
      ],
      explanation: `$-\\frac{x}{${a}} \\geq ${c - b}$. Multiply by $-${a}$ (flip sign): $x \\leq ${ans}$.`
    };
  });

  // 8: Distributive property on both sides
  makeMultiIneq(8, function(seed) {
    const r = seededRandom(seed);
    const ans = r.nextInt(2, 8);
    // 2(x - 1) > x + 3 => 2x - 2 > x + 3 => x > 5
    const b1 = r.nextInt(1, 4);
    const d = ans - 2 * b1;
    return {
      text: `Solve: $$2(x - ${b1}) > x ${signStr(d)}$$`,
      options: makeOptions(
        { text: `$x > ${ans}$` },
        [
          { text: `$x < ${ans}$`, why: 'No division by a negative occurred, so the sign stays $>$.' },
          { text: `$x > ${ans + 2 * b1}$`, why: 'Forgot to add the distributed constant to the other side.' },
          { text: `$x > ${-ans}$`, why: 'Sign error.' }
        ], r),
      hints: [
        `Distribute: $2x - ${2 * b1} > x ${signStr(d)}$.`,
        `Subtract $x$ from both sides: $x - ${2 * b1} > ${d}$.`,
        '<b>Worked example:</b> $2(x - 3) > x + 1$ → $2x - 6 > x + 1$ → $x > 7$.'
      ],
      explanation: `Distribute: $2x - ${2 * b1} > x ${signStr(d)}$. Subtract $x$ and add $${2 * b1}$: $x > ${ans}$.`
    };
  });

  // 9: Real-world taxi fare (AED context)
  makeMultiIneq(9, function(seed) {
    const r = seededRandom(seed);
    const base = r.pick([12, 15, 20]);
    const perKm = r.pick([2, 3]);
    const budget = r.pick([50, 60, 80]);
    const maxKm = Math.floor((budget - base) / perKm);
    return {
      text: `A taxi in Abu Dhabi charges AED $${base}$ flag fall plus AED $${perKm}$ per kilometer. Omar has a maximum of AED $${budget}$. What is the maximum whole number of kilometers he can travel?`,
      options: makeOptions(
        { text: `$${maxKm}\\text{ km}$` },
        [
          { text: `$${maxKm + 1}\\text{ km}$`, why: `Traveling $${maxKm + 1}\\text{ km}$ costs AED $${base + perKm * (maxKm + 1)}$, which exceeds his budget of AED $${budget}$.` },
          { text: `$${Math.floor(budget / perKm)}\\text{ km}$`, why: 'Forgot to subtract the base fare first.' },
          { text: `$${maxKm - 1}\\text{ km}$`, why: 'He can travel more kilometers without exceeding his budget.' }
        ], r),
      hints: [
        `Set up the inequality: $${base} + ${perKm}k \\leq ${budget}$.`,
        `Subtract $${base}$: $${perKm}k \\leq ${budget - base}$.`,
        `Divide by $${perKm}$: $k \\leq ${(budget - base) / perKm}$. Take the greatest whole number.`
      ],
      explanation: `$${base} + ${perKm}k \\leq ${budget} \\Rightarrow ${perKm}k \\leq ${budget - base} \\Rightarrow k \\leq ${(budget - base) / perKm}$. Maximum whole km is $${maxKm}$.`
    };
  });

  // 10: -x/3 - 4 < 1
  makeMultiIneq(10, function(seed) {
    const r = seededRandom(seed);
    const d = r.pick([2, 3, 4]);
    const b = r.nextInt(2, 6);
    const c = r.nextInt(1, 4);
    const ans = -(c + b) * d;
    return {
      text: `Solve: $$-\\frac{x}{${d}} - ${b} < ${c}$$`,
      options: makeOptions(
        { text: `$x > ${ans}$` },
        [
          { text: `$x < ${ans}$`, why: 'Multiplying by a negative reverses $<$ to $>$.' },
          { text: `$x > ${-ans}$`, why: 'Sign error.' },
          { text: `$x < ${-(c - b) * d}$`, why: 'Subtracted instead of adding $' + b + '$.' }
        ], r),
      hints: [
        `Add $${b}$ to both sides: $-\\frac{x}{${d}} < ${c + b}$.`,
        `Multiply by $-${d}$ and FLIP the inequality sign to $>$.`,
        '<b>Worked example:</b> $-\\frac{x}{2} - 3 < 1$ → $-\\frac{x}{2} < 4$ → Multiply by $-2$: $x > -8$.'
      ],
      explanation: `Add $${b}$: $-\\frac{x}{${d}} < ${c + b}$. Multiply by $-${d}$ and flip: $x > ${ans}$.`
    };
  });

  // 11: 3 - 2x >= 11
  makeMultiIneq(11, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 5);
    const k = r.nextInt(5, 15);
    const ans = -r.nextInt(2, 6);
    const c = k - a * ans;
    return {
      text: `Solve: $$${k} - ${a}x \\geq ${c}$$`,
      options: makeOptions(
        { text: `$x \\leq ${ans}$` },
        [
          { text: `$x \\geq ${ans}$`, why: 'Forgot to flip the inequality sign when dividing by $-' + a + '$.' },
          { text: `$x \\leq ${-ans}$`, why: 'Sign error.' },
          { text: `$x < ${ans}$`, why: 'The original inequality is $\\geq$.' }
        ], r),
      hints: [
        `Subtract $${k}$ from both sides: $-${a}x \\geq ${c - k}$.`,
        `Divide by $-${a}$ and flip $\\geq$ to $\\leq$.`,
        '<b>Worked example:</b> $5 - 2x \\geq 13$ → $-2x \\geq 8$ → $x \\leq -4$.'
      ],
      explanation: `Subtract $${k}$: $-${a}x \\geq ${c - k}$. Divide by $-${a}$ (flip): $x \\leq ${ans}$.`
    };
  });

  // 12: Real-world grade average problem
  makeMultiIneq(12, function(seed) {
    const r = seededRandom(seed);
    const score1 = r.nextInt(78, 88);
    const score2 = r.nextInt(80, 92);
    const targetAvg = 85;
    const required = targetAvg * 3 - score1 - score2;
    return {
      text: `Maryam scored $${score1}$ and $${score2}$ on her first two mathematics tests. What is the minimum score she must earn on her third test to achieve an average of at least $${targetAvg}$?`,
      options: makeOptions(
        { text: `$${required}$` },
        [
          { text: `$${required - 1}$`, why: `An average with this score would be below $${targetAvg}$.` },
          { text: `$${targetAvg}$`, why: 'This does not account for the scores already earned.' },
          { text: `$${required + 2}$`, why: 'We need the MINIMUM score to meet the threshold.' }
        ], r),
      hints: [
        `Average formula: $\\frac{${score1} + ${score2} + x}{3} \\geq ${targetAvg}$.`,
        `Multiply by 3: $${score1 + score2} + x \\geq ${targetAvg * 3}$.`,
        `Subtract $${score1 + score2}$: $x \\geq ${required}$.`
      ],
      explanation: `$\\frac{${score1} + ${score2} + x}{3} \\geq ${targetAvg} \\Rightarrow ${score1 + score2} + x \\geq ${targetAvg * 3} \\Rightarrow x \\geq ${required}$. Minimum score is $${required}$.`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 12: Solve and graph absolute value inequalities (<) (p.371, Lesson 6-4, ex.1–10)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[12] = { tile: 12, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[12].questions;
  function makeAbsIneq(idx, genFn) { Q.push({ id: `q12_${idx}`, generate: genFn }); }

  // 1: |x| < c
  makeAbsIneq(1, function(seed) {
    const r = seededRandom(seed);
    const c = r.nextInt(3, 12);
    return {
      text: `Solve: $$|x| < ${c}$$`,
      options: makeOptions(
        { text: `$-${c} < x < ${c}$` },
        [
          { text: `$x < ${c}$`, why: 'Absolute value inequalities with $<$ produce a compound "and" inequality bounded on both sides.' },
          { text: `$x < -${c}$ or $x > ${c}$`, why: 'This is the solution for $|x| > c$ (an "or" inequality), not $|x| < c$.' },
          { text: `$-${c} \\leq x \\leq ${c}$`, why: 'Strict inequality ($<$) does not include the endpoints.' }
        ], r),
      hints: [
        'Recall: $|x| < c$ means the distance from $0$ is less than $c$.',
        `This translates to the compound inequality $-c < x < c$.`,
        '<b>Worked example:</b> $|x| < 4 \\Rightarrow -4 < x < 4$.'
      ],
      explanation: `For any positive $c$, $|x| < c$ is equivalent to $-c < x < c$. Therefore, $-${c} < x < ${c}$.`
    };
  });

  // 2: |x - a| < c
  makeAbsIneq(2, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 8);
    const c = r.nextInt(2, 10);
    const left = -c + a;
    const right = c + a;
    return {
      text: `Solve the inequality: $$|x - ${a}| < ${c}$$`,
      options: makeOptions(
        { text: `$${left} < x < ${right}$` },
        [
          { text: `$-${c} < x < ${c}$`, why: `Forgot to add $${a}$ to all parts of the compound inequality.` },
          { text: `$x < ${left}$ or $x > ${right}$`, why: 'Absolute value inequalities with $<$ are "and" statements, not "or".' },
          { text: `$${-c - a} < x < ${c - a}$`, why: `Subtracted $${a}$ instead of adding it.` }
        ], r),
      hints: [
        `Write as a compound inequality: $-${c} < x - ${a} < ${c}$.`,
        `Add $${a}$ to all three parts: $-${c} + ${a} < x < ${c} + ${a}$.`,
        '<b>Worked example:</b> $|x - 3| < 5$ → $-5 < x - 3 < 5$ → Add 3: $-2 < x < 8$.'
      ],
      explanation: `$-${c} < x - ${a} < ${c} \\Rightarrow -${c} + ${a} < x < ${c} + ${a} \\Rightarrow ${left} < x < ${right}$.`
    };
  });

  // 3: |x + a| <= c
  makeAbsIneq(3, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 8);
    const c = r.nextInt(3, 10);
    const left = -c - a;
    const right = c - a;
    return {
      text: `Solve: $$|x + ${a}| \\leq ${c}$$`,
      options: makeOptions(
        { text: `$${left} \\leq x \\leq ${right}$` },
        [
          { text: `$${left} < x < ${right}$`, why: 'The original inequality is $\\leq$, so endpoints must be included.' },
          { text: `$x \\leq ${left}$ or $x \\geq ${right}$`, why: 'Disjunction ("or") applies to $>$, not $\\leq$.' },
          { text: `$-${c + a} \\leq x \\leq ${c + a}$`, why: 'Did not correctly apply inverse operations to each part.' }
        ], r),
      hints: [
        `Write: $-${c} \\leq x + ${a} \\leq ${c}$.`,
        `Subtract $${a}$ from all three parts.`,
        '<b>Worked example:</b> $|x + 2| \\leq 6$ → $-6 \\leq x + 2 \\leq 6$ → $-8 \\leq x \\leq 4$.'
      ],
      explanation: `$-${c} \\leq x + ${a} \\leq ${c} \\Rightarrow -${c} - ${a} \\leq x \\leq ${c} - ${a} \\Rightarrow ${left} \\leq x \\leq ${right}$.`
    };
  });

  // 4: |ax + b| < c
  makeAbsIneq(4, function(seed) {
    const r = seededRandom(seed);
    const a = 2;
    const b = r.pick([1, 3, 5]);
    const c = r.pick([7, 9, 11]);
    const left = (-c - b) / a;
    const right = (c - b) / a;
    return {
      text: `Solve: $$|${a}x + ${b}| < ${c}$$`,
      options: makeOptions(
        { text: `$${left} < x < ${right}$` },
        [
          { text: `$x < ${left}$ or $x > ${right}$`, why: 'An inequality with $<$ is an "and" statement.' },
          { text: `$-${c / a} < x < ${c / a}$`, why: 'Ignored the constant $' + b + '$ inside the absolute value.' },
          { text: `$${left} \\leq x \\leq ${right}$`, why: 'The inequality is strict ($<$, not $\\leq$).' }
        ], r),
      hints: [
        `Compound inequality: $-${c} < ${a}x + ${b} < ${c}$.`,
        `Subtract $${b}$: $-${c + b} < ${a}x < ${c - b}$.`,
        `Divide all parts by $${a}$.`,
        '<b>Worked example:</b> $|2x + 1| < 5$ → $-5 < 2x + 1 < 5$ → $-6 < 2x < 4$ → $-3 < x < 2$.'
      ],
      explanation: `$-${c} < ${a}x + ${b} < ${c} \\Rightarrow -${c + b} < ${a}x < ${c - b} \\Rightarrow ${left} < x < ${right}$.`
    };
  });

  // 5: |x| < negative number -> No solution!
  makeAbsIneq(5, function(seed) {
    const r = seededRandom(seed);
    const neg = -r.nextInt(1, 8);
    const a = r.nextIntNonZero(-6, 6);
    return {
      text: `Solve the inequality: $$|x ${signStr(a)}| < ${neg}$$`,
      options: makeOptions(
        { text: 'No solution (empty set $\\varnothing$)' },
        [
          { text: `$${neg - a} < x < ${-neg - a}$`, why: 'Absolute value is always $\\geq 0$; it can never be less than a negative number.' },
          { text: 'All real numbers', why: 'No number has an absolute value less than zero.' },
          { text: `$x < ${neg}$`, why: 'Absolute value is never negative.' }
        ], r),
      hints: [
        'What is the smallest possible value of an absolute value expression?',
        'Since $|\\text{anything}| \\geq 0$, can it ever be less than a negative number?',
        '<b>Worked example:</b> $|x + 3| < -2$. Distance cannot be less than a negative number → No solution.'
      ],
      explanation: `Absolute value is always non-negative: $|x ${signStr(a)}| \\geq 0$. Since $0 \\not< ${neg}$, there is <b>no solution</b> ($\u2205$).`
    };
  });

  // 6: |x + a| <= 0 -> Single point solution!
  makeAbsIneq(6, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextIntNonZero(-8, 8);
    return {
      text: `Solve the inequality: $$|x ${signStr(a)}| \\leq 0$$`,
      options: makeOptions(
        { text: `$x = ${-a}$` },
        [
          { text: 'No solution', why: 'While absolute value cannot be strictly negative, it CAN equal 0 when the inside is 0.' },
          { text: 'All real numbers', why: 'Only one specific value of $x$ makes the absolute value $\\leq 0$.' },
          { text: `$x \\leq ${-a}$`, why: 'The solution is a single point, not a half-line.' }
        ], r),
      hints: [
        'Can an absolute value be strictly less than 0? No.',
        `Can it equal 0? Yes, when $x ${signStr(a)} = 0$.`,
        '<b>Worked example:</b> $|x - 5| \\leq 0$ → Only possible when $x - 5 = 0 \\Rightarrow x = 5$.'
      ],
      explanation: `Since $|x| \\geq 0$, $|x ${signStr(a)}| \\leq 0$ is only possible when $x ${signStr(a)} = 0 \\Rightarrow x = ${-a}$.`
    };
  });

  // 7: Graph representation of |x| <= c
  makeAbsIneq(7, function(seed) {
    const r = seededRandom(seed);
    const c = r.nextInt(2, 9);
    return {
      text: `Which statement describes the graph of $|x| \\leq ${c}$ on a number line?`,
      options: makeOptions(
        { text: `Closed circles at $-${c}$ and $${c}$, with shading between them` },
        [
          { text: `Open circles at $-${c}$ and $${c}$, with shading between them`, why: 'The inequality includes $\\leq$, so closed circles are required.' },
          { text: `Closed circles at $-${c}$ and $${c}$, with arrows pointing outward`, why: 'Outward arrows represent an "or" inequality ($|x| \\geq c$).' },
          { text: `A closed circle at $${c}$ with an arrow pointing left`, why: 'Absolute value is bounded on both sides.' }
        ], r),
      hints: [
        `$|x| \\leq ${c}$ means $-${c} \\leq x \\leq ${c}$.`,
        'The endpoints $-' + c + '$ and $' + c + '$ are included (closed circles).',
        'Values are BETWEEN the two numbers.'
      ],
      explanation: `$-${c} \\leq x \\leq ${c}$ represents all numbers between $-${c}$ and $${c}$, inclusive. Graph has closed circles at both endpoints and shading between.`
    };
  });

  // 8: |x - a| < c graph representation
  makeAbsIneq(8, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(1, 5);
    const c = r.nextInt(2, 6);
    const left = a - c, right = a + c;
    return {
      text: `The graph of $|x - ${a}| < ${c}$ has:`,
      options: makeOptions(
        { text: `Open circles at $${left}$ and $${right}$, shaded between` },
        [
          { text: `Closed circles at $${left}$ and $${right}$, shaded between`, why: 'Strict inequality ($<$) requires OPEN circles.' },
          { text: `Open circles at $${left}$ and $${right}$, arrows pointing outward`, why: 'Outward shading represents $>$ or $\\geq$.' },
          { text: `Open circles at $-${c}$ and $${c}$, shaded between`, why: 'Did not shift by $' + a + '$.' }
        ], r),
      hints: [
        `Solve: $-${c} < x - ${a} < ${c} \\Rightarrow ${left} < x < ${right}$.`,
        'Strict inequality uses open circles and shading between.',
        '<b>Worked example:</b> $|x - 1| < 3$ → $-2 < x < 4$ → Open circles at $-2$ and $4$, shaded between.'
      ],
      explanation: `$-${c} < x - ${a} < ${c} \\Rightarrow ${left} < x < ${right}$. This is graphed with open circles at $${left}$ and $${right}$ and shading between.`
    };
  });

  // 9: Real-world tolerance problem (temperature in °C)
  makeAbsIneq(9, function(seed) {
    const r = seededRandom(seed);
    const ideal = r.pick([20, 22, 24]);
    const tol = r.pick([2, 3, 4]);
    const minT = ideal - tol, maxT = ideal + tol;
    return {
      text: `A science laboratory in Dubai maintains a temperature of $${ideal}^\\circ\\text{C}$ with a tolerance of at most $${tol}^\\circ\\text{C}$. Which inequality represents the acceptable temperature range $T$, and what are its bounds?`,
      options: makeOptions(
        { text: `$|T - ${ideal}| \\leq ${tol} \\Rightarrow ${minT}^\\circ\\text{C} \\leq T \\leq ${maxT}^\\circ\\text{C}$` },
        [
          { text: `$|T - ${tol}| \\leq ${ideal} \\Rightarrow ${ideal - tol}^\\circ\\text{C} \\leq T \\leq ${ideal + tol}^\\circ\\text{C}$`, why: 'Swapped ideal temperature and tolerance.' },
          { text: `$|T - ${ideal}| \\geq ${tol} \\Rightarrow T \\leq ${minT}^\\circ\\text{C}$ or $T \\geq ${maxT}^\\circ\\text{C}$`, why: 'Tolerance requires the difference to be within ($\\leq$) the bound.' },
          { text: `$|T + ${ideal}| \\leq ${tol}$`, why: 'Tolerance is the difference $|T - \\text{target}|$, not sum.' }
        ], r),
      hints: [
        'Tolerance formula: $|\\text{actual} - \\text{ideal}| \\leq \\text{tolerance}$.',
        `$|T - ${ideal}| \\leq ${tol} \\Rightarrow -${tol} \\leq T - ${ideal} \\leq ${tol}$.`,
        `Add $${ideal}$ to all parts.`
      ],
      explanation: `$|T - ${ideal}| \\leq ${tol} \\Rightarrow -${tol} \\leq T - ${ideal} \\leq ${tol} \\Rightarrow ${minT}^\\circ\\text{C} \\leq T \\leq ${maxT}^\\circ\\text{C}$.`
    };
  });

  // 10: |3x - 6| < 9
  makeAbsIneq(10, function(seed) {
    const r = seededRandom(seed);
    const a = 3;
    const b = 6;
    const c = r.pick([9, 12, 15]);
    const left = (-c + b) / a;
    const right = (c + b) / a;
    return {
      text: `Solve: $$|3x - 6| < ${c}$$`,
      options: makeOptions(
        { text: `$${left} < x < ${right}$` },
        [
          { text: `$x < ${left}$ or $x > ${right}$`, why: 'Inequality with $<$ means "and", not "or".' },
          { text: `$-${c / 3} < x < ${c / 3}$`, why: 'Forgot to add 6 before dividing by 3.' },
          { text: `$${left} \\leq x \\leq ${right}$`, why: 'The original inequality is strict ($<$, not $\\leq$).' }
        ], r),
      hints: [
        `Rewrite: $-${c} < 3x - 6 < ${c}$.`,
        `Add 6 to all three parts: $${-c + 6} < 3x < ${c + 6}$.`,
        `Divide by 3.`,
        '<b>Worked example:</b> $|3x - 3| < 6$ → $-6 < 3x - 3 < 6$ → $-3 < 3x < 9$ → $-1 < x < 3$.'
      ],
      explanation: `$-${c} < 3x - 6 < ${c} \\Rightarrow ${-c + 6} < 3x < ${c + 6} \\Rightarrow ${left} < x < ${right}$.`
    };
  });

  // 11: Real-world manufacturing mass tolerance (metric grams context)
  makeAbsIneq(11, function(seed) {
    const r = seededRandom(seed);
    const idealG = r.pick([250, 500, 750]);
    const tolG = r.pick([5, 10, 15]);
    return {
      text: `A food packaging plant in Ras Al Khaimah produces cereal boxes with a target mass of $${idealG}\\text{ g}$. A box is accepted if its mass $m$ differs from the target by no more than $${tolG}\\text{ g}$. Which inequality describes the acceptable mass?`,
      options: makeOptions(
        { text: `$|m - ${idealG}| \\leq ${tolG}$` },
        [
          { text: `$|m - ${idealG}| < ${tolG}$`, why: '"No more than" includes equality ($\\leq$).' },
          { text: `$|m + ${idealG}| \\leq ${tolG}$`, why: 'The difference from target is $m - ' + idealG + '$.' },
          { text: `$|m - ${tolG}| \\leq ${idealG}$`, why: 'Swapped target and tolerance.' }
        ], r),
      hints: [
        'Difference between actual and target is $|m - \\text{target}|$.',
        '"No more than" means $\\leq$.',
        '<b>Worked example:</b> Target 100 g, tolerance 2 g: $|m - 100| \\leq 2$.'
      ],
      explanation: `The deviation is $|m - ${idealG}|$, and it must be at most $${tolG}\\text{ g}$: $|m - ${idealG}| \\leq ${tolG}$.`
    };
  });

  // 12: |x/2 + 1| < 3
  makeAbsIneq(12, function(seed) {
    const r = seededRandom(seed);
    const c = r.pick([2, 3, 4]);
    // -c < x/2 + 1 < c => -c - 1 < x/2 < c - 1 => 2(-c - 1) < x < 2(c - 1)
    const left = 2 * (-c - 1);
    const right = 2 * (c - 1);
    return {
      text: `Solve the inequality: $$\\left|\\frac{x}{2} + 1\\right| < ${c}$$`,
      options: makeOptions(
        { text: `$${left} < x < ${right}$` },
        [
          { text: `$-${2 * c} < x < ${2 * c}$`, why: 'Forgot to subtract 1 before multiplying by 2.' },
          { text: `$x < ${left}$ or $x > ${right}$`, why: 'The inequality $<$ yields a bounded interval, not a disjunction.' },
          { text: `$${left} \\leq x \\leq ${right}$`, why: 'Strict inequality must remain strict.' }
        ], r),
      hints: [
        `Write as a compound inequality: $-${c} < \\frac{x}{2} + 1 < ${c}$.`,
        `Subtract 1 from all parts: $-${c + 1} < \\frac{x}{2} < ${c - 1}$.`,
        `Multiply all parts by 2.`,
        '<b>Worked example:</b> $|\\frac{x}{2} + 1| < 2$ → $-2 < \\frac{x}{2} + 1 < 2$ → $-3 < \\frac{x}{2} < 1$ → $-6 < x < 2$.'
      ],
      explanation: `$-${c} < \\frac{x}{2} + 1 < ${c} \\Rightarrow -${c + 1} < \\frac{x}{2} < ${c - 1} \\Rightarrow ${left} < x < ${right}$.`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 13: Apply dilations to linear functions (p.248, Lesson 4-4, ex.10–15)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[13] = { tile: 13, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[13].questions;
  function makeDilQ(idx, genFn) { Q.push({ id: `q13_${idx}`, generate: genFn }); }

  // 1: Vertical stretch a > 1
  makeDilQ(1, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 6);
    return {
      text: `How does the graph of $g(x) = ${a}x$ compare to the parent function $f(x) = x$?`,
      options: makeOptions(
        { text: `A vertical stretch by a factor of $${a}$ (the line is steeper)` },
        [
          { text: `A vertical compression by a factor of $\\frac{1}{${a}}$ (the line is less steep)`, why: 'Factors greater than 1 produce a stretch, not a compression.' },
          { text: `A translation $${a}$ units upward`, why: 'Multiplying by a constant stretches/dilates the graph; addition translates it.' },
          { text: `A reflection across the $x$-axis`, why: 'A reflection requires a negative factor.' }
        ], r),
      hints: [
        `In $g(x) = a \\cdot f(x)$, if $|a| > 1$, the transformation is a vertical stretch.`,
        'A vertical stretch pulls the graph away from the $x$-axis, making the line steeper.',
        '<b>Worked example:</b> $g(x) = 3x$ is a vertical stretch of $f(x) = x$ by a factor of 3.'
      ],
      explanation: `Since $|a| = ${a} > 1$, the graph undergoes a vertical stretch by a factor of $${a}$, making the slope steeper.`
    };
  });

  // 2: Vertical compression 0 < a < 1
  makeDilQ(2, function(seed) {
    const r = seededRandom(seed);
    const d = r.pick([2, 3, 4, 5]);
    return {
      text: `Which statement describes the transformation from $f(x) = x$ to $g(x) = \\frac{1}{${d}}x$?`,
      options: makeOptions(
        { text: `A vertical compression (shrink) by a factor of $\\frac{1}{${d}}$ (the line is less steep)` },
        [
          { text: `A vertical stretch by a factor of $${d}$`, why: 'When $0 < a < 1$, the transformation compresses the graph toward the $x$-axis.' },
          { text: `A translation $\\frac{1}{${d}}$ units down`, why: 'This is a dilation (multiplication), not a translation.' },
          { text: `A horizontal translation $${d}$ units left`, why: 'No term is added inside the argument.' }
        ], r),
      hints: [
        'When $0 < |a| < 1$, the graph is vertically compressed.',
        'Compression pushes the line closer to the $x$-axis (less steep / flatter).',
        '<b>Worked example:</b> $g(x) = \\frac{1}{2}x$ is compressed by a factor of $\\frac{1}{2}$.'
      ],
      explanation: `Because $0 < \\frac{1}{${d}} < 1$, $g(x)$ is a vertical compression by a factor of $\\frac{1}{${d}}$, resulting in a less steep line.`
    };
  });

  // 3: Dilation and reflection: -ax with a > 1
  makeDilQ(3, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 5);
    return {
      text: `Describe the transformations from $f(x) = x$ to $g(x) = -${a}x$:`,
      options: makeOptions(
        { text: `A reflection across the $x$-axis and a vertical stretch by a factor of $${a}$` },
        [
          { text: `A reflection across the $y$-axis only`, why: 'The negative sign reflects the graph, and the factor of ' + a + ' stretches it.' },
          { text: `A vertical compression by a factor of $\\frac{1}{${a}}$`, why: 'The magnitude $|-' + a + '| = ' + a + ' > 1$, which is a stretch.' },
          { text: `A translation $${a}$ units down`, why: 'Multiplication by a negative is a reflection and dilation, not a translation.' }
        ], r),
      hints: [
        'Break into two parts: the negative sign and the magnitude $a$.',
        'Negative sign: reflection across the $x$-axis.',
        `Magnitude $${a}$: vertical stretch by a factor of $${a}$.`
      ],
      explanation: `The negative sign reflects $f(x)$ across the $x$-axis, and the factor of $${a}$ ($|-' + a + '| = ' + a + ' > 1$) vertically stretches the line.`
    };
  });

  // 4: Dilation and reflection: -x/d
  makeDilQ(4, function(seed) {
    const r = seededRandom(seed);
    const d = r.pick([2, 3, 4]);
    return {
      text: `Which transformations produce $g(x) = -\\frac{1}{${d}}x$ from the parent function $f(x) = x$?`,
      options: makeOptions(
        { text: `Reflected across the $x$-axis and vertically compressed by a factor of $\\frac{1}{${d}}$` },
        [
          { text: `Reflected across the $x$-axis and vertically stretched by a factor of $${d}$`, why: '$\\frac{1}{' + d + '} < 1$, so it is a compression, not a stretch.' },
          { text: `Translated $\\frac{1}{${d}}$ units left and down`, why: 'This is a dilation and reflection, not a translation.' },
          { text: `Vertically compressed by a factor of $\\frac{1}{${d}}$ with no reflection`, why: 'The negative sign reflects the line.' }
        ], r),
      hints: [
        'Notice the negative sign: indicates reflection.',
        `The scale factor is $\\frac{1}{${d}} < 1$: indicates compression.`,
        '<b>Worked example:</b> $-\\frac{1}{3}x$ is reflected across the $x$-axis and compressed by $\\frac{1}{3}$.'
      ],
      explanation: `Negative sign reflects across the $x$-axis; factor $\\frac{1}{${d}}$ vertically compresses the graph.`
    };
  });

  // 5: Dilation combined with vertical translation: g(x) = ax + b
  makeDilQ(5, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 5);
    const b = r.nextIntNonZero(-6, 6);
    const dir = b > 0 ? 'up' : 'down';
    return {
      text: `Describe the transformations from $f(x) = x$ to $g(x) = ${a}x ${signStr(b)}$:`,
      options: makeOptions(
        { text: `A vertical stretch by a factor of $${a}$ and a translation $${Math.abs(b)}$ units ${dir}` },
        [
          { text: `A vertical compression by a factor of $${a}$ and a translation $${Math.abs(b)}$ units ${dir}`, why: 'Factor $' + a + ' > 1$ represents a stretch, not compression.' },
          { text: `A vertical stretch by a factor of $${a}$ and a translation $${Math.abs(b)}$ units ${b > 0 ? 'down' : 'up'}`, why: 'Sign error on the vertical translation.' },
          { text: `A horizontal translation $${Math.abs(b)}$ units left`, why: 'The constant is added outside, so it is a vertical translation.' }
        ], r),
      hints: [
        `Coefficient $${a}$: vertical stretch by $${a}$.`,
        `Constant $${signStr(b)}$: vertical translation $${Math.abs(b)}$ units ${dir}.`,
        '<b>Worked example:</b> $g(x) = 2x + 3$ is vertically stretched by 2 and shifted 3 up.'
      ],
      explanation: `The slope $m = ${a}$ indicates a vertical stretch by $${a}$. The constant $${signStr(b)}$ translates the line $${Math.abs(b)}$ units ${dir}.`
    };
  });

  // 6: Identify function from description
  makeDilQ(6, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(3, 7);
    const k = r.nextInt(1, 5);
    return {
      text: `Which equation represents $f(x) = x$ after a vertical stretch by a factor of $${a}$ followed by a vertical translation of $${k}$ units down?`,
      options: makeOptions(
        { text: `$g(x) = ${a}x - ${k}$` },
        [
          { text: `$g(x) = \\frac{1}{${a}}x - ${k}$`, why: 'A stretch by $' + a + '$ multiplies by $' + a + '$, not $1/' + a + '$.' },
          { text: `$g(x) = ${a}x + ${k}$`, why: 'Translation DOWN requires subtracting $' + k + '$.' },
          { text: `$g(x) = ${a}(x - ${k})$`, why: 'Down translation adds/subtracts a constant to the entire function, not inside.' }
        ], r),
      hints: [
        `Stretch by $${a}$: multiply $x$ by $${a} \\rightarrow ${a}x$.`,
        `Down $${k}$: subtract $${k} \\rightarrow ${a}x - ${k}$.`,
        '<b>Worked example:</b> Stretch by 4, down 2: $g(x) = 4x - 2$.'
      ],
      explanation: `Multiplying by $${a}$ stretches vertically: $${a}x$. Subtracting $${k}$ shifts down: $g(x) = ${a}x - ${k}$.`
    };
  });

  // 7: Comparing steepness of two functions
  makeDilQ(7, function(seed) {
    const r = seededRandom(seed);
    const m1 = r.pick([2, 3]);
    const m2 = r.pick([4, 5, 6]);
    return {
      text: `Compare the graphs of $f(x) = ${m1}x$ and $g(x) = ${m2}x$. Which statement is true?`,
      options: makeOptions(
        { text: `The graph of $g(x)$ is steeper than the graph of $f(x)$ because $|${m2}| > |${m1}|$` },
        [
          { text: `The graph of $f(x)$ is steeper than the graph of $g(x)$`, why: 'A larger absolute slope indicates a steeper line.' },
          { text: `The lines are parallel`, why: 'The slopes are different, so the lines are not parallel.' },
          { text: `The graph of $g(x)$ is shifted $${m2 - m1}$ units upward from $f(x)$`, why: 'The difference in slopes changes steepness, not position.' }
        ], r),
      hints: [
        'Steepness is determined by the absolute value of the slope: $|m|$.',
        `$|${m2}| = ${m2}$ is greater than $|${m1}| = ${m1}$.`,
        '<b>Worked example:</b> $y = 5x$ is steeper than $y = 2x$.'
      ],
      explanation: `Since $|${m2}| > |${m1}|$, $g(x) = ${m2}x$ rises faster than $f(x) = ${m1}x$, so $g(x)$ is steeper.`
    };
  });

  // 8: Horizontal vs vertical dilation equivalence for lines
  makeDilQ(8, function(seed) {
    const r = seededRandom(seed);
    const a = r.pick([2, 3, 4]);
    return {
      text: `For the linear parent function $f(x) = x$, a horizontal compression by a factor of $\\frac{1}{${a}}$ produces $f(${a}x) = ${a}x$. This is algebraically equivalent to which vertical transformation?`,
      options: makeOptions(
        { text: `A vertical stretch by a factor of $${a}$` },
        [
          { text: `A vertical compression by a factor of $\\frac{1}{${a}}$`, why: '$f(' + a + 'x) = ' + a + 'x = ' + a + ' f(x)$, which is a vertical stretch.' },
          { text: `A horizontal shift $${a}$ units right`, why: 'Multiplying the input is a dilation, not a shift.' },
          { text: `A reflection across the $y$-axis`, why: 'There is no negative sign.' }
        ], r),
      hints: [
        `$f(x) = x \\Rightarrow f(${a}x) = ${a}x = ${a} \\cdot f(x)$.`,
        `Multiplying $f(x)$ by $${a} > 1$ represents a vertical stretch by $${a}$.`,
        'For linear functions through the origin, horizontal compression is equivalent to vertical stretch.'
      ],
      explanation: `For $f(x) = x$, $f(${a}x) = ${a}x = ${a}f(x)$. Thus a horizontal compression by $1/${a}$ is equivalent to a vertical stretch by $${a}$.`
    };
  });

  // 9: Identify dilation factor from coordinates
  makeDilQ(9, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 6);
    const x = r.nextInt(2, 4);
    const y = a * x;
    return {
      text: `The graph of $g(x) = ax$ passes through the point $(${x}, ${y})$. What is the dilation factor $a$?`,
      options: makeOptions(
        { text: `$a = ${a}$` },
        [
          { text: `$a = \\frac{1}{${a}}$`, why: 'Divided $x$ by $y$ instead of $y$ by $x$.' },
          { text: `$a = ${y - x}$`, why: 'Subtracted coordinates instead of finding the ratio $y/x$.' },
          { text: `$a = ${a + 1}$`, why: 'Arithmetic error in division.' }
        ], r),
      hints: [
        `Substitute $x = ${x}$ and $y = ${y}$ into $y = ax$.`,
        `$${y} = a(${x}) \\Rightarrow a = \\frac{${y}}{${x}}$.`,
        '<b>Worked example:</b> Passes through $(2, 8)$ → $a = \\frac{8}{2} = 4$.'
      ],
      explanation: `$a = \\frac{y}{x} = \\frac{${y}}{${x}} = ${a}$.`
    };
  });

  // 10: Dilation effect on rate of change in context
  makeDilQ(10, function(seed) {
    const r = seededRandom(seed);
    const origRate = r.pick([10, 15, 20]);
    const factor = r.pick([2, 3]);
    const newRate = origRate * factor;
    return {
      text: `A water pump fills a tank at a rate of $f(t) = ${origRate}t$ liters per minute. An upgraded pump undergoes a dilation such that $g(t) = ${factor} \\cdot f(t)$. What is the new filling rate?`,
      options: makeOptions(
        { text: `$${newRate}\\text{ L/min}$` },
        [
          { text: `$${origRate + factor}\\text{ L/min}$`, why: 'Added the factor instead of multiplying.' },
          { text: `$${Math.round(origRate / factor)}\\text{ L/min}$`, why: 'Divided instead of multiplying.' },
          { text: `$${origRate}\\text{ L/min}$`, why: 'The dilation changes the rate of change.' }
        ], r),
      hints: [
        `$g(t) = ${factor} \\cdot (${origRate}t) = (${factor} \\times ${origRate})t$.`,
        `Calculate $${factor} \\times ${origRate}$.`,
        '<b>Worked example:</b> $f(t) = 5t$, $g(t) = 2f(t) = 10t$ → rate is 10 L/min.'
      ],
      explanation: `$g(t) = ${factor}(${origRate}t) = ${newRate}t$. The new rate of change is $${newRate}\\text{ L/min}$.`
    };
  });

  // 11: Fractional dilation between 0 and 1 with negative
  makeDilQ(11, function(seed) {
    const r = seededRandom(seed);
    const d = r.pick([3, 5]);
    return {
      text: `The graph of $g(x) = -\\frac{2}{${d}}x$ is obtained from $f(x) = x$ by:`,
      options: makeOptions(
        { text: `Reflection across the $x$-axis and vertical compression by a factor of $\\frac{2}{${d}}$` },
        [
          { text: `Reflection across the $x$-axis and vertical stretch by a factor of $\\frac{${d}}{2}$`, why: 'The factor is $\\frac{2}{' + d + '} < 1$, so it is a compression.' },
          { text: `Vertical stretch by $\\frac{2}{${d}}$ without reflection`, why: 'The negative sign reflects the line.' },
          { text: `Translation $\\frac{2}{${d}}$ units down`, why: 'Multiplication causes dilation, not translation.' }
        ], r),
      hints: [
        'Examine the magnitude $|-\\frac{2}{' + d + '}| = \\frac{2}{' + d + '}$.',
        `Since $\\frac{2}{${d}} < 1$, the transformation is a vertical compression.`,
        'The negative sign reflects across the $x$-axis.'
      ],
      explanation: `Negative sign reflects across the $x$-axis; factor $\\frac{2}{${d}} < 1$ compresses the line vertically.`
    };
  });

  // 12: Identify dilation from table
  makeDilQ(12, function(seed) {
    const r = seededRandom(seed);
    const a = r.pick([2, 4, 5]);
    return {
      text: `The table shows values of $g(x)$ after a dilation of $f(x) = x$:<br>
<div style="margin:8px 0;text-align:center;">$x = 1 \\rightarrow g(x) = ${a}$<br>$x = 2 \\rightarrow g(x) = ${2 * a}$<br>$x = 3 \\rightarrow g(x) = ${3 * a}$</div>
What is the equation for $g(x)$?`,
      options: makeOptions(
        { text: `$g(x) = ${a}x$` },
        [
          { text: `$g(x) = x + ${a - 1}$`, why: 'Check $x = 2$: $2 + ' + (a - 1) + ' = ' + (a + 1) + ' \\neq ' + (2 * a) + '$. This is not a linear translation.' },
          { text: `$g(x) = \\frac{1}{${a}}x$`, why: 'Inverted the slope.' },
          { text: `$g(x) = ${a + 1}x$`, why: 'Rate of change is $' + a + '$, not $' + (a + 1) + '$.' }
        ], r),
      hints: [
        'Notice that $g(x) / x = ' + a + '$ for every pair.',
        `The slope and dilation factor is $a = ${a}$.`,
        '<b>Worked example:</b> $(1, 3), (2, 6) \\Rightarrow g(x) = 3x$.'
      ],
      explanation: `For every input, $g(x) = ${a}x$. The dilation factor is $${a}$.`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 14: Point-slope form given two points (pp.297, 303, Lesson 5-2, Ex.2, ex.4–7)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[14] = { tile: 14, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[14].questions;
  function makePSQ(idx, genFn) { Q.push({ id: `q14_${idx}`, generate: genFn }); }

  // 1: Positive slope, integer
  makePSQ(1, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 4);
    const x1 = r.nextInt(1, 4), y1 = r.nextInt(1, 5);
    const dx = r.nextInt(1, 3);
    const x2 = x1 + dx, y2 = y1 + m * dx;
    return {
      text: `Write an equation in point-slope form ($y - y_1 = m(x - x_1)$) for the line passing through $(${x1}, ${y1})$ and $(${x2}, ${y2})$ using the point $(${x1}, ${y1})$.`,
      options: makeOptions(
        { text: `$y - ${y1} = ${m}(x - ${x1})$` },
        [
          { text: `$y + ${y1} = ${m}(x + ${x1})$`, why: 'Point-slope form uses subtraction: $y - y_1 = m(x - x_1)$.' },
          { text: `$y - ${x1} = ${m}(x - ${y1})$`, why: 'Swapped $x_1$ and $y_1$ coordinates.' },
          { text: `$y - ${y1} = -${m}(x - ${x1})$`, why: 'Sign error on the slope; $m = ' + m + '$, not $-' + m + '$.' }
        ], r),
      hints: [
        `First find the slope: $m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = \\frac{${y2 - y1}}{${dx}} = ${m}$.`,
        `Substitute $m = ${m}$ and point $(${x1}, ${y1})$ into $y - y_1 = m(x - x_1)$.`,
        '<b>Worked example:</b> $(1, 2)$ and $(3, 8)$ → $m = 3$ → $y - 2 = 3(x - 1)$.'
      ],
      explanation: `$m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = ${m}$. Using $(${x1}, ${y1})$: $y - ${y1} = ${m}(x - ${x1})$.`
    };
  });

  // 2: Negative slope, integer
  makePSQ(2, function(seed) {
    const r = seededRandom(seed);
    const m = -r.nextInt(2, 4);
    const x1 = r.nextInt(1, 3), y1 = r.nextInt(4, 9);
    const dx = r.nextInt(1, 3);
    const x2 = x1 + dx, y2 = y1 + m * dx;
    return {
      text: `Find an equation in point-slope form for the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$ using the first point:`,
      options: makeOptions(
        { text: `$y - ${y1} = ${m}(x - ${x1})$` },
        [
          { text: `$y - ${y1} = ${Math.abs(m)}(x - ${x1})$`, why: 'Forgot the negative sign on the slope.' },
          { text: `$y - ${y2} = ${m}(x - ${x1})$`, why: 'Mixed coordinates from two different points.' },
          { text: `$y + ${y1} = ${m}(x + ${x1})$`, why: 'Sign error in point-slope formula.' }
        ], r),
      hints: [
        `$m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = \\frac{${y2 - y1}}{${dx}} = ${m}$.`,
        `Use $(${x1}, ${y1})$: $y - ${y1} = ${m}(x - ${x1})$.`,
        '<b>Worked example:</b> $(1, 6)$ and $(3, 2)$ → $m = -2$ → $y - 6 = -2(x - 1)$.'
      ],
      explanation: `$m = \\frac{${y2 - y1}}{${dx}} = ${m}$. Point-slope equation: $y - ${y1} = ${m}(x - ${x1})$.`
    };
  });

  // 3: Using second point
  makePSQ(3, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 4);
    const x1 = r.nextInt(1, 3), y1 = r.nextInt(1, 4);
    const dx = 2;
    const x2 = x1 + dx, y2 = y1 + m * dx;
    return {
      text: `Which point-slope equation represents the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$ written using the second point $(${x2}, ${y2})$?`,
      options: makeOptions(
        { text: `$y - ${y2} = ${m}(x - ${x2})$` },
        [
          { text: `$y - ${y1} = ${m}(x - ${x1})$`, why: 'This uses the first point, but the question specifically requested the second point.' },
          { text: `$y - ${x2} = ${m}(x - ${y2})$`, why: 'Swapped $x_2$ and $y_2$.' },
          { text: `$y + ${y2} = ${m}(x + ${x2})$`, why: 'Used addition instead of subtraction in the formula.' }
        ], r),
      hints: [
        `Find slope: $m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = ${m}$.`,
        `Substitute point $(${x2}, ${y2})$: $y - ${y2} = ${m}(x - ${x2})$.`,
        '<b>Worked example:</b> Through $(1, 3)$ and $(4, 9)$ with point $(4, 9)$ → $y - 9 = 2(x - 4)$.'
      ],
      explanation: `$m = ${m}$. Using the second point $(${x2}, ${y2})$, the point-slope equation is $y - ${y2} = ${m}(x - ${x2})$.`
    };
  });

  // 4: Negative coordinates: (x - (-c)) -> (x + c)
  makePSQ(4, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 4);
    const x1 = -r.nextInt(2, 5), y1 = r.nextInt(1, 4);
    const dx = r.nextInt(1, 3);
    const x2 = x1 + dx, y2 = y1 + m * dx;
    return {
      text: `Write the point-slope equation for the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$ using $(${x1}, ${y1})$:`,
      options: makeOptions(
        { text: `$y - ${y1} = ${m}(x + ${Math.abs(x1)})$` },
        [
          { text: `$y - ${y1} = ${m}(x - ${Math.abs(x1)})$`, why: 'Subtracting a negative coordinate becomes addition: $x - (-' + Math.abs(x1) + ') = x + ' + Math.abs(x1) + '$.' },
          { text: `$y + ${y1} = ${m}(x + ${Math.abs(x1)})$`, why: 'The $y$-coordinate is positive, so it should be $y - ' + y1 + '$.' },
          { text: `$y - ${y1} = -${m}(x + ${Math.abs(x1)})$`, why: 'Slope is positive.' }
        ], r),
      hints: [
        `Slope: $m = \\frac{${y2} - ${y1}}{${x2} - (${x1})} = ${m}$.`,
        `$y - y_1 = m(x - x_1) \\Rightarrow y - ${y1} = ${m}(x - (${x1})) = ${m}(x + ${Math.abs(x1)})$.`,
        '<b>Worked example:</b> Point $(-3, 4)$, $m = 2$ → $y - 4 = 2(x + 3)$.'
      ],
      explanation: `$x - (${x1}) = x + ${Math.abs(x1)}$. Thus $y - ${y1} = ${m}(x + ${Math.abs(x1)})$.`
    };
  });

  // 5: Fraction slope
  makePSQ(5, function(seed) {
    const r = seededRandom(seed);
    const den = r.pick([2, 3]);
    const num = 1;
    const x1 = r.nextInt(1, 4), y1 = r.nextInt(1, 4);
    const x2 = x1 + den, y2 = y1 + num;
    return {
      text: `Write the point-slope form of the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$ using $(${x1}, ${y1})$:`,
      options: makeOptions(
        { text: `$y - ${y1} = \\frac{1}{${den}}(x - ${x1})$` },
        [
          { text: `$y - ${y1} = ${den}(x - ${x1})$`, why: 'Inverted the slope: $m = 1/' + den + '$, not $' + den + '$.' },
          { text: `$y - ${y1} = -\\frac{1}{${den}}(x - ${x1})$`, why: 'Both differences are positive, so slope is positive.' },
          { text: `$y - ${x1} = \\frac{1}{${den}}(x - ${y1})$`, why: 'Swapped $x$ and $y$ coordinates.' }
        ], r),
      hints: [
        `$m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = \\frac{1}{${den}}$.`,
        `Substitute into $y - y_1 = m(x - x_1)$.`,
        '<b>Worked example:</b> $(2, 3)$ and $(4, 4)$ → $m = \\frac{1}{2}$ → $y - 3 = \\frac{1}{2}(x - 2)$.'
      ],
      explanation: `$m = \\frac{${y2 - y1}}{${den}} = \\frac{1}{${den}}$. Equation: $y - ${y1} = \\frac{1}{${den}}(x - ${x1})$.`
    };
  });

  // 6: Convert point-slope to slope-intercept
  makePSQ(6, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 4);
    const x1 = r.nextInt(1, 4), y1 = r.nextInt(2, 6);
    const dx = 2;
    const x2 = x1 + dx, y2 = y1 + m * dx;
    const b = y1 - m * x1;
    return {
      text: `Find the slope-intercept form ($y = mx + b$) of the line passing through $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`,
      options: makeOptions(
        { text: `$y = ${m}x ${signStr(b)}$` },
        [
          { text: `$y = ${m}x ${signStr(-m * x1)}$`, why: 'Forgot to add $' + y1 + '$ to the right side.' },
          { text: `$y = -${m}x ${signStr(b)}$`, why: 'Sign error on the slope.' },
          { text: `$y = ${m}x ${signStr(y1)}$`, why: 'Used $y_1$ as the $y$-intercept without computing $b = y_1 - m x_1$.' }
        ], r),
      hints: [
        `First write point-slope: $y - ${y1} = ${m}(x - ${x1})$.`,
        `Distribute: $y - ${y1} = ${m}x - ${m * x1}$.`,
        `Add $${y1}$ to both sides: $y = ${m}x - ${m * x1} + ${y1} = ${m}x ${signStr(b)}$.`
      ],
      explanation: `$m = ${m}$. $y - ${y1} = ${m}(x - ${x1}) \\Rightarrow y = ${m}x - ${m * x1} + ${y1} = ${m}x ${signStr(b)}$.`
    };
  });

  // 7: Line through origin and another point
  makePSQ(7, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 5);
    const x2 = r.nextInt(1, 3);
    const y2 = m * x2;
    return {
      text: `Write the point-slope equation using $(0, 0)$ for the line through $(0, 0)$ and $(${x2}, ${y2})$:`,
      options: makeOptions(
        { text: `$y - 0 = ${m}(x - 0)$ (or $y = ${m}x$)` },
        [
          { text: `$y - 0 = \\frac{1}{${m}}(x - 0)$`, why: 'Inverted the slope.' },
          { text: `$y - ${y2} = ${m}(x - 0)$`, why: 'Mixed coordinates from both points.' },
          { text: `$y - 0 = -${m}(x - 0)$`, why: 'Slope is positive.' }
        ], r),
      hints: [
        `Slope: $m = \\frac{${y2} - 0}{${x2} - 0} = ${m}$.`,
        `Using $(0, 0)$: $y - 0 = ${m}(x - 0)$.`,
        '<b>Worked example:</b> $(0, 0)$ and $(2, 6)$ → $m = 3$ → $y = 3x$.'
      ],
      explanation: `$m = \\frac{${y2}}{${x2}} = ${m}$. Using $(0, 0)$: $y - 0 = ${m}(x - 0) \\Rightarrow y = ${m}x$.`
    };
  });

  // 8: Horizontal line through two points
  makePSQ(8, function(seed) {
    const r = seededRandom(seed);
    const yVal = r.nextInt(-5, 5);
    const x1 = r.nextInt(-4, 0), x2 = x1 + r.nextInt(2, 6);
    return {
      text: `Write the point-slope equation for the line through $(${x1}, ${yVal})$ and $(${x2}, ${yVal})$ using $(${x1}, ${yVal})$:`,
      options: makeOptions(
        { text: `$y - (${yVal}) = 0(x - (${x1}))$` },
        [
          { text: `$y - (${yVal}) = 1(x - (${x1}))$`, why: 'Horizontal lines have slope 0, not 1.' },
          { text: `$x - (${x1}) = 0(y - (${yVal}))$`, why: 'Point-slope form has $y - y_1$ on the left side.' },
          { text: 'Undefined slope cannot be written in point-slope form', why: 'The slope is 0 (defined), not undefined.' }
        ], r),
      hints: [
        `$m = \\frac{${yVal} - (${yVal})}{${x2} - (${x1})} = \\frac{0}{${x2 - x1}} = 0$.`,
        `Substitute $m = 0$: $y - (${yVal}) = 0(x - (${x1})) \\Rightarrow y = ${yVal}$.`,
        '<b>Worked example:</b> $(1, 3)$ and $(4, 3)$ → $m = 0$ → $y - 3 = 0(x - 1)$.'
      ],
      explanation: `$m = 0$. Using $(${x1}, ${yVal})$: $y - (${yVal}) = 0(x - (${x1}))$, simplifying to $y = ${yVal}$.`
    };
  });

  // 9: Real-world linear model from two points (AED savings)
  makePSQ(9, function(seed) {
    const r = seededRandom(seed);
    const savePerWk = r.pick([25, 30, 40, 50]);
    const init = r.pick([50, 100, 150]);
    const w1 = 2, s1 = init + savePerWk * w1;
    const w2 = 5, s2 = init + savePerWk * w2;
    return {
      text: `Fatima had AED $${s1}$ after $${w1}$ weeks of saving, and AED $${s2}$ after $${w2}$ weeks. Which point-slope equation represents her savings $S$ after $w$ weeks using the first point?`,
      options: makeOptions(
        { text: `$S - ${s1} = ${savePerWk}(w - ${w1})$` },
        [
          { text: `$S - ${w1} = ${savePerWk}(w - ${s1})$`, why: 'Swapped savings and weeks coordinates.' },
          { text: `$S - ${s1} = -${savePerWk}(w - ${w1})$`, why: 'Savings increase over time, so the rate of change is positive.' },
          { text: `$S - ${s2} = ${savePerWk}(w - ${w1})$`, why: 'Mixed coordinates from week 2 and week 1.' }
        ], r),
      hints: [
        `Find weekly savings rate: $m = \\frac{${s2} - ${s1}}{${w2} - ${w1}} = ${savePerWk}$.`,
        `Point is $(w_1, S_1) = (${w1}, ${s1})$.`,
        '<b>Worked example:</b> Week 1: 50 AED, Week 3: 90 AED → $m = 20$ → $S - 50 = 20(w - 1)$.'
      ],
      explanation: `Slope $m = \\frac{${s2} - ${s1}}{${w2} - ${w1}} = ${savePerWk}$ AED/week. Equation: $S - ${s1} = ${savePerWk}(w - ${w1})$.`
    };
  });

  // 10: Negative slope with fractional coordinates
  makePSQ(10, function(seed) {
    const r = seededRandom(seed);
    const m = -1;
    const x1 = r.nextInt(1, 4), y1 = r.nextInt(2, 6);
    const d = r.nextInt(2, 5);
    const x2 = x1 + d, y2 = y1 - d;
    return {
      text: `Find the point-slope equation for the line containing $(${x1}, ${y1})$ and $(${x2}, ${y2})$ using $(${x1}, ${y1})$:`,
      options: makeOptions(
        { text: `$y - ${y1} = -(x - ${x1})$` },
        [
          { text: `$y - ${y1} = (x - ${x1})$`, why: 'Sign error: $y$ decreases as $x$ increases, so $m = -1$.' },
          { text: `$y + ${y1} = -(x + ${x1})$`, why: 'Sign error in formula.' },
          { text: `$y - ${x1} = -(x - ${y1})$`, why: 'Swapped $x$ and $y$.' }
        ], r),
      hints: [
        `$m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = \\frac{-${d}}{${d}} = -1$.`,
        `Substitute $m = -1$: $y - ${y1} = -1(x - ${x1})$.`,
        '<b>Worked example:</b> $(2, 5)$ and $(5, 2)$ → $m = -1$ → $y - 5 = -(x - 2)$.'
      ],
      explanation: `$m = \\frac{${y2 - y1}}{${d}} = -1$. Equation: $y - ${y1} = -(x - ${x1})$.`
    };
  });

  // 11: Identify two points that satisfy a point-slope equation
  makePSQ(11, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 4);
    const x1 = r.nextInt(1, 4), y1 = r.nextInt(1, 5);
    const x2 = x1 + 1, y2 = y1 + m;
    return {
      text: `Which pair of points lies on the line $y - ${y1} = ${m}(x - ${x1})$?`,
      options: makeOptions(
        { text: `$(${x1}, ${y1})$ and $(${x2}, ${y2})$` },
        [
          { text: `$(${y1}, ${x1})$ and $(${y2}, ${x2})$`, why: 'Coordinates are reversed.' },
          { text: `$(-${x1}, -${y1})$ and $(${x2}, ${y2})$`, why: 'The given point from $y - y_1 = m(x - x_1)$ is $(' + x1 + ', ' + y1 + ')$, not $(-x_1, -y_1)$.' },
          { text: `$(${x1}, ${y1})$ and $(${x2}, ${y2 + 1})$`, why: 'The second point does not have slope $' + m + '$.' }
        ], r),
      hints: [
        `The equation directly shows the point $(${x1}, ${y1})$ lies on the line.`,
        `To find another point, let $x = ${x2}$: $y - ${y1} = ${m}(1) \\Rightarrow y = ${y2}$.`,
        '<b>Worked example:</b> $y - 2 = 3(x - 1)$ contains $(1, 2)$ and $(2, 5)$.'
      ],
      explanation: `The equation gives point $(${x1}, ${y1})$. Moving 1 unit right increases $y$ by $m = ${m}$ to $(${x2}, ${y2})$.`
    };
  });

  // 12: Real-world train travel (metric km/h context)
  makePSQ(12, function(seed) {
    const r = seededRandom(seed);
    const speed = r.pick([120, 150, 160]);
    const t1 = 1, d1 = speed;
    const t2 = 3, d2 = speed * 3;
    return {
      text: `The Etihad Rail train travels from Abu Dhabi to Fujairah. At $t = ${t1}\\text{ h}$, distance $d = ${d1}\\text{ km}$; at $t = ${t2}\\text{ h}$, $d = ${d2}\\text{ km}$. Write the point-slope equation using the point $(${t1}, ${d1})$:`,
      options: makeOptions(
        { text: `$d - ${d1} = ${speed}(t - ${t1})$` },
        [
          { text: `$d - ${t1} = ${speed}(t - ${d1})$`, why: 'Swapped time and distance variables.' },
          { text: `$d - ${d1} = -${speed}(t - ${t1})$`, why: 'Speed is positive.' },
          { text: `$d - ${d2} = ${speed}(t - ${t1})$`, why: 'Mixed coordinates from two different times.' }
        ], r),
      hints: [
        `Calculate speed: $m = \\frac{${d2} - ${d1}}{${t2} - ${t1}} = ${speed}\\text{ km/h}$.`,
        `Use $(t_1, d_1) = (${t1}, ${d1})$: $d - d_1 = m(t - t_1)$.`,
        '<b>Worked example:</b> $1\\text{ h} \\rightarrow 100\\text{ km}$, $2\\text{ h} \\rightarrow 200\\text{ km}$ → $d - 100 = 100(t - 1)$.'
      ],
      explanation: `Slope $m = ${speed}$. Using point $(${t1}, ${d1})$: $d - ${d1} = ${speed}(t - ${t1})$.`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 15: Create and identify equations of parallel or perpendicular lines (pp.304–305, Lesson 5-2, ex.31–43)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[15] = { tile: 15, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[15].questions;
  function makeParPerpQ(idx, genFn) { Q.push({ id: `q15_${idx}`, generate: genFn }); }

  // 1: Identify perpendicular slope
  makeParPerpQ(1, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 6);
    return {
      text: `What is the slope of any line perpendicular to the line $y = ${m}x - 7$?`,
      options: makeOptions(
        { text: `$m_\\perp = -\\frac{1}{${m}}$` },
        [
          { text: `$m_\\perp = ${m}$`, why: 'Equal slopes indicate PARALLEL lines, not perpendicular.' },
          { text: `$m_\\perp = -${m}$`, why: 'Perpendicular slopes are negative RECIPROCALS, not just opposite signs.' },
          { text: `$m_\\perp = \\frac{1}{${m}}$`, why: 'Forgot to negate: $m_1 \\cdot m_2$ must equal $-1$.' }
        ], r),
      hints: [
        'Perpendicular lines have slopes that are negative reciprocals: $m_\\perp = -\\frac{1}{m}$.',
        `Original slope is $${m}$. Its reciprocal is $\\frac{1}{${m}}$, negated is $-\\frac{1}{${m}}$.`,
        '<b>Worked example:</b> Perpendicular to $m = 3$ is $m_\\perp = -\\frac{1}{3}$.'
      ],
      explanation: `Perpendicular lines satisfy $m_1 \\cdot m_2 = -1$. With $m_1 = ${m}$, $m_2 = -\\frac{1}{${m}}$.`
    };
  });

  // 2: Perpendicular slope of negative fraction
  makeParPerpQ(2, function(seed) {
    const r = seededRandom(seed);
    const pairs = [[2, 3], [3, 4], [3, 5], [4, 5]];
    const [num, den] = r.pick(pairs);
    return {
      text: `What is the slope of a line perpendicular to $y = -\\frac{${num}}{${den}}x + 4$?`,
      options: makeOptions(
        { text: `$m_\\perp = \\frac{${den}}{${num}}$` },
        [
          { text: `$m_\\perp = -\\frac{${den}}{${num}}$`, why: 'Negative of a negative is POSITIVE: $-(-\\frac{den}{num}) = +\\frac{den}{num}$.' },
          { text: `$m_\\perp = -\\frac{${num}}{${den}}$`, why: 'This is the slope of a parallel line.' },
          { text: `$m_\\perp = \\frac{${num}}{${den}}$`, why: 'Only changed the sign without taking the reciprocal.' }
        ], r),
      hints: [
        'Take the fraction, flip numerator and denominator, and change the sign.',
        `Flip $-\\frac{${num}}{${den}} \\rightarrow -\\frac{${den}}{${num}}$, negate $\\rightarrow +\\frac{${den}}{${num}}$.`,
        '<b>Worked example:</b> Perpendicular to $-\\frac{2}{5}$ is $+\\frac{5}{2}$.'
      ],
      explanation: `$m_\\perp = -\\frac{1}{-\\frac{${num}}{${den}}} = \\frac{${den}}{${num}}$.`
    };
  });

  // 3: Equation of perpendicular line through a point
  makeParPerpQ(3, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 4);
    const x1 = m * r.nextInt(1, 3);
    const y1 = r.nextInt(1, 5);
    const mPerp = -1 / m;
    const bNew = y1 - mPerp * x1;
    return {
      text: `Find the equation in slope-intercept form of the line passing through $(${x1}, ${y1})$ and perpendicular to $y = ${m}x + 8$.`,
      options: makeOptions(
        { text: `$y = -\\frac{1}{${m}}x ${signStr(bNew)}$` },
        [
          { text: `$y = ${m}x ${signStr(y1 - m * x1)}$`, why: 'Used the parallel slope instead of perpendicular.' },
          { text: `$y = \\frac{1}{${m}}x ${signStr(y1 - (1 / m) * x1)}$`, why: 'Forgot to negate the reciprocal.' },
          { text: `$y = -${m}x ${signStr(y1 + m * x1)}$`, why: 'Did not take the reciprocal of the slope.' }
        ], r),
      hints: [
        `Perpendicular slope: $m_\\perp = -\\frac{1}{${m}}$.`,
        `Substitute into $y - y_1 = m_\\perp(x - x_1)$: $y - ${y1} = -\\frac{1}{${m}}(x - ${x1})$.`,
        '<b>Worked example:</b> Through $(2, 3)$ perpendicular to $y = 2x$: $m_\\perp = -\\frac{1}{2}$, $y - 3 = -\\frac{1}{2}(x - 2) \\Rightarrow y = -\\frac{1}{2}x + 4$.'
      ],
      explanation: `$m_\\perp = -\\frac{1}{${m}}$. Point $(${x1}, ${y1})$: $y - ${y1} = -\\frac{1}{${m}}(x - ${x1}) \\Rightarrow y = -\\frac{1}{${m}}x + \\frac{${x1}}{${m}} + ${y1} = -\\frac{1}{${m}}x ${signStr(bNew)}$.`
    };
  });

  // 4: Determine if two lines are parallel, perpendicular, or neither
  makeParPerpQ(4, function(seed) {
    const r = seededRandom(seed);
    const type = r.pick(['parallel', 'perpendicular', 'neither']);
    const m = r.nextInt(2, 4);
    let eq1 = `y = ${m}x + 3`;
    let eq2, ans, whyNote;
    if (type === 'parallel') {
      eq2 = `y = ${m}x - 5`;
      ans = 'Parallel';
      whyNote = 'Both lines have identical slope $m = ' + m + '$ and different $y$-intercepts.';
    } else if (type === 'perpendicular') {
      eq2 = `y = -\\frac{1}{${m}}x + 2`;
      ans = 'Perpendicular';
      whyNote = `The slopes are negative reciprocals: $${m} \\cdot (-\\frac{1}{${m}}) = -1$.`;
    } else {
      eq2 = `y = -${m}x + 1`;
      ans = 'Neither';
      whyNote = `The slopes ($${m}$ and $-${m}$) are opposites, not negative reciprocals, and not equal.`;
    }
    return {
      text: `Determine whether the graphs of the pair of equations are parallel, perpendicular, or neither:<br>$$${eq1}$$<br>$$${eq2}$$`,
      options: makeOptions(
        { text: ans },
        [
          { text: ans === 'Parallel' ? 'Perpendicular' : 'Parallel', why: 'Check the product or equality of the slopes.' },
          { text: ans === 'Neither' ? 'Perpendicular' : 'Neither', why: 'Verify the relationship between the slopes.' },
          { text: 'Coincident (same line)', why: 'The equations have different $y$-intercepts.' }
        ], r),
      hints: [
        'Find the slope of each line: $m_1$ and $m_2$.',
        'If $m_1 = m_2$, parallel. If $m_1 \\cdot m_2 = -1$, perpendicular. Otherwise, neither.',
        whyNote
      ],
      explanation: whyNote
    };
  });

  // 5: Perpendicular to horizontal line
  makeParPerpQ(5, function(seed) {
    const r = seededRandom(seed);
    const yVal = r.nextInt(-5, 5);
    const xPoint = r.nextIntNonZero(-6, 6);
    const yPoint = r.nextInt(-5, 5);
    return {
      text: `Which equation represents the line perpendicular to $y = ${yVal}$ that passes through $(${xPoint}, ${yPoint})$?`,
      options: makeOptions(
        { text: `$x = ${xPoint}$` },
        [
          { text: `$y = ${yPoint}$`, why: '$y = c$ is horizontal and parallel to $y = ' + yVal + '$, not perpendicular.' },
          { text: `$x = ${yVal}$`, why: 'The line must pass through the given point $x$-coordinate ($' + xPoint + '$).' },
          { text: `$y = -x + ${xPoint + yPoint}$`, why: 'Perpendicular to a horizontal line is a vertical line $x = c$.' }
        ], r),
      hints: [
        `$y = ${yVal}$ is a horizontal line with slope $0$.`,
        'Lines perpendicular to horizontal lines are VERTICAL lines ($x = c$).',
        '<b>Worked example:</b> Perpendicular to $y = 3$ through $(5, -1)$ is $x = 5$.'
      ],
      explanation: `A horizontal line ($y = c$) is perpendicular to a vertical line ($x = k$). Passing through $(${xPoint}, ${yPoint})$, the equation is $x = ${xPoint}$.`
    };
  });

  // 6: Perpendicular to vertical line
  makeParPerpQ(6, function(seed) {
    const r = seededRandom(seed);
    const xVal = r.nextInt(-6, 6);
    const xPoint = r.nextInt(-5, 5);
    const yPoint = r.nextIntNonZero(-6, 6);
    return {
      text: `Find the equation of the line passing through $(${xPoint}, ${yPoint})$ that is perpendicular to the vertical line $x = ${xVal}$.`,
      options: makeOptions(
        { text: `$y = ${yPoint}$` },
        [
          { text: `$x = ${xPoint}$`, why: '$x = c$ is vertical, which is PARALLEL to $x = ' + xVal + '$.' },
          { text: `$y = ${xVal}$`, why: 'The line must pass through the given $y$-coordinate ($' + yPoint + '$).' },
          { text: `$x + y = ${xPoint + yPoint}$`, why: 'Perpendicular to a vertical line is horizontal: $y = c$.' }
        ], r),
      hints: [
        'A line perpendicular to a vertical line is a horizontal line.',
        'Horizontal lines have equations of the form $y = c$.',
        '<b>Worked example:</b> Perpendicular to $x = 2$ through $(3, 7)$ is $y = 7$.'
      ],
      explanation: `Perpendicular to vertical line $x = ${xVal}$ is horizontal: $y = y_1 = ${yPoint}$.`
    };
  });

  // 7: Given standard form 2x + 3y = 6, find perpendicular slope
  makeParPerpQ(7, function(seed) {
    const r = seededRandom(seed);
    const a = r.pick([2, 3]);
    const b = r.pick([4, 5]);
    // ax + by = c => by = -ax + c => m = -a/b => m_perp = b/a
    return {
      text: `What is the slope of any line perpendicular to $${a}x + ${b}y = 12$?`,
      options: makeOptions(
        { text: `$m_\\perp = \\frac{${b}}{${a}}$` },
        [
          { text: `$m_\\perp = -\\frac{${a}}{${b}}$`, why: 'This is the slope of the original line, not its perpendicular.' },
          { text: `$m_\\perp = -\\frac{${b}}{${a}}$`, why: 'The original slope is negative ($-' + a + '/' + b + '$), so the perpendicular slope is POSITIVE.' },
          { text: `$m_\\perp = \\frac{${a}}{${b}}$`, why: 'Forgot to take the reciprocal.' }
        ], r),
      hints: [
        `First find the slope: $${b}y = -${a}x + 12 \\Rightarrow m = -\\frac{${a}}{${b}}$.`,
        `Perpendicular slope is negative reciprocal: $m_\\perp = -\\frac{1}{-\\frac{${a}}{${b}}} = \\frac{${b}}{${a}}$.`,
        '<b>Worked example:</b> $2x + 3y = 6$ → $m = -\\frac{2}{3}$ → $m_\\perp = \\frac{3}{2}$.'
      ],
      explanation: `Line slope $m = -\\frac{${a}}{${b}}$. Perpendicular slope: $m_\\perp = \\frac{${b}}{${a}}$.`
    };
  });

  // 8: Two lines in standard form perpendicular: 2x - y = 4 and x + 2y = 8
  makeParPerpQ(8, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 4);
    return {
      text: `Which equation is perpendicular to $${a}x - y = 5$?`,
      options: makeOptions(
        { text: `$x + ${a}y = 10$` },
        [
          { text: `$${a}x - y = 10$`, why: 'This line is parallel (same coefficients $A$ and $B$).' },
          { text: `$${a}x + y = 10$`, why: 'Slope is $-' + a + '$, which is opposite but not reciprocal.' },
          { text: `$x - ${a}y = 10$`, why: 'Slope is $+1/' + a + '$, but perpendicular requires $-1/' + a + '$.' }
        ], r),
      hints: [
        `Original line: $-y = -${a}x + 5 \\Rightarrow y = ${a}x - 5$ (slope $m = ${a}$).`,
        `Perpendicular slope must be $m_\\perp = -\\frac{1}{${a}}$.`,
        `Solve each option for $y$ to find which has slope $-\\frac{1}{${a}}$.`
      ],
      explanation: `$${a}x - y = 5 \\Rightarrow y = ${a}x - 5$ ($m = ${a}$). $x + ${a}y = 10 \\Rightarrow ${a}y = -x + 10 \\Rightarrow y = -\\frac{1}{${a}}x + \\frac{10}{${a}}$ ($m = -\\frac{1}{${a}}$). They are perpendicular.`
    };
  });

  // 9: Perpendicular line passing through origin
  makeParPerpQ(9, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 5);
    return {
      text: `Write the equation of the line passing through $(0, 0)$ perpendicular to $y = ${m}x - 4$.`,
      options: makeOptions(
        { text: `$y = -\\frac{1}{${m}}x$` },
        [
          { text: `$y = ${m}x$`, why: 'Parallel through origin, not perpendicular.' },
          { text: `$y = \\frac{1}{${m}}x$`, why: 'Forgot to negate the reciprocal.' },
          { text: `$y = -${m}x$`, why: 'Did not take the reciprocal.' }
        ], r),
      hints: [
        `Perpendicular slope: $m_\\perp = -\\frac{1}{${m}}$.`,
        'Passing through $(0, 0)$ means $b = 0$.',
        '<b>Worked example:</b> Perpendicular to $y = 3x$ through origin is $y = -\\frac{1}{3}x$.'
      ],
      explanation: `$m_\\perp = -\\frac{1}{${m}}$ and $b = 0 \\Rightarrow y = -\\frac{1}{${m}}x$.`
    };
  });

  // 10: Slopes product test
  makeParPerpQ(10, function(seed) {
    const r = seededRandom(seed);
    return {
      text: `If two non-vertical lines in a plane are perpendicular, what is the product of their slopes ($m_1 \\cdot m_2$)?`,
      options: makeOptions(
        { text: `$-1$` },
        [
          { text: `$1$`, why: 'The product is $-1$ because the slopes have opposite signs.' },
          { text: `$0$`, why: 'A slope product of 0 means one of the lines is horizontal, but not both.' },
          { text: `Undefined`, why: 'The product of two real non-zero slopes is always defined and equals $-1$.' }
        ], r),
      hints: [
        'Recall the definition: $m_1 = -\\frac{1}{m_2}$.',
        'Multiply both sides by $m_2$: $m_1 \\cdot m_2 = -1$.',
        '<b>Worked example:</b> $2 \\cdot (-\\frac{1}{2}) = -1$.'
      ],
      explanation: `By definition, two non-vertical lines are perpendicular if and only if the product of their slopes is $-1$.`
    };
  });

  // 11: Perpendicular line through point with negative slope
  makeParPerpQ(11, function(seed) {
    const r = seededRandom(seed);
    const m = -r.nextInt(2, 4);
    const x1 = r.nextInt(1, 3);
    const y1 = r.nextInt(1, 5);
    // m_perp = 1 / |m|
    const den = Math.abs(m);
    const bNew = y1 - (1 / den) * x1;
    return {
      text: `Which equation is perpendicular to $y = ${m}x + 2$ and passes through $(${x1 * den}, ${y1})$?`,
      options: makeOptions(
        { text: `$y = \\frac{1}{${den}}x ${signStr(y1 - x1)}$` },
        [
          { text: `$y = -\\frac{1}{${den}}x ${signStr(y1 + x1)}$`, why: 'Perpendicular slope to a negative slope is POSITIVE.' },
          { text: `$y = ${m}x ${signStr(y1 - m * x1 * den)}$`, why: 'Used parallel slope.' },
          { text: `$y = ${den}x ${signStr(y1 - den * x1 * den)}$`, why: 'Used reciprocal without correct ratio.' }
        ], r),
      hints: [
        `Original slope is $${m}$. Perpendicular slope is $m_\\perp = +\\frac{1}{${den}}$.`,
        `$y - ${y1} = \\frac{1}{${den}}(x - ${x1 * den})$.`,
        '<b>Worked example:</b> Perpendicular to $y = -2x$ through $(4, 1)$ is $y - 1 = \\frac{1}{2}(x - 4) \\Rightarrow y = \\frac{1}{2}x - 1$.'
      ],
      explanation: `$m_\\perp = \\frac{1}{${den}}$. $y - ${y1} = \\frac{1}{${den}}(x - ${x1 * den}) \\Rightarrow y = \\frac{1}{${den}}x - ${x1} + ${y1} = \\frac{1}{${den}}x ${signStr(y1 - x1)}$.`
    };
  });

  // 12: Real-world perpendicular street grid
  makeParPerpQ(12, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 4);
    return {
      text: `In a planned community in Al Ain, Main Street follows the line $y = ${m}x + 4$. First Avenue is perpendicular to Main Street and intersects it at the $y$-intercept $(0, 4)$. What is the equation of First Avenue?`,
      options: makeOptions(
        { text: `$y = -\\frac{1}{${m}}x + 4$` },
        [
          { text: `$y = ${m}x + 4$`, why: 'This is the same street, not perpendicular.' },
          { text: `$y = -\\frac{1}{${m}}x - 4$`, why: 'They intersect at $(0, 4)$, so both share the $y$-intercept of $+4$.' },
          { text: `$y = -${m}x + 4$`, why: 'Perpendicular slope must be the reciprocal $-\\frac{1}{' + m + '}$.' }
        ], r),
      hints: [
        `Main Street has slope $${m}$, so First Avenue has slope $m_\\perp = -\\frac{1}{${m}}$.`,
        'Both intersect at $(0, 4)$, so the $y$-intercept is $b = 4$.',
        '<b>Worked example:</b> Perpendicular to $y = 2x + 1$ with same $y$-intercept is $y = -\\frac{1}{2}x + 1$.'
      ],
      explanation: `Slope is $m_\\perp = -\\frac{1}{${m}}$ and $y$-intercept is $4$. Equation: $y = -\\frac{1}{${m}}x + 4$.`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 16: Construct the inverses of relations (p.331, Lesson 5-6, ex.4–9)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[16] = { tile: 16, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[16].questions;
  function makeInvQ(idx, genFn) { Q.push({ id: `q16_${idx}`, generate: genFn }); }

  // 1: Inverse of a set of ordered pairs
  makeInvQ(1, function(seed) {
    const r = seededRandom(seed);
    const pairs = [
      [r.nextInt(1, 3), r.nextInt(4, 6)],
      [r.nextInt(4, 6), r.nextInt(7, 9)],
      [r.nextInt(7, 9), r.nextInt(1, 3)]
    ];
    const origStr = pairs.map(([x, y]) => `(${x}, ${y})`).join(', ');
    const invStr = pairs.map(([x, y]) => `(${y}, ${x})`).join(', ');
    const wrong1 = pairs.map(([x, y]) => `(-${x}, -${y})`).join(', ');
    const wrong2 = pairs.map(([x, y]) => `(-${y}, -${x})`).join(', ');
    return {
      text: `Find the inverse of the relation: $$\\{${origStr}\\}$$`,
      options: makeOptions(
        { text: `$\\{${invStr}\\}$` },
        [
          { text: `$\\{${wrong1}\\}$`, why: 'The inverse swaps $x$ and $y$ coordinates; it does not negate them.' },
          { text: `$\\{${wrong2}\\}$`, why: 'Negated the coordinates in addition to swapping.' },
          { text: `$\\{${origStr}\\}$`, why: 'This is the original relation unchanged.' }
        ], r),
      hints: [
        'To find the inverse of a relation, interchange the $x$- and $y$-coordinates of each ordered pair.',
        '$(a, b) \\rightarrow (b, a)$.',
        '<b>Worked example:</b> Inverse of $\{(1, 2), (3, 4)\}$ is $\{(2, 1), (4, 3)\}$.'
      ],
      explanation: `Swap the coordinates in each pair: $(x, y) \\rightarrow (y, x)$. The inverse is $\\{${invStr}\\}$.`
    };
  });

  // 2: Inverse of f(x) = ax + b
  makeInvQ(2, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 5);
    const b = r.nextIntNonZero(-8, 8);
    return {
      text: `Find the inverse function $f^{-1}(x)$ for: $$f(x) = ${a}x ${signStr(b)}$$`,
      options: makeOptions(
        { text: `$f^{-1}(x) = \\frac{x ${signStr(-b)}}{${a}}$` },
        [
          { text: `$f^{-1}(x) = \\frac{x ${signStr(b)}}{${a}}$`, why: 'When solving $x = ' + a + 'y ' + signStr(b) + '$, you must subtract $' + b + '$ to isolate $y$.' },
          { text: `$f^{-1}(x) = ${a}x ${signStr(-b)}$`, why: 'Forgot to divide by the coefficient $' + a + '$.' },
          { text: `$f^{-1}(x) = -\\frac{1}{${a}}x ${signStr(b)}$`, why: 'Confused inverse function with perpendicular slope.' }
        ], r),
      hints: [
        `Step 1: Replace $f(x)$ with $y$: $y = ${a}x ${signStr(b)}$.`,
        `Step 2: Swap $x$ and $y$: $x = ${a}y ${signStr(b)}$.`,
        `Step 3: Solve for $y$: $x ${signStr(-b)} = ${a}y \\Rightarrow y = \\frac{x ${signStr(-b)}}{${a}}$.`,
        '<b>Worked example:</b> $f(x) = 2x + 3$ → $x = 2y + 3$ → $y = \\frac{x - 3}{2}$.'
      ],
      explanation: `Set $x = ${a}y ${signStr(b)} \\Rightarrow ${a}y = x ${signStr(-b)} \\Rightarrow f^{-1}(x) = \\frac{x ${signStr(-b)}}{${a}}$.`
    };
  });

  // 3: Inverse of f(x) = x/a - b
  makeInvQ(3, function(seed) {
    const r = seededRandom(seed);
    const a = r.pick([2, 3, 4]);
    const b = r.nextInt(1, 6);
    return {
      text: `What is the inverse of $f(x) = \\frac{x}{${a}} - ${b}$?`,
      options: makeOptions(
        { text: `$f^{-1}(x) = ${a}x + ${a * b}$` },
        [
          { text: `$f^{-1}(x) = ${a}x + ${b}$`, why: `When multiplying by $${a}$, both terms must be multiplied: $${a}(x + ${b}) = ${a}x + ${a * b}$.` },
          { text: `$f^{-1}(x) = \\frac{x + ${b}}{${a}}$`, why: 'The inverse operation of dividing by $' + a + '$ is multiplying by $' + a + '$.' },
          { text: `$f^{-1}(x) = ${a}x - ${a * b}$`, why: 'Sign error: adding $' + b + '$ before multiplying.' }
        ], r),
      hints: [
        `Swap variables: $x = \\frac{y}{${a}} - ${b}$.`,
        `Add $${b}$: $x + ${b} = \\frac{y}{${a}}$.`,
        `Multiply the entire expression by $${a}$: $y = ${a}(x + ${b}) = ${a}x + ${a * b}$.`
      ],
      explanation: `$x = \\frac{y}{${a}} - ${b} \\Rightarrow \\frac{y}{${a}} = x + ${b} \\Rightarrow y = ${a}(x + ${b}) = ${a}x + ${a * b}$.`
    };
  });

  // 4: Domain and Range of inverse
  makeInvQ(4, function(seed) {
    const r = seededRandom(seed);
    return {
      text: `If a function $f$ has domain $\\{2, 4, 6\\}$ and range $\\{1, 3, 5\\}$, what are the domain and range of its inverse $f^{-1}$?`,
      options: makeOptions(
        { text: `Domain: $\\{1, 3, 5\\}$, Range: $\\{2, 4, 6\\}$` },
        [
          { text: `Domain: $\\{2, 4, 6\\}$, Range: $\\{1, 3, 5\\}$`, why: 'The domain and range of a function SWAP for its inverse.' },
          { text: `Domain: $\\{-2, -4, -6\\}$, Range: $\\{-1, -3, -5\\}$`, why: 'The inverse does not negate values.' },
          { text: `Domain: $\\{1, 2, 3\\}$, Range: $\\{4, 5, 6\\}$`, why: 'Values are paired from the original domain and range.' }
        ], r),
      hints: [
        'The inverse reverses the role of inputs and outputs.',
        'Domain of $f^{-1}$ = Range of $f$.',
        'Range of $f^{-1}$ = Domain of $f$.'
      ],
      explanation: `For any inverse relation, the domain of $f^{-1}$ is the range of $f$ ($\\{1, 3, 5\\}$), and the range of $f^{-1}$ is the domain of $f$ ($\\{2, 4, 6\\}$).`
    };
  });

  // 5: Graphical property of inverse: reflection across y = x
  makeInvQ(5, function(seed) {
    const r = seededRandom(seed);
    return {
      text: `The graph of an inverse function $f^{-1}(x)$ is the reflection of the graph of $f(x)$ across which line?`,
      options: makeOptions(
        { text: `The line $y = x$` },
        [
          { text: `The $x$-axis ($y = 0$)`, why: 'Reflecting across the $x$-axis produces $-f(x)$, not $f^{-1}(x)$.' },
          { text: `The $y$-axis ($x = 0$)`, why: 'Reflecting across the $y$-axis produces $f(-x)$.' },
          { text: `The line $y = -x$`, why: 'The inverse reflects across $y = x$ where coordinates $(x, y)$ map to $(y, x)$.' }
        ], r),
      hints: [
        'Swapping $x$ and $y$ geometrically corresponds to reflection across the diagonal line.',
        'This line has slope 1 and passes through the origin.',
        '<b>Worked example:</b> $(2, 3)$ reflects across $y = x$ to $(3, 2)$.'
      ],
      explanation: `Since the inverse operation swaps $x$ and $y$, the graph of $f^{-1}$ is symmetric to $f$ across the diagonal line $y = x$.`
    };
  });

  // 6: Inverse of f(x) = (x + a) / b
  makeInvQ(6, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 7);
    const b = r.pick([2, 3, 4, 5]);
    return {
      text: `Find $f^{-1}(x)$ if: $$f(x) = \\frac{x + ${a}}{${b}}$$`,
      options: makeOptions(
        { text: `$f^{-1}(x) = ${b}x - ${a}$` },
        [
          { text: `$f^{-1}(x) = ${b}x + ${a}$`, why: `After multiplying by $${b}$, you must subtract $${a}$ to isolate $y$.` },
          { text: `$f^{-1}(x) = \\frac{x - ${a}}{${b}}$`, why: 'Did not reverse the division operation.' },
          { text: `$f^{-1}(x) = \\frac{1}{${b}}x - ${a}$`, why: 'Inverse of dividing by $' + b + '$ is multiplying by $' + b + '$.' }
        ], r),
      hints: [
        `Write $x = \\frac{y + ${a}}{${b}}$.`,
        `Multiply both sides by $${b}$: $${b}x = y + ${a}$.`,
        `Subtract $${a}$: $y = ${b}x - ${a}$.`
      ],
      explanation: `$x = \\frac{y + ${a}}{${b}} \\Rightarrow ${b}x = y + ${a} \\Rightarrow f^{-1}(x) = ${b}x - ${a}$.`
    };
  });

  // 7: Evaluating f^-1(c) directly
  makeInvQ(7, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 5);
    const b = r.nextInt(1, 8);
    const inputVal = r.nextInt(1, 6);
    const c = a * inputVal + b;
    return {
      text: `Given $f(x) = ${a}x + ${b}$, find the value of $f^{-1}(${c})$:`,
      options: makeOptions(
        { text: `$${inputVal}$` },
        [
          { text: `$${a * c + b}$`, why: 'This calculates $f(' + c + ')$, not $f^{-1}(' + c + ')$.' },
          { text: `$${inputVal + 1}$`, why: 'Arithmetic error when solving.' },
          { text: `$${Math.round(c / a)}$`, why: 'Forgot to subtract $' + b + '$ before dividing.' }
        ], r),
      hints: [
        `$f^{-1}(${c})$ is the value of $x$ for which $f(x) = ${c}$.`,
        `Set $${a}x + ${b} = ${c}$ and solve for $x$.`,
        '<b>Worked example:</b> $f(x) = 2x + 1$. $f^{-1}(7) \\Rightarrow 2x + 1 = 7 \\Rightarrow x = 3$.'
      ],
      explanation: `Set $f(x) = ${c}$: $${a}x + ${b} = ${c} \\Rightarrow ${a}x = ${c - b} \\Rightarrow x = ${inputVal}$.`
    };
  });

  // 8: Inverse of f(x) = -x + b
  makeInvQ(8, function(seed) {
    const r = seededRandom(seed);
    const b = r.nextInt(2, 9);
    return {
      text: `Find the inverse function of $f(x) = -x + ${b}$:`,
      options: makeOptions(
        { text: `$f^{-1}(x) = -x + ${b}$ (it is its own inverse!)` },
        [
          { text: `$f^{-1}(x) = x - ${b}$`, why: 'Check: $x = -y + ' + b + ' \\Rightarrow y = -x + ' + b + '$.' },
          { text: `$f^{-1}(x) = x + ${b}$`, why: 'Sign error.' },
          { text: `$f^{-1}(x) = -x - ${b}$`, why: 'Both terms negated incorrectly.' }
        ], r),
      hints: [
        `Swap variables: $x = -y + ${b}$.`,
        `Add $y$ and subtract $x$: $y = -x + ${b}$.`,
        'Functions with slope $-1$ are self-inverses!'
      ],
      explanation: `$x = -y + ${b} \\Rightarrow y = -x + ${b}$. The function is its own inverse.`
    };
  });

  // 9: Horizontal line test for existence of inverse function
  makeInvQ(9, function(seed) {
    const r = seededRandom(seed);
    return {
      text: `Which test determines whether the inverse of a relation will also be a function?`,
      options: makeOptions(
        { text: `The Horizontal Line Test on the original graph` },
        [
          { text: `The Vertical Line Test on the original graph`, why: 'The vertical line test determines if the ORIGINAL relation is a function, not its inverse.' },
          { text: `The Diagonal Line Test`, why: 'There is no standard diagonal line test.' },
          { text: `The Slope Formula Test`, why: 'Inverse functions can exist for non-linear functions as long as they pass the horizontal line test.' }
        ], r),
      hints: [
        'A function has an inverse that is also a function if no horizontal line intersects the graph more than once.',
        'This ensures the function is one-to-one.',
        'Horizontal lines on $f$ become vertical lines on $f^{-1}$.'
      ],
      explanation: `The Horizontal Line Test applied to $f(x)$ verifies if every output comes from a unique input (one-to-one), ensuring $f^{-1}(x)$ is a function.`
    };
  });

  // 10: Inverse from a table
  makeInvQ(10, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 4);
    const xVals = [1, 2, 3];
    const yVals = xVals.map(x => a * x);
    return {
      text: `If a function $f$ is given by the table:<br>
<div style="margin:8px 0;text-align:center;">
$x: 1, 2, 3$<br>$f(x): ${yVals.join(', ')}$
</div>
What is the value of $f^{-1}(${yVals[1]})$?`,
      options: makeOptions(
        { text: `$2$` },
        [
          { text: `$${yVals[1]}$`, why: 'This is the output of $f$, not the input mapped by the inverse.' },
          { text: `$${yVals[2]}$`, why: 'Incorrect table lookup.' },
          { text: `$1$`, why: '$f(1) = ' + yVals[0] + '$, not $' + yVals[1] + '$.' }
        ], r),
      hints: [
        `Find the row where $f(x) = ${yVals[1]}$.`,
        `The corresponding input $x$ is $2$.`,
        '<b>Worked example:</b> If $f(2) = 6$, then $f^{-1}(6) = 2$.'
      ],
      explanation: `Since $f(2) = ${yVals[1]}$, by definition $f^{-1}(${yVals[1]}) = 2$.`
    };
  });

  // 11: Real-world unit conversion inverse (km to cm or AED to USD)
  makeInvQ(11, function(seed) {
    const r = seededRandom(seed);
    const rate = r.pick([3.67, 4.0, 5.0]);
    return {
      text: `A currency exchange function converts US dollars ($d$) to UAE Dirhams ($A$) using $A = f(d) = ${rate}d$. What is the inverse function that converts Dirhams back to dollars?`,
      options: makeOptions(
        { text: `$d = f^{-1}(A) = \\frac{A}{${rate}}$` },
        [
          { text: `$d = f^{-1}(A) = ${rate}A$`, why: 'Multiplying by the rate would increase the amount instead of converting back.' },
          { text: `$d = f^{-1}(A) = A - ${rate}$`, why: 'The inverse of multiplication is division, not subtraction.' },
          { text: `$d = f^{-1}(A) = \\frac{${rate}}{A}$`, why: 'Divided the rate by $A$ instead of $A$ by the rate.' }
        ], r),
      hints: [
        `Solve $A = ${rate}d$ for $d$.`,
        `Divide both sides by $${rate}$.`,
        '<b>Worked example:</b> $y = 4x \\Rightarrow x = \\frac{y}{4}$.'
      ],
      explanation: `Dividing both sides of $A = ${rate}d$ by $${rate}$ gives $d = \\frac{A}{${rate}}$.`
    };
  });

  // 12: Inverse of a linear function with fractional slope
  makeInvQ(12, function(seed) {
    const r = seededRandom(seed);
    const den = r.pick([2, 3]);
    const num = 1;
    const b = r.nextInt(1, 4);
    return {
      text: `Find the inverse of $f(x) = \\frac{1}{${den}}x + ${b}$:`,
      options: makeOptions(
        { text: `$f^{-1}(x) = ${den}x - ${den * b}$` },
        [
          { text: `$f^{-1}(x) = ${den}x - ${b}$`, why: `Forgot to multiply $${b}$ by $${den}$ when distributing.` },
          { text: `$f^{-1}(x) = ${den}x + ${den * b}$`, why: 'Sign error: subtracting $' + b + '$ before multiplying.' },
          { text: `$f^{-1}(x) = -${den}x + ${b}$`, why: 'Confused inverse function with perpendicular slope.' }
        ], r),
      hints: [
        `Swap variables: $x = \\frac{1}{${den}}y + ${b}$.`,
        `Subtract $${b}$: $x - ${b} = \\frac{1}{${den}}y$.`,
        `Multiply by $${den}$: $y = ${den}(x - ${b}) = ${den}x - ${den * b}$.`
      ],
      explanation: `$x = \\frac{1}{${den}}y + ${b} \\Rightarrow \\frac{1}{${den}}y = x - ${b} \\Rightarrow y = ${den}x - ${den * b}$.`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 17: Identify and graph step functions (p.265, Lesson 4-6, ex.18a–d)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[17] = { tile: 17, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[17].questions;
  function makeStepQ(idx, genFn) { Q.push({ id: `q17_${idx}`, generate: genFn }); }

  // 1: Evaluate greatest integer function for positive decimal
  makeStepQ(1, function(seed) {
    const r = seededRandom(seed);
    const intPart = r.nextInt(2, 8);
    const decPart = r.pick([1, 3, 5, 7, 8, 9]);
    const val = `${intPart}.${decPart}`;
    return {
      text: `Evaluate the greatest integer function: $$f(x) = \\lfloor x \\rfloor \\quad \\text{for } x = ${val}$$`,
      options: makeOptions(
        { text: `$${intPart}$` },
        [
          { text: `$${intPart + 1}$`, why: `The greatest integer function rounds DOWN to the greatest integer less than or equal to $x$, not up.` },
          { text: `$${val}$`, why: 'The output of the greatest integer function is always an integer.' },
          { text: `$${decPart}$`, why: 'This is the decimal part, not the floor integer.' }
        ], r),
      hints: [
        'The greatest integer function $\\lfloor x \\rfloor$ gives the greatest integer that is $\\leq x$.',
        `For positive numbers, this is simply the integer part before the decimal point: $${intPart}$.`,
        '<b>Worked example:</b> $\\lfloor 3.8 \\rfloor = 3$.'
      ],
      explanation: `The greatest integer less than or equal to $${val}$ is $${intPart}$. Therefore, $\\lfloor ${val} \\rfloor = ${intPart}$.`
    };
  });

  // 2: Evaluate greatest integer function for negative decimal (CRUCIAL concept!)
  makeStepQ(2, function(seed) {
    const r = seededRandom(seed);
    const intPart = r.nextInt(1, 6);
    const decPart = r.pick([2, 4, 6, 7]);
    const val = `-${intPart}.${decPart}`;
    const ans = -(intPart + 1);
    return {
      text: `Evaluate the greatest integer function $f(x) = \\lfloor x \\rfloor$ for $x = ${val}$:`,
      options: makeOptions(
        { text: `$${ans}$` },
        [
          { text: `$-${intPart}$`, why: `$-${intPart}$ is GREATER than $${val}$. The floor function must round down to the integer to the left on the number line ($${ans}$).` },
          { text: `$${intPart}$`, why: 'Lost the negative sign.' },
          { text: `$${ans - 1}$`, why: 'Rounded down too far.' }
        ], r),
      hints: [
        `Think of the number line: $${val}$ lies between $-${intPart}$ and $${ans}$.`,
        `The integer to the LEFT (less than or equal to $${val}$) is $${ans}$.`,
        '<b>Worked example:</b> $\\lfloor -2.3 \\rfloor = -3$, because $-3 \\leq -2.3 < -2$.'
      ],
      explanation: `On a number line, $${val}$ lies between $${ans}$ and $-${intPart}$. The greatest integer less than or equal to $${val}$ is $${ans}$.`
    };
  });

  // 3: Domain and range of greatest integer function
  makeStepQ(3, function(seed) {
    const r = seededRandom(seed);
    return {
      text: `What are the domain and range of the greatest integer function $f(x) = \\lfloor x \\rfloor$?`,
      options: makeOptions(
        { text: `Domain: All real numbers; Range: All integers ($\\mathbb{Z}$)` },
        [
          { text: `Domain: All integers; Range: All real numbers`, why: 'Any real number can be an input, but outputs are strictly integers.' },
          { text: `Domain: All real numbers; Range: All real numbers`, why: 'The output cannot be a fraction or decimal, only integers.' },
          { text: `Domain: Positive real numbers; Range: Positive integers`, why: 'The function is defined for all real numbers including negative numbers.' }
        ], r),
      hints: [
        'Can you plug in any number ($x = 2.5, -1.7, \\pi$)? Yes, so the domain is all real numbers.',
        'What kinds of numbers come out ($\\{-2, -1, 0, 1, 2, \\dots\\}$)? Only integers!',
        '<b>Worked example:</b> $\\lfloor x \\rfloor$ outputs $\\dots, -2, -1, 0, 1, 2, \\dots$.'
      ],
      explanation: `The domain of $f(x) = \\lfloor x \\rfloor$ is all real numbers ($\\mathbb{R}$), and its range is the set of all integers ($\\mathbb{Z}$).`
    };
  });

  // 4: Evaluate transformed step function: f(x) = 2[x] + 1
  makeStepQ(4, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 4);
    const k = r.nextInt(1, 5);
    const intPart = r.nextInt(1, 4);
    const decPart = r.pick([3, 7]);
    const xVal = `${intPart}.${decPart}`;
    const ans = a * intPart + k;
    return {
      text: `Given $g(x) = ${a}\\lfloor x \\rfloor + ${k}$, find $g(${xVal})$:`,
      options: makeOptions(
        { text: `$${ans}$` },
        [
          { text: `$${a * (intPart + 1) + k}$`, why: 'Rounded $x$ up instead of using the floor.' },
          { text: `$${ans - k}$`, why: `Forgot to add the constant $${k}$.` },
          { text: `$${Math.round(a * parseFloat(xVal) + k)}$`, why: 'Multiplied before evaluating the step function.' }
        ], r),
      hints: [
        `First evaluate the inner floor: $\\lfloor ${xVal} \\rfloor = ${intPart}$.`,
        `Then substitute: $g(${xVal}) = ${a}(${intPart}) + ${k}$.`,
        `Calculate $${a * intPart} + ${k} = ${ans}$.`
      ],
      explanation: `$\\lfloor ${xVal} \\rfloor = ${intPart}$. Then $g(${xVal}) = ${a}(${intPart}) + ${k} = ${a * intPart} + ${k} = ${ans}$.`
    };
  });

  // 5: Real-world parking fee step function (AED context)
  makeStepQ(5, function(seed) {
    const r = seededRandom(seed);
    const ratePerHour = r.pick([10, 15, 20]);
    const hours = r.pick([1.2, 2.5, 3.1, 4.4]);
    const chargedHours = Math.ceil(hours);
    const cost = chargedHours * ratePerHour;
    return {
      text: `A parking garage at a shopping mall in Dubai charges AED $${ratePerHour}$ for each hour or fraction of an hour. A motorist parks for $${hours}$ hours. What is the total parking fee?`,
      options: makeOptions(
        { text: `AED $${cost}$` },
        [
          { text: `AED $${Math.floor(hours) * ratePerHour}$`, why: 'A fraction of an hour is charged as a full hour (ceiling function).' },
          { text: `AED $${Math.round(hours * ratePerHour)}$`, why: 'Parking rates are step functions, not continuous.' },
          { text: `AED $${(chargedHours + 1) * ratePerHour}$`, why: 'Charged for one extra hour too many.' }
        ], r),
      hints: [
        `"Each hour or fraction of an hour" means any part of an hour rounds UP to the next full hour: $\\lceil ${hours} \\rceil = ${chargedHours}$ hours.`,
        `Multiply full hours by rate: $${chargedHours} \\times ${ratePerHour} = ${cost}$ AED.`,
        '<b>Worked example:</b> 1.4 hours at 10 AED/hr → 2 hours charged = 20 AED.'
      ],
      explanation: `Since any fraction of an hour counts as a full hour, $${hours}$ hours is charged as $${chargedHours}$ hours. Total fee $= ${chargedHours} \\times ${ratePerHour} = ${cost}$ AED.`
    };
  });

  // 6: Real-world mobile data step function
  makeStepQ(6, function(seed) {
    const r = seededRandom(seed);
    const ratePerGB = r.pick([15, 25, 30]);
    const gb = r.pick([2.3, 3.1, 4.6]);
    const chargedGB = Math.ceil(gb);
    const cost = chargedGB * ratePerGB;
    return {
      text: `A telecommunications company charges AED $${ratePerGB}$ per gigabyte (GB) or fraction of a GB. A student uses $${gb}\\text{ GB}$ of data. What is the total charge?`,
      options: makeOptions(
        { text: `AED $${cost}$` },
        [
          { text: `AED $${Math.floor(gb) * ratePerGB}$`, why: 'The partial GB is rounded up, not truncated.' },
          { text: `AED $${cost + ratePerGB}$`, why: 'Added an extra GB.' },
          { text: `AED $${Math.round(gb * ratePerGB)}$`, why: 'Step function rounds to integer steps, not exact decimals.' }
        ], r),
      hints: [
        `Any fraction of a GB is rounded up to the next whole GB: $\\lceil ${gb} \\rceil = ${chargedGB}\\text{ GB}$.`,
        `Cost $= ${chargedGB} \\times ${ratePerGB} = ${cost}$ AED.`
      ],
      explanation: `Usage of $${gb}\\text{ GB}$ rounds up to $${chargedGB}\\text{ GB}$. Charge $= ${chargedGB} \\times ${ratePerGB} = ${cost}$ AED.`
    };
  });

  // 7: Evaluate floor of an exact integer
  makeStepQ(7, function(seed) {
    const r = seededRandom(seed);
    const intVal = r.nextInt(-8, 8);
    return {
      text: `Evaluate $f(x) = \\lfloor x \\rfloor$ when $x = ${intVal}$:`,
      options: makeOptions(
        { text: `$${intVal}$` },
        [
          { text: `$${intVal - 1}$`, why: 'For an exact integer, the greatest integer $\\leq x$ is the integer itself, not the one below it.' },
          { text: `$${intVal + 1}$`, why: 'Floor never rounds up.' },
          { text: `$0$`, why: 'Floor of an integer is that integer.' }
        ], r),
      hints: [
        'The definition states: $\\lfloor x \\rfloor$ is the greatest integer LESS THAN OR EQUAL TO $x$.',
        'When $x$ is already an integer, $\\lfloor x \\rfloor = x$.',
        '<b>Worked example:</b> $\\lfloor 5 \\rfloor = 5$ and $\\lfloor -3 \\rfloor = -3$.'
      ],
      explanation: `Since $${intVal}$ is an integer, $\\lfloor ${intVal} \\rfloor = ${intVal}$.`
    };
  });

  // 8: Floor with addition inside: f(x) = [x + a]
  makeStepQ(8, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(1, 4);
    const xVal = 2.4;
    const inner = xVal + a;
    const ans = Math.floor(inner);
    return {
      text: `Find $f(2.4)$ if $f(x) = \\lfloor x + ${a} \\rfloor$:`,
      options: makeOptions(
        { text: `$${ans}$` },
        [
          { text: `$${ans + 1}$`, why: 'Rounded up instead of down.' },
          { text: `$${Math.floor(xVal)}$`, why: `Forgot to add $${a}$ inside the bracket.` },
          { text: `$${inner}$`, why: 'Output must be an integer.' }
        ], r),
      hints: [
        `First add inside the bracket: $2.4 + ${a} = ${inner.toFixed(1)}$.`,
        `Then find $\\lfloor ${inner.toFixed(1)} \\rfloor = ${ans}$.`
      ],
      explanation: `$f(2.4) = \\lfloor 2.4 + ${a} \\rfloor = \\lfloor ${inner.toFixed(1)} \\rfloor = ${ans}$.`
    };
  });

  // 9: Interval where [x] = c
  makeStepQ(9, function(seed) {
    const r = seededRandom(seed);
    const c = r.nextInt(-4, 6);
    return {
      text: `For which interval of $x$ is $\\lfloor x \\rfloor = ${c}$?`,
      options: makeOptions(
        { text: `$${c} \\leq x < ${c + 1}$` },
        [
          { text: `$${c} < x \\leq ${c + 1}$`, why: 'The lower endpoint is closed (included), and the upper endpoint is open.' },
          { text: `$${c - 1} < x \\leq ${c}$`, why: 'For this interval, $\\lfloor x \\rfloor = ' + (c - 1) + '$, not $' + c + '$.' },
          { text: `$${c} \\leq x \\leq ${c + 1}$`, why: 'At $x = ' + (c + 1) + '$, $\\lfloor x \\rfloor = ' + (c + 1) + '$, not $' + c + '$.' }
        ], r),
      hints: [
        'By definition, $\\lfloor x \\rfloor = n$ if and only if $n \\leq x < n + 1$.',
        `Here $n = ${c}$, so $${c} \\leq x < ${c + 1}$.`,
        '<b>Worked example:</b> $\\lfloor x \\rfloor = 3$ for $3 \\leq x < 4$.'
      ],
      explanation: `$\\lfloor x \\rfloor = ${c}$ for all real numbers from $${c}$ up to (but not including) $${c + 1}$: $${c} \\leq x < ${c + 1}$.`
    };
  });

  // 10: Step height in a = 3[x]
  makeStepQ(10, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 5);
    return {
      text: `In the graph of $f(x) = ${a}\\lfloor x \\rfloor$, what is the vertical distance (step height) between consecutive steps?`,
      options: makeOptions(
        { text: `$${a}$ units` },
        [
          { text: `$1$ unit`, why: 'The parent function has step height 1, but multiplying by ' + a + ' stretches the height to ' + a + '.' },
          { text: `$\\frac{1}{${a}}$ units`, why: 'The horizontal step length remains 1, while vertical height is ' + a + '.' },
          { text: `$${a + 1}$ units`, why: 'The difference between consecutive values is ' + a + '(n+1) - ' + a + 'n = ' + a + '.' }
        ], r),
      hints: [
        'Compare consecutive outputs: for $x \\in [0, 1)$, $f(x) = 0$. For $x \\in [1, 2)$, $f(x) = ' + a + '$.',
        `The difference between consecutive levels is $${a} - 0 = ${a}$.`
      ],
      explanation: `Since consecutive integer outputs of $\\lfloor x \\rfloor$ differ by $1$, multiplying by $${a}$ makes consecutive steps differ by $${a} \\times 1 = ${a}$ units vertically.`
    };
  });

  // 11: Real-world taxi waiting fee step function
  makeStepQ(11, function(seed) {
    const r = seededRandom(seed);
    const feePer5Min = r.pick([5, 10]);
    const minutes = r.pick([6, 8, 12, 14]);
    const periods = Math.ceil(minutes / 5);
    const total = periods * feePer5Min;
    return {
      text: `A taxi service charges AED $${feePer5Min}$ for every $5$ minutes or fraction thereof of waiting time. If the driver waits $${minutes}$ minutes, what is the waiting fee?`,
      options: makeOptions(
        { text: `AED $${total}$` },
        [
          { text: `AED $${Math.floor(minutes / 5) * feePer5Min}$`, why: 'The fraction of 5 minutes is charged as a full 5-minute period.' },
          { text: `AED $${total + feePer5Min}$`, why: 'Counted an extra period.' },
          { text: `AED $${Math.round((minutes / 5) * feePer5Min)}$`, why: 'Step function applies discrete jumps.' }
        ], r),
      hints: [
        `Divide waiting time by 5: $${minutes} / 5 = ${(minutes / 5).toFixed(1)}$.`,
        `Round up to the next whole period: $\\lceil ${(minutes / 5).toFixed(1)} \\rceil = ${periods}$ periods.`,
        `Multiply: $${periods} \\times ${feePer5Min} = ${total}$ AED.`
      ],
      explanation: `$${minutes}$ minutes is $${periods}$ periods of 5 minutes (or fraction thereof). Fee $= ${periods} \\times ${feePer5Min} = ${total}$ AED.`
    };
  });

  // 12: Negative floor with subtraction: [x - 0.5]
  makeStepQ(12, function(seed) {
    const r = seededRandom(seed);
    const xVal = r.pick([1.2, 2.3, 3.4]);
    const inner = xVal - 0.5;
    const ans = Math.floor(inner);
    return {
      text: `Evaluate $f(x) = \\lfloor x - 0.5 \\rfloor$ when $x = ${xVal}$:`,
      options: makeOptions(
        { text: `$${ans}$` },
        [
          { text: `$${ans + 1}$`, why: 'Rounded up instead of using the floor.' },
          { text: `$${Math.floor(xVal)}$`, why: 'Forgot to subtract 0.5 first.' },
          { text: `$${inner.toFixed(1)}$`, why: 'Floor function outputs an integer.' }
        ], r),
      hints: [
        `Calculate inside first: $${xVal} - 0.5 = ${inner.toFixed(1)}$.`,
        `Find $\\lfloor ${inner.toFixed(1)} \\rfloor = ${ans}$.`
      ],
      explanation: `$f(${xVal}) = \\lfloor ${xVal} - 0.5 \\rfloor = \\lfloor ${inner.toFixed(1)} \\rfloor = ${ans}$.`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 18: Identify and graph step functions (p.261, Lesson 4-6, Example 2)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[18] = { tile: 18, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[18].questions;
  function makeStepGraphQ(idx, genFn) { Q.push({ id: `q18_${idx}`, generate: genFn }); }

  // 1: Endpoints of horizontal segments on greatest integer graph
  makeStepGraphQ(1, function(seed) {
    const r = seededRandom(seed);
    const n = r.nextInt(1, 5);
    return {
      text: `On the graph of the greatest integer function $f(x) = \\lfloor x \\rfloor$, which endpoints does the segment at $y = ${n}$ have?`,
      options: makeOptions(
        { text: `A closed circle at $(${n}, ${n})$ and an open circle at $(${n + 1}, ${n})$` },
        [
          { text: `An open circle at $(${n}, ${n})$ and a closed circle at $(${n + 1}, ${n})$`, why: 'For $\\lfloor x \\rfloor$, the segment starts closed at the left and ends open at the right.' },
          { text: `Closed circles at both $(${n}, ${n})$ and $(${n + 1}, ${n})$`, why: 'If both endpoints were closed, the graph would fail the vertical line test at integer values.' },
          { text: `Open circles at both endpoints`, why: 'The function is defined at all integers, so the left endpoint is closed.' }
        ], r),
      hints: [
        `Since $\\lfloor ${n} \\rfloor = ${n}$, the point $(${n}, ${n})$ is included (closed circle).`,
        `As $x$ approaches $${n + 1}$ from below, $\\lfloor x \\rfloor = ${n}$, but $\\lfloor ${n + 1} \\rfloor = ${n + 1}$.`,
        `Therefore, the right endpoint at $(${n + 1}, ${n})$ is an open circle.`
      ],
      explanation: `For $x \\in [${n}, ${n + 1})$, $y = ${n}$. The left end $(${n}, ${n})$ is closed, and the right end $(${n + 1}, ${n})$ is open.`
    };
  });

  // 2: Discontinuity of step functions
  makeStepGraphQ(2, function(seed) {
    const r = seededRandom(seed);
    return {
      text: `Why is the greatest integer function called a "step function"?`,
      options: makeOptions(
        { text: `Its graph consists of line segments that resemble stairs, with jump discontinuities at each integer` },
        [
          { text: `It is a continuous line with sudden changes in slope`, why: 'The graph is not continuous; it has separate horizontal steps with jumps.' },
          { text: `It only increases in steps of 10`, why: 'The steps occur at every integer (unit 1).' },
          { text: `Its domain consists only of discrete integers`, why: 'The domain is all real numbers, but the graph is piecewise constant.' }
        ], r),
      hints: [
        'Look at the shape of the graph: horizontal steps connected by jumps.',
        'At each integer, the function jumps up to the next level.',
        'These are called jump discontinuities.'
      ],
      explanation: `The graph consists of horizontal line segments that look like steps of a staircase, with jump discontinuities at every integer value.`
    };
  });

  // 3: Graph of f(x) = [x] + k
  makeStepGraphQ(3, function(seed) {
    const r = seededRandom(seed);
    const k = r.nextInt(1, 4);
    return {
      text: `How does the graph of $g(x) = \\lfloor x \\rfloor + ${k}$ differ from the parent graph $f(x) = \\lfloor x \\rfloor$?`,
      options: makeOptions(
        { text: `Every step is shifted vertically upward by $${k}$ units` },
        [
          { text: `Every step is shifted horizontally $${k}$ units right`, why: 'The constant is added outside, so it is a vertical shift.' },
          { text: `The length of each step increases by $${k}$ units`, why: 'Adding a constant changes position, not step length.' },
          { text: `The graph is reflected across the $x$-axis`, why: 'There is no negative coefficient.' }
        ], r),
      hints: [
        `Adding $+${k}$ outside the floor function is a vertical transformation.`,
        'Every $y$-value increases by $' + k + '$.',
        '<b>Worked example:</b> $\\lfloor x \\rfloor + 2$ shifts every segment 2 units up.'
      ],
      explanation: `Adding $${k}$ to the function shifts the entire staircase vertically upward by $${k}$ units.`
    };
  });

  // 4: Graph of f(x) = [x - h]
  makeStepGraphQ(4, function(seed) {
    const r = seededRandom(seed);
    const h = r.nextInt(1, 4);
    return {
      text: `How is the graph of $g(x) = \\lfloor x - ${h} \\rfloor$ obtained from $f(x) = \\lfloor x \\rfloor$?`,
      options: makeOptions(
        { text: `Shifted horizontally $${h}$ units to the right` },
        [
          { text: `Shifted horizontally $${h}$ units to the left`, why: 'Subtracting inside shifts right: $x - h = 0 \\Rightarrow x = h$.' },
          { text: `Shifted vertically $${h}$ units down`, why: 'The subtraction is inside the floor brackets, so it is a horizontal shift.' },
          { text: `The step width is divided by $${h}$`, why: 'Dilation changes width, not horizontal translation.' }
        ], r),
      hints: [
        `Inside the floor: $x - ${h}$.`,
        'Horizontal translations inside parentheses/brackets move in the opposite direction of the sign.',
        'Minus shifts right.'
      ],
      explanation: `Subtracting $${h}$ inside the floor function translates the graph $${h}$ units to the right.`
    };
  });

  // 5: Step length in f(x) = [2x]
  makeStepGraphQ(5, function(seed) {
    const r = seededRandom(seed);
    const b = r.pick([2, 3, 4]);
    return {
      text: `In the step function $f(x) = \\lfloor ${b}x \\rfloor$, what is the horizontal length of each step?`,
      options: makeOptions(
        { text: `$\\frac{1}{${b}}$ unit` },
        [
          { text: `$${b}$ units`, why: 'Multiplying $x$ by ' + b + ' compresses the steps horizontally by a factor of 1/' + b + '.' },
          { text: `$1$ unit`, why: 'The horizontal length changes from 1 to 1/' + b + '.' },
          { text: `$2$ units`, why: 'Step length is $1/b$.' }
        ], r),
      hints: [
        `For the step at $y = 0$: $0 \\leq ${b}x < 1$.`,
        `Divide by $${b}$: $0 \\leq x < \\frac{1}{${b}}$.`,
        `The length of this interval is $\\frac{1}{${b}} - 0 = \\frac{1}{${b}}$.`
      ],
      explanation: `Each step occurs where $n \\leq ${b}x < n + 1 \\Rightarrow \\frac{n}{${b}} \\leq x < \\frac{n + 1}{${b}}$. The step length is $\\frac{1}{${b}}$ unit.`
    };
  });

  // 6: Step length in f(x) = [x / b]
  makeStepGraphQ(6, function(seed) {
    const r = seededRandom(seed);
    const b = r.pick([2, 3, 4]);
    return {
      text: `What is the horizontal length of each step in the graph of $f(x) = \\left\\lfloor \\frac{x}{${b}} \\right\\rfloor$?`,
      options: makeOptions(
        { text: `$${b}$ units` },
        [
          { text: `$\\frac{1}{${b}}$ unit`, why: 'Dividing $x$ by ' + b + ' horizontally STRETCHES each step by a factor of ' + b + '.' },
          { text: `$1$ unit`, why: 'The step length is multiplied by $' + b + '$.' },
          { text: `$${b + 1}$ units`, why: 'Length is exactly $' + b + '$ units.' }
        ], r),
      hints: [
        `Set $0 \\leq \\frac{x}{${b}} < 1$.`,
        `Multiply all parts by $${b}$: $0 \\leq x < ${b}$.`,
        `Length of the step is $${b} - 0 = ${b}$ units.`
      ],
      explanation: `Dividing by $${b}$ inside horizontally stretches the steps to a length of $${b}$ units.`
    };
  });

  // 7: Value of ceiling function at integer vs non-integer
  makeStepGraphQ(7, function(seed) {
    const r = seededRandom(seed);
    const n = r.nextInt(2, 6);
    return {
      text: `Which statement correctly compares the ceiling function $\\lceil x \\rceil$ and floor function $\\lfloor x \\rfloor$ when $x$ is NOT an integer (e.g. $x = ${n}.3$)?`,
      options: makeOptions(
        { text: `$\\lceil x \\rceil = \\lfloor x \\rfloor + 1$` },
        [
          { text: `$\\lceil x \\rceil = \\lfloor x \\rfloor$`, why: 'They are only equal when $x$ is an integer.' },
          { text: `$\\lceil x \\rceil = \\lfloor x \\rfloor - 1$`, why: 'Ceiling rounds UP to the next integer, so it is 1 greater than floor.' },
          { text: `$\\lceil x \\rceil = -\\lfloor x \\rfloor$`, why: 'Ceiling and floor are not negations of each other.' }
        ], r),
      hints: [
        `Test with $x = ${n}.3$: $\\lfloor ${n}.3 \\rfloor = ${n}$, while $\\lceil ${n}.3 \\rceil = ${n + 1}$.`,
        `Notice: $${n + 1} = ${n} + 1$.`
      ],
      explanation: `For any non-integer $x$, the ceiling function rounds up to the next integer while floor rounds down, so $\\lceil x \\rceil = \\lfloor x \\rfloor + 1$.`
    };
  });

  // 8: Graph description of f(x) = -[x]
  makeStepGraphQ(8, function(seed) {
    const r = seededRandom(seed);
    return {
      text: `What is the effect of the negative sign on the graph of $g(x) = -\\lfloor x \\rfloor$?`,
      options: makeOptions(
        { text: `Reflects the staircase across the $x$-axis, so the steps decrease as $x$ increases` },
        [
          { text: `Reflects the graph across the $y$-axis only`, why: 'The negative sign is outside the function, reflecting across the $x$-axis.' },
          { text: `Swaps open and closed circles on each step`, why: 'The endpoints reflect vertically: $(n, -n)$ is closed and $(n+1, -n)$ is open.' },
          { text: `Shifts the graph 1 unit down`, why: 'A negative coefficient is a reflection, not a translation.' }
        ], r),
      hints: [
        'A negative sign outside the function $y = -f(x)$ reflects across the $x$-axis.',
        'Positive outputs become negative outputs.',
        'Instead of ascending steps, the staircase descends.'
      ],
      explanation: `Multiplying by $-1$ reflects the graph across the $x$-axis, making the steps descend from left to right.`
    };
  });

  // 9: Identify the piecewise definition of [x] on [-1, 2)
  makeStepGraphQ(9, function(seed) {
    const r = seededRandom(seed);
    return {
      text: `Which piecewise definition correctly represents $f(x) = \\lfloor x \\rfloor$ on the interval $[-1, 2)$?`,
      options: makeOptions(
        { text: `$f(x) = \\begin{cases} -1, & -1 \\leq x < 0 \\\\ 0, & 0 \\leq x < 1 \\\\ 1, & 1 \\leq x < 2 \\end{cases}$` },
        [
          { text: `$f(x) = \\begin{cases} -1, & -1 < x \\leq 0 \\\\ 0, & 0 < x \\leq 1 \\\\ 1, & 1 < x \\leq 2 \\end{cases}$`, why: 'The left endpoint must be $\\leq$ and right endpoint $<$.' },
          { text: `$f(x) = \\begin{cases} 0, & -1 \\leq x < 0 \\\\ 1, & 0 \\leq x < 1 \\\\ 2, & 1 \\leq x < 2 \\end{cases}$`, why: 'Outputs are off by 1.' },
          { text: `$f(x) = x$ on all intervals`, why: 'The greatest integer function is piecewise constant, not identity.' }
        ], r),
      hints: [
        'Remember that each step has a closed left endpoint and open right endpoint: $[n, n+1)$.',
        'On $[0, 1)$, $\\lfloor x \\rfloor = 0$. On $[-1, 0)$, $\\lfloor x \\rfloor = -1$.'
      ],
      explanation: `For each interval $[n, n+1)$, $f(x) = n$. Thus on $[-1, 0)$ $f=-1$, on $[0, 1)$ $f=0$, and on $[1, 2)$ $f=1$.`
    };
  });

  // 10: Range of transformed step function: f(x) = 3[x]
  makeStepGraphQ(10, function(seed) {
    const r = seededRandom(seed);
    const a = r.pick([2, 3, 4, 5]);
    return {
      text: `What is the range of $g(x) = ${a}\\lfloor x \\rfloor$?`,
      options: makeOptions(
        { text: `All integer multiples of $${a}$ ($\\{\\dots, -${2 * a}, -${a}, 0, ${a}, ${2 * a}, \\dots\\}$)` },
        [
          { text: `All integers ($\\mathbb{Z}$)`, why: 'Multiplying by ' + a + ' only produces multiples of ' + a + ', not every integer.' },
          { text: `All real numbers ($\\mathbb{R}$)`, why: 'The outputs are discrete values, not continuous.' },
          { text: `Only non-negative multiples of $${a}$`, why: 'Negative integers multiplied by ' + a + ' produce negative outputs.' }
        ], r),
      hints: [
        'The range of $\\lfloor x \\rfloor$ is all integers $\\mathbb{Z}$.',
        `Multiplying every integer by $${a}$ gives the set of all integer multiples of $${a}$.`
      ],
      explanation: `Since $\\lfloor x \\rfloor \\in \\mathbb{Z}$, the range of $${a}\\lfloor x \\rfloor$ is $\\{${a}k \\mid k \\in \\mathbb{Z}\\}$, which is all multiples of $${a}$.`
    };
  });

  // 11: Real-world step function reading from graph
  makeStepGraphQ(11, function(seed) {
    const r = seededRandom(seed);
    const weight = r.pick([15, 25, 45, 75]);
    const ratePer50g = 4;
    const steps = Math.ceil(weight / 50);
    const cost = steps * ratePer50g;
    return {
      text: `Postage at Emirates Post is AED $${ratePer50g}$ for letters up to $50\\text{ g}$, and AED $${ratePer50g}$ for each additional $50\\text{ g}$ or fraction thereof. What is the postage for a letter with mass $${weight}\\text{ g}$?`,
      options: makeOptions(
        { text: `AED $${cost}$` },
        [
          { text: `AED $${cost + ratePer50g}$`, why: 'Overcharged by one step.' },
          { text: `AED $${(weight / 50) * ratePer50g}$`, why: 'Postage is a step function, not a continuous proportional rate.' },
          { text: `AED $${Math.max(ratePer50g, (steps - 1) * ratePer50g)}$`, why: 'The weight exceeds the lower tier.' }
        ], r),
      hints: [
        `$${weight}\\text{ g}$ falls into the range $(0, 50]$ or $(50, 100]$.`,
        `Since $${weight} \\leq ${steps * 50}$, it requires $${steps}$ step(s).`,
        `$${steps} \\times ${ratePer50g} = ${cost}$ AED.`
      ],
      explanation: `A mass of $${weight}\\text{ g}$ requires $${steps}$ tier(s) of $50\\text{ g}$. Cost $= ${steps} \\times ${ratePer50g} = ${cost}$ AED.`
    };
  });

  // 12: Evaluating step function at a boundary integer
  makeStepGraphQ(12, function(seed) {
    const r = seededRandom(seed);
    const n = r.nextInt(1, 5);
    return {
      text: `On the step function graph of $f(x) = \\lfloor x \\rfloor$, what is the value of $f(${n})$?`,
      options: makeOptions(
        { text: `$${n}$` },
        [
          { text: `$${n - 1}$`, why: 'The left circle on the step $y = ' + n + '$ is CLOSED, so $f(' + n + ') = ' + n + '$.' },
          { text: `Undefined`, why: 'The function is defined everywhere on $\\mathbb{R}$.' },
          { text: `$${n + 1}$`, why: 'Floor of an integer equals the integer itself.' }
        ], r),
      hints: [
        'Look at the vertical line $x = ' + n + '$.',
        `It intersects the open circle at $(${n}, ${n - 1})$ and the closed circle at $(${n}, ${n})$.`,
        'The function takes the value at the CLOSED circle.'
      ],
      explanation: `At $x = ${n}$, the closed circle is at $y = ${n}$ and the open circle is at $y = ${n - 1}$. The function value is $f(${n}) = ${n}$.`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 19: Graph absolute value functions (p.277, Lesson 4-7, ex.7–12)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[19] = { tile: 19, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[19].questions;
  function makeAbsGraphQ(idx, genFn) { Q.push({ id: `q19_${idx}`, generate: genFn }); }

  // 1: Find vertex of f(x) = a|x - h| + k
  makeAbsGraphQ(1, function(seed) {
    const r = seededRandom(seed);
    const a = r.pick([2, 3, -1, -2]);
    const h = r.nextInt(1, 6);
    const k = r.nextIntNonZero(-6, 6);
    return {
      text: `What is the vertex of the absolute value function: $$f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}|x - ${h}| ${signStr(k)}$$`,
      options: makeOptions(
        { text: `$(${h}, ${k})$` },
        [
          { text: `$(-${h}, ${k})$`, why: 'In vertex form $a|x - h| + k$, the $x$-coordinate is $+h$, not $-h$.' },
          { text: `$(${h}, -${k})$`, why: 'Sign error on the $y$-coordinate.' },
          { text: `$(${k}, ${h})$`, why: 'Swapped $h$ and $k$.' }
        ], r),
      hints: [
        'Standard vertex form is $f(x) = a|x - h| + k$.',
        `The vertex is $(h, k) = (${h}, ${k})$.`,
        '<b>Worked example:</b> $f(x) = 2|x - 3| + 4$ has vertex $(3, 4)$.'
      ],
      explanation: `In $f(x) = a|x - h| + k$, $h = ${h}$ and $k = ${k}$. The vertex is $(${h}, ${k})$.`
    };
  });

  // 2: Vertex with addition inside: |x + h|
  makeAbsGraphQ(2, function(seed) {
    const r = seededRandom(seed);
    const a = r.pick([1, 2, -1]);
    const h = r.nextInt(1, 6);
    const k = r.nextInt(-5, 5);
    return {
      text: `Identify the vertex of: $$f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}|x + ${h}| ${signStr(k)}$$`,
      options: makeOptions(
        { text: `$(-${h}, ${k})$` },
        [
          { text: `$(${h}, ${k})$`, why: '$|x + ' + h + '| = |x - (-' + h + ')|$, so $h = -' + h + '$.' },
          { text: `$(-${h}, -${k})$`, why: 'Sign error on $k$.' },
          { text: `$(0, ${k})$`, why: 'The horizontal shift is $-' + h + '$, not $0$.' }
        ], r),
      hints: [
        `Set the expression inside the absolute value to 0: $x + ${h} = 0 \\Rightarrow x = -${h}$.`,
        `Substitute $x = -${h}$: $f(-${h}) = ${k}$. Vertex is $(-${h}, ${k})$.`
      ],
      explanation: `$x + ${h} = 0 \\Rightarrow x = -${h}$. The vertex is $(-${h}, ${k})$.`
    };
  });

  // 3: Axis of symmetry
  makeAbsGraphQ(3, function(seed) {
    const r = seededRandom(seed);
    const h = r.nextIntNonZero(-6, 6);
    const k = r.nextInt(-5, 5);
    return {
      text: `What is the equation of the axis of symmetry for $f(x) = |x ${signStr(-h)}| ${signStr(k)}$?`,
      options: makeOptions(
        { text: `$x = ${h}$` },
        [
          { text: `$y = ${k}$`, why: 'The axis of symmetry is a vertical line ($x = c$), not horizontal.' },
          { text: `$x = -${h}$`, why: 'Sign error on the $x$-coordinate of the vertex.' },
          { text: `$x = 0$`, why: 'The graph has been shifted horizontally to $x = ' + h + '$.' }
        ], r),
      hints: [
        'The axis of symmetry is the vertical line passing through the vertex $(h, k)$.',
        `Equation of a vertical line is $x = h$. Here $h = ${h}$.`,
        '<b>Worked example:</b> For vertex $(4, -2)$, axis of symmetry is $x = 4$.'
      ],
      explanation: `The axis of symmetry passes through the vertex $(h, k) = (${h}, ${k})$. Equation is $x = ${h}$.`
    };
  });

  // 4: Direction of opening
  makeAbsGraphQ(4, function(seed) {
    const r = seededRandom(seed);
    const isNegative = r.pick([true, false]);
    const a = isNegative ? -r.nextInt(2, 4) : r.nextInt(2, 4);
    const h = r.nextInt(1, 5), k = r.nextInt(1, 5);
    return {
      text: `Does the graph of $f(x) = ${a}|x - ${h}| + ${k}$ open upward or downward, and does it have a maximum or minimum?`,
      options: makeOptions(
        { text: isNegative ? `Opens downward; has a maximum at $y = ${k}$` : `Opens upward; has a minimum at $y = ${k}$` },
        [
          { text: isNegative ? `Opens upward; has a minimum at $y = ${k}$` : `Opens downward; has a maximum at $y = ${k}$`, why: 'The sign of $a$ determines direction: positive opens UP, negative opens DOWN.' },
          { text: isNegative ? `Opens downward; has a minimum at $y = ${k}$` : `Opens upward; has a maximum at $y = ${k}$`, why: 'A graph opening downward has a MAXIMUM at its vertex, while opening upward has a MINIMUM.' },
          { text: `Opens upward; has no extreme value`, why: 'Every absolute value function has a vertex with a max or min.' }
        ], r),
      hints: [
        `Look at the coefficient $a = ${a}$.`,
        `Since $a ${a > 0 ? '> 0' : '< 0'}$, the V-shape opens ${a > 0 ? 'upward' : 'downward'}.`,
        `${a > 0 ? 'Opening upward means the vertex is the lowest point (minimum).' : 'Opening downward means the vertex is the highest point (maximum).'}`
      ],
      explanation: `Because $a = ${a} ${a > 0 ? '> 0' : '< 0'}$, the graph opens ${a > 0 ? 'upward with a minimum' : 'downward with a maximum'} at the vertex $y = ${k}$.`
    };
  });

  // 5: Slopes of the two branches
  makeAbsGraphQ(5, function(seed) {
    const r = seededRandom(seed);
    const a = r.nextInt(2, 5);
    const h = r.nextInt(1, 4), k = r.nextInt(1, 4);
    return {
      text: `What are the slopes of the two linear branches of $f(x) = ${a}|x - ${h}| + ${k}$?`,
      options: makeOptions(
        { text: `$-${a}$ to the left of the vertex ($x < ${h}$), and $${a}$ to the right ($x > ${h}$)` },
        [
          { text: `$${a}$ on both branches`, why: 'The V-shape requires one branch to fall and the other to rise.' },
          { text: `$\\pm 1$`, why: 'The coefficient $' + a + '$ scales the slopes from $\\pm 1$ to $\\pm ' + a + '$.' },
          { text: `$-\\frac{1}{${a}}$ and $\\frac{1}{${a}}$`, why: 'Slopes are $\\pm a$, not reciprocal.' }
        ], r),
      hints: [
        'An absolute value graph has two symmetric linear rays meeting at the vertex.',
        `To the right ($x > ${h}$), slope is $+${a}$. To the left ($x < ${h}$), slope is $-${a}$.`,
        '<b>Worked example:</b> $3|x - 1|$ has slopes $-3$ and $+3$.'
      ],
      explanation: `For $x > ${h}$, $f(x) = ${a}(x - ${h}) + ${k}$ (slope $m = ${a}$). For $x < ${h}$, $f(x) = -${a}(x - ${h}) + ${k}$ (slope $m = -${a}$).`
    };
  });

  // 6: Find y-intercept: f(0)
  makeAbsGraphQ(6, function(seed) {
    const r = seededRandom(seed);
    const a = r.pick([1, 2, 3]);
    const h = r.nextInt(1, 5);
    const k = r.nextInt(-4, 4);
    const yInt = a * Math.abs(-h) + k;
    return {
      text: `Find the $y$-intercept of $f(x) = ${a === 1 ? '' : a}|x - ${h}| ${signStr(k)}$:`,
      options: makeOptions(
        { text: `$(0, ${yInt})$` },
        [
          { text: `$(0, ${k})$`, why: 'This is the $y$-coordinate of the vertex, not the $y$-intercept where $x = 0$.' },
          { text: `$(0, ${-yInt})$`, why: 'Sign error.' },
          { text: `$(0, ${a * h})$`, why: 'Forgot to add the vertical shift $' + k + '$.' }
        ], r),
      hints: [
        'To find the $y$-intercept, evaluate $f(0)$.',
        `$f(0) = ${a === 1 ? '' : a}|0 - ${h}| ${signStr(k)} = ${a === 1 ? '' : a}(${h}) ${signStr(k)} = ${yInt}$.`
      ],
      explanation: `Set $x = 0$: $f(0) = ${a === 1 ? '' : a}|-${h}| ${signStr(k)} = ${a * h} ${signStr(k)} = ${yInt}$. The $y$-intercept is $(0, ${yInt})$.`
    };
  });

  // 7: Find x-intercepts: f(x) = 0
  makeAbsGraphQ(7, function(seed) {
    const r = seededRandom(seed);
    const h = r.nextInt(2, 6);
    const k = r.nextInt(2, 6);
    // f(x) = |x - h| - k = 0 => |x - h| = k => x = h + k or h - k
    const x1 = h - k, x2 = h + k;
    return {
      text: `Find the $x$-intercepts of $f(x) = |x - ${h}| - ${k}$:`,
      options: makeOptions(
        { text: `$(${x1}, 0)$ and $(${x2}, 0)$` },
        [
          { text: `$(${x2}, 0)$ only`, why: 'There are two $x$-intercepts when the vertex is below the $x$-axis.' },
          { text: `$(${h}, 0)$`, why: 'This is the $x$-coordinate of the vertex, not an intercept.' },
          { text: `No $x$-intercepts`, why: 'The graph opens upward from vertex $(' + h + ', -' + k + ')$ below the $x$-axis, so it crosses twice.' }
        ], r),
      hints: [
        `Set $f(x) = 0$: $|x - ${h}| - ${k} = 0 \\Rightarrow |x - ${h}| = ${k}$.`,
        `Split into two cases: $x - ${h} = ${k}$ or $x - ${h} = -${k}$.`,
        `$x = ${x2}$ and $x = ${x1}$.`
      ],
      explanation: `$|x - ${h}| = ${k} \\Rightarrow x - ${h} = ${k} \\Rightarrow x = ${x2}$, or $x - ${h} = -${k} \\Rightarrow x = ${x1}$. Intercepts: $(${x1}, 0)$ and $(${x2}, 0)$.`
    };
  });

  // 8: No x-intercepts case
  makeAbsGraphQ(8, function(seed) {
    const r = seededRandom(seed);
    const h = r.nextInt(1, 5);
    const k = r.nextInt(2, 6);
    return {
      text: `How many $x$-intercepts does $f(x) = |x - ${h}| + ${k}$ have?`,
      options: makeOptions(
        { text: `None ($0$ intercepts)` },
        [
          { text: `$1$ intercept`, why: 'An absolute value graph only has 1 intercept if the vertex lies directly ON the $x$-axis ($k = 0$).' },
          { text: `$2$ intercepts`, why: 'The vertex is at $(' + h + ', ' + k + ')$ above the $x$-axis and opens UPWARD, so it never crosses $y = 0$.' },
          { text: `Infinitely many`, why: 'A non-constant function cannot have infinitely many roots.' }
        ], r),
      hints: [
        `Find the vertex: $(${h}, ${k})$.`,
        `Since $k = ${k} > 0$ and the graph opens upward ($a = 1 > 0$), the entire graph lies above the $x$-axis.`,
        'Therefore, it never intersects the $x$-axis.'
      ],
      explanation: `Vertex is at $(${h}, ${k})$. Since the minimum value is $${k} > 0$ and the function opens upward, it never touches $y = 0$. There are <b>0</b> $x$-intercepts.`
    };
  });

  // 9: Range of absolute value function opening down
  makeAbsGraphQ(9, function(seed) {
    const r = seededRandom(seed);
    const h = r.nextInt(1, 5);
    const k = r.nextInt(-4, 6);
    return {
      text: `What is the range of $f(x) = -|x - ${h}| ${signStr(k)}$?`,
      options: makeOptions(
        { text: `$\\{y \\mid y \\leq ${k}\\}$` },
        [
          { text: `$\\{y \\mid y \\geq ${k}\\}$`, why: 'The graph opens downward, so $y$ is LESS than or equal to the vertex maximum.' },
          { text: `All real numbers`, why: 'Absolute value functions have a restricted range bounded by the vertex.' },
          { text: `$\\{y \\mid y \\leq -${k}\\}$`, why: 'The vertex $y$-coordinate is $' + k + '$, not $-' + k + '$.' }
        ], r),
      hints: [
        `Vertex is at $(${h}, ${k})$.`,
        'Because of the negative sign outside, the graph opens downward.',
        `The maximum value is $y = ${k}$, so $y \\leq ${k}$.`
      ],
      explanation: `Maximum occurs at the vertex $y = ${k}$. Opening downward means all outputs are $\\leq ${k}$. Range: $\\{y \\mid y \\leq ${k}\\}$.`
    };
  });

  // 10: Identify equation from vertex and point
  makeAbsGraphQ(10, function(seed) {
    const r = seededRandom(seed);
    const h = r.nextInt(1, 4), k = r.nextInt(1, 4);
    return {
      text: `An absolute value function has vertex $(${h}, ${k})$, opens upward, and passes through $(${h + 1}, ${k + 2})$. What is its equation?`,
      options: makeOptions(
        { text: `$f(x) = 2|x - ${h}| + ${k}$` },
        [
          { text: `$f(x) = |x - ${h}| + ${k}$`, why: 'For $a = 1$, when $x = ' + (h + 1) + '$, $y = ' + (k + 1) + ' \\neq ' + (k + 2) + '$. The slope is 2.' },
          { text: `$f(x) = 2|x + ${h}| + ${k}$`, why: 'Vertex at $(' + h + ', ' + k + ')$ requires $|x - ' + h + '|$.' },
          { text: `$f(x) = -2|x - ${h}| + ${k}$`, why: 'The graph opens upward, so $a$ must be positive.' }
        ], r),
      hints: [
        `Vertex form: $f(x) = a|x - ${h}| + ${k}$.`,
        `Substitute point $(${h + 1}, ${k + 2})$: $${k + 2} = a|${h + 1} - ${h}| + ${k} \\Rightarrow ${k + 2} = a(1) + ${k} \\Rightarrow a = 2$.`
      ],
      explanation: `Using $(h, k) = (${h}, ${k})$: $f(x) = a|x - ${h}| + ${k}$. At $x = ${h + 1}$, $y = a(1) + ${k} = ${k + 2} \\Rightarrow a = 2$.`
    };
  });

  // 11: Width comparison (vertical stretch / compression)
  makeAbsGraphQ(11, function(seed) {
    const r = seededRandom(seed);
    return {
      text: `Which function produces an absolute value graph that is wider (less steep) than the parent graph $f(x) = |x|$?`,
      options: makeOptions(
        { text: `$g(x) = \\frac{1}{3}|x|$` },
        [
          { text: `$g(x) = 3|x|$`, why: '$a = 3 > 1$ vertically stretches the graph, making it NARROWER (steeper).' },
          { text: `$g(x) = |x - 3|$`, why: 'A horizontal shift does not change the width of the graph.' },
          { text: `$g(x) = |x| + 3$`, why: 'A vertical shift does not change width.' }
        ], r),
      hints: [
        'A graph is wider when $|a| < 1$ (vertical compression / flatter slopes).',
        'A graph is narrower when $|a| > 1$ (vertical stretch / steeper slopes).',
        '$\\frac{1}{3} < 1$, so the branches rise more slowly, widening the V-shape.'
      ],
      explanation: `When $0 < |a| < 1$, the function is vertically compressed, making the branches less steep and the V-shape wider. Here $a = \\frac{1}{3}$.`
    };
  });

  // 12: Real-world reflection path model (light bounce)
  makeAbsGraphQ(12, function(seed) {
    const r = seededRandom(seed);
    const bounceX = r.nextInt(3, 7);
    return {
      text: `A beam of light reflects off a flat surface at point $(${bounceX}, 0)$. Its path forms a V-shape opening upward with slope $\\pm 1$. What equation models the path of the light beam?`,
      options: makeOptions(
        { text: `$y = |x - ${bounceX}|$` },
        [
          { text: `$y = |x + ${bounceX}|$`, why: 'Bounce point at $x = ' + bounceX + '$ requires $|x - ' + bounceX + '| = 0$.' },
          { text: `$y = -|x - ${bounceX}|$`, why: 'The beam travels above the surface ($y \\geq 0$), so it opens upward.' },
          { text: `$y = |x| - ${bounceX}$`, why: 'This has vertex at $(0, -' + bounceX + ')$, not $(' + bounceX + ', 0)$.' }
        ], r),
      hints: [
        `The vertex of the bounce is on the surface at $(${bounceX}, 0)$.`,
        `In vertex form with $a = 1$: $y = |x - ${bounceX}| + 0$.`
      ],
      explanation: `The vertex is $(h, k) = (${bounceX}, 0)$ and opens upward. The equation is $y = |x - ${bounceX}|$.`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 20: Slope-intercept form given slope and one point (p.293, Lesson 5-1, ex.33–42)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[20] = { tile: 20, type: 'mcq', questions: [] };
(function() {
  const Q = QUESTION_BANK[20].questions;
  function makeSIFromPtQ(idx, genFn) { Q.push({ id: `q20_${idx}`, generate: genFn }); }

  // 1: Given slope and positive point
  makeSIFromPtQ(1, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 5);
    const x1 = r.nextInt(1, 4), y1 = r.nextInt(1, 8);
    const b = y1 - m * x1;
    return {
      text: `Write an equation in slope-intercept form ($y = mx + b$) for the line that has slope $m = ${m}$ and passes through $(${x1}, ${y1})$.`,
      options: makeOptions(
        { text: `$y = ${m}x ${signStr(b)}$` },
        [
          { text: `$y = ${m}x ${signStr(y1 + m * x1)}$`, why: 'Sign error when solving for $b$: $b = y_1 - m x_1$, not $y_1 + m x_1$.' },
          { text: `$y = ${m}x ${signStr(y1)}$`, why: 'Used the given $y$-coordinate as the $y$-intercept instead of calculating $b$.' },
          { text: `$y = -${m}x ${signStr(b)}$`, why: 'Changed the sign of the slope.' }
        ], r),
      hints: [
        `Use $y = mx + b$. Substitute $m = ${m}$, $x = ${x1}$, and $y = ${y1}$.`,
        `$${y1} = ${m}(${x1}) + b \\Rightarrow b = ${y1} - ${m * x1} = ${b}$.`,
        '<b>Worked example:</b> $m = 3$, $(2, 7)$ → $7 = 3(2) + b \\Rightarrow 7 = 6 + b \\Rightarrow b = 1$. Equation: $y = 3x + 1$.'
      ],
      explanation: `$${y1} = ${m}(${x1}) + b \\Rightarrow b = ${b}$. Equation is $y = ${m}x ${signStr(b)}$.`
    };
  });

  // 2: Given negative slope and point
  makeSIFromPtQ(2, function(seed) {
    const r = seededRandom(seed);
    const m = -r.nextInt(2, 4);
    const x1 = r.nextInt(1, 4), y1 = r.nextInt(2, 6);
    const b = y1 - m * x1;
    return {
      text: `Find the slope-intercept equation of the line with slope $m = ${m}$ containing $(${x1}, ${y1})$:`,
      options: makeOptions(
        { text: `$y = ${m}x ${signStr(b)}$` },
        [
          { text: `$y = ${m}x ${signStr(y1 - Math.abs(m) * x1)}$`, why: 'Watch signs: subtracting a negative adds, so $b = y_1 - (-' + Math.abs(m) + ')x_1 = y_1 + ' + (Math.abs(m) * x1) + '$.' },
          { text: `$y = ${Math.abs(m)}x ${signStr(b)}$`, why: 'Forgot negative sign on slope.' },
          { text: `$y = ${m}x - ${x1}$`, why: 'Incorrect calculation of intercept.' }
        ], r),
      hints: [
        `Substitute into $y = mx + b$: $${y1} = (${m})(${x1}) + b$.`,
        `$${y1} = ${m * x1} + b \\Rightarrow b = ${y1} - (${m * x1}) = ${b}$.`
      ],
      explanation: `$${y1} = ${m}(${x1}) + b \\Rightarrow b = ${y1} - (${m * x1}) = ${b}$. Equation: $y = ${m}x ${signStr(b)}$.`
    };
  });

  // 3: Given fraction slope
  makeSIFromPtQ(3, function(seed) {
    const r = seededRandom(seed);
    const den = r.pick([2, 3, 4]);
    const x1 = den * r.nextInt(1, 3);
    const y1 = r.nextInt(1, 6);
    const b = y1 - (1 / den) * x1;
    return {
      text: `Write an equation in slope-intercept form for the line with slope $m = \\frac{1}{${den}}$ passing through $(${x1}, ${y1})$.`,
      options: makeOptions(
        { text: `$y = \\frac{1}{${den}}x ${signStr(b)}$` },
        [
          { text: `$y = ${den}x ${signStr(b)}$`, why: 'Inverted the slope.' },
          { text: `$y = \\frac{1}{${den}}x ${signStr(y1)}$`, why: 'Did not calculate $b = y_1 - m x_1$.' },
          { text: `$y = -\\frac{1}{${den}}x ${signStr(b)}$`, why: 'Slope is positive.' }
        ], r),
      hints: [
        `Substitute: $${y1} = \\frac{1}{${den}}(${x1}) + b$.`,
        `$\\frac{1}{${den}}(${x1}) = ${x1 / den}$.`,
        `$b = ${y1} - ${x1 / den} = ${b}$.`
      ],
      explanation: `$b = ${y1} - \\frac{1}{${den}}(${x1}) = ${b}$. Equation: $y = \\frac{1}{${den}}x ${signStr(b)}$.`
    };
  });

  // 4: Slope found from two points first
  makeSIFromPtQ(4, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 4);
    const x1 = r.nextInt(1, 3), y1 = r.nextInt(1, 4);
    const dx = 2;
    const x2 = x1 + dx, y2 = y1 + m * dx;
    const b = y1 - m * x1;
    return {
      text: `Find the slope-intercept form of the line passing through the two points $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`,
      options: makeOptions(
        { text: `$y = ${m}x ${signStr(b)}$` },
        [
          { text: `$y = ${m}x ${signStr(y1)}$`, why: 'Did not solve for $b$.' },
          { text: `$y = -${m}x ${signStr(b)}$`, why: 'Slope is positive.' },
          { text: `$y = \\frac{1}{${m}}x ${signStr(b)}$`, why: 'Inverted the slope.' }
        ], r),
      hints: [
        `Step 1: Find slope $m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = \\frac{${y2 - y1}}{${dx}} = ${m}$.`,
        `Step 2: Find $b$ using $(${x1}, ${y1})$: $${y1} = ${m}(${x1}) + b \\Rightarrow b = ${b}$.`,
        '<b>Worked example:</b> $(1, 3)$ and $(3, 7)$ → $m = 2$ → $3 = 2(1) + b \\Rightarrow b = 1 \\Rightarrow y = 2x + 1$.'
      ],
      explanation: `Slope $m = ${m}$. $b = ${y1} - ${m}(${x1}) = ${b}$. Equation: $y = ${m}x ${signStr(b)}$.`
    };
  });

  // 5: Slope 0 (horizontal line)
  makeSIFromPtQ(5, function(seed) {
    const r = seededRandom(seed);
    const x1 = r.nextInt(-5, 5);
    const y1 = r.nextInt(-6, 6);
    return {
      text: `Write the slope-intercept equation for the line with slope $m = 0$ passing through $(${x1}, ${y1})$:`,
      options: makeOptions(
        { text: `$y = ${y1}$` },
        [
          { text: `$x = ${x1}$`, why: '$x = c$ is a vertical line with undefined slope, not slope 0.' },
          { text: `$y = 0x + ${x1}$`, why: 'The constant is the $y$-value ($' + y1 + '$), not the $x$-value.' },
          { text: `$y = x ${signStr(y1)}$`, why: 'Slope is 0, not 1.' }
        ], r),
      hints: [
        `$y = mx + b \\Rightarrow y = 0(x) + b \\Rightarrow y = b$.`,
        `Since the line passes through $(${x1}, ${y1})$, $b = ${y1}$.`
      ],
      explanation: `With $m = 0$, $y = 0x + ${y1} = ${y1}$.`
    };
  });

  // 6: Point with negative coordinates
  makeSIFromPtQ(6, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 4);
    const x1 = -r.nextInt(2, 5);
    const y1 = -r.nextInt(2, 5);
    const b = y1 - m * x1;
    return {
      text: `Find the equation in slope-intercept form for the line with slope $m = ${m}$ through $(${x1}, ${y1})$:`,
      options: makeOptions(
        { text: `$y = ${m}x ${signStr(b)}$` },
        [
          { text: `$y = ${m}x ${signStr(y1 - m * Math.abs(x1))}$`, why: 'Watch signs when multiplying by negative $x_1$: $m \\cdot (' + x1 + ') = ' + (m * x1) + '$.' },
          { text: `$y = -${m}x ${signStr(b)}$`, why: 'Slope is positive.' },
          { text: `$y = ${m}x ${signStr(y1)}$`, why: 'Forgot to solve for $b$.' }
        ], r),
      hints: [
        `Substitute: $${y1} = ${m}(${x1}) + b$.`,
        `$${y1} = ${m * x1} + b \\Rightarrow b = ${y1} - (${m * x1}) = ${b}$.`
      ],
      explanation: `$b = ${y1} - (${m})(${x1}) = ${y1} - (${m * x1}) = ${b}$. Equation: $y = ${m}x ${signStr(b)}$.`
    };
  });

  // 7: Slope 1 or -1
  makeSIFromPtQ(7, function(seed) {
    const r = seededRandom(seed);
    const sign = r.pick([1, -1]);
    const x1 = r.nextInt(2, 6);
    const y1 = r.nextInt(1, 8);
    const b = y1 - sign * x1;
    const slopeStr = sign === 1 ? 'x' : '-x';
    return {
      text: `Write in slope-intercept form: slope $m = ${sign}$, passing through $(${x1}, ${y1})$.`,
      options: makeOptions(
        { text: `$y = ${slopeStr} ${signStr(b)}$` },
        [
          { text: `$y = ${sign === 1 ? '-x' : 'x'} ${signStr(b)}$`, why: 'Sign error on the slope.' },
          { text: `$y = ${slopeStr} ${signStr(y1)}$`, why: 'Used $y_1$ directly without computing $b$.' },
          { text: `$y = ${slopeStr} ${signStr(-b)}$`, why: 'Sign error on the intercept.' }
        ], r),
      hints: [
        `$b = y_1 - m x_1 = ${y1} - (${sign})(${x1}) = ${b}$.`,
        `Equation: $y = ${slopeStr} ${signStr(b)}$.`
      ],
      explanation: `$b = ${y1} - (${sign})(${x1}) = ${b}$. Equation: $y = ${slopeStr} ${signStr(b)}$.`
    };
  });

  // 8: Two points with negative coordinates
  makeSIFromPtQ(8, function(seed) {
    const r = seededRandom(seed);
    const m = -r.nextInt(1, 3);
    const x1 = -r.nextInt(3, 6), y1 = r.nextInt(1, 5);
    const dx = 2;
    const x2 = x1 + dx, y2 = y1 + m * dx;
    const b = y1 - m * x1;
    return {
      text: `What is the slope-intercept equation for the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$?`,
      options: makeOptions(
        { text: `$y = ${m}x ${signStr(b)}$` },
        [
          { text: `$y = ${Math.abs(m)}x ${signStr(b)}$`, why: 'Slope is negative because $y$ decreases.' },
          { text: `$y = ${m}x ${signStr(y1)}$`, why: 'Did not compute $b$.' },
          { text: `$y = -\\frac{1}{${Math.abs(m)}}x ${signStr(b)}$`, why: 'Inverted the slope.' }
        ], r),
      hints: [
        `$m = \\frac{${y2} - ${y1}}{${x2} - (${x1})} = ${m}$.`,
        `$b = ${y1} - (${m})(${x1}) = ${b}$.`
      ],
      explanation: `Slope $m = ${m}$. $b = ${y1} - (${m})(${x1}) = ${b}$. Equation: $y = ${m}x ${signStr(b)}$.`
    };
  });

  // 9: Real-world taxi fee model
  makeSIFromPtQ(9, function(seed) {
    const r = seededRandom(seed);
    const rate = r.pick([2, 3]);
    const km = 10;
    const totalCost = r.pick([35, 42, 50]);
    const baseFee = totalCost - rate * km;
    return {
      text: `A taxi ride in Dubai costs AED $${rate}$ per kilometer ($m = ${rate}$). A passenger took a $${km}\\text{-km}$ trip and paid a total of AED $${totalCost}$. Write a slope-intercept equation relating total cost $y$ to distance $x$:`,
      options: makeOptions(
        { text: `$y = ${rate}x + ${baseFee}$` },
        [
          { text: `$y = ${rate}x + ${totalCost}$`, why: 'AED ' + totalCost + ' is the total for ' + km + ' km, not the starting base fee.' },
          { text: `$y = ${baseFee}x + ${rate}$`, why: 'Swapped rate and base fee.' },
          { text: `$y = ${rate}x - ${baseFee}$`, why: 'The base fee adds to the cost, not subtracts.' }
        ], r),
      hints: [
        `Slope is rate $= ${rate}$. The point is $(km, cost) = (${km}, ${totalCost})$.`,
        `$${totalCost} = ${rate}(${km}) + b \\Rightarrow b = ${totalCost} - ${rate * km} = ${baseFee}$.`
      ],
      explanation: `Base fee $b = ${totalCost} - ${rate}(${km}) = ${baseFee}$. Equation: $y = ${rate}x + ${baseFee}$.`
    };
  });

  // 10: Point is y-intercept directly: (0, b)
  makeSIFromPtQ(10, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 6);
    const b = r.nextIntNonZero(-8, 8);
    return {
      text: `Write the slope-intercept form of the line with slope $m = ${m}$ that passes through $(0, ${b})$:`,
      options: makeOptions(
        { text: `$y = ${m}x ${signStr(b)}$` },
        [
          { text: `$y = ${m}x$`, why: 'The $y$-intercept is ' + b + ', not 0.' },
          { text: `$y = ${b}x + ${m}$`, why: 'Swapped slope and $y$-intercept.' },
          { text: `$y = -${m}x ${signStr(b)}$`, why: 'Slope is positive.' }
        ], r),
      hints: [
        'Notice that the $x$-coordinate is $0$.',
        'By definition, any point $(0, b)$ directly gives the $y$-intercept $b$!',
        `No calculation needed: $b = ${b}$.`
      ],
      explanation: `Since the point is $(0, ${b})$, the $y$-intercept is directly $b = ${b}$. Equation is $y = ${m}x ${signStr(b)}$.`
    };
  });

  // 11: Real-world plant growth model
  makeSIFromPtQ(11, function(seed) {
    const r = seededRandom(seed);
    const growthPerWk = r.pick([2, 3, 4]);
    const weeks = 3;
    const currentHeight = r.pick([18, 22, 26]);
    const initHeight = currentHeight - growthPerWk * weeks;
    return {
      text: `A desert plant grows at a constant rate of $${growthPerWk}\\text{ cm}$ per week ($m = ${growthPerWk}$). After $${weeks}$ weeks, its height is $${currentHeight}\\text{ cm}$. Which equation gives the height $H$ after $w$ weeks?`,
      options: makeOptions(
        { text: `$H = ${growthPerWk}w + ${initHeight}$` },
        [
          { text: `$H = ${growthPerWk}w + ${currentHeight}$`, why: 'The initial height at $w=0$ is $' + initHeight + '$, not $' + currentHeight + '$.' },
          { text: `$H = ${initHeight}w + ${growthPerWk}$`, why: 'Growth rate is the slope on $w$.' },
          { text: `$H = -${growthPerWk}w + ${initHeight}$`, why: 'The plant grows taller, so rate is positive.' }
        ], r),
      hints: [
        `Slope is $m = ${growthPerWk}$. The point is $(w, H) = (${weeks}, ${currentHeight})$.`,
        `$${currentHeight} = ${growthPerWk}(${weeks}) + b \\Rightarrow b = ${initHeight}$.`
      ],
      explanation: `Initial height $b = ${currentHeight} - ${growthPerWk}(${weeks}) = ${initHeight}\\text{ cm}$. Equation: $H = ${growthPerWk}w + ${initHeight}$.`
    };
  });

  // 12: Identify which line matches given slope and point
  makeSIFromPtQ(12, function(seed) {
    const r = seededRandom(seed);
    const m = r.nextInt(2, 4);
    const x1 = 2;
    const y1 = r.nextInt(3, 8);
    const b = y1 - m * x1;
    return {
      text: `Which equation has slope $m = ${m}$ and contains the point $(2, ${y1})$?`,
      options: makeOptions(
        { text: `$y = ${m}x ${signStr(b)}$` },
        [
          { text: `$y = ${m}x ${signStr(b + 2)}$`, why: 'Does not contain $(2, ' + y1 + ')$: ' + m + '(2) + ' + (b + 2) + ' = ' + (y1 + 2) + ' != ' + y1 + '.' },
          { text: `$y = ${m + 1}x ${signStr(b)}$`, why: 'Slope must be ' + m + '.' },
          { text: `$y = -${m}x ${signStr(b)}$`, why: 'Slope sign is incorrect.' }
        ], r),
      hints: [
        `Plug in $x = 2$: $y = ${m}(2) + b = ${2 * m} + b$.`,
        `Set equal to $${y1}$: $b = ${y1} - ${2 * m} = ${b}$.`
      ],
      explanation: `Check $x = 2$: $y = ${m}(2) ${signStr(b)} = ${2 * m + b} = ${y1}$. Matches the given point.`
    };
  });
})();

// ═══════════════════════════════════════════════════════════
// TILE 21: FRQ - Compound "and" inequalities & Distributive Property
// p.363, Lesson 6-3 & p.97, Lesson 2-4
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[21] = { tile: 21, type: 'frq', questions: [] };
(function() {
  const Q = QUESTION_BANK[21].questions;

  // Q21 template generator
  for (let idx = 1; idx <= 5; idx++) {
    Q.push({
      id: `q21_${idx}`,
      generate(seed) {
        const r = seededRandom(seed + idx * 13);
        // Part (a): Compound inequality: leftBound <= ax + b < rightBound
        const a = r.pick([2, 3]);
        const b = r.nextIntNonZero(-5, 5);
        const low = -r.nextInt(2, 5);
        const high = r.nextInt(2, 5);
        const leftBound = a * low + b;
        const rightBound = a * high + b;

        // Part (b): Distributive equation: c(x + d) + e = f(x + g)
        const c = r.pick([2, 3, 4]);
        const f = c - 1; // ensures unique solution: cx - fx = x
        const ansB = r.nextInt(-4, 6);
        const d = r.nextInt(1, 4);
        const g = r.nextInt(1, 4);
        const e = f * (ansB + g) - c * (ansB + d);

        const solA_str = `${low} <= x < ${high}`;
        const solA_display = `$${low} \\leq x < ${high}$`;

        return {
          hasNumberLine: true,
          numberLineConfig: { min: low - 2, max: high + 2, p1: low, p1Type: 'closed', p2: high, p2Type: 'open', shadeBetween: true },
          text: `<b>Part (a) [2.5 points]:</b><br>
Solve the compound inequality and describe its graph on a number line:
$$${leftBound} \\leq ${a}x ${signStr(b)} < ${rightBound}$$
<br>
<b>Part (b) [2.5 points]:</b><br>
Solve the equation using the Distributive Property:
$$${c}(x ${signStr(d)}) ${signStr(e)} = ${f === 1 ? '' : f}(x ${signStr(g)})$$`,
          fields: [
            {
              label: 'Part (a) — Lower bound of $x$ (the number on the left):',
              placeholder: 'e.g. -2',
              correct: low,
              accept: [`${low}`, `x >= ${low}`, `${low} <= x`],
              correctDisplay: `${low}`,
              points: 1
            },
            {
              label: 'Part (a) — Upper bound of $x$ (the number on the right):',
              placeholder: 'e.g. 3',
              correct: high,
              accept: [`${high}`, `x < ${high}`],
              correctDisplay: `${high}`,
              points: 1
            },
            {
              label: 'Part (a) — Graph description (open/closed endpoints):',
              placeholder: 'e.g. closed at -2, open at 3',
              correct: 'closed at ' + low + ', open at ' + high,
              accept: [
                `closed at ${low}, open at ${high}`,
                `closed ${low}, open ${high}`,
                `[${low}, ${high})`,
                `closed circle at ${low}, open circle at ${high}`
              ],
              correctDisplay: `Closed circle at ${low}, open circle at ${high}, shaded between`,
              points: 0.5
            },
            {
              label: 'Part (b) — Solution for $x$:',
              placeholder: 'e.g. 4 or x = 4',
              correct: ansB,
              accept: [`${ansB}`, `x = ${ansB}`, `x=${ansB}`],
              correctDisplay: `x = ${ansB}`,
              points: 2.5
            }
          ],
          totalPoints: 5,
          rubric: [
            { field: 0, points: 1, desc: 'Correct lower bound from isolating variable' },
            { field: 1, points: 1, desc: 'Correct upper bound from isolating variable' },
            { field: 2, points: 0.5, desc: 'Correct endpoint types (closed on <=, open on <)' },
            { field: 3, points: 2.5, desc: 'Correct distribution and solution for Part (b)' }
          ],
          hints: [
            `For Part (a), subtract $${b}$ from all three parts, then divide all parts by $${a}$.`,
            `For Part (b), distribute $${c}$ on the left and $${f === 1 ? '' : f}$ on the right, combine like terms, and isolate $x$.`,
            `<b>Worked example:</b><br>
Part (a): $-5 \\leq 2x + 1 < 7$ → Subtract 1: $-6 \\leq 2x < 6$ → Divide by 2: $-3 \\leq x < 3$.<br>
Graph: closed circle at $-3$, open circle at $3$, shaded between.<br>
Part (b): $3(x + 2) - 4 = 2(x + 5)$ → $3x + 6 - 4 = 2x + 10$ → $3x + 2 = 2x + 10$ → $x = 8$.`
          ],
          modelSolution: `<b>Part (a) Solution:</b><br>
$$${leftBound} \\leq ${a}x ${signStr(b)} < ${rightBound}$$
Subtract $${b}$ from all three parts:<br>
$$${leftBound - b} \\leq ${a}x < ${rightBound - b}$$
Divide all three parts by $${a}$:<br>
$$${low} \\leq x < ${high}$$
<b>Graph:</b> Closed circle at $x = ${low}$, open circle at $x = ${high}$, with the segment between them shaded.<br><br>
<b>Part (b) Solution:</b><br>
$$${c}(x ${signStr(d)}) ${signStr(e)} = ${f === 1 ? '' : f}(x ${signStr(g)})$$
Apply the Distributive Property:<br>
$$${c}x ${signStr(c * d)} ${signStr(e)} = ${f === 1 ? '' : f}x ${signStr(f * g)}$$
Combine like terms on the left side:<br>
$$${c}x ${signStr(c * d + e)} = ${f === 1 ? '' : f}x ${signStr(f * g)}$$
Subtract $${f === 1 ? '' : f}x$ from both sides:<br>
$$x ${signStr(c * d + e)} = ${f * g}$$
Subtract $${c * d + e}$ from both sides:<br>
$$x = ${ansB}$$`,
          explanation: `Part (a) yields $${low} \\leq x < ${high}$ with closed circle at $${low}$ and open at $${high}$. Part (b) gives $x = ${ansB}$ after distributing and isolating $x$.`
        };
      }
    });
  }
})();

// ═══════════════════════════════════════════════════════════
// TILE 22: FRQ - Graph linear functions using x- and y-intercepts (p.216, Lesson 4-1, ex.9–14)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[22] = { tile: 22, type: 'frq', questions: [] };
(function() {
  const Q = QUESTION_BANK[22].questions;

  for (let idx = 1; idx <= 5; idx++) {
    Q.push({
      id: `q22_${idx}`,
      generate(seed) {
        const r = seededRandom(seed + idx * 17);
        const a = r.pick([2, 3, 4]);
        const b = r.pick([2, 3, 5]);
        const xInt = r.nextIntNonZero(-4, 4);
        const yInt = r.nextIntNonZero(-4, 4);
        const c = a * xInt; // ensure integer x-intercept
        // Adjust b so yInt is clean integer: a*x + b*y = c => yInt = c / b
        // Better: pick intercepts first!
        const x0 = r.nextIntNonZero(-5, 5);
        const y0 = r.nextIntNonZero(-5, 5);
        const A = Math.abs(y0);
        const B = (x0 * y0 < 0) ? Math.abs(x0) : -Math.abs(x0);
        // A*x + B*y = A*x0
        const C = A * x0;
        // Check: x-int is C/A = x0. y-int is C/B = A*x0 / B = y0. Perfect!
        // Slope m = -A/B = y0 / (-x0) = -y0 / x0
        const slopeFrac = fmtFrac(-y0, x0);

        return {
          hasCoordGrid: true,
          coordConfig: { p1: [x0, 0], p2: [0, y0], line: true },
          text: `Given the linear equation in standard form:
$$${termStr(A, 'x')} ${addTermStr(B, 'y')} = ${C}$$
<b>Task:</b><br>
Find the $x$-intercept and $y$-intercept, calculate the slope of the line, and plot the line on the coordinate grid.`,
          fields: [
            {
              label: 'Step 1 [1.5 points] — Find the $x$-intercept (set $y = 0$):',
              placeholder: `e.g. ${x0} or (${x0}, 0)`,
              correct: x0,
              accept: [`${x0}`, `(${x0},0)`, `(${x0}, 0)`, `x=${x0}`, `x = ${x0}`],
              correctDisplay: `(${x0}, 0) or x = ${x0}`,
              points: 1.5
            },
            {
              label: 'Step 2 [1.5 points] — Find the $y$-intercept (set $x = 0$):',
              placeholder: `e.g. ${y0} or (0, ${y0})`,
              correct: y0,
              accept: [`${y0}`, `(0,${y0})`, `(0, ${y0})`, `y=${y0}`, `y = ${y0}`],
              correctDisplay: `(0, ${y0}) or y = ${y0}`,
              points: 1.5
            },
            {
              label: 'Step 3 [1.0 point] — Slope of the line ($m = \\frac{y_2 - y_1}{x_2 - x_1}$):',
              placeholder: 'e.g. -2 or 3/4',
              correct: (-y0 / x0),
              accept: [
                `${slopeFrac}`,
                `${-y0 / x0}`,
                fmtFrac(-y0, x0).replace('\\frac{', '').replace('}{', '/').replace('}', '')
              ],
              correctDisplay: `m = ${slopeFrac}`,
              points: 1.0
            },
            {
              label: 'Step 4 [1.0 point] — Slope-intercept form ($y = mx + b$):',
              placeholder: `e.g. y = ${slopeFrac}x ${signStr(y0)}`,
              correct: `y = ${slopeFrac}x ${signStr(y0)}`,
              accept: [
                `y=${slopeFrac}x${signStr(y0)}`.replace(/\s+/g, ''),
                `y=${-y0/x0}x${signStr(y0)}`.replace(/\s+/g, '')
              ],
              correctDisplay: `y = ${slopeFrac}x ${signStr(y0)}`,
              points: 1.0
            }
          ],
          totalPoints: 5,
          rubric: [
            { field: 0, points: 1.5, desc: 'Correct substitution of y = 0 to find x-intercept' },
            { field: 1, points: 1.5, desc: 'Correct substitution of x = 0 to find y-intercept' },
            { field: 2, points: 1.0, desc: 'Correct slope calculation between intercepts' },
            { field: 3, points: 1.0, desc: 'Correct slope-intercept equation' }
          ],
          hints: [
            'To find the $x$-intercept, substitute $y = 0$ and solve for $x$.',
            'To find the $y$-intercept, substitute $x = 0$ and solve for $y$.',
            `<b>Worked example:</b> $2x + 3y = 12$<br>
$x$-intercept: $2x + 3(0) = 12 \\Rightarrow 2x = 12 \\Rightarrow x = 6 \\rightarrow (6, 0)$.<br>
$y$-intercept: $2(0) + 3y = 12 \\Rightarrow 3y = 12 \\Rightarrow y = 4 \\rightarrow (0, 4)$.<br>
Slope: $m = \\frac{4 - 0}{0 - 6} = -\\frac{2}{3}$. Equation: $y = -\\frac{2}{3}x + 4$.`
          ],
          modelSolution: `<b>Step 1: Find the $x$-intercept</b><br>
Set $y = 0$:<br>
$$${termStr(A, 'x')} ${addTermStr(B, '(0)')} = ${C}$$
$$${termStr(A, 'x')} = ${C} \\Rightarrow x = \\frac{${C}}{${A}} = ${x0}$$
The $x$-intercept is $(${x0}, 0)$.<br><br>
<b>Step 2: Find the $y$-intercept</b><br>
Set $x = 0$:<br>
$$${termStr(A, '(0)')} ${addTermStr(B, 'y')} = ${C}$$
$$${termStr(B, 'y')} = ${C} \\Rightarrow y = \\frac{${C}}{${B}} = ${y0}$$
The $y$-intercept is $(0, ${y0})$.<br><br>
<b>Step 3: Calculate the slope</b><br>
$$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{${y0} - 0}{0 - (${x0})} = \\frac{${y0}}{-${x0}} = ${slopeFrac}$$<br>
<b>Step 4: Slope-intercept form</b><br>
Using $m = ${slopeFrac}$ and $b = ${y0}$:<br>
$$y = ${slopeFrac}x ${signStr(y0)}$$`,
          explanation: `The intercepts are $(${x0}, 0)$ and $(0, ${y0})$, giving slope $m = ${slopeFrac}$ and line $y = ${slopeFrac}x ${signStr(y0)}$.`
        };
      }
    });
  }
})();

// ═══════════════════════════════════════════════════════════
// TILE 23: FRQ - Create equations of parallel or perpendicular lines (pp.301–302, Lesson 5-2, Ex.8–9)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[23] = { tile: 23, type: 'frq', questions: [] };
(function() {
  const Q = QUESTION_BANK[23].questions;

  for (let idx = 1; idx <= 5; idx++) {
    Q.push({
      id: `q23_${idx}`,
      generate(seed) {
        const r = seededRandom(seed + idx * 23);
        const isPerp = idx % 2 === 0; // alternate parallel and perpendicular
        const mGiven = r.pick([2, 3, 4, -2, -3]);
        const bGiven = r.nextIntNonZero(-6, 6);
        const x1 = r.nextInt(1, 4);
        const y1 = r.nextInt(-4, 6);

        let targetSlope, slopeLabel, targetMFrac;
        if (isPerp) {
          slopeLabel = 'perpendicular';
          targetSlope = -1 / mGiven;
          targetMFrac = fmtFrac(-1, mGiven);
        } else {
          slopeLabel = 'parallel';
          targetSlope = mGiven;
          targetMFrac = `${mGiven}`;
        }

        // New y-intercept: y1 = m_target * x1 + b => b = y1 - m_target * x1
        const bNum = y1 * (isPerp ? mGiven : 1) - (isPerp ? -1 : mGiven) * x1;
        const bDen = isPerp ? mGiven : 1;
        const bClean = isPerp ? fmtFrac(bNum, bDen) : (y1 - mGiven * x1);

        return {
          text: `A line $L_1$ has the equation:
$$y = ${mGiven}x ${signStr(bGiven)}$$
<b>Task [5 points]:</b><br>
Find the equation of line $L_2$ that passes through the point $P(${x1}, ${y1})$ and is <b>${slopeLabel.toUpperCase()}</b> to line $L_1$.`,
          fields: [
            {
              label: `Step 1 [1.0 point] — Slope of the given line $L_1$ ($m_1$):`,
              placeholder: 'e.g. 2',
              correct: mGiven,
              accept: [`${mGiven}`],
              correctDisplay: `m_1 = ${mGiven}`,
              points: 1.0
            },
            {
              label: `Step 2 [1.5 points] — Slope of line $L_2$ ($m_2$, ${slopeLabel}):`,
              placeholder: isPerp ? `e.g. -1/2` : `e.g. 2`,
              correct: targetSlope,
              accept: [`${targetMFrac}`, `${targetSlope}`, targetMFrac.replace('\\frac{', '').replace('}{', '/').replace('}', '')],
              correctDisplay: `m_2 = ${targetMFrac}`,
              points: 1.5
            },
            {
              label: `Step 3 [1.5 points] — $y$-intercept of line $L_2$ ($b$):`,
              placeholder: 'e.g. 5',
              correct: isPerp ? (bNum / bDen) : (y1 - mGiven * x1),
              accept: [`${bClean}`, `${isPerp ? (bNum / bDen) : (y1 - mGiven * x1)}`],
              correctDisplay: `b = ${bClean}`,
              points: 1.5
            },
            {
              label: `Step 4 [1.0 point] — Complete equation of line $L_2$ ($y = mx + b$):`,
              placeholder: `e.g. y = ${targetMFrac}x + ${bClean}`,
              correct: `y = ${targetMFrac}x + ${bClean}`,
              accept: [
                `y=${targetMFrac}x+${bClean}`.replace(/\s+/g, ''),
                `y=${targetSlope}x+${bClean}`.replace(/\s+/g, '')
              ],
              correctDisplay: `y = ${targetMFrac}x ${isPerp ? '+ ' + bClean : signStr(y1 - mGiven * x1)}`,
              points: 1.0
            }
          ],
          totalPoints: 5,
          rubric: [
            { field: 0, points: 1.0, desc: 'Identified correct slope of original line' },
            { field: 1, points: 1.5, desc: isPerp ? 'Found negative reciprocal slope for perpendicular line' : 'Applied equal slope for parallel line' },
            { field: 2, points: 1.5, desc: 'Correctly substituted point P to find y-intercept b' },
            { field: 3, points: 1.0, desc: 'Stated correct final slope-intercept equation' }
          ],
          hints: [
            `The slope of $L_1$ is the coefficient of $x$: $m_1 = ${mGiven}$.`,
            isPerp
              ? `Perpendicular lines have slopes that multiply to $-1$: $m_2 = -\\frac{1}{m_1} = ${targetMFrac}$.`
              : `Parallel lines have identical slopes: $m_2 = m_1 = ${mGiven}$.`,
            `Substitute $m_2$ and $(${x1}, ${y1})$ into $y = m_2 x + b$ to solve for $b$.`,
            '<b>Worked example:</b> Through $(1, 4)$ perpendicular to $y = 2x - 3$:<br>$m_2 = -\\frac{1}{2}$. $4 = -\\frac{1}{2}(1) + b \\Rightarrow b = 4.5$. $y = -\\frac{1}{2}x + 4.5$.'
          ],
          modelSolution: `<b>Step 1: Identify slope of $L_1$</b><br>
From $y = ${mGiven}x ${signStr(bGiven)}$, the slope is $m_1 = ${mGiven}$.<br><br>
<b>Step 2: Determine slope of $L_2$</b><br>
${isPerp ? `Line $L_2$ is perpendicular to $L_1$, so its slope is the negative reciprocal:<br>$$m_2 = -\\frac{1}{m_1} = -\\frac{1}{${mGiven}} = ${targetMFrac}$$` : `Line $L_2$ is parallel to $L_1$, so its slope is identical:<br>$$m_2 = m_1 = ${mGiven}$$`}<br>
<b>Step 3: Solve for the $y$-intercept $b$</b><br>
Substitute point $P(${x1}, ${y1})$ into $y = m_2 x + b$:<br>
$$${y1} = (${targetMFrac})(${x1}) + b$$
$$b = ${y1} - (${targetMFrac})(${x1}) = ${bClean}$$<br>
<b>Step 4: Final Equation</b><br>
$$y = ${targetMFrac}x ${isPerp ? '+ ' + bClean : signStr(y1 - mGiven * x1)}$$`,
          explanation: `Line $L_2$ has slope $m = ${targetMFrac}$ and passes through $(${x1}, ${y1})$, yielding $y = ${targetMFrac}x ${isPerp ? '+ ' + bClean : signStr(y1 - mGiven * x1)}$.`
        };
      }
    });
  }
})();

// ═══════════════════════════════════════════════════════════
// TILE 24: FRQ - Apply the arithmetic sequence formula (p.256, Lesson 4-5, ex.23–26)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[24] = { tile: 24, type: 'frq', questions: [] };
(function() {
  const Q = QUESTION_BANK[24].questions;

  for (let idx = 1; idx <= 5; idx++) {
    Q.push({
      id: `q24_${idx}`,
      generate(seed) {
        const r = seededRandom(seed + idx * 29);
        const a1 = r.nextInt(-10, 20);
        const d = r.pick([3, 4, 5, 6, 7, -2, -3, -4, -5]);
        const seq = [a1, a1 + d, a1 + 2 * d, a1 + 3 * d];
        const targetN = r.pick([15, 20, 25, 30, 40]);
        const targetVal = a1 + (targetN - 1) * d;

        return {
          text: `Consider the arithmetic sequence:
$$${seq.join(', ')}, \\dots$$
<b>Formula:</b> $a_n = a_1 + (n - 1)d$<br><br>
<b>Task [5 points]:</b><br>
1. Identify the first term $a_1$ and common difference $d$.<br>
2. Write the simplified formula for the $n$-th term $a_n$.<br>
3. Find the value of the $${targetN}^{\\text{th}}$ term ($a_{${targetN}}$).`,
          fields: [
            {
              label: 'Step 1 [1.0 point] — First term ($a_1$):',
              placeholder: `e.g. ${a1}`,
              correct: a1,
              accept: [`${a1}`, `a_1=${a1}`, `a1=${a1}`],
              correctDisplay: `a_1 = ${a1}`,
              points: 1.0
            },
            {
              label: 'Step 2 [1.0 point] — Common difference ($d = a_2 - a_1$):',
              placeholder: `e.g. ${d}`,
              correct: d,
              accept: [`${d}`, `d=${d}`],
              correctDisplay: `d = ${d}`,
              points: 1.0
            },
            {
              label: 'Step 3 [1.5 points] — Simplified formula for $a_n$ (in the form $dn + c$):',
              placeholder: `e.g. ${d}n ${signStr(a1 - d)}`,
              correct: `${d}n ${signStr(a1 - d)}`,
              accept: [
                `${d}n${signStr(a1 - d)}`.replace(/\s+/g, ''),
                `a_n=${d}n${signStr(a1 - d)}`.replace(/\s+/g, ''),
                `${a1}+(${d})(n-1)`.replace(/\s+/g, '')
              ],
              correctDisplay: `a_n = ${d}n ${signStr(a1 - d)}`,
              points: 1.5
            },
            {
              label: `Step 4 [1.5 points] — Find $a_{${targetN}}$:`,
              placeholder: `e.g. ${targetVal}`,
              correct: targetVal,
              accept: [`${targetVal}`, `a_${targetN}=${targetVal}`, `a${targetN}=${targetVal}`],
              correctDisplay: `a_{${targetN}} = ${targetVal}`,
              points: 1.5
            }
          ],
          totalPoints: 5,
          rubric: [
            { field: 0, points: 1.0, desc: 'Identified first term a_1' },
            { field: 1, points: 1.0, desc: 'Calculated common difference d = a_2 - a_1' },
            { field: 2, points: 1.5, desc: 'Substituted into formula and simplified to dn + c' },
            { field: 3, points: 1.5, desc: 'Correctly evaluated term a_n for n = ' + targetN }
          ],
          hints: [
            `The first term is the initial number in the list: $a_1 = ${a1}$.`,
            `The common difference is $d = ${seq[1]} - (${seq[0]}) = ${d}$.`,
            `Use $a_n = a_1 + (n - 1)d$: distribute $d$ and combine constants.`,
            `To find $a_{${targetN}}$, substitute $n = ${targetN}$ into your formula.`,
            '<b>Worked example:</b> Sequence $3, 7, 11, \\dots$<br>$a_1 = 3, d = 4$. $a_n = 3 + (n - 1)(4) = 4n - 1$. For $n = 10$: $a_{10} = 4(10) - 1 = 39$.'
          ],
          modelSolution: `<b>Step 1: First Term</b><br>
The first term is $a_1 = ${a1}$.<br><br>
<b>Step 2: Common Difference</b><br>
$$d = a_2 - a_1 = ${seq[1]} - (${seq[0]}) = ${d}$$<br>
<b>Step 3: Simplified $n$-th Term Formula</b><br>
$$a_n = a_1 + (n - 1)d$$
$$a_n = ${a1} + (n - 1)(${d})$$
$$a_n = ${a1} + ${d}n - ${d}$$
$$a_n = ${d}n ${signStr(a1 - d)}$$<br>
<b>Step 4: Find $a_{${targetN}}$</b><br>
$$a_{${targetN}} = ${d}(${targetN}) ${signStr(a1 - d)} = ${d * targetN} ${signStr(a1 - d)} = ${targetVal}$$`,
          explanation: `First term $a_1 = ${a1}$, $d = ${d}$, giving $a_n = ${d}n ${signStr(a1 - d)}$. The $${targetN}^{\\text{th}}$ term is $a_{${targetN}} = ${targetVal}$.`
        };
      }
    });
  }
})();

// ═══════════════════════════════════════════════════════════
// TILE 25: FRQ - Solve equations for specific variables (pp.120, 126, Lesson 2-7, Ex.4, ex.23–24)
// ═══════════════════════════════════════════════════════════
QUESTION_BANK[25] = { tile: 25, type: 'frq', questions: [] };
(function() {
  const Q = QUESTION_BANK[25].questions;

  const literalProblems = [
    {
      title: 'Perimeter of a Rectangle',
      eq: 'P = 2l + 2w',
      solveFor: 'w',
      step1Label: 'Step 1 [2.0 points] — Isolate the term containing $w$ ($2w$):',
      step1Ans: 'P - 2l',
      step1Accept: ['P - 2l', 'P-2l', '-2l + P'],
      step1Display: '2w = P - 2l',
      finalLabel: 'Step 2 [3.0 points] — Divide by $2$ to solve for $w$:',
      finalAns: '(P - 2l)/2',
      finalAccept: [
        '(P - 2l)/2', '(P-2l)/2', 'P/2 - l', '\\frac{P - 2l}{2}',
        '\\frac{P}{2} - l', '(p - 2l)/2'
      ],
      finalDisplay: 'w = \\frac{P - 2l}{2} \\text{ or } w = \\frac{P}{2} - l',
      workedEx: 'Solve $P = 2l + 2w$ for $w$: Subtract $2l$: $2w = P - 2l$. Divide by 2: $w = \\frac{P - 2l}{2}$.',
      solSteps: `Subtract $2l$ from both sides:<br>$$2w = P - 2l$$<br>Divide both sides by $2$:<br>$$w = \\frac{P - 2l}{2} \\quad \\text{or} \\quad w = \\frac{P}{2} - l$$`
    },
    {
      title: 'Area of a Triangle',
      eq: 'A = \\frac{1}{2}bh',
      solveFor: 'h',
      step1Label: 'Step 1 [2.0 points] — Multiply both sides by $2$ to clear the fraction:',
      step1Ans: '2A',
      step1Accept: ['2A', '2*A', 'bh = 2A'],
      step1Display: 'bh = 2A',
      finalLabel: 'Step 2 [3.0 points] — Divide by $b$ to solve for $h$:',
      finalAns: '2A/b',
      finalAccept: ['2A/b', '2*A/b', '(2A)/b', '\\frac{2A}{b}'],
      finalDisplay: 'h = \\frac{2A}{b}',
      workedEx: 'Solve $A = \\frac{1}{2}bh$ for $h$: Multiply by 2: $2A = bh$. Divide by $b$: $h = \\frac{2A}{b}$.',
      solSteps: `Multiply both sides by $2$:<br>$$2A = bh$$<br>Divide both sides by $b$ ($b \\neq 0$):<br>$$h = \\frac{2A}{b}$$`
    },
    {
      title: 'Circumference of a Circle',
      eq: 'C = 2\\pi r',
      solveFor: 'r',
      step1Label: 'Step 1 [2.0 points] — Identify the factor multiplying $r$:',
      step1Ans: '2pi',
      step1Accept: ['2pi', '2\\pi', '2*pi'],
      step1Display: '2\\pi',
      finalLabel: 'Step 2 [3.0 points] — Divide both sides by $2\\pi$ to solve for $r$:',
      finalAns: 'C/(2pi)',
      finalAccept: ['C/(2pi)', 'C/(2*pi)', '\\frac{C}{2\\pi}', 'C / (2pi)'],
      finalDisplay: 'r = \\frac{C}{2\\pi}',
      workedEx: 'Solve $C = 2\\pi r$ for $r$: Divide by $2\\pi$: $r = \\frac{C}{2\\pi}$.',
      solSteps: `Divide both sides by $2\\pi$:<br>$$r = \\frac{C}{2\\pi}$$`
    },
    {
      title: 'Volume of a Rectangular Prism',
      eq: 'V = lwh',
      solveFor: 'h',
      step1Label: 'Step 1 [2.0 points] — Identify the combined coefficient of $h$:',
      step1Ans: 'lw',
      step1Accept: ['lw', 'l*w', 'w*l', 'wl'],
      step1Display: 'lw',
      finalLabel: 'Step 2 [3.0 points] — Divide both sides by $lw$ to isolate $h$:',
      finalAns: 'V/(lw)',
      finalAccept: ['V/(lw)', 'V/(l*w)', '\\frac{V}{lw}', 'V / (lw)'],
      finalDisplay: 'h = \\frac{V}{lw}',
      workedEx: 'Solve $V = lwh$ for $h$: Divide by $lw$: $h = \\frac{V}{lw}$.',
      solSteps: `Divide both sides by $lw$ ($lw \\neq 0$):<br>$$h = \\frac{V}{lw}$$`
    },
    {
      title: 'Standard Linear Equation',
      eq: 'ax + by = c',
      solveFor: 'y',
      step1Label: 'Step 1 [2.0 points] — Subtract $ax$ to isolate the $by$ term:',
      step1Ans: 'c - ax',
      step1Accept: ['c - ax', 'c-ax', '-ax + c', '-ax+c'],
      step1Display: 'by = c - ax',
      finalLabel: 'Step 2 [3.0 points] — Divide both sides by $b$ to solve for $y$:',
      finalAns: '(c - ax)/b',
      finalAccept: [
        '(c - ax)/b', '(c-ax)/b', '\\frac{c - ax}{b}',
        'c/b - (a/b)x', '-(a/b)x + c/b'
      ],
      finalDisplay: 'y = \\frac{c - ax}{b} \\quad \\text{or} \\quad y = -\\frac{a}{b}x + \\frac{c}{b}',
      workedEx: 'Solve $ax + by = c$ for $y$: Subtract $ax$: $by = c - ax$. Divide by $b$: $y = \\frac{c - ax}{b}$.',
      solSteps: `Subtract $ax$ from both sides:<br>$$by = c - ax$$<br>Divide both sides by $b$ ($b \\neq 0$):<br>$$y = \\frac{c - ax}{b} \\quad \\text{or} \\quad y = -\\frac{a}{b}x + \\frac{c}{b}$$`
    }
  ];

  literalProblems.forEach((p, idx) => {
    Q.push({
      id: `q25_${idx + 1}`,
      generate(seed) {
        return {
          text: `<b>Formula: ${p.title}</b>
$$${p.eq}$$
<b>Task [5 points]:</b><br>
Solve the literal equation for the variable <b>$${p.solveFor}$</b>. Show all intermediate algebraic steps.`,
          fields: [
            {
              label: p.step1Label,
              placeholder: 'e.g. ' + p.step1Ans,
              correct: p.step1Ans,
              accept: p.step1Accept,
              correctDisplay: p.step1Display,
              points: 2.0
            },
            {
              label: p.finalLabel,
              placeholder: 'e.g. ' + p.finalAns,
              correct: p.finalAns,
              accept: p.finalAccept,
              correctDisplay: p.finalDisplay,
              points: 3.0
            }
          ],
          totalPoints: 5,
          rubric: [
            { field: 0, points: 2.0, desc: 'Correct first inverse operation to isolate target term' },
            { field: 1, points: 3.0, desc: 'Correct division to completely isolate target variable' }
          ],
          hints: [
            `Treat all variables except $${p.solveFor}$ as constants.`,
            `Use inverse operations to isolate $${p.solveFor}$.`,
            `<b>Worked example:</b> ${p.workedEx}`
          ],
          modelSolution: `<b>Full Step-by-Step Solution:</b><br>
Original equation:
$$${p.eq}$$
${p.solSteps}`,
          explanation: `Solving for $${p.solveFor}$ gives $${p.finalDisplay}$.`
        };
      }
    });
  });
})();

// ═══════════════════════════════════════════════════════════
// REMAPPING QUESTION BANK TO ASCENDING CHRONOLOGICAL LESSON ORDER
// ═══════════════════════════════════════════════════════════
(function() {
  const mapNewToOld = {
    // MCQ Q1–Q20 in exact lesson order
    1: 2,   // L 2-1 (p.71)
    2: 1,   // L 2-3 (p.88)
    3: 3,   // L 2-4 (p.97)
    4: 4,   // L 2-5 (p.106)
    5: 6,   // L 2-6 (p.113)
    6: 5,   // L 4-2 (p.227)
    7: 7,   // L 4-3 (p.235)
    8: 13,  // L 4-4 (p.248)
    9: 18,  // L 4-6 (p.261)
    10: 17, // L 4-6 (p.265)
    11: 8,  // L 4-7 (p.267)
    12: 19, // L 4-7 (p.277)
    13: 20, // L 5-1 (p.293)
    14: 14, // L 5-2 (pp.297, 303)
    15: 10, // L 5-2 (p.304)
    16: 15, // L 5-2 (pp.304, 305)
    17: 16, // L 5-6 (p.331)
    18: 9,  // L 6-1 (p.347)
    19: 11, // L 6-2 (p.354)
    20: 12, // L 6-4 (p.371)
    // FRQ Q21–Q25 in exact lesson order
    21: 25, // L 2-7 (pp.120, 126)
    22: 22, // L 4-1 (p.216)
    23: 24, // L 4-5 (p.256)
    24: 23, // L 5-2 (pp.301, 302)
    25: 21, // L 6-3, 2-4 (pp.363, 97)
  };

  const remapped = {};
  for (let newTile = 1; newTile <= 25; newTile++) {
    const oldTile = mapNewToOld[newTile];
    const source = QUESTION_BANK[oldTile];
    if (source) {
      remapped[newTile] = {
        tile: newTile,
        type: source.type,
        questions: source.questions
      };
    }
  }

  for (let t = 1; t <= 25; t++) {
    QUESTION_BANK[t] = remapped[t];
  }
})();
