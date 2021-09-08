import React, {useRef} from 'react';
import {View, StyleSheet, SectionList} from 'react-native';
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
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import {useUserIdAuth} from '~/hooks/auth';

const PostAudiencesBottomSheet = () => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const insets = useSafeAreaInsets();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme, insets);

  const postAudienceSheetRef = useRef<any>();
  const postAudienceSheet = useKeySelector(postKeySelector.postAudienceSheet);

  const {isShow, data, fromStack} = postAudienceSheet || {};
  const currentUserId = useUserIdAuth();

  const onPressItem = (item: any) => {
    const {id, type} = item || {};
    if (type === 'user') {
      dispatch(
        menuActions.selectedProfile({id: id, isPublic: id !== currentUserId}),
      );
      rootNavigation.navigate(homeStack.publicProfile);
    } else {
      rootNavigation.navigate('groups', {
        screen: groupStack.groupDetail,
        params: {
          groupId: id,
          initial: false,
        },
      });
    }
    postAudienceSheetRef?.current?.close?.();
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

  const renderContent = () => {
    return (
      <View style={styles.container}>
        <Text.H6 style={styles.header} useI18n>
          post:label_post_audiences
        </Text.H6>
        <SectionList
          style={styles.sectionContainer}
          showsVerticalScrollIndicator={false}
          sections={data || []}
          keyExtractor={(item, index) => `section_list_${item}_${index}`}
          renderSectionHeader={renderSectionHeader}
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
      menuMinWidth={500}
      ContentComponent={renderContent()}
      onClose={() => dispatch(postActions.hidePostAudiencesBottomSheet())}
    />
  );
};

const createStyle = (theme: ITheme, insets: any) => {
  const {spacing, dimension} = theme;
  return StyleSheet.create({
    container: {
      height: 0.7 * dimension?.deviceHeight,
      paddingHorizontal: spacing.padding.large,
      paddingBottom: 0,
    },
    sectionContainer: {
      paddingBottom: spacing.padding.base + insets.bottom,
    },
    header: {
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.large,
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
  });
};

export default PostAudiencesBottomSheet;
