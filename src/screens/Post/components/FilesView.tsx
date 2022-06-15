import {View} from 'react-native';
import React from 'react';
import UploadingFile, {
  UploadingFileProps,
} from '~/beinComponents/UploadingFile';
import {IGetFile} from '~/services/fileUploader';
import {isEmpty} from 'lodash';
import {IActivityDataFile} from '~/interfaces/IPost';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';

interface Props extends Partial<UploadingFileProps> {
  files: IGetFile[] | IActivityDataFile[];
  onRemoveFile?: (item: IGetFile) => void;
}

const FilesView = ({files, onRemoveFile, ...props}: Props) => {
  if (isEmpty(files)) return null;

  const theme: ITheme = useTheme() as ITheme;

  return (
    <View>
      {files.map((item: any, index: number) => (
        <>
          <UploadingFile
            key={`create-post-file-${index}`}
            file={item}
            onClose={() => onRemoveFile?.(item)}
            {...props}
          />
          {index < files.length - 1 && (
            <ViewSpacing height={theme.spacing.margin.small} />
          )}
        </>
      ))}
    </View>
  );
};

export default FilesView;
