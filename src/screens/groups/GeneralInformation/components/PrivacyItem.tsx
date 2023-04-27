import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import { IconType } from '~/resources/icons';
import { Button } from '~/baseComponents';
import { CommunityPrivacyType, GroupPrivacyType } from '~/constants/privacyTypes';

interface Props {
  value: GroupPrivacyType | CommunityPrivacyType;
  icon: IconType;
  title: string;
  subtitle: string
  selectedPrivacy: string;
  onPress: (key: string) => void;
}

const PrivacyItem = ({
  value, icon, title, subtitle, selectedPrivacy, onPress,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const isSelected = selectedPrivacy === value;

  const _onPress = () => {
    onPress?.(value);
  };

  return (
    <Button testID="privacty_item.view" style={styles.container} onPress={_onPress}>
      <View style={styles.privacyHeader}>
        <View style={styles.privacy}>
          <Icon icon={icon} tintColor={colors.neutral20} />
          <Text.BodyM
            testID="privacty_item.title"
            color={colors.neutral60}
            style={styles.privacyText}
            useI18n
          >
            {title}
          </Text.BodyM>
        </View>

        {isSelected && (
        <Icon
          testID="privacty_item.checked"
          icon="Check"
          tintColor={colors.blue50}
        />
        )}
      </View>

      <Text.BodyM
        testID="privacty_item.subtitle"
        style={styles.descriptionPrivacyText}
        color={colors.neutral60}
        useI18n
      >
        {subtitle}
      </Text.BodyM>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.padding.large,
    paddingVertical: spacing.padding.base,
  },
  privacyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyText: {
    marginHorizontal: spacing.margin.small,
  },
  descriptionPrivacyText: {
    marginTop: spacing.margin.base,
  },
});

export default PrivacyItem;
