import { IFilePicked } from '~/interfaces/common';
import {
  createStore, resetStore,
} from '~/store/utils';
import IBaseState, { InitStateType } from '../interfaces/IBaseState';
import { ResourceUploadType } from '~/interfaces/IUpload';
import uploadFile from './actions/uploadFile';
import uploadImage from './actions/uploadImage';

export interface IGetFile {
  id?: string;
  name: string;
  url?: string;
  size?: any;
  uploading?: boolean;
  uploadType?: ResourceUploadType;
  result?: any;
  type?: string;
  thumbnails?: any[];
}

export interface IUploadParam {
  file: IFilePicked;
  uploadType: ResourceUploadType;
}

export interface IFileUploadResponse {
  id?: string;
  originUrl: string;
  properties: {
    name: string;
    mimeType: string;
    size: number;
  };
}

// thêm field localUrl vào obj uploadingFiles để hiện ảnh local khi update
// sau khi upload xong thì xóa hết field đó đi

export interface IUploaderState extends IBaseState {
  uploadingFiles: {[x: string]: number};
  uploadedFiles: {[x: string]: IGetFile};
  abortController: {[x: string]: AbortController};
  errors: {[x: string]: string};
  actions:{
    uploadFile: (data: IUploadParam) => void;
    uploadImage: (data: IUploadParam) => void;
    cancel: (file: any) => void;
    cancelAllFiles: () => void;
  }
}

const initialState: InitStateType<IUploaderState> = {
  uploadingFiles: {},
  uploadedFiles: {},
  abortController: {},
  errors: {},
};

const uploaderStore = (set, get) => ({
  ...initialState,
  actions: {
    uploadFile: uploadFile(set, get),
    uploadImage: uploadImage(set, get),
    cancel: (file: any) => {
      const filename = file?.name || file?.filename || file?.fileName;
      const { abortController } = get();
      abortController?.[filename]?.abort?.();

      set((state) => {
        state.error?.[filename] && delete state.error?.[filename];
        state.uploadingFiles?.[filename] && delete state.uploadingFiles?.[filename];
        state.abortController?.[filename] && delete state.abortController?.[filename];
      }, 'cancel');
    },
    cancelAllFiles: () => {
      const { abortController } = get();
      Object.keys(abortController).forEach((file) => abortController?.[file]?.abort?.());
      set((state) => {
        state.error = {};
        state.uploadingFiles = {};
        state.abortController = {};
      }, 'cancelAllFiles');
    },
  },
  reset: () => resetStore(initialState, set),
});

const useUploaderStore = createStore<IUploaderState>(uploaderStore);

export default useUploaderStore;
