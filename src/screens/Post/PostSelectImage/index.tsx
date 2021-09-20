import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {useRootNavigation} from '~/hooks/navigation';
import * as modalActions from '~/store/modal/actions';
import i18n from '~/localization';
import {useDispatch} from 'react-redux';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';

export interface PostSelectImageProps {
  style?: StyleProp<ViewStyle>;
}

const PostSelectImage: FC<PostSelectImageProps> = ({
  style,
}: PostSelectImageProps) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const selectedImages =
    useKeySelector(postKeySelector.createPost.images) || [];

  const onPressBack = () => {
    dispatch(
      modalActions.showAlert({
        title: i18n.t('common:label_discard_changes'),
        content: i18n.t('common:text_discard_warning'),
        showCloseButton: true,
        cancelBtn: true,
        cancelLabel: i18n.t('common:btn_continue_editing'),
        confirmLabel: i18n.t('common:btn_discard'),
        onConfirm: () => rootNavigation.goBack(),
        stretchOnWeb: true,
      }),
    );
  };

  const onPressSave = () => {
    //todo save image
    rootNavigation.goBack();
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.background}>
      <Header
        titleTextProps={{useI18n: true}}
        title={'post:title_edit_images'}
        buttonText={'common:btn_done'}
        buttonProps={{useI18n: true}}
        onPressBack={onPressBack}
        onPressButton={onPressSave}
      />
      <Text>{JSON.stringify(selectedImages)}</Text>
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
  });
};

export default PostSelectImage;
