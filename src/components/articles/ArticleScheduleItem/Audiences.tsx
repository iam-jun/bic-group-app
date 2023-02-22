import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { IPostAudience } from '~/interfaces/IPost';
import { useRootNavigation } from '~/hooks/navigation';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useBaseHook } from '~/hooks';
import mainStack from '~/router/navigator/MainStack/stack';
import Tag from '~/baseComponents/Tag';
import modalActions from '~/storeRedux/modal/actions';
import { PostAudiencesModal } from '~/components/posts';

interface IAudiences {
  audience: IPostAudience;
}

const Audiences: React.FC<IAudiences> = ({ audience }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { colors } = theme;
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const { groups = [] } = audience || {};

  const navigateToGroup = (groupId: any, communityId: any) => {
    rootNavigation.navigate(mainStack.groupDetail, { groupId, communityId });
  };

  const navigateToCommunity = (communityId: string) => {
    rootNavigation.navigate(mainStack.communityDetail, { communityId });
  };

  const onPressAudience = (item: any) => {
    const { id, communityId, isCommunity } = item || {};
    if (isCommunity && communityId) {
      navigateToCommunity(communityId);
    } else {
      navigateToGroup(id, communityId);
    }
  };

  const onPressMoreItem = () => {
    dispatch(
      modalActions.showModal({
        isOpen: true,
        isFullScreen: true,
        titleFullScreen: t('post:title_post_to'),
        ContentComponent: <PostAudiencesModal data={groups || []} onPressItemAudience={onPressAudience} />,
      }),
    );
  };

  const renderContent = () => {
    if (groups.length === 0) {
      return null;
    }
    return (
      <>
        {renderItem()}
        {renderMoreItem()}
      </>
    );
  };

  const renderItem = () => {
    const firstItem = groups[0];
    return (
      <Tag
        type="neutral"
        size="small"
        label={firstItem.name}
        onActionPress={() => onPressAudience(firstItem)}
        textProps={{ numberOfLines: 1, style: styles.text }}
        testID="audiences.tag_item"
      />
    );
  };

  const renderMoreItem = () => {
    if (groups.length === 1) {
      return null;
    }
    return (
      <Tag
        type="neutral"
        size="small"
        label={renderLabelMoreItem()}
        onActionPress={onPressMoreItem}
        textProps={{ numberOfLines: 1, style: styles.text }}
        testID="audiences.tag_more_item"
      />
    );
  };

  const renderLabelMoreItem = () => t('common:text_other_audience', { count: groups.length - 1 });

  return (
    <View style={styles.boxAudience}>
      <Text.BodyXS color={colors.neutral60}>{`${t('common:audiences')}:`}</Text.BodyXS>
      <ViewSpacing width={spacing.margin.small} />
      <ScrollView horizontal>{renderContent()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  boxAudience: {
    marginTop: spacing.margin.small,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    maxWidth: 255,
    paddingLeft: spacing.padding.tiny,
  },
});

export default Audiences;
