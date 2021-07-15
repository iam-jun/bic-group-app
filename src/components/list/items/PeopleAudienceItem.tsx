import React, {useState} from 'react';
import {StyleSheet} from 'react-native';

import HeaderView from '../../HeaderView';
import ScreenWrapper from '../../ScreenWrapper';
import {margin, padding} from '~/theme/spacing';
import {IObject} from '~/interfaces/common';
import {useTheme} from 'react-native-paper';
import {IUser} from '~/interfaces/IAuth';
import CheckBox from '~/components/CheckBox';

const PeopleAudienceItem = ({
  user,
  onActionPress,
}: {
  user: IUser;
  onActionPress: Function;
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false);

  return (
    <ScreenWrapper style={styles.container}>
      <HeaderView avatar={{user, size: 'base'}} firstLabel={user.name} />
      <CheckBox
        toggleCheckBox={toggleCheckBox}
        setToggleCheckBox={setToggleCheckBox}
        onActionPress={onActionPress}
      />
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
