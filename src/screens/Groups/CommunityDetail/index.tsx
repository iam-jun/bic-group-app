import React, {useEffect, Fragment} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {ITheme} from '~/theme/interfaces';
import PrivateWelcome from './components/PrivateWelcome';
import actions from '~/screens/Groups/redux/actions';
import PageContent from './components/PageContent';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import {groupPrivacy} from '~/constants/privacyTypes';
import groupJoinStatus from '~/constants/groupJoinStatus';

const CommunityDetail = (props: any) => {
  const params = props.route.params;
  const communityId = params?.communityId;
  const dispatch = useDispatch();

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {join_status, privacy} = infoDetail;
  const isPrivate = privacy === groupPrivacy.private;
  const isMember = join_status === groupJoinStatus.member;

  const getCommunityDetail = () => {
    dispatch(actions.getCommunityDetail(communityId));
  };

  useEffect(() => getCommunityDetail(), [communityId]);

  const renderCommunityContent = () => {
    if (!isMember && privacy === groupPrivacy.private) {
      return <PrivateWelcome />;
    }

    return <PageContent />;
  };

  const onPressChat = () => {
    // TODO: Add navigation to Chat
  };

  const renderCommunityDetail = () => {
    return (
      <Fragment>
        <Header
          rightIcon="EllipsisV"
          rightIconProps={{backgroundColor: theme.colors.background}}
          onPressChat={isMember || !isPrivate ? onPressChat : undefined}
        />
        <View testID="community_detail.content" style={styles.contentContainer}>
          {renderCommunityContent()}
        </View>
      </Fragment>
    );
  };

  return (
    <ScreenWrapper style={styles.screenContainer} isFullView>
      {renderCommunityDetail()}
    </ScreenWrapper>
  );
};

export default CommunityDetail;

const themeStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    screenContainer: {
      backgroundColor: colors.borderDivider,
    },
    contentContainer: {
      flex: 1,
    },
  });
};
