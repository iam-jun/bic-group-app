import React, { FC, useState } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Button } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
import Header from '~/beinComponents/Header';
import ImagePicker from '~/beinComponents/ImagePicker';
import Text from '~/beinComponents/Text';
import UploadingImage from '~/beinComponents/UploadingImage';
import { uploadTypes } from '~/configs/resourceConfig';

import { useBaseHook } from '~/hooks';
import { useBackPressListener } from '~/hooks/navigation';
import { IFilePicked } from '~/interfaces/common';
import { EditArticleProps } from '~/interfaces/IArticle';
import { IArticleCover } from '~/interfaces/IPost';
import useEditArticle from '~/screens/articles/EditArticle/hooks/useEditArticle';
import useEditArticleStore from '~/screens/articles/EditArticle/store';
import ImageUploader from '~/services/imageUploader';
import dimension, { scaleSize } from '~/theme/dimension';
import spacing from '~/theme/spacing';
import { checkPermission, permissionTypes } from '~/utils/permission';

const COVER_WIDTH = dimension.deviceWidth;
const COVER_HEIGHT = scaleSize(200);

const EditArticleCover: FC<EditArticleProps> = ({ route }: EditArticleProps) => {
  const articleId = route?.params?.articleId;

  const [selectingCover, setSelectingCover] = useState<IFilePicked>();
  const [error, setError] = useState('');

  const actions = useEditArticleStore((state) => state.actions);
  const coverMedia: IArticleCover = useEditArticleStore((state) => state.data.coverMedia) || {};

  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const {
    handleSave, handleBack, enableButtonSave, loading,
  } = useEditArticle({ articleId });

  const disabled = !enableButtonSave || loading;

  useBackPressListener(handleBack);

  const onPressSelect = () => {
    checkPermission(
      permissionTypes.photo, dispatch, (canOpenPicker) => {
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

  const onUploadSuccess = (url: string, fileName: string) => {
    const file = ImageUploader.getInstance().getFile(fileName);
    if (file?.result?.id && file?.result?.url) {
      actions.setCover(file.result as IArticleCover);
    } else {
      console.error('\x1b[36m🐣️ index onUploadSuccess invalid result\x1b[0m');
    }
  };

  const onError = (error) => setError(error);

  const renderError = (error: string) => (
    <View style={[styles.cover, styles.errorContainer]}>
      <Icon icon="Image" size={30} tintColor={theme.colors.neutral40} />
      <Text.SubtitleM style={styles.textAddCover} useI18n>article:text_add_cover</Text.SubtitleM>
      <Text.BodyXS style={styles.textError}>{error}</Text.BodyXS>
      <Button onPress={onPressSelect}>
        <Text.LinkS useI18n>article:text_select_cover</Text.LinkS>
      </Button>
    </View>
  );

  const renderButton = () => {
    if (!coverMedia?.url) {
      return (
        <Button style={[styles.centerButtonContainer, styles.emptyCoverContainer]} onPress={onPressSelect}>
          <Icon icon="Image" size={30} tintColor={theme.colors.neutral40} />
          <Text.SubtitleM style={styles.textAddCover} useI18n>article:text_add_cover</Text.SubtitleM>
          <View style={styles.iconCamera}>
            <Icon icon="Camera" tintColor={theme.colors.neutral40} size={22} />
          </View>
        </Button>
      );
    }
    if (error) {
      return null;
    }
    return (
      <View style={styles.centerButtonContainer}>
        <Button.Neutral type="ghost" size="medium" onPress={onPressSelect}>
          {t('article:text_change_cover')}
        </Button.Neutral>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('article:title_edit_cover')}
        buttonProps={{ disabled, loading }}
        buttonText={t('common:btn_save')}
        onPressButton={handleSave}
        onPressBack={handleBack}
      />
      <View>
        <UploadingImage
          uploadType={uploadTypes.postImage}
          style={styles.cover}
          file={selectingCover}
          fileName={selectingCover?.filename}
          url={!selectingCover && coverMedia.url}
          width={COVER_WIDTH}
          height={COVER_HEIGHT}
          onUploadSuccess={onUploadSuccess}
          onError={onError}
          renderError={renderError}
        />
        {renderButton()}
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
    textInputContainer: {
      paddingHorizontal: spacing.padding.extraLarge,
    },
    textInput: {
      paddingVertical: 0,
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
    emptyCoverContainer: {
      backgroundColor: colors.neutral2,
    },
    cover: {
      width: '100%',
      height: scaleSize(200),
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
  });
};

export default EditArticleCover;
