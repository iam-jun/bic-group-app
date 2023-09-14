import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Tag, { TagProps } from '~/baseComponents/Tag';
import Text from '~/baseComponents/Text';

import spacing from '~/theme/spacing';
import { useBaseHook } from '~/hooks';
import Icon from '~/baseComponents/Icon';
import ViewSpacing from '~/beinComponents/ViewSpacing';

interface SelectingListInfoProps {
  data: any[];
  type?: string;
  title?: string;
  infoMessage?: string;
  tagProps?: Partial<TagProps> | ((item: any) => Partial<TagProps>);
  onRemoveItem: (item: any) => void;
  isShowTitle?: boolean;
}

const SelectingListInfo: React.FC<SelectingListInfoProps> = ({
  data = [],
  type = 'info',
  title = '',
  infoMessage = '',
  tagProps,
  onRemoveItem,
  isShowTitle = true,
}) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const infoTitle = title || t('article:text_selecting_will_be_added_to');

  const renderItem = (item, index) => {
    const label = typeof item === 'string' ? item : (item?.name || item?.title);
    return (
      <Tag
        key={`selecting_${type}_tag_${item?.id || index}`}
        style={[
          {
            marginTop: spacing.margin.small,
            marginLeft: index === 0 ? spacing.margin.large : spacing.margin.small,
            marginRight: index === data.length - 1 ? spacing.margin.large : 0,
          },
        ]}
        size="large"
        type="secondary"
        label={label}
        icon="iconCloseSmall"
        onPressIcon={() => {
          onRemoveItem?.(item);
        }}
        {...(typeof tagProps === 'function' ? tagProps(item) : tagProps)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {!!infoMessage && (
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
      {isShowTitle && (
        <Text.SubtitleL
          testID="aritcles.slecting_list_info.info_title"
          style={styles.textTitle}
        >
          {infoTitle}
        </Text.SubtitleL>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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

export default SelectingListInfo;
