import React from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Avatar from '~/beinComponents/Avatar';
import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import {useBaseHook} from '~/hooks';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';

const HeaderCreatePost = () => {
  const {navigation} = useBaseHook();
  const theme: ITheme = useTheme();
  const {colors} = theme;
  const styles = createStyle(theme);

  const onPressCreate = () => {
    navigation.navigate(homeStack.createPost);
  };

  return (
    <View style={styles.container}>
      <Avatar.Medium
        isRounded={true}
        source={
          'https://cdn.dribbble.com/users/183984/screenshots/2569843/pokemon_3.jpg'
        }
      />
      <Button
        TouchableComponent={TouchableHighlight}
        onPress={onPressCreate}
        underlayColor={colors.bgHover}
        style={styles.buttonContainer}>
        <Text.Body
          color={colors.textSecondary}
          useI18n
          style={styles.textStyle}>
          {'post:create_new_post'}
        </Text.Body>
        <Icon tintColor={colors.primary7} icon={'Edit'} />
      </Button>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginBottom: spacing?.margin.base,
      paddingTop: spacing?.padding.base,
      paddingBottom: spacing?.padding.small,
      paddingHorizontal: spacing?.padding.large,
      backgroundColor: colors.background,
      // shadowColor: '#000',
      // shadowOpacity: 0.1,
      // shadowRadius: 1,
      // elevation: 2,
    },
    buttonContainer: {
      flex: 1,
      marginLeft: spacing?.margin.base,
      backgroundColor: colors.borderDivider,
      justifyContent: 'center',
      paddingHorizontal: spacing?.padding.base,
      borderRadius: 20,
    },
    textStyle: {
      flex: 1,
      marginLeft: spacing?.margin.base,
    },
  });
};

export default HeaderCreatePost;
