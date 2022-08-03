import React, { FC, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';

import useJoinedGroupTreeStore from '~/store/communities/joinedGroupTree';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import FlatGroupItem from '~/beinComponents/list/items/FlatGroupItem';
import modalActions from '~/store/modal/actions';
import mainStack from '~/router/navigator/MainStack/stack';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { IGroup } from '~/interfaces/IGroup';
import { useRootNavigation } from '~/hooks/navigation';

export interface CommunityJoinedGroupsProps {
  communityId?: string;
  teamName?: string;
}

const CommunityJoinedGroupTree: FC<CommunityJoinedGroupsProps> = (
  { communityId, teamName = 'bein' }: CommunityJoinedGroupsProps,
) => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();

  const id = communityId || teamName;

  const joinedGroups = useJoinedGroupTreeStore((state) => get(state, `data.${id}`))
  const loading = useJoinedGroupTreeStore((state) => get(state, 'loading'))
  const getJoinedGroupTree = useJoinedGroupTreeStore((state) => get(state, 'getJoinedGroupTree'))

  useEffect(() => {
    getJoinedGroupTree(communityId)
  }, [communityId])

  const onPressGroup = (group: IGroup) => {
    dispatch(modalActions.hideModal())
    if (group.communityId) {
      rootNavigation.navigate(mainStack.communityDetail, {
        communityId: group.communityId,
      });
    } else {
      rootNavigation.navigate(
        groupStack.groupDetail, {
          groupId: group.id,
          initial: true,
        },
      );
    }
  }

  const renderItem = ({ item }: any) => (
    <FlatGroupItem
      {...item}
      showPrivacyAvatar
      showInfo={false}
      onPressGroup={onPressGroup}
      style={{ marginHorizontal: 16 }}
    />
  )

  return (
    <View>
      {loading
        ? <LoadingIndicator />
        : (
          <FlatList
            keyExtractor={(item) => `joined_group_${item?.id}`}
            data={joinedGroups || []}
            renderItem={renderItem}
          />
        )}
    </View>
  );
};

export default CommunityJoinedGroupTree;
