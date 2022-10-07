import { StyleSheet, View } from 'react-native';
import React, { FC } from 'react';
import { isEmpty } from 'lodash';
import HashTag from '~/baseComponents/HashTag';
import { margin, padding } from '~/theme/spacing';

interface Props {
    data: string[]
}

const HashTags: FC<Props> = ({ data }) => {
  if (isEmpty(data)) return null;

  return (
    <View style={styles.container}>
      {data.map((item) => <HashTag key={`article-tag-${item}`} name={item} style={styles.tag} />)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingVertical: padding.large,
  },
  tag: {
    marginEnd: margin.small,
  },
});

export default HashTags;
