import React, {useRef} from 'react';
import {View, StyleSheet, SectionList, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ITheme} from '~/theme/interfaces';
import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import {useKeySelector} from '~/hooks/selector';

import BottomSheet from '~/beinComponents/BottomSheet';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import privacyTypes from '~/constants/privacyTypes';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useRootNavigation} from '~/hooks/navigation';
import menuActions from '~/screens/Menu/redux/actions';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import {useUserIdAuth} from '~/hooks/auth';
import Button from '~/beinComponents/Button';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import mainStack from '~/router/navigator/MainStack/stack';

const PostAudiencesBottomSheet = () => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const insets = useSafeAreaInsets();
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme, insets);

  const postAudienceSheetRef = useRef<any>();
  const postAudienceSheet = useKeySelector(postKeySelector.postAudienceSheet);

  const {isShow, data, fromStack} = postAudienceSheet || {};
  const currentUserId = useUserIdAuth();

  const onPressClose = () => {
    postAudienceSheetRef?.current?.close?.();
  };

  const navigateToGroup = (groupId: any) => {
    if (Platform.OS === 'web') {
      rootNavigation.navigate(groupStack.groupDetail, {
        groupId,
        initial: false,
      });
    } else {
      rootNavigation.navigate(mainStack.groupDetail, {
        groupId,
      });
    }
  };

  const onPressItem = (item: any) => {
    const {id, type} = item || {};
    if (type === 'user') {
      rootNavigation.navigate(mainStack.userProfile, {userId: id});
    } else {
      navigateToGroup(id);
    }
    onPressClose();
  };

  const renderSectionHeader = () => null;

  const renderGroupContentComponent = (item: any) => {
    const {type, user_count, privacy} = item || {};
    const privacyData: any =
      privacyTypes.find(item => item?.type === privacy) || {};
    if (type === 'user') {
      return null;
    }
    return (
      <View style={styles.itemGroupContent}>
        <Icon
          size={16}
          icon={privacyData.icon || 'Globe'}
          tintColor={colors.textSecondary}
        />
        <Text.BodyS style={styles.diamond} color={colors.textSecondary}>
          ⬩
        </Text.BodyS>
        <Icon
          size={16}
          style={styles.iconUser}
          icon={'UsersAlt'}
          tintColor={colors.textSecondary}
        />
        <Text.BodyS color={colors.textSecondary}>{user_count}</Text.BodyS>
      </View>
    );
  };

  const renderItem = ({item}: any) => {
    const {name, avatar, icon} = item || {};
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

  const renderEmpty = () => {
    return <LoadingIndicator />;
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text.H6 style={styles.header} useI18n>
          post:label_post_audiences
        </Text.H6>
        <Text.Subtitle useI18n color={colors.textSecondary}>
          post:label_desc_post_audiences
        </Text.Subtitle>
        {Platform.OS === 'web' && (
          <Button style={styles.icClose} onPress={onPressClose}>
            <Icon icon={'iconClose'} />
          </Button>
        )}
      </View>
    );
  };

  const renderContent = () => {
    return (
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
  };

  return (
    <BottomSheet
      modalizeRef={postAudienceSheetRef}
      isOpen={isShow}
      menuMinWidth={375}
      isContextMenu={false}
      webModalStyle={{width: 375}}
      ContentComponent={renderContent()}
      onClose={() => dispatch(postActions.hidePostAudiencesBottomSheet())}
    />
  );
};

const createStyle = (theme: ITheme, insets: any) => {
  const {spacing, dimension, colors} = theme;
  return StyleSheet.create({
    container: {
      height:
        Platform.select({web: 0.55, default: 0.7}) * dimension?.deviceHeight,
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
    headerContainer: {
      paddingHorizontal: spacing.padding.large,
      paddingBottom: spacing.padding.small,
      paddingTop: Platform.select({web: spacing.padding.small, default: 0}),
      borderBottomWidth: 1,
      borderColor: colors.borderDivider,
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
