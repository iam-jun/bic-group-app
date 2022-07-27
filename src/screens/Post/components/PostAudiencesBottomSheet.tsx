import React, { useRef } from 'react';
import { View, StyleSheet, SectionList } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import { useKeySelector } from '~/hooks/selector';

import BottomSheet from '~/beinComponents/BottomSheet';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import privacyTypes from '~/constants/privacyTypes';
import { useRootNavigation } from '~/hooks/navigation';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import mainStack from '~/router/navigator/MainStack/stack';
import dimension from '~/theme/dimension';
import spacing from '~/theme/spacing';

const PostAudiencesBottomSheet = () => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const insets = useSafeAreaInsets();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme, insets);

  const postAudienceSheetRef = useRef<any>();
  const postAudienceSheet = useKeySelector(postKeySelector.postAudienceSheet);

  const { isShow, data } = postAudienceSheet || {};

  const onPressClose = () => {
    postAudienceSheetRef?.current?.close?.();
  };

  const navigateToGroup = (groupId: any) => {
    rootNavigation.navigate(mainStack.groupDetail, {
      groupId,
    });
  };

  const navigateToCommunity = (communityId: string) => {
    rootNavigation.navigate(mainStack.communityDetail, {
      communityId,
    });
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

  const renderSectionHeader = () => null;

  const renderGroupContentComponent = (item: any) => {
    const { type, userCount, privacy } = item || {};
    const privacyData: any = privacyTypes.find((item) => item?.type === privacy) || {};
    if (type === 'user') {
      return null;
    }
    return (
      <View style={styles.itemGroupContent}>
        <Icon
          size={16}
          icon={privacyData.icon || 'Globe'}
          tintColor={colors.gray50}
        />
        <Text.BodyS style={styles.diamond} color={colors.gray50}>
          ⬩
        </Text.BodyS>
        <Icon
          size={16}
          style={styles.iconUser}
          icon="UserGroup"
          tintColor={colors.gray50}
        />
        <Text.BodyS color={colors.gray50}>{userCount}</Text.BodyS>
      </View>
    );
  };

  const renderItem = ({ item }: any) => {
    const { name, avatar, icon } = item || {};
    return (
      <PrimaryItem
        height={54}
        title={name}
        showAvatar
        avatar={avatar || icon}
        onPress={() => onPressItem(item)}
        ContentComponent={renderGroupContentComponent(item)}
      />
    );
  };

  const renderEmpty = () => <LoadingIndicator />;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text.H6 style={styles.header} useI18n>
        post:label_post_audiences
      </Text.H6>
      <Text.BodyS useI18n color={colors.gray50}>
        post:label_desc_post_audiences
      </Text.BodyS>
    </View>
  );

  const renderContent = () => (
    <View style={styles.container}>
      {renderHeader()}
      <SectionList
        style={styles.sectionContainer}
        showsVerticalScrollIndicator={false}
        sections={data || []}
        keyExtractor={(item, index) => `section_list_${item}_${index}`}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={() => (
          <ViewSpacing height={spacing.margin.small} />
        )}
        ListEmptyComponent={renderEmpty}
        renderItem={renderItem}
      />
    </View>
  );

  return (
    <BottomSheet
      modalizeRef={postAudienceSheetRef}
      isOpen={isShow}
      menuMinWidth={375}
      isContextMenu={false}
      ContentComponent={renderContent()}
      onClose={() => dispatch(postActions.hidePostAudiencesBottomSheet())}
    />
  );
};

const createStyle = (theme: ExtendedTheme, insets: any) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      height: dimension.deviceHeight * 0.7,
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
    headerContainer: {
      paddingHorizontal: spacing.padding.large,
      paddingBottom: spacing.padding.small,
      borderBottomWidth: 1,
      borderColor: colors.neutral5,
    },
    sectionContainer: {
      paddingBottom: spacing.padding.base + insets.bottom,
    },
    header: {
      paddingTop: spacing.padding.small,
    },
    itemGroupContent: {
      flexDirection: 'row',
    },
    iconUser: {
      marginRight: spacing.margin.tiny,
    },
    diamond: {
      marginHorizontal: spacing.margin.tiny,
    },
    icClose: {
      position: 'absolute',
      top: spacing.margin.base,
      right: spacing.margin.base,
    },
  });
};

export default PostAudiencesBottomSheet;
