import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from '~/baseComponents/Icon';
import { spacing } from '~/theme';

export default class MarkdownBlockQuote extends PureComponent {
  static propTypes = {
    continue: PropTypes.bool,
    iconStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf([PropTypes.node]),
    ]),
  };

  render() {
    const styles = createStyles(this.props.theme);

    let icon;
    if (!this.props.continue) {
      // todo update icon
      icon = <Icon icon="ArrowRight" size={20} />;
    }

    return (
      <View style={styles.container} testID="markdown_block_quote">
        {/* <View style={styles.icon}>{icon}</View> */}
        <View style={styles.childContainer}>{this.props.children}</View>
      </View>
    );
  }
}

const createStyles = (theme) => {
  return StyleSheet.create({
    container: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      borderLeftColor: theme.purple50,
      borderLeftWidth: 6,
      paddingLeft: spacing.padding.base,
      paddingVertical: spacing.padding.small,
      backgroundColor: theme.gray1
    },
    childContainer: {
      flex: 1,
    },
    icon: {
      width: 23,
    },
  })
}
