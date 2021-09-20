import {IFilePicked} from '~/interfaces/common';

const createImageSelector = (multiple = false) => {
  const imageSelector = document.createElement('input', {});
  imageSelector.style.display = 'none';
  imageSelector.setAttribute('name', 'bein-image-picker');
  imageSelector.setAttribute('type', 'file');
  if (multiple) {
    imageSelector.setAttribute('multiple', 'multiple');
  }
  imageSelector.setAttribute('accept', 'image/*,image/heif,image/heic,video/*');
  return imageSelector;
};

const openPickerSingle = () => {
  return new Promise(resolve => {
    const imageSelector = createImageSelector();
    imageSelector.value = '';
    imageSelector.addEventListener('change', () => {
      if (imageSelector?.files && imageSelector?.files?.length > 0) {
        const result: any = imageSelector.files[0];
        result.filename = result.name;
        result.mime = result.type;
        resolve(result as IFilePicked);
      }
    });
    imageSelector.click();
  });
};

const openPickerMultiple = () => {
  return new Promise(resolve => {
    const imageSelector = createImageSelector(true);
    imageSelector.value = '';
    imageSelector.addEventListener('change', () => {
      if (imageSelector?.files && imageSelector.files.length > 0) {
        const result: any = [];
        // @ts-ignore
        imageSelector.files.map?.((image: any) => {
          image.filename = image.name;
          image.mime = image.type;
          result.push(image);
        });
        resolve(result);
      }
    });
    imageSelector.click();
  });
};

const BeinImagePicker = {
  openPickerSingle,
  openPickerMultiple,
};

export default BeinImagePicker;
