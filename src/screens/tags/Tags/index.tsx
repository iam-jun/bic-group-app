import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useCallback, useEffect } from 'react';
import {
  View, StyleSheet, Platform, KeyboardAvoidingView,
} from 'react-native';
import Header from '~/beinComponents/Header';
import { ICommunity } from '~/interfaces/ICommunity';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import CreateTag from './components/CreateTag';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';
import ListTags from './components/ListTags';
import useGroupsStore, { IGroupsState } from '~/store/entities/groups';
import useTagsControllerStore from '../store';

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

  const { currentGroupId, groups } = useGroupsStore((state: IGroupsState) => state);
  const { group } = groups[currentGroupId] || {};
  const { name: nameGroup, communityId } = group || {};

  const community = useCommunitiesStore(useCallback((
    state: ICommunitiesState,
  ) => state.data[type === 'community' ? id : communityId] || {} as ICommunity, [id, type]));

  const {
    name: nameCommunity, id: idCommunity,
  } = community;

  const theme = useTheme();
  const styles = createStyle(theme);

  const actions = useTagsControllerStore((state) => state.actions);
  const canCUDTag = useTagsControllerStore(useCallback(
    (state) => state.communityCUDTagPermissions[idCommunity],
    [idCommunity],
  ));

  const titleHeader = type === 'community' ? nameCommunity : nameGroup;

  useEffect(() => {
    actions.getCommunityCUDTagPermission(idCommunity);
  }, [idCommunity]);

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        <Header title={titleHeader} />
        {
          canCUDTag && (
            <>
              <ViewSpacing height={spacing.padding.large} />
              <CreateTag communityId={idCommunity} />
            </>
          )
        }
        <ViewSpacing height={spacing.padding.large} />
        <ListTags communityId={idCommunity} />
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
    },
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
