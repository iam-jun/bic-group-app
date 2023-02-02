import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Button } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import ImagePicker from '~/beinComponents/ImagePicker';
import UploadingImage from '~/beinComponents/UploadingImage';
import { uploadTypes } from '~/configs/resourceConfig';

import { IFilePicked } from '~/interfaces/common';
import { IArticleCover } from '~/interfaces/IPost';
import useCreateArticle from '~/screens/articles/CreateArticle/hooks/useCreateArticle';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import { IGetFile } from '~/store/uploader';
import dimension, { scaleSize } from '~/theme/dimension';
import spacing from '~/theme/spacing';
import { checkPermission, permissionTypes } from '~/utils/permission';
import EditAction from '../../components/EditAction';

const COVER_WIDTH = dimension.deviceWidth;
const COVER_HEIGHT = scaleSize(200);

type CreateArticleCoverProps = {
  articleId: string;
}

const CreateArticleCover: FC<CreateArticleCoverProps> = ({ articleId }) => {
  const [selectingCover, setSelectingCover] = useState<IFilePicked>();
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const actions = useCreateArticleStore((state) => state.actions);
  const coverMedia: IArticleCover = useCreateArticleStore((state) => state.data.coverMedia) || {};

  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const {
    handleSave,
  } = useCreateArticle({ articleId });

  const onPressSelect = () => {
    checkPermission(
      permissionTypes.photo, dispatch, (canOpenPicker) => {
        if (canOpenPicker) {
          ImagePicker.openPickerSingle({
            mediaType: 'photo',
          }).then((file) => {
            setSelectingCover(file);
            setUploadingImage(true);
          });
        }
      },
    );
  };

  const onUploadSuccess = (file: IGetFile) => {
    if (file?.result?.id && file?.result?.url) {
      actions.setCover(file.result as IArticleCover);
      setUploadingImage(false);
      handleSave({ isNavigateBack: false });
    } else {
      console.error('\x1b[36m🐣️ index onUploadSuccess invalid result\x1b[0m');
    }
  };

  const onError = (error) => {
    setError(error);
    setUploadingImage(false);
  };

  const renderError = (error: string) => (
    <Button style={[styles.cover, styles.errorContainer]} onPress={onPressSelect}>
      <Icon icon="Image" size={30} tintColor={theme.colors.neutral20} />
      <Text.SubtitleM style={styles.textAddCover} useI18n>common:text_select_file</Text.SubtitleM>
      <Text.BodyXS style={styles.textError}>{error}</Text.BodyXS>
    </Button>
  );

  const renderButton = () => {
    if (uploadingImage || error) return null;

    if (!coverMedia?.url) {
      return (
        <Button style={[styles.centerButtonContainer, styles.emptyCoverContainer]} onPress={onPressSelect}>
          <Icon icon="Image" size={30} tintColor={theme.colors.neutral20} />
          <Text.SubtitleM style={styles.textAddCover} useI18n>common:text_select_file</Text.SubtitleM>
        </Button>
      );
    }

    return (
      <EditAction style={styles.btnEdit} onPress={onPressSelect} type="edit" />
    );
  };

  return (
    <View style={{ ...theme.elevations.e2 }}>
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
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
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
      backgroundColor: colors.neutral1,
    },
    cover: {
      width: '100%',
      height: scaleSize(200),
      borderRadius: 0,
    },
    textAddCover: {
      marginTop: spacing.margin.base,
      color: colors.blue50,
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
    btnEdit: {
      backgroundColor: colors.white,
    },
  });
};

export default CreateArticleCover;
