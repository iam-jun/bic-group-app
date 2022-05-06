import React, {useEffect} from 'react';
import {View, StyleSheet, Platform, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import privacyTypes from '~/constants/privacyTypes';
import groupsKeySelector from '../redux/keySelector';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useRootNavigation} from '~/hooks/navigation';
import groupJoinStatus from '~/constants/groupJoinStatus';
import {useDispatch} from 'react-redux';
import groupsActions from '../redux/actions';
import {isEmpty} from 'lodash';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import MenuItem from '~/beinComponents/list/items/MenuItem';

const GroupAboutContent = () => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const groupData = useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const join_status = useKeySelector(groupsKeySelector.groupDetail.join_status);
  const isMember = join_status === groupJoinStatus.member;

  const groupId = groupData.id;
  const {description, user_count, privacy} = groupData;

  const privacyData = privacyTypes.find(item => item?.type === privacy) || {};
  const {icon, title, subtitle}: any = privacyData || {};

  useEffect(() => {
    // just to fetch group detail when first access on Web
    if (Platform.OS === 'web' && isEmpty(groupData)) {
      const initUrl = window.location.href;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const parse = require('url-parse');
      const url = parse(initUrl, true);
      const paths = url.pathname.split('/');
      // paths = ['', 'groups', '{id}', 'about']
      const id = parseInt(paths[2], 10);

      dispatch(groupsActions.getGroupDetail(id));
    }
  }, []);

  const onPressMembers = () => {
    rootNavigation.navigate(groupStack.groupMembers, {groupId});
  };

  const renderContent = () => (
    <>
      {!!description && (
        <>
          <Text.H5 useI18n style={styles.labelDescription}>
            common:text_description
          </Text.H5>
          <CollapsibleText
            limitLength={500}
            shortLength={500}
            textProps={{variant: 'h4', style: styles.descriptionContainer}}
            content={description}
          />
        </>
      )}
      <MenuItem
        testID="group_about_content.members"
        style={styles.memberItem}
        icon={'UsersAlt'}
        onPress={isMember ? onPressMembers : undefined}
        disabled={!isMember}
        title={`${user_count} ${i18next.t('groups:text_members', {
          count: user_count,
        })}`}
        rightSubIcon={isMember ? 'AngleRightB' : undefined}
      />
      <MenuItem
        testID="group_about_content.privacy"
        style={styles.privacyItem}
        icon={icon}
        title={i18next.t(title)}
        subTitle={i18next.t(subtitle)}
        disabled
      />
    </>
  );

  return (
    <View style={styles.container} testID="group_about_content">
      {isEmpty(groupData) ? <LoadingIndicator /> : renderContent()}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.padding.small,
    },
    labelDescription: {
      paddingVertical: spacing.padding.small,
    },
    descriptionContainer: {
      paddingBottom: spacing.padding.small,
    },
    memberItem: {
      height: 44,
    },
    privacyItem: {
      height: 56,
    },
  });
};

export default GroupAboutContent;
