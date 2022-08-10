import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle, Dimensions,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import { IGroup } from '~/interfaces/IGroup';
import Avatar from '~/bicComponents/Avatar';
import Icon from '~/beinComponents/Icon';
import privacyTypes from '~/constants/privacyTypes';
import spacing from '~/theme/spacing';

export interface ReorderGroupItemProps {
  style?: StyleProp<ViewStyle>;
  group: IGroup;
}

const screenWidth = Dimensions.get('window').width;

const MARGIN_HORIZONTAL = 40;
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
  const privacyData = privacyTypes.find((i) => i?.type === privacy) || {};
  const { icon: privacyIcon }: any = privacyData || {};

  return (
    <View style={[styles.container, style]}>
      <View style={styles.groupInfo}>
        <View style={styles.drag}>
          <Icon size={16} icon="Bars" tintColor={colors.white} />
        </View>
        <View>
          <Avatar.Tiny source={icon} />
          <View style={styles.iconPrivacy}>
            <Icon size={spacing.margin.base} icon={privacyIcon} />
          </View>
        </View>
        <Text.H6
          numberOfLines={1}
          style={{ flex: 1, marginLeft: spacing.margin.small }}
        >
          {name}
        </Text.H6>
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
      borderWidth: 1,
      borderColor: colors.neutral5,
      backgroundColor: colors.white,
    },
    iconPrivacy: {
      width: spacing.margin.base,
      height: spacing.margin.base,
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.white,
      borderRadius: 2,
    },
    textName: { flex: 1, marginLeft: spacing.margin.small },
    drag: {
      width: 25,
      height: '100%',
      backgroundColor: colors.gray20,
      marginRight: spacing.margin.small,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default ReorderGroupItem;
