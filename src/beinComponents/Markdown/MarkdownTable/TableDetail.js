import PropTypes from 'prop-types';
import React from 'react';
import { Platform, ScrollView } from 'react-native';

import { makeStyleSheetFromTheme } from '../utils/utils';

export default class TableDetail extends React.PureComponent {
  static propTypes = {
    renderRows: PropTypes.func.isRequired,
    tableWidth: PropTypes.number.isRequired,
    renderAsFlex: PropTypes.bool.isRequired,
  };

  render() {
    const style = getStyleSheet();
    const content = this.props.renderRows(true);
    const viewStyle = this.props.renderAsFlex
      ? style.displayFlex
      : { width: this.props.tableWidth };

    let container;
    if (Platform.OS === 'android') {
      container = (
        <ScrollView testID="table.screen">
          <ScrollView
            contentContainerStyle={viewStyle}
            horizontal
            testID="table.scroll_view"
          >
            {content}
          </ScrollView>
        </ScrollView>
      );
    } else {
      container = (
        <ScrollView
          style={style.fullHeight}
          contentContainerStyle={viewStyle}
          testID="table.scroll_view"
        >
          {content}
        </ScrollView>
      );
    }
    return container;
  }
}

const getStyleSheet = makeStyleSheetFromTheme(() => ({
  container: {
    flex: 1,
  },
  fullHeight: {
    height: '100%',
  },
  displayFlex: {
    ...Platform.select({
      android: {
        flex: 1,
      },
      ios: {
        flex: 0,
      },
    }),
  },
}));
