import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/beinComponents/Text';

import { useBaseHook } from '~/hooks';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { IAudience } from '~/interfaces/IPost';
import { useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import postKeySelector from '~/storeRedux/post/keySelector';
import spacing from '~/theme/spacing';

interface CreatePostChosenAudiencesProps {
  disabled?: boolean;
}

const CreatePostChosenAudiences: React.FC<CreatePostChosenAudiencesProps> = ({
  disabled,
}: CreatePostChosenAudiencesProps) => {
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const theme: ExtendedTheme = useTheme();

  const chosenAudiences = useKeySelector(postKeySelector.createPost.chosenAudiences);

  const names = getNames(
    chosenAudiences,
  );

  const onPressSelectAudience = () => {
    rootNavigation.navigate(homeStack.postSelectAudience);
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, { opacity: disabled ? 0.5 : 1 }]}
      onPress={onPressSelectAudience}
      testID="create_post_chosen_audiences"
    >
      <Text.BodyM numberOfLines={2} color={theme.colors.neutral40} style={styles.textPostTo}>
        {`${t('post:post_to')} `}
        <Text.BodyMMedium color={theme.colors.neutral70}>{chosenAudiences?.length || 0}</Text.BodyMMedium>
        {': '}
        <Text.BodyMMedium color={theme.colors.neutral70} testID="create_post_chosen_audiences.names">{names}</Text.BodyMMedium>
      </Text.BodyM>
    </TouchableOpacity>
  );
};

const getNames = (
  chosenAudiences: IAudience[],
) => {
  let result = '';
  if (chosenAudiences?.length > 0) {
    const newChosenAudiencesName = [];
    chosenAudiences.forEach((item: IAudience) => {
      newChosenAudiencesName.push(item?.name);
    });
    result = newChosenAudiencesName.join(', ');
  }
  return result;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing?.padding.large,
    paddingVertical: spacing?.padding.small,
    alignItems: 'center',
  },
  textPostTo: {
  },
});

export default CreatePostChosenAudiences;
