import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Avatar, Button } from '~/baseComponents';
import { IGroup } from '~/interfaces/IGroup';
import { GroupPrivacyDetail } from '~/constants/privacyTypes';
import { IconType } from '~/resources/icons';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import Tag from '~/baseComponents/Tag';
import Icon from '~/baseComponents/Icon';

export interface GroupItemProps {
  style?: StyleProp<ViewStyle>;
  item: IGroup;
  nameLines?: number;

  onPress: (item: IGroup, isChecked: boolean) => void
  shouldBeChecked: (item: IGroup) => boolean;
  isSingleSelect?: boolean;
}

const AudienceContent: FC<GroupItemProps> = ({
  style,
  item,
  nameLines = 1,

  onPress,
  shouldBeChecked,
  isSingleSelect,
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles();
  const { colors } = theme;
  const [checked, setChecked] = useState(shouldBeChecked(item));

  const {
    icon, name, privacy, community,
  } = item || {};
  const { name: communityName } = community || {};
  const privacyIcon = GroupPrivacyDetail[privacy]?.icon as IconType;

  useEffect(() => {
    setChecked(shouldBeChecked(item));
  }, [shouldBeChecked(item)]);

  const _onPress = () => {
    const newValue = !checked;
    onPress(item, newValue);
    setChecked(newValue);
  };

  const checkBoxStyles = {
    unselect: {
      iconName: !isSingleSelect && 'Square' as IconType,
      iconColor: !isSingleSelect && colors.neutral20,
    },
    selected: {
      iconName: isSingleSelect ? 'Check' : 'SquareCheckSolid' as IconType,
      iconColor: isSingleSelect ? colors.green50 : colors.blue50,
    },
  };

  const { iconName, iconColor } = checked ? checkBoxStyles.selected : checkBoxStyles.unselect;

  return (
    <Button
      testID="group_item.container"
      style={[styles.container, style]}
      onPress={_onPress}
    >
      <Avatar.Base
        source={icon}
        privacyIcon={privacyIcon}
      />
      <View style={styles.textContainer}>
        <Text.BodyM
          style={styles.textName}
          color={theme.colors.neutral60}
          numberOfLines={nameLines}
        >
          {name}
        </Text.BodyM>
        <Tag
          textProps={{ numberOfLines: 1 }}
          style={styles.tagContainer}
          type="secondary"
          label={communityName}
          disabled
        />
      </View>
      <View>
        {
          !!iconName && <Icon icon={iconName} size={22} tintColor={iconColor} />
        }
      </View>
    </Button>
  );
};

const themeStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.padding.base,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textName: {
    width: '100%',
    justifyContent: 'center',
  },
  tagContainer: {
    alignSelf: 'baseline',
    marginTop: spacing.margin.xTiny,
  },
});

export default AudienceContent;
