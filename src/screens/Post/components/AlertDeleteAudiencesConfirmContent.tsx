import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';

import i18n from 'i18next';
import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';

const AlertDeleteAudiencesConfirmContent = ({ data }: {data: any[]}) => {
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

  if (!data?.length) return null;
  if (data.length > 3 && !showAll) {
    return (
      <View style={styles.container}>
        <Text.BodyM>{i18n.t('post:content_delete_audiences_of_post')}</Text.BodyM>
        <View style={styles.contentContainer}>
          <ScrollView>
            <TouchableOpacity>
              {data?.slice(0, 3)?.map?.(renderItem)}
              <Text.BodyMMedium onPress={() => { setShowAll(true) }}>
                {' '}
                •
                {` +${data.length - 3} ${i18n.t('post:more_group')}`}
              </Text.BodyMMedium>
            </TouchableOpacity>
          </ScrollView>
        </View>

      </View>
    )
  }
  return (
    <View style={styles.container}>
      <Text.BodyM>{i18n.t('post:content_delete_audiences_of_post')}</Text.BodyM>
      <View style={styles.contentContainer}>
        <ScrollView>
          <TouchableOpacity>
            {data?.map?.(renderItem)}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {},
  itemContainer: {
    marginTop: spacing.margin.base,
  },
  contentContainer: {
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.margin.base,
  },
});

export default AlertDeleteAudiencesConfirmContent;
