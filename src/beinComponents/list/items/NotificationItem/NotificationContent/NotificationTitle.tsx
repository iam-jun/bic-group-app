import React from 'react';
import {StyleSheet} from 'react-native';
import i18n from 'i18next';

import Text from '~/beinComponents/Text';

export interface NotificationTitleProps {
  actorNames: string;
  verbText?: any;
  groupText?: string;
}

const NotificationTitle = ({
  actorNames,
  verbText,
  groupText,
}: NotificationTitleProps) => {
  const styles = createStyle();

  let _verbText = verbText;
  if (typeof _verbText === 'object') {
    const {emoji, targetText} = verbText;

    _verbText = (
      <React.Fragment>
        {i18n.t('reacted') + ' '}
        {emoji}
        {' ' + targetText}
      </React.Fragment>
    );
  }

  return (
    <Text.BodyM style={styles.title}>
      {actorNames + ' '}
      <Text.Body>
        {_verbText}
        {groupText && <Text.BodyM>{' ' + groupText}</Text.BodyM>}
      </Text.Body>
    </Text.BodyM>
  );
};

const createStyle = () => {
  return StyleSheet.create({
    title: {
      alignItems: 'baseline',
    },
  });
};

export default NotificationTitle;
