import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle, Dimensions,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import { IGroup } from '~/interfaces/IGroup';
import Avatar from '~/baseComponents/Avatar';
import Icon from '~/baseComponents/Icon';
import { groupPrivacyListDetail } from '~/constants/privacyTypes';
import spacing from '~/theme/spacing';

export interface ReorderGroupItemProps {
  style?: StyleProp<ViewStyle>;
  group: IGroup;
}

const screenWidth = Dimensions.get('window').width;

const MARGIN_HORIZONTAL = 30;
const MARGIN_VERTICAL = 8;
export const ITEM_WIDTH = screenWidth - 2 * MARGIN_HORIZONTAL;
export const ITEM_HEIGHT = 36 + 2 * MARGIN_VERTICAL;

const ReorderGroupItem: FC<ReorderGroupItemProps> = ({
  style,
  group,
}: ReorderGroupItemProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const { privacy, icon, name } = group || {};
  const privacyData = groupPrivacyListDetail.find((i) => i?.type === privacy) || {};
  const { icon: privacyIcon }: any = privacyData || {};

  return (
    <View style={[styles.container, style]}>
      <View style={styles.groupInfo}>
        <View style={styles.drag}>
          <Icon size={spacing.margin.base} icon="Bars" tintColor={colors.white} />
        </View>
        <Avatar.Base source={icon} privacyIcon={privacyIcon} />
        <Text.BodyMMedium
          numberOfLines={1}
          style={styles.textName}
          color={colors.neutral60}
        >
          {name}
        </Text.BodyMMedium>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
      marginHorizontal: MARGIN_HORIZONTAL,
      paddingVertical: MARGIN_VERTICAL,
      justifyContent: 'center',
    },
    groupInfo: {
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    textName: { flex: 1, marginLeft: spacing.margin.small },
    drag: {
      width: 24,
      height: '100%',
      backgroundColor: colors.neutral20,
      marginRight: spacing.margin.base,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default ReorderGroupItem;
