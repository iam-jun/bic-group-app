import ApiConfig from '~/configs/apiConfig';
import {IFilePicked} from '~/interfaces/common';
import {makeHttpRequest} from '~/services/httpApiRequest';

export default class FileUploader {
  static INSTANCE: FileUploader | null = null;

  static fileUploaded = {};

  static getInstance() {
    if (!FileUploader.INSTANCE) {
      FileUploader.INSTANCE = new FileUploader();
    }
    return FileUploader.INSTANCE;
  }

  upload(file: IFilePicked) {
    const formData = new FormData();
    // @ts-ignore
    formData.append('file', file, file.name);
    formData.append(
      'description',
      JSON.stringify({
        size: file.size,
        type: file.type,
      }),
    );
    console.log(
      `\x1b[35m🐣️ fileUploader upload formData: `,
      formData,
      `\x1b[0m`,
    );

    makeHttpRequest(ApiConfig.Upload.uploadFile('postImage', formData))
      .then((response: any) => {
        if (response?.data) {
          console.log(
            `\x1b[34m🐣️ fileUploader `,
            `${JSON.stringify(response?.data, undefined, 2)}\x1b[0m`,
          );
        }
      })
      .catch(e => {
        console.log(
          `\x1b[34m🐣️ fileUploader error: `,
          `${JSON.stringify(e, undefined, 2)}\x1b[0m`,
        );
      });
  }

  delete() {
    console.log(`\x1b[36m🐣️ fileUploader delete\x1b[0m`);
  }
}
