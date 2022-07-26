import i18next from 'i18next';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Icon from '~/beinComponents/Icon';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/beinComponents/Text';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';

import spacing from '~/theme/spacing';

interface Props {
  item: any;
  onPressHelpMessage: () => void;
}

const PrivacyItem = ({ item, onPressHelpMessage }: Props) => {
  const { privacy } = useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  return (
    <PrimaryItem
      testID={`general_information.privacy.${item.type}`.toLowerCase()}
      title={i18next.t(item.title)}
      subTitle={(
        <Text>
          {`${i18next.t(item.subtitle)} `}
          <Text onPress={onPressHelpMessage} color={colors.blue50} useI18n>
            settings:text_learn_more
          </Text>
        </Text>
      )}
      LeftComponent={
        <Icon style={styles.bottomSheetLeftIcon} icon={item.icon} />
      }
      RightComponent={
        privacy === item.type ? (
          <Icon icon="Check" size={24} tintColor={colors.purple60} />
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  bottomSheetLeftIcon: {
    marginRight: spacing.margin.large,
  },
});

export default PrivacyItem;
