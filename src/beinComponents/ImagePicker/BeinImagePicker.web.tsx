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

const getImageDimension = (file: any) => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function (e: any) {
      const data = e.target.result;
      const img = new Image();
      img.src = data;
      img.onload = function () {
        resolve({
          width: img.width,
          height: img.height,
        });
      };
    };
    reader.readAsDataURL(file);
  });
};

const formatImage = async (image: any) => {
  let data: any = {};
  try {
    data = await getImageDimension(image);
  } catch (e) {
    console.log(`\x1b[31m🐣️ BeinImagePicker.web getImage info `, e, `\x1b[0m`);
  }
  image.filename = image?.name;
  image.mime = image?.type;
  image.width = data?.width;
  image.height = data?.height;
  return image;
};

const openPickerSingle = () => {
  return new Promise(resolve => {
    const imageSelector = createImageSelector();
    imageSelector.value = '';
    imageSelector.addEventListener('change', async () => {
      if (imageSelector?.files && imageSelector?.files?.length > 0) {
        const result = await formatImage(imageSelector.files[0]);
        resolve(result);
      }
    });
    imageSelector.click();
  });
};

const openPickerMultiple = () => {
  return new Promise(resolve => {
    const imageSelector = createImageSelector(true);
    imageSelector.value = '';
    imageSelector.addEventListener('change', async () => {
      if (imageSelector?.files && imageSelector.files.length > 0) {
        const result: IFilePicked[] = [];
        for (let i = 0; i < imageSelector.files.length; i++) {
          const image = await formatImage(imageSelector.files[i]);
          result.push(image);
        }
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
