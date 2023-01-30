import { IUploadType } from '~/configs/resourceConfig';
import { IFilePicked } from '~/interfaces/common';
import {
  createStore, resetStore,
} from '~/store/utils';
import IBaseState, { InitStateType } from '../interfaces/IBaseState';
import upload from './actions/upload';

export interface IGetFile {
  id?: string;
  name: string;
  url?: string;
  size?: any;
  uploading?: boolean;
  uploadType?: IUploadType;
  result?: any;
  type?: string;
  thumbnails?: any[];
}

export interface IUploadParam {
  type?: 'file'|'image'
  file: IFilePicked;
  uploadType: IUploadType;
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

export interface IUploaderState extends IBaseState {
  uploadingFiles: {[x: string]: number};
  uploadedFiles: {[x: string]: IGetFile};
  abortController: {[x: string]: AbortController};
  errors: {[x: string]: string};
  actions:{
    upload: (data: IUploadParam) => void;
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
    upload: upload(set, get),
    cancel: (file: any) => {
      const filename = file?.name || file?.filename || file?.fileName;
      const { fileAbortController } = get();
      fileAbortController?.[filename]?.abort?.();

      set((state) => {
        state.error?.[filename] && delete state.error?.[filename];
        state.uploadingFiles?.[filename] && delete state.uploadingFiles?.[filename];
        state.abortController?.[filename] && delete state.abortController?.[filename];
      }, 'cancel');
    },
    cancelAllFiles: () => {
      const { fileAbortController } = get();
      Object.keys(fileAbortController).forEach((file) => fileAbortController?.[file]?.abort?.());
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
