import React, {useEffect, Fragment} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {ITheme} from '~/theme/interfaces';
import PrivateWelcome from './components/PrivateWelcome';
import actions from '~/screens/Groups/redux/actions';

const CommunityDetail = (props: any) => {
  const params = props.route.params;
  const communityId = params?.communityId;
  const dispatch = useDispatch();

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const getCommunityDetail = () => {
    dispatch(actions.getCommunityDetail(communityId, true));
  };

  const renderCommunityContent = () => {
    return <PrivateWelcome />;
  };

  const renderCommunityDetail = () => {
    return (
      <Fragment>
        <Header
          rightIcon="EllipsisV"
          rightIconProps={{backgroundColor: theme.colors.background}}
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
  const insets = useSafeAreaInsets();
  const {colors, dimension, spacing} = theme;
  return StyleSheet.create({
    screenContainer: {
      backgroundColor: colors.background,
    },
    contentContainer: {
      flex: 1,
    },
  });
};
