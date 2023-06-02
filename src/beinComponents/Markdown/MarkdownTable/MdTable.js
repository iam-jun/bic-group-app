import PropTypes from 'prop-types';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  Platform,
  View,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {
  CELL_MAX_WIDTH,
  CELL_MIN_WIDTH,
} from '~/beinComponents/Markdown/MarkdownTableCell/MdTableCell';
import {
  makeStyleSheetFromTheme,
  preventDoubleTap,
} from '~/beinComponents/Markdown/utils/utils';

import Icon from '~/baseComponents/Icon';
import TableDetail from '~/beinComponents/Markdown/MarkdownTable/TableDetail';

const MAX_HEIGHT = 300;
const MAX_PREVIEW_COLUMNS = 5;

export default class MdTable extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    numColumns: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired,
    showModal: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      containerWidth: 0,
      contentHeight: 0,
      cellWidth: 0,
    };
  }

  componentDidMount() {
    this.dimensionsListener = Dimensions.addEventListener(
      'change',
      this.setMaxPreviewColumns,
    );

    const window = Dimensions.get('window');
    this.setMaxPreviewColumns({ window });
  }

  componentWillUnmount() {
    this.dimensionsListener?.remove();
  }

  setMaxPreviewColumns = ({ window }) => {
    const maxPreviewColumns = Math.floor(window.width / CELL_MIN_WIDTH);
    this.setState({ maxPreviewColumns });
  };

  getTableWidth = (isFullView = false) => {
    const maxPreviewColumns = this.state.maxPreviewColumns || MAX_PREVIEW_COLUMNS;
    const columns = Math.min(this.props.numColumns, maxPreviewColumns);

    return isFullView || columns === 1
      ? columns * CELL_MAX_WIDTH
      : columns * CELL_MIN_WIDTH;
  };

  handlePress = preventDoubleTap(() => {
    this.props.showModal(
      <TableDetail
        renderRows={this.renderRows}
        tableWidth={this.getTableWidth(true)}
        renderAsFlex={this.shouldRenderAsFlex(true)}
      />,
      'Table',
    );
  });

  handleContainerLayout = (e) => {
    this.setState({
      containerWidth: e.nativeEvent.layout.width,
    });
  };

  handleContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({
      contentHeight,
    });
  };

  renderPreviewRows = (isFullView = false) => this.renderRows(isFullView, true);

  shouldRenderAsFlex = (isFullView = false) => {
    const { numColumns } = this.props;
    const { height, width } = Dimensions.get('window');
    const isLandscape = width > height;

    // render as flex in the channel screen, only for mobile phones on the portrait mode,
    // and if tables have 2 ~ 4 columns
    if (
      !isFullView
      && numColumns > 1
      && numColumns < 4
      // &&!DeviceTypes.IS_TABLET
    ) {
      return true;
    }

    // render a 4 column table as flex when in landscape mode only
    // otherwise it should expand beyond the device's full width
    if (!isFullView && isLandscape && numColumns === 4) {
      return true;
    }

    // render as flex in full table screen, only for mobile phones on portrait mode,
    // and if tables have 3 or 4 columns
    if (
      isFullView
      && numColumns >= 3
      && numColumns <= 4
      // &&!DeviceTypes.IS_TABLET
    ) {
      return true;
    }

    return false;
  };

  getTableStyle = (isFullView) => {
    const { theme } = this.props;
    const style = getStyleSheet(theme);
    const tableStyle = [style.table];

    const renderAsFlex = this.shouldRenderAsFlex(isFullView);
    if (renderAsFlex) {
      tableStyle.push(style.displayFlex);
      return tableStyle;
    }

    tableStyle.push({ width: this.getTableWidth(isFullView) });
    return tableStyle;
  };

  renderRows = (isFullView = false, isPreview = false) => {
    const tableStyle = this.getTableStyle(isFullView);

    let rows = React.Children.toArray(this.props.children);
    if (isPreview) {
      const { maxPreviewColumns } = this.state;
      const prevRowLength = rows.length;
      const prevColLength = React.Children.toArray(
        rows[0].props.children,
      ).length;

      // it should start with 0 but we temporary hide table header
      rows = rows.slice(1, maxPreviewColumns).map((row) => {
        const children = React.Children.toArray(row.props.children).slice(
          0,
          maxPreviewColumns,
        );
        return {
          ...row,
          props: {
            ...row.props,
            children,
          },
        };
      });

      this.rowsSliced = prevRowLength > rows.length;
      this.colsSliced = prevColLength > React.Children.toArray(rows[0].props.children).length;
    }

    // Add an extra prop to the last row of the table so that it knows not to render a bottom border
    // since the container should be rendering that
    rows[rows.length - 1] = React.cloneElement(rows[rows.length - 1], {
      isLastRow: true,
    });

      // temporary hide table header
    // Add an extra prop to the first row of the table so that it can have a different background color
    // rows[0] = React.cloneElement(rows[0], {
    //   isFirstRow: true,
    // });

    return (
      <TouchableOpacity activeOpacity={1} style={tableStyle}>
        {rows}
      </TouchableOpacity>
    );
  };

  render() {
    const { containerWidth, contentHeight } = this.state;
    const { theme } = this.props;
    const style = getStyleSheet(theme);
    const tableWidth = this.getTableWidth();
    const renderAsFlex = this.shouldRenderAsFlex();
    const previewRows = this.renderPreviewRows();

    let leftOffset;
    if (renderAsFlex || tableWidth > containerWidth) {
      leftOffset = containerWidth - 20;
    } else {
      leftOffset = tableWidth - 20;
    }
    let expandButtonOffset = leftOffset;
    if (Platform.OS === 'android') {
      expandButtonOffset -= 10;
    }

    // Renders when the columns were sliced, or the table width exceeds the container,
    // or if the columns exceed maximum allowed for previews
    let moreRight = null;
    if (
      this.colsSliced
      || (containerWidth && tableWidth > containerWidth && !renderAsFlex)
      || this.props.numColumns > MAX_PREVIEW_COLUMNS
    ) {
      moreRight = (
        <LinearGradient
          colors={[
            theme.gray1,
            theme.gray90,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[style.moreRight, { height: contentHeight, left: leftOffset }]}
        />
      );
    }

    let moreBelow = null;
    if (this.rowsSliced || contentHeight > MAX_HEIGHT) {
      const width = renderAsFlex
        ? '100%'
        : Math.min(tableWidth, containerWidth);

      moreBelow = (
        <LinearGradient
          colors={[
            theme.gray1,
            theme.gray40,
          ]}
          style={[style.moreBelow, { width }]}
        />
      );
    }

    let expandButton = null;

    if (expandButtonOffset > 0) {
      expandButton = (
        <TouchableOpacity
          type="opacity"
          onPress={this.handlePress}
          style={[style.expandButton, { left: expandButtonOffset }]}
          testID="markdown_table.expand.button"
        >
          <View style={[style.iconContainer, { width: this.getTableWidth() }]}>
            <View style={style.iconButton}>
              <Icon icon="iconExpand" size={14} tintColor={theme.blue50} />
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={style.tablePadding}
        onPress={this.handlePress}
        type="opacity"
        testID="markdown_table"
      >
        <ScrollView
          onContentSizeChange={this.handleContentSizeChange}
          onLayout={this.handleContainerLayout}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          style={style.container}
        >
          {previewRows}
        </ScrollView>
        {moreRight}
        {moreBelow}
        {expandButton}
      </TouchableOpacity>
    );
  }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => ({
  container: {
    maxHeight: MAX_HEIGHT,
  },
  expandButton: {
    height: 34,
    width: 34,
  },
  iconContainer: {
    maxWidth: '100%',
    alignItems: 'flex-end',
    paddingTop: 8,
    paddingBottom: 4,
    ...Platform.select({
      ios: {
        paddingRight: 14,
      },
    }),
  },
  iconButton: {
    backgroundColor: theme.white,
    marginTop: -32,
    marginRight: -6,
    borderWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderColor: theme.neutral20,
    width: 34,
    height: 34,
  },
  displayFlex: {
    flex: 1,
  },
  table: {
    width: '100%',
    borderColor: theme.gray40,
    borderWidth: 1,
  },
  tablePadding: {
    paddingRight: 10,
  },
  moreBelow: {
    bottom: Platform.select({
      ios: 34,
      android: 33.75,
    }),
    height: 20,
    position: 'absolute',
    left: 0,
    borderColor: theme.gray20,
    opacity: 0.4,
  },
  moreRight: {
    maxHeight: MAX_HEIGHT,
    position: 'absolute',
    top: 0,
    width: 20,
    borderColor: theme.gray20,
    borderRightWidth: 1,
  },
}));
