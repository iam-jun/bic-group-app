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
import { useBaseHook } from '~/hooks';
import Icon from '~/baseComponents/Icon';

export interface GroupItemProps {
  style?: StyleProp<ViewStyle>;
  item: IGroup;
  nameLines?: number;

  onPress: (item: IGroup, isChecked: boolean) => void
  shouldBeChecked: (item: IGroup) => boolean;
  shouldCheckboxDisabled: (item: IGroup) => boolean;
}

const AudienceContent: FC<GroupItemProps> = ({
  style,
  item,
  nameLines = 1,

  onPress,
  shouldBeChecked,
  shouldCheckboxDisabled,
}) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles();
  const { colors } = theme;
  const [checked, setChecked] = useState(shouldBeChecked(item));

  const { icon, name, privacy } = item;
  const privacyIcon = GroupPrivacyDetail[privacy]?.icon as IconType;
  const hideAudienceNoPermission = shouldCheckboxDisabled(item);

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
      iconName: 'Square' as IconType,
      iconColor: colors.neutral20,
    },
    selected: {
      iconName: 'SquareCheckSolid' as IconType,
      iconColor: colors.blue50,
    },
  };

  const { iconName, iconColor } = checked ? checkBoxStyles.selected : checkBoxStyles.unselect;

  if (hideAudienceNoPermission) return null;

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
          style={styles.tagContainer}
          type="secondary"
          label={`${t('common:text_community')} / ${t('common:text_group')}`}
          disabled
        />
      </View>
      <View>
        <Icon icon={iconName} size={22} tintColor={iconColor} />
      </View>
    </Button>
  );
};

const themeStyles = () => {
  return StyleSheet.create({
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
};

export default AudienceContent;
