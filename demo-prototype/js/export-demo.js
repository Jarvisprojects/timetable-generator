(function (global) {
  async function exportCurrentViewToPDF(elementId, filename = 'timetable.pdf') {
    const el = document.getElementById(elementId);
    if (!el) { DemoUI.showSnackbar('Nothing to export', 'error'); return; }
    DemoUI.showSnackbar('Preparing PDF...', 'info');
    try {
      const canvas = await html2canvas(el, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('landscape', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
      pdf.save(filename);
      DemoUI.showSnackbar('PDF ready', 'success');
    } catch (e) {
      console.error(e);
      DemoUI.showSnackbar('Export failed', 'error');
    }
  }
  function exportCurrentViewToExcel(mapping, filename = 'timetable.xlsx') {
    const data = [['cellId', 'courseId', 'teacherId', 'roomId']];
    Object.keys(mapping || {}).forEach(cellId => {
      const a = mapping[cellId];
      data.push([cellId, a.courseId, a.teacherId, a.roomId]);
    });
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Timetable');
    XLSX.writeFile(wb, filename);
    DemoUI.showSnackbar('Excel ready', 'success');
  }
  global.DemoExport = { exportCurrentViewToPDF, exportCurrentViewToExcel };
})(window);
