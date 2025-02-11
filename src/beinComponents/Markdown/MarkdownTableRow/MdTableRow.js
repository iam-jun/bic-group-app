import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';

import { makeStyleSheetFromTheme } from '../utils/utils';

export default class MdTableRow extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    isLastRow: PropTypes.bool,
    isFirstRow: PropTypes.bool,
    theme: PropTypes.object.isRequired,
  };

  render() {
    const style = getStyleSheet(this.props.theme);

    const rowStyle = [style.row];
    if (!this.props.isLastRow) {
      rowStyle.push(style.rowBottomBorder);
    }

    if (this.props.isFirstRow) {
      rowStyle.push(style.rowTopBackground);
    }

    // Add an extra prop to the last cell so that it knows not to render a right border since the container
    // will handle that
    const children = React.Children.toArray(this.props.children);
    children[children.length - 1] = React.cloneElement(
      children[children.length - 1],
      {
        isLastCell: true,
      },
    );

    return <View style={rowStyle}>{children}</View>;
  }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => ({
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  rowTopBackground: {
    backgroundColor: theme.gray5,
  },
  rowBottomBorder: {
    borderColor: theme.gray20,
    borderBottomWidth: 1,
  },
}));
