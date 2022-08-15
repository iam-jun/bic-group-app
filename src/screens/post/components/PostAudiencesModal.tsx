import React from 'react';
import {
  View, StyleSheet, SectionList, Modal, Platform,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import postKeySelector from '~/storeRedux/post/keySelector';
import postActions from '~/storeRedux/post/actions';
import { useKeySelector } from '~/hooks/selector';

import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import { useRootNavigation } from '~/hooks/navigation';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import mainStack from '~/router/navigator/MainStack/stack';
import spacing from '~/theme/spacing';
import Button from '~/beinComponents/Button';
import GroupItem from '~/beinComponents/list/items/GroupItem';

const PostAudiencesModal = () => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const insets = useSafeAreaInsets();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(
    theme, insets,
  );

  const postAudienceSheet = useKeySelector(postKeySelector.postAudienceSheet);

  const { isShow, data } = postAudienceSheet || {};

  const onPressClose = () => {
    dispatch(postActions.hidePostAudiencesBottomSheet())
  };

  const navigateToGroup = (groupId: any) => {
    rootNavigation.navigate(mainStack.groupDetail, { groupId });
  };

  const navigateToCommunity = (communityId: string) => {
    rootNavigation.navigate(mainStack.communityDetail, { communityId });
  };

  const onPressItem = (item: any) => {
    const { id, communityId } = item || {};
    if (communityId) {
      navigateToCommunity(communityId);
    } else {
      navigateToGroup(id);
    }
    onPressClose();
  };

  const renderItem = ({ item }: any) => (
    <GroupItem
      {...item}
      privacy="PUBLIC"
      showPrivacyAvatar
      disableHorizontal
      showInfo={false}
      onPressItem={() => onPressItem(item)}
      groupStyle={styles.groupItem}
    />
  );

  const renderEmpty = () => <LoadingIndicator />;

  const renderContent = () => (
    <View style={styles.container}>
      <SectionList
        style={styles.sectionContainer}
        showsVerticalScrollIndicator={false}
        sections={data || []}
        keyExtractor={(
          item, index,
        ) => `section_list_${item}_${index}`}
        ListHeaderComponent={() => (
          <ViewSpacing height={spacing.margin.small} />
        )}
        ListEmptyComponent={renderEmpty}
        renderItem={renderItem}
      />
    </View>
  );

  return (
    <Modal
      visible={isShow}
      transparent
      animationType="slide"
      onRequestClose={onPressClose}
    >
      <View testID="common_modal.center" style={styles.fullScreenContainer}>
        <View style={styles.fullScreenHeader}>
          <Text.H4 style={styles.titleFullScreen} numberOfLines={2} useI18n>
            post:title_post_to
          </Text.H4>
          <Button style={styles.btnClose} onPress={onPressClose}>
            <Icon icon="iconCloseSmall" />
          </Button>
        </View>
        {renderContent()}
      </View>
    </Modal>
  );
};

const createStyle = (
  theme: ExtendedTheme, insets: any,
) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      borderTopWidth: 1,
      borderColor: colors.gray5,
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
    fullScreenContainer: {
      flex: 1,
      backgroundColor: colors.neutral,
      justifyContent: 'center',
      paddingTop: Platform.OS === 'android' ? 0 : insets.top,
      paddingBottom: insets.bottom + spacing.padding.small,
    },
    fullScreenHeader: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.small,
      alignItems: 'center',
    },
    titleFullScreen: {
      flex: 1,
      marginLeft: spacing.margin.large,
      paddingVertical: spacing.padding.small,
    },
    btnClose: { paddingHorizontal: spacing.padding.extraLarge },
    sectionContainer: {
      paddingBottom: spacing.padding.base + insets.bottom,
    },
    groupItem: {
      paddingVertical: spacing.padding.small,
      marginHorizontal: spacing.padding.small,
    },
  });
};

export default PostAudiencesModal;
