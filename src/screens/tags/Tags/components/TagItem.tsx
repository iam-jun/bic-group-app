import { useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import { ITag } from '~/interfaces/ITag';
import spacing from '~/theme/spacing';
import useTagItemMenu from '../useTagItemMenu';
import { Button } from '~/baseComponents';
import { useRootNavigation } from '~/hooks/navigation';
import tagsStack from '~/router/navigator/MainStack/stacks/tagsStack/stack';

type TagItemProps = {
    item: ITag;
    isMember: boolean;
    communityId: string;
}

const TagItem: FC<TagItemProps> = ({
  item, isMember, communityId,
}) => {
  const { name, totalUsed } = item;

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
    isMember
    && rootNavigation.navigate(tagsStack.tagDetail, { tagData: item, communityId });
  };

  return (
    <Button style={styles.row} onPress={goToTagsDetail}>
      <View style={styles.flex}>
        <Text.BodyM numberOfLines={1}>{name.toLowerCase()}</Text.BodyM>
      </View>
      {isMember && canAction && (
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
