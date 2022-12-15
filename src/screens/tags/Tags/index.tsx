import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '~/beinComponents/Header';
import { ICommunity } from '~/interfaces/ICommunity';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import CreateTag from './components/CreateTag';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';
import ListTags from './components/ListTags';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

type TagsProps = {
    route: {
        params: {
            id: string;
            type: 'community' | 'group';
        },
    }
}

const Tags: FC<TagsProps> = (props) => {
  const { params } = props.route || {};
  const { id, type } = params || {};

  const groupInfo = useKeySelector(groupsKeySelector.groupDetail.group);
  const { name: nameGroup, communityId } = groupInfo;

  const community = useCommunitiesStore(useCallback((
    state: ICommunitiesState,
  ) => state.data[type === 'community' ? id : communityId] || {} as ICommunity, [id, type]));

  const {
    name: nameCommunity, joinStatus, id: idCommunity,
  } = community;

  const isMember = joinStatus === GroupJoinStatus.MEMBER;

  const theme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Header
        title={type === 'community' ? nameCommunity : nameGroup}
      />
      {
        isMember && (
        <>
          <ViewSpacing height={spacing.padding.large} />
          <CreateTag communityId={idCommunity} />
        </>
        )
      }
      <ViewSpacing height={spacing.padding.large} />
      <ListTags communityId={idCommunity} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
    childrenText: {
      paddingVertical: spacing.padding.small,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
    },
  });
};

export default Tags;
