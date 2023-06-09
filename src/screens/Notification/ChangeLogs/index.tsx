import React, { FC, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import { spacing } from '~/theme';
import ChangeLogsSvg from '~/../assets/images/img_changelogs_notification.svg';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import { IRouteParams } from '~/interfaces/IRouter';
import INotificationsState from '../store/Interface';
import useNotificationStore from '../store';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Markdown from '~/beinComponents/Markdown';
import Text from '~/baseComponents/Text';
import { sizes } from '~/theme/dimension';

const ChangeLogs: FC<IRouteParams> = (props) => {
  const notiActions = useNotificationStore((state: INotificationsState) => state.actions);
  const changleLogsNoti = useNotificationStore((state: INotificationsState) => state.changelogsInfo);
  const loading = useNotificationStore((state: INotificationsState) => state.changelogsInfoLoading);

  const { title = '', content = '' } = changleLogsNoti || {};

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
      {!!loading
        ? (
          <View style={styles.center}>
            <LoadingIndicator />
          </View>
        )
        : !loading && !title
          ? (
            <View style={styles.center}>
              <Text.ParagraphM useI18n>common:text_sorry_something_went_wrong</Text.ParagraphM>
            </View>
          )
          : (
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainerStyle}
            >
              <View style={styles.image}>
                <SVGIcon source={ChangeLogsSvg} size={120} />
              </View>
              <Text.H3 useI18n style={styles.title}>
                {title}
              </Text.H3>
              <Markdown value={content} />
            </ScrollView>
          )}
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
    image: {
      alignItems: 'center',
      paddingBottom: spacing.padding.extraLarge,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      textAlign: 'center',
      marginBottom: spacing.margin.tiny,
      fontSize: sizes.mdH2,
    },
    contentContainerStyle: {
      paddingBottom: spacing.padding.extraLarge,
    },
  });
};

export default ChangeLogs;
