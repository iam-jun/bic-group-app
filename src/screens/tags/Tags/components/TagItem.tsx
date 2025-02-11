import { useTheme } from '@react-navigation/native';
import React, { FC, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import { ITag } from '~/interfaces/ITag';
import spacing from '~/theme/spacing';
import useTagItemMenu from '../useTagItemMenu';
import { Button } from '~/baseComponents';
import { useRootNavigation } from '~/hooks/navigation';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import { ICommunity } from '~/interfaces/ICommunity';
import searchStack from '~/router/navigator/MainStack/stacks/searchStack/stack';

type TagItemProps = {
    item: ITag;
    isMember: boolean;
    communityId: string;
    canCUDTag: boolean;
}

const TagItem: FC<TagItemProps> = ({
  item, isMember, communityId, canCUDTag,
}) => {
  const { name, totalUsed } = item;

  const community = useCommunitiesStore(
    useCallback(
      (state: ICommunitiesState) => state.data[communityId] || ({} as ICommunity),
      [communityId],
    ),
  );

  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle();
  const { rootNavigation } = useRootNavigation();

  const canAction = totalUsed === 0;

  const { showMenu } = useTagItemMenu(communityId, item);

  const onPressMenu = () => {
    showMenu();
  };

  const goToTagsDetail = () => {
    if (!isMember) return;
    const rootGroup = {
      ...community,
      id: community?.groupId,
    };
    rootNavigation.push(searchStack.searchMain, { tag: item, group: rootGroup });
  };

  return (
    <Button style={styles.row} onPress={goToTagsDetail}>
      <View style={styles.flex}>
        <Text.BodyM numberOfLines={1}>{name.toUpperCase()}</Text.BodyM>
      </View>
      {canCUDTag && canAction && (
        <Icon
          testID="tag_menu"
          icon="Ellipsis"
          onPress={onPressMenu}
          size={20}
          tintColor={colors.neutral40}
          hitSlop={{
            top: 20,
            bottom: 20,
            left: 20,
            right: 20,
          }}
        />
      )}
    </Button>
  );
};

const createStyle = () => StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.padding.base,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
    marginRight: spacing.margin.small,
  },

});

export default TagItem;
