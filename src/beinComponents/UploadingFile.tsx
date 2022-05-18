import React, {FC, useEffect} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {IUploadType} from '~/configs/resourceConfig';
import {IFilePicked} from '~/interfaces/common';
import VideoUploader from '~/services/videoUploader';

export interface UploadingFileProps {
  style?: StyleProp<ViewStyle>;
  uploadType: IUploadType | string;
  file?: IFilePicked;
  fileName?: string;
  url?: string;
}

const UploadingFile: FC<UploadingFileProps> = ({
  uploadType,
  file,
  fileName,
}: UploadingFileProps) => {
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const test = async () => {
    if (file && fileName) {
      const result = VideoUploader.getInstance().getFile(fileName);
      console.log(
        `\x1b[34m🐣️ UploadingFile result: `,
        `${JSON.stringify(result, undefined, 2)}\x1b[0m`,
      );
      const result2 = await VideoUploader.getInstance().upload({
        file,
        uploadType,
      });
      console.log(
        `\x1b[34m🐣️ UploadingFile result2`,
        `${JSON.stringify(result2, undefined, 2)}\x1b[0m`,
      );
      const result3 = VideoUploader.getInstance().getFile(fileName);
      console.log(
        `\x1b[34m🐣️ UploadingFile result: `,
        `${JSON.stringify(result3, undefined, 2)}\x1b[0m`,
      );
    }
  };

  useEffect(() => {
    test();
  }, [fileName]);

  return (
    <View style={styles.container}>
      <Text>Video: {fileName}</Text>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
    },
  });
};

export default UploadingFile;
