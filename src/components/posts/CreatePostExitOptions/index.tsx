import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';

import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import useModalStore from '~/store/modal';

export interface CreatePostExitOptionsProps {
  onPressSaveDraft?: () => void;
}

const CreatePostExitOptions: FC<CreatePostExitOptionsProps> = ({
  onPressSaveDraft,
}: CreatePostExitOptionsProps) => {
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const modalActions = useModalStore((state) => state.actions);

  const onPressSaveAsDraft = () => {
    modalActions.hideModal();
    onPressSaveDraft?.();
  };

  const onPressDiscard = () => {
    modalActions.hideModal();
    rootNavigation.goBack();
  };

  const onPressContinue = () => {
    modalActions.hideModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text.H6 useI18n>post:post_exit_title</Text.H6>
        <Text.BodyS color={colors.gray50} useI18n>
          post:post_exit_desc
        </Text.BodyS>
      </View>
      <PrimaryItem
        leftIconProps={{ icon: 'FilePen', size: 20 }}
        leftIcon="FilePen"
        title={t('post:post_exit_option_save')}
        onPress={onPressSaveAsDraft}
      />
      <PrimaryItem
        leftIconProps={{ icon: 'TrashCan', size: 20 }}
        leftIcon="TrashCan"
        title={t('post:post_exit_option_discard')}
        onPress={onPressDiscard}
      />
      <PrimaryItem
        leftIconProps={{ icon: 'PenLine', size: 20 }}
        leftIcon="PenLine"
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
