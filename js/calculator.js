// ── Scientific Calculator ──────────────────────────────────
const Calculator = (() => {
  let display = '0';
  let memory = 0;
  let lastOp = null;
  let newNumber = true;
  let parentheses = 0;

  const buttons = [
    { label: 'sin', cls: 'fn', action: 'fn', fn: Math.sin },
    { label: 'cos', cls: 'fn', action: 'fn', fn: Math.cos },
    { label: 'tan', cls: 'fn', action: 'fn', fn: Math.tan },
    { label: '(', cls: 'fn', action: 'paren' },
    { label: ')', cls: 'fn', action: 'paren' },
    { label: 'x²', cls: 'fn', action: 'fn', fn: x => x * x },
    { label: '√', cls: 'fn', action: 'fn', fn: Math.sqrt },
    { label: 'xʸ', cls: 'fn', action: 'input', value: '**' },
    { label: 'π', cls: 'fn', action: 'const', value: Math.PI },
    { label: 'e', cls: 'fn', action: 'const', value: Math.E },
    { label: '7', cls: '', action: 'digit' },
    { label: '8', cls: '', action: 'digit' },
    { label: '9', cls: '', action: 'digit' },
    { label: '÷', cls: 'op', action: 'input', value: '/' },
    { label: 'C', cls: 'op', action: 'clear' },
    { label: '4', cls: '', action: 'digit' },
    { label: '5', cls: '', action: 'digit' },
    { label: '6', cls: '', action: 'digit' },
    { label: '×', cls: 'op', action: 'input', value: '*' },
    { label: '⌫', cls: 'op', action: 'backspace' },
    { label: '1', cls: '', action: 'digit' },
    { label: '2', cls: '', action: 'digit' },
    { label: '3', cls: '', action: 'digit' },
    { label: '−', cls: 'op', action: 'input', value: '-' },
    { label: '±', cls: '', action: 'negate' },
    { label: '0', cls: '', action: 'digit' },
    { label: '.', cls: '', action: 'digit' },
    { label: 'Ans', cls: 'fn', action: 'const', value: 0 },
    { label: '+', cls: 'op', action: 'input', value: '+' },
    { label: '=', cls: 'eq', action: 'eval' },
  ];

  function init() {
    const container = document.getElementById('calc-buttons');
    if (!container) return;
    container.innerHTML = '';
    buttons.forEach(b => {
      const btn = document.createElement('button');
      btn.className = 'calc-btn ' + b.cls;
      btn.textContent = b.label;
      btn.setAttribute('type', 'button');
      btn.addEventListener('click', () => handleBtn(b));
      container.appendChild(btn);
    });
    updateDisplay();
  }

  function handleBtn(b) {
    switch (b.action) {
      case 'digit':
        if (newNumber) { display = ''; newNumber = false; }
        if (b.label === '.' && display.includes('.')) return;
        display += b.label;
        break;
      case 'input':
        display += b.value;
        newNumber = false;
        break;
      case 'fn':
        try {
          const val = parseFloat(evaluate(display));
          display = String(b.fn(val));
          newNumber = true;
        } catch { display = 'Error'; newNumber = true; }
        break;
      case 'const':
        if (b.label === 'Ans') { display = String(memory); }
        else { display = String(b.value); }
        newNumber = true;
        break;
      case 'paren':
        display += b.label;
        newNumber = false;
        break;
      case 'clear':
        display = '0';
        newNumber = true;
        break;
      case 'backspace':
        display = display.slice(0, -1) || '0';
        break;
      case 'negate':
        if (display && display !== '0') {
          if (display.startsWith('-')) display = display.slice(1);
          else display = '-' + display;
        }
        break;
      case 'eval':
        try {
          const result = evaluate(display);
          memory = result;
          // Update Ans button
          buttons.find(b2 => b2.label === 'Ans').value = result;
          display = String(result);
          newNumber = true;
        } catch { display = 'Error'; newNumber = true; }
        break;
    }
    updateDisplay();
  }

  function evaluate(expr) {
    // Sanitize: only allow numbers, operators, parentheses, dots
    const sanitized = expr.replace(/[^0-9+\-*/().%e\s^]/g, '').replace(/\*\*/g, '**');
    // Use Function constructor for safe math evaluation
    try {
      const result = Function('"use strict"; return (' + sanitized + ')')();
      if (!isFinite(result)) return 'Error';
      return Math.round(result * 1e10) / 1e10;
    } catch {
      return 'Error';
    }
  }

  function updateDisplay() {
    const el = document.getElementById('calc-display');
    if (el) el.textContent = display;
  }

  function toggle() {
    const modal = document.getElementById('calc-modal');
    if (modal) {
      modal.classList.toggle('hidden');
      if (!modal.classList.contains('hidden')) init();
    }
  }

  return { init, toggle };
})();
