import React from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import Text from '~/beinComponents/Text';
import Avatar from '~/beinComponents/Avatar';
import {ITheme} from '~/theme/interfaces';

interface HeaderAvatarViewProps {
  firstLabel: string;
  secondLabel: string;
  avatar: string;
  containerStyle: StyleProp<ViewStyle>;
}

const HeaderAvatarView = ({
  firstLabel,
  secondLabel,
  avatar,
  containerStyle,
}: HeaderAvatarViewProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  return (
    <TouchableOpacity
      style={StyleSheet.flatten([styles.container, containerStyle])}>
      <Avatar.UltraLarge source={avatar} style={styles.avatar} />
      <View style={{flex: 1}}>
        <Text.H6>{firstLabel}</Text.H6>
        <Text.Subtitle>{secondLabel}</Text.Subtitle>
      </View>
    </TouchableOpacity>
  );
};

export default HeaderAvatarView;

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginTop: spacing.margin.small,
      alignItems: 'center',
    },
    avatar: {
      marginLeft: spacing.margin.large,
      marginRight: spacing.margin.base,
    },
  });
};
