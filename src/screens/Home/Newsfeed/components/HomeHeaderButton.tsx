import React, { FC } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';

import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';
import Icon from '~/beinComponents/Icon';
import IconChat from '~/beinComponents/IconChat';

export interface HomeHeaderButtonProps {
  style?: StyleProp<ViewStyle>;
  onPressChat?: () => void;
  onPressSearch?: () => void;
}

const HomeHeaderButton: FC<HomeHeaderButtonProps> = ({ style, onPressSearch, onPressChat }: HomeHeaderButtonProps) => {
  const styles = createStyle();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <Button onPress={onPressSearch} style={{ marginRight: spacing.margin.large }}>
          <Icon size={24} icon="iconSearch" />
        </Button>
        {onPressChat && <IconChat onPress={onPressChat} />}
      </View>
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.margin.large,
  },
});

export default HomeHeaderButton;
