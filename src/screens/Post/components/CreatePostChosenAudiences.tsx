import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Text from '~/beinComponents/Text';

import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {useBaseHook} from '~/hooks';
import Button from '~/beinComponents/Button';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {IAudience} from '~/interfaces/IPost';
import Icon from '~/beinComponents/Icon';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import spacing from '~/theme/spacing';

interface CreatePostChosenAudiencesProps {
  disabled?: boolean;
}

const CreatePostChosenAudiences: React.FC<CreatePostChosenAudiencesProps> = ({
  disabled,
}: CreatePostChosenAudiencesProps) => {
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();

  const theme: ExtendedTheme = useTheme() as ExtendedTheme;

  const chosenAudiences = useKeySelector(
    postKeySelector.createPost.chosenAudiences,
  );

  const names = getNames(chosenAudiences, t);

  const onPressSelectAudience = () => {
    rootNavigation.navigate(homeStack.postSelectAudience);
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, {opacity: disabled ? 0.5 : 1}]}
      onPress={onPressSelectAudience}
      testID="create_post_chosen_audiences">
      <View style={styles.contentContainer}>
        <Text.BodyS color={theme.colors.gray50} style={styles.textSendTo}>
          {`${t('post:send_to')} `}
          <Text.H6 testID="create_post_chosen_audiences.names">{names}</Text.H6>
        </Text.BodyS>
        {chosenAudiences?.length === 0 && (
          <Button.Secondary
            textProps={{
              variant: 'bodyM',
              useI18n: true,
              color: theme.colors.purple60,
            }}
            borderRadius={spacing?.borderRadius.large}
            style={styles.buttonChoose}
            onPress={onPressSelectAudience}
            testID="create_post_chosen_audiences.choose_group">
            post:choose_group_people
          </Button.Secondary>
        )}
      </View>
      <Icon icon={'AngleRightSolid'} />
    </TouchableOpacity>
  );
};

const getNames = (chosenAudiences: IAudience[], t: any) => {
  let result = '';
  if (chosenAudiences?.length > 0) {
    result = chosenAudiences?.[0]?.name || '';
    const countLeft = chosenAudiences.length - 1;
    if (countLeft > 0) {
      result = `${result} ${t('post:and')} ${countLeft} ${t(
        'post:other_places',
      )}`;
    }
  }
  return result;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing?.padding.extraLarge,
    paddingVertical: spacing?.padding.small,
    alignItems: 'center',
  },
  contentContainer: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  textSendTo: {
    marginRight: spacing?.margin.tiny,
    marginVertical: spacing.margin.small,
  },
  buttonChoose: {
    paddingHorizontal: spacing?.padding.large,
    alignSelf: 'center',
    paddingVertical: spacing?.padding.tiny,
  },
});

export default CreatePostChosenAudiences;
