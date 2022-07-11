import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import {IMentionUser} from '~/interfaces/IPost';

import Text from '~/beinComponents/Text';
import Avatar from '~/beinComponents/Avatar';
import spacing from '~/theme/spacing';

export interface MentionbarItemProps {
  testID?: string;
  data: IMentionUser;
  onPress?: (data: IMentionUser) => void;
}

const MentionBarItem: FC<MentionbarItemProps> = ({
  data,
  onPress,
}: MentionbarItemProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  return (
    <TouchableOpacity
      testID="mention_bar_item"
      disabled={!onPress}
      onPress={() => onPress?.(data)}
      style={styles.container}>
      <Avatar.Small
        testID="mention_bar_item.avatar"
        isRounded
        source={data?.avatar}
      />
      <Text.BodyS testID="mention_bar_item.name" style={styles.text}>
        {data?.fullname}
      </Text.BodyS>
    </TouchableOpacity>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacing.margin.small,
      marginVertical: spacing.margin.small,
      borderRadius: spacing.margin.large,
      backgroundColor: colors.bgSecondary,
    },
    text: {
      marginRight: spacing.margin.small,
      marginLeft: spacing.margin.tiny,
    },
  });
};

export default MentionBarItem;
