import React from 'react';
import {StyleSheet} from 'react-native';

import HeaderView from '../../HeaderView';
import ScreenWrapper from '../../ScreenWrapper';
import {IObject} from '~/interfaces/common';
import {useTheme} from 'react-native-paper';
import {IUser} from '~/interfaces/IAuth';
import CheckBox from '~/components/CheckBox';
import {IAction} from '~/constants/commonActions';

const PeopleAudienceItem = ({
  user,
  onActionPress,
}: {
  user: IUser;
  onActionPress: (action: IAction) => void;
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <ScreenWrapper style={styles.container}>
      <HeaderView avatar={{user, size: 'base'}} firstLabel={user.name} />
      <CheckBox onActionPress={onActionPress} />
    </ScreenWrapper>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 12,
    },
  });
};

export default React.memo(PeopleAudienceItem);
