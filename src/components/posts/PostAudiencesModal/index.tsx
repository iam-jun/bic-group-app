import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import GroupItem from '~/beinComponents/list/items/GroupItem';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useRootNavigation } from '~/hooks/navigation';
import { IGroup } from '~/interfaces/IGroup';
import mainStack from '~/router/navigator/MainStack/stack';
import useModalStore from '~/store/modal';
import spacing from '~/theme/spacing';

export interface PostAudiencesModalProps {
  data: IGroup[] | any;
  showBlockedIcon?: boolean;
  onPressItemAudience?: any;
}

const PostAudiencesModal: FC<PostAudiencesModalProps> = ({
  data,
  showBlockedIcon,
  onPressItemAudience,
}: PostAudiencesModalProps) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const modalActions = useModalStore((state) => state.actions);

  const onPressClose = () => {
    modalActions.hideModal();
  };

  const navigateToGroup = (groupId: any, communityId: any) => {
    rootNavigation.navigate(mainStack.groupDetail, { groupId, communityId });
  };

  const navigateToCommunity = (communityId: string) => {
    rootNavigation.navigate(mainStack.communityDetail, { communityId });
  };

  const onPressItem = (item: any) => {
    const { id, communityId, isCommunity } = item || {};

    if (onPressItemAudience) {
      onPressItemAudience?.(item);
    } else if (isCommunity && communityId) {
      navigateToCommunity(communityId);
    } else {
      navigateToGroup(id, communityId);
    }

    onPressClose();
  };

  const renderItem = ({ item }: any) => (
    <GroupItem
      {...item}
      showPrivacyAvatar
      disableHorizontal
      showInfo={false}
      showBlockedIcon={showBlockedIcon}
      onPressItem={() => onPressItem(item)}
      groupStyle={styles.groupItem}
    />
  );

  const renderListHeaderComponent = () => <ViewSpacing height={spacing.margin.small} />;

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data || []}
        renderItem={renderItem}
        initialNumToRender={20}
        keyExtractor={(item, index) => `audience_${item?.id || index}`}
        ListHeaderComponent={renderListHeaderComponent}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      borderTopWidth: 1,
      borderColor: colors.gray5,
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
    groupItem: {
      paddingVertical: spacing.padding.small,
      marginHorizontal: spacing.padding.small,
    },
  });
};

export default PostAudiencesModal;
