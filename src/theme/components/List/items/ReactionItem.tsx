import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import TextContent from '../../Text';
import Icon from '../../Icon';
import {white as WHITE_COLOR} from '~/theme/configs/colors';

export interface Props {
  style?: StyleProp<ViewStyle>;
  icon?: any;
  value?: any;
  tintColor?: string;
}

const ReactionItem: React.FC<Props> = ({
  style,
  icon,
  value,
  tintColor = WHITE_COLOR,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Icon {...icon} tintColor={tintColor} size={9} style={styles.icon} />
      <TextContent>{value}</TextContent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  icon: {
    marginEnd: 6,
    padding: 4,
    borderRadius: 100,
  },
});

export default ReactionItem;
