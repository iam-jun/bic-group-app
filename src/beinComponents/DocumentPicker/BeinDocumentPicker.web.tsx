let fileSelector: any;

const initFileSelector = () => {
  fileSelector = document.createElement('input', {});
  fileSelector.style.display = 'none';
  fileSelector.setAttribute('name', 'bein-file-picker');
  fileSelector.setAttribute('type', 'file');
};

const openPickerSingle = async () => {
  return new Promise(resolve => {
    if (!fileSelector) {
      initFileSelector();
    }
    fileSelector.value = '';
    fileSelector.addEventListener('change', () => {
      if (fileSelector.files.length > 0) {
        resolve(fileSelector.files[0]);
      }
    });
    fileSelector.click();
  });
};

const BeinDocumentPicker = {
  openPickerSingle,
};

export default BeinDocumentPicker;
