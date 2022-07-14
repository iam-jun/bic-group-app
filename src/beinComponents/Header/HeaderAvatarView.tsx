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
import {useKeySelector} from '~/hooks/selector';

interface HeaderAvatarViewProps {
  firstLabel: string;
  secondLabel: string;
  avatar: string;
  containerStyle: StyleProp<ViewStyle>;
  onPress?: (...params: any) => void;
}

const HeaderAvatarView = ({
  firstLabel,
  secondLabel,
  avatar,
  containerStyle,
  onPress,
}: HeaderAvatarViewProps) => {
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  return (
    <TouchableOpacity
      testID="header_avatar_view"
      disabled={!isInternetReachable}
      style={StyleSheet.flatten([styles.container, containerStyle])}
      onPress={onPress}>
      <Avatar.Large source={avatar} style={styles.avatar} />
      <View style={{flex: 1}}>
        <Text.H6 testID="header_avatar_view.first_label">{firstLabel}</Text.H6>
        <Text.BodyS testID="header_avatar_view.second_label">
          {secondLabel}
        </Text.BodyS>
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
      paddingHorizontal: spacing.padding.large,
    },
    avatar: {
      marginRight: spacing.margin.base,
    },
  });
};
