(function (global) {
  const STORAGE_KEY = 'demo_state_v1';
  const defaultState = { teachers: [], rooms: [], courses: [], timeslots: [], constraints: [], jobs: [], versions: [], activeVersionId: null };
  function loadRaw() { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return JSON.parse(JSON.stringify(defaultState)); try { return JSON.parse(raw); } catch (e) { console.error('Failed to parse demo state, resetting.', e); localStorage.removeItem(STORAGE_KEY); return JSON.parse(JSON.stringify(defaultState)); } }
  function persist(state) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return { success: true }; }
  function getState() { return loadRaw(); }
  function saveState(state) { return persist(state); }
  function resetStateToSample(sampleObj) { const s = JSON.parse(JSON.stringify(defaultState)); if (sampleObj && typeof sampleObj === 'object') { Object.keys(sampleObj).forEach(k => { if (k in s) s[k] = sampleObj[k]; }); } persist(s); return s; }
  function listTeachers() { return getState().teachers || []; }
  function getTeacherById(teacherId) { const state = getState(); return (state.teachers || []).find(t => t.teacherId === teacherId) || null; }
  function addTeacher(teacherObj) { if (!teacherObj || !teacherObj.teacherId) return { success: false, message: 'Invalid teacher object' }; const state = getState(); state.teachers = state.teachers || []; if (state.teachers.some(t => t.teacherId === teacherObj.teacherId)) { return { success: false, message: 'Teacher ID exists' }; } state.teachers.push(teacherObj); persist(state); return { success: true }; }
  function updateTeacher(teacherId, updates) { const state = getState(); const index = (state.teachers || []).findIndex(t => t.teacherId === teacherId); if (index === -1) return { success: false, message: 'Not found' }; state.teachers[index] = Object.assign({}, state.teachers[index], updates); persist(state); return { success: true }; }
  function deleteTeacher(teacherId) { const state = getState(); state.teachers = (state.teachers || []).filter(t => t.teacherId !== teacherId); persist(state); return { success: true }; }
  function listRooms() { return getState().rooms || []; }
  function listCourses() { return getState().courses || []; }
  function listTimeslots() { return getState().timeslots || []; }
  function appendVersion(versionObj) { if (!versionObj || !versionObj.versionId) return { success: false, message: 'Invalid version' }; const state = getState(); state.versions = state.versions || []; state.versions.push(versionObj); state.activeVersionId = versionObj.versionId; persist(state); return { success: true, versionId: versionObj.versionId }; }
  function listVersions() { return getState().versions || []; }
  function getVersion(versionId) { return (getState().versions || []).find(v => v.versionId === versionId) || null; }
  function setActiveVersion(versionId) { const state = getState(); if (!(state.versions || []).some(v => v.versionId === versionId)) { return { success: false, message: 'Version not found' }; } state.activeVersionId = versionId; persist(state); return { success: true }; }
  function getActiveVersion() { const state = getState(); return state.activeVersionId ? getVersion(state.activeVersionId) : null; }
  function appendJob(jobObj) { if (!jobObj || !jobObj.jobId) return { success: false }; const state = getState(); state.jobs = state.jobs || []; state.jobs.push(jobObj); persist(state); return { success: true }; }
  global.DemoState = { getState, saveState, resetStateToSample, listTeachers, getTeacherById, addTeacher, updateTeacher, deleteTeacher, listRooms, listCourses, listTimeslots, appendVersion, listVersions, getVersion, setActiveVersion, getActiveVersion, appendJob };
})(window);