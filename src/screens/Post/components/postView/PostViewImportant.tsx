import React, {FC} from 'react';
import ImportantStatus from '~/screens/Post/components/ImportantStatus';
import {StyleSheet, View} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import Icon from '~/beinComponents/Icon';

export interface PostViewImportantProps {
  isImportant: boolean;
  expireTime: any;
  markedReadPost: boolean;
  isLite?: boolean;
}

const PostViewImportant: FC<PostViewImportantProps> = ({
  isImportant,
  expireTime,
  markedReadPost,
  isLite,
}: PostViewImportantProps) => {
  const theme = useTheme() as ITheme;
  const {colors} = theme || {};
  const styles = createStyle(theme);

  if (!isImportant || !expireTime) {
    return null;
  }

  const now = new Date();
  const notExpired =
    now.getTime() < new Date(expireTime).getTime() && !markedReadPost;

  if (isLite) {
    return (
      <View
        testID={'post_view.important_status_lite'}
        style={styles.liteContainer}>
        <Icon
          size={12}
          icon={'iconStar'}
          iconStyle={styles.iconStar}
          tintColor={colors.primary6}
        />
      </View>
    );
  }

  return <ImportantStatus notExpired={notExpired} />;
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    liteContainer: {
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 1,
      backgroundColor: colors.primary6,
      paddingHorizontal: spacing.padding.tiny,
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.tiny,
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 8,
    },
    iconStar: {
      backgroundColor: colors.background,
      borderRadius: spacing.borderRadius.small,
      padding: 2,
    },
  });
};

export default PostViewImportant;
