import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import {IconType} from '~/resources/icons';
import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';

import Icon from '~/beinComponents/Icon';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';

interface GroupSectionItemProps {
  title: string;
  subtitle: string;
  rightIcon: IconType;
  privacyIcon?: IconType;
  testID?: string;
  onPress?: (e: any) => void;
}

const GroupSectionItem = ({
  title,
  subtitle,
  rightIcon,
  privacyIcon,
  testID,
  onPress,
}: GroupSectionItemProps) => {
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  return (
    <TouchableOpacity testID={testID} onPress={onPress}>
      <PrimaryItem
        title={t(title)}
        subTitle={subtitle}
        RightComponent={
          <>
            {!!privacyIcon && <Icon icon={privacyIcon} />}
            <Icon icon={rightIcon} style={styles.rightIcon} />
          </>
        }
      />
    </TouchableOpacity>
  );
};

export default GroupSectionItem;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    rightIcon: {
      marginLeft: spacing.margin.extraLarge,
    },
  });
};
