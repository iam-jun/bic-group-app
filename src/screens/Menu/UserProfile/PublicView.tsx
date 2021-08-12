import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import useMenu from '~/hooks/menu';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ProfileInfo from '../fragments/ProfileInfo';

const PublicView = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const menuData = useMenu();
  const {selectedProfile} = menuData || {};
  const {fullname, background_img_url, avatar, description, isPublic} =
    selectedProfile || {};

  const data = {
    fullname,
    background_img_url,
    avatar,
    description,
    isPublic,
  };

  return (
    <ScreenWrapper testID="PublicProfile" style={styles.container}>
      <ProfileInfo {...data} />
    </ScreenWrapper>
  );
};

export default PublicView;

const themeStyles = (theme: ITheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
  });
};
