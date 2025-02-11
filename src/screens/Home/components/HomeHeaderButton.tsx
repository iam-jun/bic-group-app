import React, { FC } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';

import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
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
        <Button testID="home_header_button.btn_search" onPress={onPressSearch} style={{ marginRight: spacing.margin.tiny }}>
          <Icon size={18} icon="search" />
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
    marginLeft: spacing.margin.large,
  },
});

export default HomeHeaderButton;
