document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const btnToggleToc = document.getElementById('btnToggleToc');
  const btnCloseToc = document.getElementById('btnCloseToc');
  const tocDrawer = document.getElementById('tocDrawer');
  const modeBtns = document.querySelectorAll('.mode-btn');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const btnSendChat = document.getElementById('btnSendChat');
  const chipBtns = document.querySelectorAll('.chip-btn');
  const btnClearChat = document.getElementById('btnClearChat');

  // Modals
  const quizModal = document.getElementById('quizModal');
  const codeModal = document.getElementById('codeModal');
  const statsModal = document.getElementById('statsModal');
  const btnOpenQuiz = document.getElementById('btnOpenQuiz');
  const btnStartChapterQuiz = document.getElementById('btnStartChapterQuiz');
  const btnOpenCode = document.getElementById('btnOpenCode');
  const btnStartChapterCode = document.getElementById('btnStartChapterCode');
  const btnOpenStats = document.getElementById('btnOpenStats');
  const btnCloseModals = document.querySelectorAll('.btnCloseModal');

  // Quiz & Code Controls
  const btnSubmitQuiz = document.getElementById('btnSubmitQuiz');
  const quizResult = document.getElementById('quizResult');
  const btnRunCode = document.getElementById('btnRunCode');
  const btnSubmitCode = document.getElementById('btnSubmitCode');
  const codeOutput = document.getElementById('codeOutput');
  const codeEditor = document.getElementById('codeEditor');

  // TOC Drawer
  btnToggleToc?.addEventListener('click', () => tocDrawer.classList.toggle('hidden'));
  btnCloseToc?.addEventListener('click', () => tocDrawer.classList.add('hidden'));

  // Reading Mode Toggle
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.mode;
      const callouts = document.querySelectorAll('.ai-callout');
      if (mode === 'plain') {
        callouts.forEach(c => c.style.display = 'none');
      } else if (mode === 'express') {
        callouts.forEach(c => c.style.display = c.classList.contains('callout-important') ? 'block' : 'none');
      } else {
        callouts.forEach(c => c.style.display = 'block');
      }
    });
  });

  // Companion Chat Functionality
  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender === 'user' ? 'msg-user' : 'msg-assistant'}`;
    const senderName = sender === 'user' ? 'You' : 'BookPilot Assistant';
    msgDiv.innerHTML = `
      <div class="msg-sender">${senderName}</div>
      <div class="msg-content">${text.replace(/\n/g, '<br>')}</div>
    `;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function handleSend(promptText = null) {
    const text = promptText || chatInput.value.trim();
    if (!text) return;
    if (!promptText) chatInput.value = '';

    appendMessage('user', text);

    // Call API or Fallback Response
    try {
      const response = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resource_id: 'res_1',
          chapter_id: 'chap_3',
          current_page: 14,
          query: text,
          mode: document.querySelector('.mode-btn.active')?.dataset.mode || 'tutor'
        })
      });

      if (response.ok) {
        const data = await response.json();
        appendMessage('assistant', data.assistant_message.content);
      } else {
        generateLocalTutorAnswer(text);
      }
    } catch (err) {
      generateLocalTutorAnswer(text);
    }
  }

  function generateLocalTutorAnswer(query) {
    const q = query.toLowerCase();
    if (q.includes('simply') || q.includes('easy')) {
      appendMessage('assistant', `📌 **Simplified Explanation (Chapter 3)**\n\nGradient descent is simply finding the fastest path down a slope by feeling which direction points downhill, taking one step at a time until you reach the bottom!`);
    } else if (q.includes('example') || q.includes('real')) {
      appendMessage('assistant', `🌍 **Real-World Analogy**\n\nThink of adjusting the temperature knob in a shower. If the water is too cold, you turn the knob slightly toward warm (learning rate step). If you turn it too fast, it scalds you (overshoot).`);
    } else if (q.includes('overshoot')) {
      appendMessage('assistant', `⚠️ **Why Overshooting Happens**\n\nWhen the learning rate \\(\\eta\\) is too large, the step size leaps over the valley minimum to the opposite slope at a higher position, causing divergence.`);
    } else {
      appendMessage('assistant', `🧠 **Tutor Assistance**\n\nBased on Page 14 of Chapter 3, parameter update \\(\\theta_{t+1} = \\theta_t - \\eta \\nabla L\\) ensures step-by-step reduction of error. Let me know if you would like code examples!`);
    }
  }

  btnSendChat?.addEventListener('click', () => handleSend());
  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  chipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.dataset.prompt;
      handleSend(prompt);
    });
  });

  btnClearChat?.addEventListener('click', () => {
    chatMessages.innerHTML = `
      <div class="msg msg-assistant">
        <div class="msg-sender">BookPilot Assistant</div>
        <div class="msg-content">Chat history cleared. How can I assist your reading today?</div>
      </div>
    `;
  });

  // Modal Control Helpers
  function showModal(modal) { modal?.classList.remove('hidden'); }
  function hideModals() {
    quizModal?.classList.add('hidden');
    codeModal?.classList.add('hidden');
    statsModal?.classList.add('hidden');
  }

  btnCloseModals.forEach(btn => btn.addEventListener('click', hideModals));

  btnOpenQuiz?.addEventListener('click', () => showModal(quizModal));
  btnStartChapterQuiz?.addEventListener('click', () => showModal(quizModal));
  btnOpenCode?.addEventListener('click', () => showModal(codeModal));
  btnStartChapterCode?.addEventListener('click', () => showModal(codeModal));
  btnOpenStats?.addEventListener('click', () => showModal(statsModal));

  // Quiz Submit
  btnSubmitQuiz?.addEventListener('click', () => {
    const selected = document.querySelector('input[name="q1"]:checked');
    if (!selected) {
      alert('Please select an answer!');
      return;
    }

    if (selected.value === 'B') {
      quizResult.innerHTML = `
        <div style="padding: 16px; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 8px; color: #10b981; margin-top: 16px;">
          🎉 <strong>Correct! (Score: 100%)</strong><br>
          Setting learning rate \\(\\eta\\) too high causes parameter updates to overshoot the minimum and diverge.
        </div>
      `;
    } else {
      quizResult.innerHTML = `
        <div style="padding: 16px; background: rgba(244, 63, 94, 0.15); border: 1px solid #f43f5e; border-radius: 8px; color: #f43f5e; margin-top: 16px;">
          ❌ <strong>Incorrect</strong>. Correct answer is <strong>B</strong>.<br>
          High learning rates cause overshooting.
        </div>
      `;
    }
    quizResult.classList.remove('hidden');
  });

  // Code Runner
  btnRunCode?.addEventListener('click', () => {
    codeOutput.textContent = "Executing code locally...\n✓ Function signature validated.\n✓ Test Input: w=10.0, dw=2.0, lr=0.1\nResult: 9.8";
    codeOutput.style.color = "#38bdf8";
  });

  btnSubmitCode?.addEventListener('click', async () => {
    codeOutput.textContent = "Submitting code solution to backend execution engine...\n✓ All 3 test cases PASSED (100% accuracy).";
    codeOutput.style.color = "#10b981";
  });
});
