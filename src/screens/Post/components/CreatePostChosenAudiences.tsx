import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {useBaseHook} from '~/hooks';
import Button from '~/beinComponents/Button';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {useCreatePost} from '~/hooks/post';
import {IAudience} from '~/interfaces/IPost';
import Icon from '~/beinComponents/Icon';

const CreatePostChosenAudiences = () => {
  const {t, navigation} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const createPostData = useCreatePost();
  const {chosenAudiences} = createPostData || {};

  const names = getNames(chosenAudiences, t);

  const onPressSelectAudience = () => {
    navigation.navigate(homeStack.postSelectAudience);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPressSelectAudience}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Text.BodyS
          color={theme.colors.textSecondary}
          style={styles.textSendTo}>
          {`${t('post:send_to')} `}
          <Text.H6>{names}</Text.H6>
        </Text.BodyS>
        {chosenAudiences?.length === 0 && (
          <Button.Secondary
            textProps={{
              variant: 'body',
              useI18n: true,
              color: theme.colors.primary7,
            }}
            borderRadius={theme.spacing?.borderRadius.large}
            style={{
              paddingHorizontal: theme.spacing?.padding.large,
              alignSelf: 'center',
              paddingVertical: theme.spacing?.padding.tiny,
            }}
            onPress={onPressSelectAudience}>
            post:choose_group_people
          </Button.Secondary>
        )}
      </View>
      <Icon icon={'AngleRightB'} />
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

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: spacing?.padding.extraLarge,
      paddingVertical: spacing?.padding.base,
    },
    textSendTo: {
      marginRight: spacing?.margin.small,
      marginTop: spacing?.margin.small,
    },
  });
};

export default CreatePostChosenAudiences;
