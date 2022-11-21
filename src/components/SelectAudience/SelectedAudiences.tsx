import React from 'react';
import {
  View, StyleSheet, Dimensions, ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';

import Tag from '~/baseComponents/Tag';
import useSelectAudienceStore from '~/components/SelectAudience/store';
import spacing from '~/theme/spacing';
import { useBaseHook } from '~/hooks';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TAG_MAX_WIDTH = SCREEN_WIDTH * 0.6;

const SelectedAudiences = () => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const actions = useSelectAudienceStore((state) => state.actions);
  const selectingGroups = useSelectAudienceStore((state) => state.selectedAudiences.groups);

  const list = Object.values(selectingGroups);

  const onPressRemoveItem = (item: any) => {
    actions.updateItemSelection(item, false);
  };

  const renderItem = (item, index) => {
    const { name } = item;
    const isFirstItem = index === 0;
    const isLastItem = index === (list?.length || 0) - 1;

    return (
      <Tag
        key={`tag_${item?.id || index}`}
        style={{
          marginTop: spacing.margin.small,
          marginLeft: isFirstItem ? spacing.margin.large : 0,
          marginRight: isLastItem ? spacing.margin.large : spacing.margin.small,
        }}
        textProps={{
          numberOfLines: 1,
          ellipsizeMode: 'middle',
          style: styles.text,
        }}
        size="large"
        type="secondary"
        label={name}
        onPressIcon={() => onPressRemoveItem(item)}
        icon="Xmark"
      />
    );
  };

  return (
    <View testID="selecting_audience.container" style={styles.container}>
      <Text.SubtitleM style={styles.textTitle}>
        {`${t('post:text_chosen_audience')}: ${list?.length || 0}`}
      </Text.SubtitleM>
      <ScrollView horizontal>
        {list?.map?.(renderItem)}
      </ScrollView>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      marginBottom: spacing.margin.large,
    },
    textTitle: {
      paddingHorizontal: spacing.padding.large,
    },
    divider: {
      marginTop: spacing.margin.tiny,
    },
    contentContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: colors.white,
    },
    text: {
      maxWidth: TAG_MAX_WIDTH,
      color: colors.blue50,
      marginLeft: spacing.margin.tiny,
    },
  });
};

export default SelectedAudiences;
