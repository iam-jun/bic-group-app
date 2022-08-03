import React, { FC, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';

import useJoinedGroupTreeStore from '~/store/communities/joinedGroupTree';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import FlatGroupItem from '~/beinComponents/list/items/FlatGroupItem';
import modalActions from '~/store/modal/actions';

export interface CommunityJoinedGroupsProps {
  communityId?: string;
  teamName?: string;
}

const CommunityJoinedGroupTree: FC<CommunityJoinedGroupsProps> = (
  { communityId, teamName = 'bein' }: CommunityJoinedGroupsProps,
) => {
  const dispatch = useDispatch();

  const id = communityId || teamName;

  const joinedGroups = useJoinedGroupTreeStore((state) => get(state, `data.${id}`))
  const loading = useJoinedGroupTreeStore((state) => get(state, 'loading'))
  const getJoinedGroupTree = useJoinedGroupTreeStore((state) => get(state, 'getJoinedGroupTree'))

  useEffect(() => {
    getJoinedGroupTree(communityId)
  }, [communityId])

  const onPressGroup = () => {
    dispatch(modalActions.hideModal())
  }

  const renderItem = ({ item }: any) => <FlatGroupItem {...item} onPressGroup={onPressGroup} />

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
