import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from '~/baseComponents/Icon';

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
    let icon;
    if (!this.props.continue) {
      // todo update icon
      icon = <Icon icon="ArrowRight" size={20} />;
    }

    return (
      <View style={style.container} testID="markdown_block_quote">
        <View style={style.icon}>{icon}</View>
        <View style={style.childContainer}>{this.props.children}</View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  childContainer: {
    flex: 1,
  },
  icon: {
    width: 23,
  },
});
