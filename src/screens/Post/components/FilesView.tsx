import {StyleSheet, View} from 'react-native';
import React from 'react';
import UploadingFile, {
  UploadingFileProps,
} from '~/beinComponents/UploadingFile';
import {IGetFile} from '~/services/fileUploader';
import {isEmpty, isNumber} from 'lodash';
import {IActivityDataFile} from '~/interfaces/IPost';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import appConfig from '~/configs/appConfig';
import {formatBytes} from '~/utils/formatData';

interface Props extends Partial<UploadingFileProps> {
  files: IGetFile[] | IActivityDataFile[];
  remainingSize?: number;
  onRemoveFile?: (item: IGetFile) => void;
}

const FilesView = ({files, remainingSize, onRemoveFile, ...props}: Props) => {
  if (isEmpty(files)) return null;

  const theme: ITheme = useTheme() as ITheme;
  const {t} = useBaseHook();
  const styles = themeStyles(theme);

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
            <ViewSpacing
              key={`create-post-file-spacing-${index}`}
              height={theme.spacing.margin.small}
            />
          )}
        </>
      ))}
      {isNumber(remainingSize) && (
        <Text.Subtitle style={styles.remainingText}>
          {t('upload:text_file_remainning', {
            max_files: appConfig.maxFiles,
            remaining_size: formatBytes(remainingSize),
          })}
        </Text.Subtitle>
      )}
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    remainingText: {
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.small,
      color: theme.colors.textSecondary,
    },
  });
};

export default FilesView;
