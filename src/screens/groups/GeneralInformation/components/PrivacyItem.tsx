import React from 'react';
import { StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Icon from '~/baseComponents/Icon';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import spacing from '~/theme/spacing';
import useCommunitiesStore from '~/store/entities/comunities';

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

  return (
    <PrimaryItem
      testID={`general_information.privacy.${item.type}`.toLowerCase()}
      title={item.title}
      titleProps={{ variant: 'h5', useI18n: true }}
      subTitle={item.subtitle}
      subTitleProps={{ variant: 'bodyS', numberOfLines: 0, useI18n: true }}
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
