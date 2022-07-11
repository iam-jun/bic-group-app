import React from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';

import Text from '~/beinComponents/Text';
import Avatar from '~/beinComponents/Avatar';
import {useKeySelector} from '~/hooks/selector';
import spacing from '~/theme/spacing';

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

  return (
    <TouchableOpacity
      testID="header_avatar_view"
      disabled={!isInternetReachable}
      style={StyleSheet.flatten([styles.container, containerStyle])}
      onPress={onPress}>
      <Avatar.Large source={avatar} style={styles.avatar} />
      <View style={{flex: 1}}>
        <Text.H6 testID="header_avatar_view.first_label">{firstLabel}</Text.H6>
        <Text.Subtitle testID="header_avatar_view.second_label">
          {secondLabel}
        </Text.Subtitle>
      </View>
    </TouchableOpacity>
  );
};

export default HeaderAvatarView;

const styles = StyleSheet.create({
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
