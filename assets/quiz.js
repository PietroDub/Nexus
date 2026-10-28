function initQuizzes() {
  document.querySelectorAll('[data-quiz]').forEach((root) => {
    const items = JSON.parse(root.getAttribute('data-quiz'));
    items.forEach((item, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'q';
      const prompt = document.createElement('p');
      prompt.textContent = i + 1 + '. ' + item.q;
      wrap.appendChild(prompt);
      const feedback = document.createElement('p');
      feedback.className = 'feedback';
      feedback.setAttribute('aria-live', 'polite');
      item.choices.forEach((choice, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = choice;
        btn.addEventListener('click', () => {
          wrap.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', 'false'));
          btn.setAttribute('aria-pressed', 'true');
          const ok = idx === item.answer;
          feedback.textContent = ok ? item.ok : item.no;
          feedback.className = 'feedback ' + (ok ? 'ok' : 'bad');
        });
        wrap.appendChild(btn);
      });
      wrap.appendChild(feedback);
      root.appendChild(wrap);
    });
  });
}

document.addEventListener('DOMContentLoaded', initQuizzes);
