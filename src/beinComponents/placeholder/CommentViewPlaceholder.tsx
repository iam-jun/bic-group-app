import React from 'react';
import {View, StyleSheet, SectionList} from 'react-native';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';

import {ShineOverlay, Placeholder, PlaceholderLine} from 'rn-placeholder';
import {getRandomInt} from '~/utils/generator';
import CommentPlaceholder from './CommentPlaceholder';
import spacing from '~/theme/spacing';

const sectionData = [{title: '', data: [{id: 1}, {id: 2}]}];

const CommentViewPlaceholder = () => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const renderHeaderText = () => {
    return (
      <View style={styles.row}>
        <Placeholder Animation={ShineOverlay} style={styles.contentContainer}>
          <PlaceholderLine width={getRandomInt(30, 60)} />
        </Placeholder>
      </View>
    );
  };

  const renderItem = () => {
    return <CommentPlaceholder style={styles.containerChild} />;
  };

  const renderSectionItem = () => {
    return <CommentPlaceholder />;
  };

  return (
    <View style={{flex: 1}}>
      <SectionList
        sections={sectionData}
        renderItem={renderItem}
        renderSectionHeader={renderSectionItem}
        ListHeaderComponent={renderHeaderText}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <View />}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing.padding.tiny,
    },
    contentContainer: {
      flexDirection: 'row',
      padding: spacing.padding.small,
      backgroundColor: '#F9FAFB',
      borderRadius: spacing.borderRadius.small,
    },
    containerChild: {
      paddingTop: spacing?.padding.small,
      paddingRight: spacing?.padding.large,
      backgroundColor: colors.background,
    },
    row: {
      paddingHorizontal: spacing.margin.large,
      paddingVertical: spacing.margin.base,
    },
  });
};

export default CommentViewPlaceholder;
