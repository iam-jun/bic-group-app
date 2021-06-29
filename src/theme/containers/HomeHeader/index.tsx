import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useBaseHook} from '~/hooks';
import {IObject} from '~/interfaces/common';
import {Header} from '~/theme/components';
import Icon from '~/theme/components/Icon';
import Avatar from '~/theme/components/Image/Avatar';

export interface Props {}

const HomeHeader: React.FC<Props> = () => {
  const {navigation} = useBaseHook();
  const theme: IObject<any> = useTheme();
  const {colors} = theme;

  return (
    <Header
      leftComponent={<Avatar useMyProfile size="small" />}
      //   leftPress={() => navigation.toggleDrawer()}
      rightIcon="iconMenu"
      rightPress={() => navigation.toggleDrawer()}
      title="Bein"
    />
  );
};

const styles = StyleSheet.create({});

export default HomeHeader;
