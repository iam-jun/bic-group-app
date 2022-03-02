import React from 'react';
import {StyleSheet} from 'react-native';
import Text from '~/beinComponents/Text';
import i18n from '~/localization';
interface Props {
  actorNames: string;
  verbText?: any;
  groupText?: string;
}

const NotificationTitle = ({actorNames, verbText, groupText}: Props) => {
  const styles = createStyle();

  const renderReactVerb = () => {
    if (!verbText) return null;

    if (typeof verbText === 'string') return verbText;

    const {emoji, targetText} = verbText;

    return (
      <React.Fragment>
        {i18n.t('reacted') + ' '}
        {emoji}
        {' ' + targetText}
      </React.Fragment>
    );
  };

  return (
    <Text.BodyM style={styles.title}>
      {actorNames + ' '}
      <Text.Body>
        {renderReactVerb}
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
