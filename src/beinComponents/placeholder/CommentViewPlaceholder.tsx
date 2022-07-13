import React from 'react';
import {View, StyleSheet, SectionList} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import {ShineOverlay, Placeholder, PlaceholderLine} from 'rn-placeholder';
import {getRandomInt} from '~/utils/generator';
import CommentPlaceholder from './CommentPlaceholder';
import spacing from '~/theme/spacing';

const sectionData = [{title: '', data: [{id: 1}, {id: 2}]}];

const CommentViewPlaceholder = () => {
  const theme = useTheme() as ExtendedTheme;
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

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
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
      backgroundColor: colors.white,
    },
    row: {
      paddingHorizontal: spacing.margin.large,
      paddingVertical: spacing.margin.base,
    },
  });
};

export default CommentViewPlaceholder;
