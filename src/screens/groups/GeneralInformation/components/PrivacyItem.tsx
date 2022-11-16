import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Icon from '~/baseComponents/Icon';
import Text from '~/beinComponents/Text';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import spacing from '~/theme/spacing';
import useCommunitiesStore from '~/store/entities/communities';

interface Props {
  item: any;
  type: 'group' | 'community';
}

const PrivacyItem = ({ item, type }: Props) => {
  const currentCommunityId = useCommunitiesStore((state) => state.currentCommunityId);
  const community = useCommunitiesStore((state) => state.data[currentCommunityId]);
  const group = useKeySelector(groupsKeySelector.groupDetail.group);
  const data = type === 'group' ? group : community;

  const { privacy } = data || {};
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const isChecked = privacy === item.type;

  return (
    <>
      <View style={styles.privacyHeader}>
        <View style={styles.privacy}>
          <Icon icon={item.icon} tintColor={colors.neutral20} />
          <Text.BodyM color={colors.neutral60} style={styles.privacyText} useI18n>
            {item.title}
          </Text.BodyM>
        </View>

        {isChecked && <Icon icon="Check" tintColor={colors.blue50} />}
      </View>

      <Text.BodyM style={styles.descriptionPrivacyText} color={colors.neutral60} useI18n>
        {item.subtitle}
      </Text.BodyM>
    </>
  );
};

const styles = StyleSheet.create({
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
