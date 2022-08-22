import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import i18n from 'i18next';
import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const contentHeight = SCREEN_HEIGHT * 0.2;

const AlertDeleteAudiencesConfirmContent = ({ data, canDeleteOwnPost }: {data: any[], canDeleteOwnPost:boolean}) => {
  const theme: ExtendedTheme = useTheme();
  const [showAll, setShowAll] = useState(false);

  const renderItem = (item: any, index: number) => (
    <View
      key={`alert_assign_group_confirm.item_${index}`}
      style={styles.itemContainer}
    >
      <Text.BodyM numberOfLines={1}>
        {' '}
        •
        {` ${item.name}`}
      </Text.BodyM>
    </View>
  );

  const content = canDeleteOwnPost ? i18n.t('post:content_delete_audiences_of_post') : i18n.t('post:content_not_able_delete_of_post');

  if (!data?.length) return null;
  if (data.length > 3 && !showAll) {
    return (
      <View style={styles.container}>
        <Text.BodyM>{content}</Text.BodyM>
        <View style={styles.contentContainer}>
          <ScrollView>
            <TouchableOpacity>
              {data?.slice(0, 3)?.map?.(renderItem)}
              <View
                style={styles.itemContainer}
              >
                <Text.BodyMMedium onPress={() => { setShowAll(true); }} color={theme.colors.purple50}>
                  {' '}
                  •
                  {` +${data.length - 3} ${i18n.t('post:more_group')}`}
                </Text.BodyMMedium>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text.BodyM>{content}</Text.BodyM>
      <View style={styles.contentContainer}>
        <ScrollView>
          <TouchableOpacity>
            {data?.map?.(renderItem)}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  itemContainer: {
    marginTop: spacing.margin.base,
  },
  contentContainer: {
    height: contentHeight,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.margin.base,
  },
});

export default AlertDeleteAudiencesConfirmContent;
