let imageSelector: any;
let fileSelector: any;

const _Picker = {
  openPicker: async () => {
    return new Promise(resolve => {
      if (!imageSelector) {
        imageSelector = document.createElement('input', {});
        imageSelector.style.display = 'none';
        imageSelector.setAttribute('name', 'bein-picker');
        imageSelector.setAttribute('type', 'file');
        // imageSelector.setAttribute('multiple', 'multiple');
        imageSelector.setAttribute(
          'accept',
          'image/*,image/heif,image/heic,video/*',
        );
      }
      imageSelector.value = '';
      const onFileChange = () => {
        if (imageSelector.files.length > 0) {
          const result = imageSelector.files[0];
          result.filename = result.name;
          result.mime = result.type;
          resolve(result);
        }
      };
      imageSelector.addEventListener('change', onFileChange);
      imageSelector.click();
    });
  },
  pickSingle: async () => {
    return new Promise(resolve => {
      if (fileSelector) {
        fileSelector = document.createElement('input', {});
        fileSelector.style.display = 'none';
        fileSelector.setAttribute('name', 'bein-picker');
        fileSelector.setAttribute('type', 'file');
      }
      fileSelector.value = '';
      const onFileChange = () => {
        if (fileSelector.files.length > 0) {
          resolve(fileSelector.files[0]);
        }
      };
      fileSelector.addEventListener('change', onFileChange);
      fileSelector.click();
    });
  },
};

export default _Picker;
