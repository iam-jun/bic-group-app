import i18next from 'i18next';
import {AppConfig} from '~/configs';
import {IFilePicked} from '~/interfaces/common';

export const validateFile = (file: IFilePicked): string | null => {
  if (file.size > AppConfig.maxFileSize) {
    return i18next.t('common:error:file:over_file_size');
  }
  return null;
};
