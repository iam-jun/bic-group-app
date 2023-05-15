import React, { FC, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import ChangeLogsSvg from '~/../assets/images/img_changelogs_notification.svg';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import { IRouteParams } from '~/interfaces/IRouter';
import { sizes } from '~/theme/dimension';
import INotificationsState from '../store/Interface';
import useNotificationStore from '../store';

const ChangeLogs: FC<IRouteParams> = (props) => {
  const notiActions = useNotificationStore((state: INotificationsState) => state.actions);

  const { params } = props.route;
  const { id = '' } = params || {};

  useEffect(() => {
    if (id) {
      notiActions.getChangelogNotification(id);
    }
  }, [id]);

  if (!id) return null;

  const theme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Header
        title="common:btn_go_back"
        useI18n
        style={styles.header}
      />
      <View style={styles.content}>
        <View style={styles.image}>
          <SVGIcon source={ChangeLogsSvg} size={120} />
        </View>
        <Text.H3 useI18n style={styles.title}>
          notification:text_scheduled
        </Text.H3>
        <Text.ParagraphS>
          {' '}
        </Text.ParagraphS>
        {/* <Markdown value={content} /> */}
        <Text.ParagraphS useI18n style={{ fontWeight: 'bold' }}>
          notification:text_bic_team
        </Text.ParagraphS>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    header: {
      borderBottomWidth: 1,
      borderBottomColor: colors.gray5,
      paddingVertical: 0,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.large,
    },
    title: {
      textAlign: 'center',
      marginBottom: spacing.margin.tiny,
      fontSize: sizes.mdH3,
    },
    image: {
      alignItems: 'center',
    },
  });
};

export default ChangeLogs;
