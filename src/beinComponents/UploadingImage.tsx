import React, {FC, useState, useEffect} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import FileUploader, {IUploadParam, IUploadType} from '~/services/fileUploader';
import {IFilePicked} from '~/interfaces/common';
import Image from '~/beinComponents/Image';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

export interface UploadingImageProps {
  style?: StyleProp<ViewStyle>;
  uploadType: IUploadType | string;
  file?: IFilePicked;
  fileName?: string;
  url?: string;
  onUploadSuccess?: (url: string, fileName: string) => void;
}

const UploadingImage: FC<UploadingImageProps> = ({
  style,
  uploadType,
  file,
  fileName,
  url,
  onUploadSuccess,
}: UploadingImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [isError, setIsError] = useState(false);

  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  useEffect(() => {
    if (url) {
      setImageUrl(url);
    } else if (file) {
      const param: IUploadParam = {
        uploadType,
        file,
        onSuccess: uploadedUrl => {
          setImageUrl(uploadedUrl);
          onUploadSuccess?.(uploadedUrl, fileName || '');
        },
        onError: e => {
          console.log(`\x1b[31m🐣️ UploadingImage ontError `, e, `\x1b[0m`);
          setIsError(true);
        },
      };
      FileUploader.getInstance().upload(param);
    }
  }, []);

  const renderContent = () => {
    if (imageUrl) {
      return <Image style={{width: '100%', height: 200}} source={imageUrl} />;
    }
    return <LoadingIndicator />;
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
    },
  });
};

export default UploadingImage;
