import React, { FC } from 'react';
import {
  View, StyleSheet, FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { useRootNavigation } from '~/hooks/navigation';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import mainStack from '~/router/navigator/MainStack/stack';
import spacing from '~/theme/spacing';
import GroupItem from '~/beinComponents/list/items/GroupItem';
import { IGroup } from '~/interfaces/IGroup';
import modalActions from '~/storeRedux/modal/actions';

export interface PostAudiencesModalProps {
  data: IGroup[] | any;
}

const PostAudiencesModal: FC<PostAudiencesModalProps> = ({ data }: PostAudiencesModalProps) => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const onPressClose = () => {
    dispatch(modalActions.hideModal());
  };

  const navigateToGroup = (groupId: any, communityId: any) => {
    rootNavigation.navigate(mainStack.groupDetail, { groupId, communityId });
  };

  const navigateToCommunity = (communityId: string) => {
    rootNavigation.navigate(mainStack.communityDetail, { communityId });
  };

  const onPressItem = (item: any) => {
    const { id, communityId, isCommunity } = item || {};
    if (isCommunity && communityId) {
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
      onPressItem={() => onPressItem(item)}
      groupStyle={styles.groupItem}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data || []}
        renderItem={renderItem}
        initialNumToRender={20}
        keyExtractor={(item, index) => `audience_${item?.id || index}`}
        ListHeaderComponent={() => (
          <ViewSpacing height={spacing.margin.small} />
        )}
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
