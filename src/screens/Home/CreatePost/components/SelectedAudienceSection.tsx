import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {useBaseHook} from '~/hooks';
import Button from '~/beinComponents/Button';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';

const SelectedAudienceSection = () => {
  const {navigation} = useBaseHook();
  const theme: ITheme = useTheme();
  const styles = createStyle(theme);

  const onPressSelectAudience = () => {
    navigation.navigate(homeStack.selectAudience);
  };

  return (
    <View style={styles.container}>
      <Text.H6 style={styles.textSendTo} useI18n>
        post:send_to
      </Text.H6>
      <Button.Secondary
        useI18n
        borderRadius={theme.spacing?.borderRadius.large}
        style={{paddingHorizontal: theme.spacing?.padding.large}}
        onPress={onPressSelectAudience}>
        post:choose_group_people
      </Button.Secondary>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flexWrap: 'wrap',
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

export default SelectedAudienceSection;
