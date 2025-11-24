(function (global) {
  const SAMPLE_PATH = '../../data/sample-generator-output.json';
  function lookupCourseName(courseId) {
    const courses = DemoState.listCourses();
    const c = (courses || []).find(x => x.courseId === courseId);
    return c ? c.name : courseId;
  }
  function lookupTeacherName(teacherId) {
    const t = DemoState.getTeacherById ? DemoState.getTeacherById(teacherId) : null;
    return t ? t.name : teacherId;
  }
  function applyMapping(mapping) {
    const missing = [];
    Object.keys(mapping || {}).forEach(cellId => {
      const el = document.getElementById(cellId);
      if (!el) { missing.push(cellId); return; }
      const assignment = mapping[cellId];
      const courseEl = el.querySelector('[data-role="course"]');
      const teacherEl = el.querySelector('[data-role="teacher"]');
      const roomEl = el.querySelector('[data-role="room"]');
      if (courseEl) courseEl.textContent = assignment.courseId + ' — ' + lookupCourseName(assignment.courseId);
      if (teacherEl) teacherEl.textContent = (lookupTeacherName(assignment.teacherId) || assignment.teacherId);
      if (roomEl) roomEl.textContent = assignment.roomId || '';
      el.onclick = function () {
        document.getElementById('modal-course-fullname').textContent = lookupCourseName(assignment.courseId);
        document.getElementById('modal-teacher-name').textContent = lookupTeacherName(assignment.teacherId);
        document.getElementById('modal-room-id').textContent = assignment.roomId;
        document.getElementById('modal-slot-info').textContent = cellId;
        DemoUI.openModal('cell-modal');
      };
    });
    if (missing.length) console.warn('Missing cells in DOM for mapping:', missing);
  }
  async function loadSampleAndRegister() {
    try {
      const res = await fetch(SAMPLE_PATH);
      const json = await res.json();
      const existing = DemoState.listVersions();
      if (!existing || existing.length === 0) {
        DemoState.appendVersion(json);
      } else {
        const copy = Object.assign({}, json, { versionId: 'vt-demo-' + Date.now(), createdAt: new Date().toISOString() });
        DemoState.appendVersion(copy);
      }
      return json;
    } catch (e) {
      console.error('Failed to load sample generator output', e);
      return null;
    }
  }
  function populateVersionSelect() {
    const select = document.getElementById('version-select');
    select.innerHTML = '';
    const versions = DemoState.listVersions();
    (versions || []).forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.versionId;
      opt.textContent = `${v.versionId} — ${new Date(v.createdAt).toLocaleString()}`;
      select.appendChild(opt);
    });
    const active = DemoState.getState().activeVersionId;
    if (active) select.value = active;
  }
  function loadVersionById(versionId) {
    const v = DemoState.getVersion(versionId);
    if (!v) return;
    applyMapping(v.data);
    DemoState.setActiveVersion(versionId);
    populateVersionSelect();
  }
  const DemoTemplate = {
    init: async function () {
      const s = DemoState.getState();
      if ((!s.teachers || s.teachers.length === 0) || (!s.courses || s.courses.length === 0)) {
        try {
          const inRes = await fetch('../../data/sample-inputs.json');
          const inputs = await inRes.json();
          DemoState.resetStateToSample(inputs);
        } catch (e) {
          console.warn('No sample inputs found');
        }
      }
      if (!s.versions || s.versions.length === 0) {
        const sample = await loadSampleAndRegister();
        if (sample) { }
      }
      populateVersionSelect();
      const active = DemoState.getState().activeVersionId;
      if (active) loadVersionById(active);
      return;
    },
    loadVersion: function (versionId) { loadVersionById(versionId); },
    createVersionFromSample: async function () {
      const sample = await loadSampleAndRegister();
      if (sample) {
        const vlist = DemoState.listVersions();
        const last = vlist[vlist.length - 1];
        loadVersionById(last.versionId);
        DemoUI.showSnackbar('New demo version created: ' + last.versionId, 'success');
      } else {
        DemoUI.showSnackbar('Failed to create demo version', 'error');
      }
    },
    getCurrentMapping: function () {
      const active = DemoState.getState().activeVersionId;
      const v = DemoState.getVersion(active);
      return v ? v.data : {};
    }
  };
  global.DemoTemplate = DemoTemplate;
})(window);
