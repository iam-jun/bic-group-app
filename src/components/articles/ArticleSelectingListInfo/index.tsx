import React from 'react';
import {
  StyleSheet, View, ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Tag, { TagProps } from '~/baseComponents/Tag';
import Text from '~/baseComponents/Text';

import spacing from '~/theme/spacing';
import { useBaseHook } from '~/hooks';
import Icon from '~/baseComponents/Icon';
import ViewSpacing from '~/beinComponents/ViewSpacing';

interface ArticleSelectingListInfoProps {
  data: any[];
  type?: string;
  title?: string;
  infoMessage?: string;
  tagProps?: Omit<TagProps, 'label'>;
  onRemoveItem: (item: any)=>void;
}

const ArticleSelectingListInfo: React.FC<ArticleSelectingListInfoProps> = ({
  data = [],
  type = 'info',
  title = '',
  infoMessage = '',
  tagProps,
  onRemoveItem,
}: ArticleSelectingListInfoProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const infoTitle = title || t('article:text_selecting_categories');

  const renderItem = (item, index) => (
    <Tag
      key={`selecting_${type}_tag_${item?.id}`}
      style={[{
        marginTop: spacing.margin.small,
        marginLeft: index === 0 ? spacing.margin.large : spacing.margin.small,
        marginRight: index === data.length - 1 ? spacing.margin.large : 0,
      }]}
      size="large"
      type="secondary"
      label={item?.name || item?.title}
      icon="iconCloseSmall"
      onPressIcon={() => { onRemoveItem?.(item); }}
      {...tagProps}
    />
  );

  return (
    <View style={styles.container}>
      {!!infoMessage
      && (
      <View
        testID="aritcles.slecting_list_info.info_message.view"
        style={styles.row}
      >
        <Icon
          icon="CircleInfo"
          size={16}
          tintColor={theme.colors.neutral20}
        />
        <ViewSpacing width={spacing.margin.tiny} />
        <Text.BodyS
          testID="aritcles.slecting_list_info.info_message.text"
          color={theme.colors.neutral40}
        >
          {infoMessage}
        </Text.BodyS>
      </View>
      )}
      <Text.SubtitleL
        testID="aritcles.slecting_list_info.info_title"
        style={styles.textTitle}
      >
        {infoTitle}
      </Text.SubtitleL>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {data?.map?.(renderItem)}
      </ScrollView>
    </View>
  );
};

const createStyle = (_theme: ExtendedTheme) => StyleSheet.create({
  container: {
    paddingBottom: spacing.padding.small,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: spacing.padding.large,
    paddingBottom: spacing.padding.xSmall,
  },
  textTitle: {
    paddingHorizontal: spacing.padding.large,
  },
});

export default ArticleSelectingListInfo;
