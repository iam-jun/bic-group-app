import {IFilePicked} from '~/interfaces/common';

let imageSelector: any;

const initImageSelector = () => {
  imageSelector = document.createElement('input', {});
  imageSelector.style.display = 'none';
  imageSelector.setAttribute('name', 'bein-image-picker');
  imageSelector.setAttribute('type', 'file');
  imageSelector.setAttribute('multiple', 'multiple');
  imageSelector.setAttribute('accept', 'image/*,image/heif,image/heic,video/*');
};

const openPickerSingle = () => {
  return new Promise(resolve => {
    if (!imageSelector) {
      initImageSelector();
    }
    imageSelector.value = '';
    imageSelector.addEventListener('change', () => {
      if (imageSelector.files.length > 0) {
        const result: IFilePicked = imageSelector.files[0];
        result.filename = result.name;
        result.mime = result.type;
        resolve(result);
      }
    });
    imageSelector.click();
  });
};

const BeinImagePicker = {
  openPickerSingle,
};

export default BeinImagePicker;
