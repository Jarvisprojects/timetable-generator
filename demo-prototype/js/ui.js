(function (global) {
  const SESSION_KEY = 'demo_session';
  function setSessionAndRedirect(sessionObj) {
    const now = new Date().toISOString();
    const session = { role: sessionObj.role || 'student', email: sessionObj.email || '', uid: sessionObj.uid || ('u_' + Math.random().toString(36).substring(2,9)), createdAt: now };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    if (session.role === 'hod') { window.location.href = 'pages/hod-dashboard.html'; }
    else if (session.role === 'teacher') { window.location.href = 'pages/teacher-view.html'; }
    else { window.location.href = 'pages/student-view.html'; }
  }
  function getSession() { const raw = sessionStorage.getItem(SESSION_KEY); if (!raw) return null; try { return JSON.parse(raw); } catch (e) { return null; } }
  function showSnackbar(message, type = 'info') { console.log(`[snackbar ${type}] ${message}`); alert(message); }
  function openModal(id) { const el = document.getElementById(id); if (el) el.classList.remove('hidden'); }
  function closeModal(id) { const el = document.getElementById(id); if (el) el.classList.add('hidden'); }
  global.DemoUI = { setSessionAndRedirect, getSession, showSnackbar, openModal, closeModal };
})(window);