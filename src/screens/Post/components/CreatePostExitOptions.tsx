import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {useBaseHook} from '~/hooks';
import {useRootNavigation} from '~/hooks/navigation';
import modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import spacing from '~/theme/spacing';

export interface CreatePostExitOptionsProps {
  onPressSaveDraft?: () => void;
}

const CreatePostExitOptions: FC<CreatePostExitOptionsProps> = ({
  onPressSaveDraft,
}: CreatePostExitOptionsProps) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;

  const onPressSaveAsDraft = () => {
    dispatch(modalActions.hideModal());
    onPressSaveDraft?.();
  };

  const onPressDiscard = () => {
    dispatch(modalActions.hideModal());
    rootNavigation.goBack();
  };

  const onPressContinue = () => {
    dispatch(modalActions.hideModal());
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text.H6 useI18n>post:post_exit_title</Text.H6>
        <Text.Subtitle color={colors.textSecondary} useI18n>
          post:post_exit_desc
        </Text.Subtitle>
      </View>
      <PrimaryItem
        height={48}
        leftIconProps={{icon: 'FileEditAlt', size: 20}}
        leftIcon={'FileEditAlt'}
        title={t('post:post_exit_option_save')}
        onPress={onPressSaveAsDraft}
      />
      <PrimaryItem
        height={48}
        leftIconProps={{icon: 'TrashAlt', size: 20}}
        leftIcon={'TrashAlt'}
        title={t('post:post_exit_option_discard')}
        onPress={onPressDiscard}
      />
      <PrimaryItem
        height={48}
        leftIconProps={{icon: 'EditAlt', size: 20}}
        leftIcon={'EditAlt'}
        title={t('post:post_exit_option_continue')}
        onPress={onPressContinue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    padding: spacing.padding.base,
  },
});

export default CreatePostExitOptions;
