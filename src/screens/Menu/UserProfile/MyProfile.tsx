import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../redux/keySelector';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ProfileInfo from '../fragments/ProfileInfo';
import Header from '~/beinComponents/Header';

const MyProfile = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const profile = useKeySelector(menuKeySelector.myProfile);

  return (
    <ScreenWrapper testID="MyProfilePage" style={styles.container} isFullView>
      <Header />
      <ProfileInfo {...profile} />
    </ScreenWrapper>
  );
};

export default MyProfile;

const themeStyles = (theme: ITheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
  });
};
