import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { get } from 'lodash';
import { IGetFile } from '~/services/imageUploader';

export const getTotalFileSize = () => useSelector(
  createSelector(
    (state) => get(state, 'post.createPost.files'),
    (files) => {
      let totalSize = 0;
      files.forEach((file: IGetFile) => {
        totalSize += file.size;
      });
      return {
        totalFiles: files.length,
        totalSize,
      };
    },
  ),
);
