import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import UploadingImage from '~/beinComponents/UploadingImage';
import { uploadTypes } from '~/configs/resourceConfig';
import { IFilePicked } from '~/interfaces/common';
import dimension, { scaleSize } from '~/theme/dimension';
import Icon from '~/baseComponents/Icon';
import { Button } from '~/baseComponents';
import { checkPermission, permissionTypes } from '~/utils/permission';
import ImagePicker from '~/beinComponents/ImagePicker';
import { IArticleCover } from '~/interfaces/IPost';
import { IGetFile } from '~/store/uploader';

const COVER_WIDTH = dimension.deviceWidth;
const COVER_HEIGHT = scaleSize(200);

interface Props {
  style?: any;
  disabled?: boolean;
  coverMedia: IArticleCover;
  onUploadSuccess: (cover: IArticleCover) => void;
}

const CoverImage = ({
  style, coverMedia, disabled, onUploadSuccess,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const [selectingCover, setSelectingCover] = useState<IFilePicked>();
  const [error, setError] = useState('');

  const onPressSelect = () => {
    checkPermission(
      permissionTypes.photo, (canOpenPicker) => {
        if (canOpenPicker) {
          ImagePicker.openPickerSingle({
            mediaType: 'photo',
          }).then((file) => {
            setSelectingCover(file);
          });
        }
      },
    );
  };

  const handleUploadSuccess = (file: IGetFile) => {
    if (file?.result?.id && file?.result?.url) {
      onUploadSuccess(file.result as IArticleCover);
    } else {
      console.error('\x1b[36m🐣️ index onUploadSuccess invalid result\x1b[0m');
    }
  };

  const onError = (error) => setError(error);

  const renderError = (error: string) => (
    <View style={[styles.cover, styles.errorContainer]}>
      <Icon icon="Image" size={30} tintColor={theme.colors.neutral40} />
      <Text.SubtitleM style={styles.textAddCover} useI18n>common:text_add_cover</Text.SubtitleM>
      <Text.BodyXS style={styles.textError}>{error}</Text.BodyXS>
      <Button onPress={onPressSelect}>
        <Text.LinkS useI18n>article:text_select_cover</Text.LinkS>
      </Button>
    </View>
  );

  const renderButton = () => {
    if (!coverMedia?.url && !error) {
      return (
        <Button
          testID="create_series.cover_image.button_add"
          style={[styles.centerButtonContainer, styles.emptyCoverContainer]}
          onPress={onPressSelect}
        >
          <Icon icon="Image" size={30} tintColor={theme.colors.neutral40} />
          <Text.SubtitleM style={styles.textAddCover} useI18n>common:text_add_cover</Text.SubtitleM>
        </Button>
      );
    }
    if (error) {
      return null;
    }
    return (
      <View style={styles.centerButtonContainer}>
        <Button.Neutral
          disabled={disabled}
          type="ghost"
          size="medium"
          onPress={onPressSelect}
          useI18n
        >
          series:text_update_cover
        </Button.Neutral>
      </View>
    );
  };

  return (
    <View style={style}>
      <UploadingImage
        uploadType={uploadTypes.postImage}
        style={styles.cover}
        file={selectingCover}
        fileName={selectingCover?.filename}
        url={!selectingCover && coverMedia.url}
        width={COVER_WIDTH}
        height={COVER_HEIGHT}
        onUploadSuccess={handleUploadSuccess}
        onError={onError}
        renderError={renderError}
      />
      {renderButton()}
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: spacing?.padding.large,
      paddingVertical: spacing?.padding.small,
      alignItems: 'center',
      borderBottomColor: colors.neutral5,
      borderBottomWidth: 1,
    },
    textPostTo: {
    },
    cover: {
      width: '100%',
      height: scaleSize(200),
    },
    emptyCoverContainer: {
      backgroundColor: colors.neutral2,
    },
    textAddCover: {
      marginTop: spacing.margin.base,
    },
    iconCamera: {
      position: 'absolute',
      top: spacing.margin.small,
      right: spacing.margin.small,
    },
    errorContainer: {
      backgroundColor: colors.neutral2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textError: {
      color: colors.red40,
      paddingVertical: spacing.padding.small,
    },
    centerButtonContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default CoverImage;
