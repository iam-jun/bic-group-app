import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';

export interface PostDetailProps {}

const PostDetail: React.FC<PostDetailProps> = ({}: PostDetailProps) => {
  const theme: ITheme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Text>Creating new component PostDetail</Text>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
  });
};

export default PostDetail;
