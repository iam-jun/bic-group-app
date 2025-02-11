import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IPostAudience } from '~/interfaces/IPost';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useBaseHook } from '~/hooks';
import Tag from '~/baseComponents/Tag';
import { PostAudiencesModal } from '~/components/posts';
import useModalStore from '~/store/modal';
import { navigateToCommunityDetail, navigateToGroupDetail } from '~/router/helper';

interface IAudiences {
  audience: IPostAudience;
}

const Audiences: React.FC<IAudiences> = ({ audience }) => {
  const theme = useTheme();
  const { colors } = theme;
  const { t } = useBaseHook();
  const { groups = [] } = audience || {};
  const modalActions = useModalStore((state) => state.actions);

  const onPressAudience = (item: any) => {
    const { id, communityId, isCommunity } = item || {};
    if (isCommunity && communityId) {
      navigateToCommunityDetail({ communityId });
    } else {
      navigateToGroupDetail({ groupId: id, communityId });
    }
  };

  const onPressMoreItem = () => {
    modalActions.showModal({
      isOpen: true,
      isFullScreen: true,
      titleFullScreen: t('post:title_publish_to'),
      ContentComponent: <PostAudiencesModal data={groups || []} onPressItemAudience={onPressAudience} />,
    });
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
