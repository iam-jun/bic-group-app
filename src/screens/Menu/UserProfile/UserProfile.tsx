import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {isEmpty} from 'lodash';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../redux/keySelector';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ProfileInfo from '../fragments/ProfileInfo';
import NoUserFound from '~/screens/Menu/fragments/NoUserFound';
import Header from '~/beinComponents/Header';

const UserProfile = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const profile = useKeySelector(menuKeySelector.selectedProfile);

  if (isEmpty(profile)) return <NoUserFound />;

  return (
    <ScreenWrapper testID="UserProfile" style={styles.container} isFullView>
      <Header />
      <ProfileInfo {...profile} />
    </ScreenWrapper>
  );
};

export default UserProfile;

const themeStyles = (theme: ITheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
  });
};
