/* eslint-disable class-methods-use-this */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/static-property-placement */
import { Parser, Node } from 'commonmark';
import Renderer from 'commonmark-react-renderer';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';

// import AtMention from '@components/at_mention';

import {
  concatStyles,
  makeStyleSheetFromTheme,
  getScheme,
} from './utils/utils';

import MarkdownBlockQuote from './MarkdownBlockQuote';
import MarkdownCodeBlock from './MarkdownCodeBlock';
import MarkdownList from './MarkdownList';
import MarkdownListItem from './MarkdownListItem';
import MarkdownTable from './MarkdownTable';
import MarkdownTableCell from './MarkdownTableCell';
import MarkdownTableRow from './MarkdownTableRow';
import MarkdownLink from './MarkdownLink';
import {
  addListItemIndices,
  combineTextNodes,
  pullOutImages,
} from './utils/transform';
import AtMention from './AtMention';
import Emoji from '~/baseComponents/Emoji';
import { spacing } from '~/theme';
import MarkdownImage from './MarkdownImage';

export default class Md extends PureComponent {
  static propTypes = {
    autolinkedUrlSchemes: PropTypes.array,
    baseTextStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    blockStyles: PropTypes.object,
    channelMentions: PropTypes.object,
    imagesMetadata: PropTypes.object,
    isEdited: PropTypes.bool,
    isReplyPost: PropTypes.bool,
    isSearchResult: PropTypes.bool,
    mentionKeys: PropTypes.array,
    minimumHashtagLength: PropTypes.number,
    onChannelLinkPress: PropTypes.func,
    onPostPress: PropTypes.func,
    postId: PropTypes.string,
    textStyles: PropTypes.object,
    theme: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    disableImage: PropTypes.bool,
    disableHashtags: PropTypes.bool,
    disableAtMentions: PropTypes.bool,
    disableChannelLink: PropTypes.bool,
    disableAtChannelMentionHighlight: PropTypes.bool,
    disableGallery: PropTypes.bool,
    showModal: PropTypes.func,
    onPressAudience: PropTypes.func,
    selector: PropTypes.string,
    mentions: PropTypes.array,
    dataStore: PropTypes.any,
    dataSelector: PropTypes.any,
    textTestID: PropTypes.string,
  };

  static defaultProps = {
    value: '',
    textStyles: {},
    blockStyles: {},
    disableImage: true,
    disableHashtags: false,
    disableAtMentions: false,
    disableChannelLink: false,
    disableAtChannelMentionHighlight: false,
    disableGallery: false,
    showModal: () => true,
    onLongPress: () => true,
  };

  constructor(props) {
    super(props);

    this.parser = this.createParser();
    this.renderer = this.createRenderer();
  }

  createParser = () => new Parser({
    urlFilter: this.urlFilter,
    minimumHashtagLength: this.props.minimumHashtagLength,
  });

  urlFilter = (url) => {
    const scheme = getScheme(url);

    return !scheme || this.props.autolinkedUrlSchemes.indexOf(scheme) !== -1;
  };

  createRenderer = () => new Renderer({
    renderers: {
      text: this.renderText,

      emph: Renderer.forwardChildren,
      strong: Renderer.forwardChildren,
      del: Renderer.forwardChildren,
      code: this.renderCodeSpan,
      link: this.renderLink,
      image: this.renderImage,
      atMention: this.renderAtMention,
      channelLink: this.renderChannelLink,
      emoji: this.renderEmoji,
      hashtag: this.renderHashtag,

      paragraph: this.renderParagraph,
      heading: this.renderHeading,
      codeBlock: this.renderCodeBlock,
      blockQuote: this.renderBlockQuote,

      list: this.renderList,
      item: this.renderListItem,

      hardBreak: this.renderHardBreak,
      thematicBreak: this.renderThematicBreak,
      softBreak: this.renderSoftBreak,

      htmlBlock: this.renderHtml,
      htmlInline: this.renderHtml,

      table: this.renderTable,
      table_row: this.renderTableRow,
      table_cell: this.renderTableCell,

      mention_highlight: Renderer.forwardChildren,

      editedIndicator: this.renderEditedIndicator,
    },
    renderParagraphsInLists: true,
    getExtraPropsForNode: this.getExtraPropsForNode,
  });

  getExtraPropsForNode = (node) => {
    const extraProps = {
      continue: node.continue,
      index: node.index,
    };

    if (node.type === 'image') {
      extraProps.reactChildren = node.react.children;
      extraProps.linkDestination = node.linkDestination;
    }

    return extraProps;
  };

  computeTextStyle = (baseStyle, context) => {
    const contextStyles = context
      .map((type) => this.props.textStyles[type])
      .filter((f) => f !== undefined);
    return contextStyles.length
      ? concatStyles(baseStyle, contextStyles)
      : baseStyle;
  };

  renderText = (data) => {
    const { context, literal } = data;
    if (context.indexOf('image') !== -1) {
      // If this text is displayed, it will be styled by the image component
      return (
        <Text testID={this.props.textTestID || 'markdown_text'}>{literal}</Text>
      );
    }

    // Construct the text style based off of the parents of this node since RN's inheritance is limited
    const style = this.computeTextStyle(this.props.baseTextStyle, context);

    return (
      <Text testID={this.props.textTestID || 'markdown_text'} style={style}>
        {literal}
      </Text>
    );
  };

  renderCodeSpan = ({ context, literal }) => (
    <Text
      style={this.computeTextStyle(
        [this.props.baseTextStyle, this.props.textStyles.code],
        context,
      )}
    >
      {literal}
    </Text>
  );

  // Just render as link because of not have metadata from server
  renderImage = ({ src, alt, linkDestination }) => (
    <MarkdownImage  src={src} alt={alt} linkDestination={linkDestination} />
  )

  renderAtMention = ({ mentionName }) => (
    <AtMention
      mentionName={mentionName}
      style={[this.props.textStyles?.mention || this.props.baseTextStyle]}
      mentions={this.props.mentions}
      onPress={this.props.onPressAudience}
    />
  );

  renderChannelLink = ({ context, channelName }) => this.renderText({ context, literal: `~${channelName}` });

  renderEmoji = ({ context, emojiName, literal }) => (
    <Emoji
      emojiName={emojiName}
      literal={literal}
      testID='markdown_emoji'
      textStyle={this.computeTextStyle(this.props.baseTextStyle, context)}
    />
  );

  renderHashtag = ({ context, hashtag }) => {
    if (this.props.disableHashtags) {
      return this.renderText({ context, literal: `#${hashtag}` });
    }
    return <Text style={this.props.baseTextStyle}>{hashtag}</Text>;
  };

  renderParagraph = ({ children, first, context }) => {
    if (!children || children.length === 0) {
      return <View />;
    }

    const style = getStyleSheet(this.props.theme);
    const blockStyle = [style.block];
    if (!first) {
      blockStyle.push(this.props.blockStyles.adjacentParagraph);
    }
    
    const styleParagraph = context?.length === 0 ? style.paragraph : {};

    return (
      <View style={[blockStyle, styleParagraph,]}>
        <Text>{children}</Text>
      </View>
    );
  };

  renderHeading = ({ children, level }) => {
    const containerStyle = [
      getStyleSheet(this.props.theme).block,
      this.props.blockStyles[`heading${level}`],
    ];
    const textStyle = this.props.blockStyles[`heading${level}Text`];
    const style = getStyleSheet(this.props.theme);

    return (
      <View style={[containerStyle,style.paragraph]}>
        <Text style={textStyle}>{children}</Text>
      </View>
    );
  };

  renderCodeBlock = (props) => {
    // These sometimes include a trailing newline
    const content = props.literal.replace(/\n$/, '');

    return (
      <MarkdownCodeBlock
        theme={this.props.theme}
        content={content}
        language={props.language}
        textStyle={this.props.textStyles.codeBlock}
        showModal={this.props.showModal}
      />
    );
  };

  renderBlockQuote = ({ children, ...otherProps }) => {
    return (
    <MarkdownBlockQuote
      theme={this.props.theme}
      iconStyle={this.props.blockStyles.quoteBlockIcon}
      {...otherProps}
    >
      {children}
    </MarkdownBlockQuote>
  );
  }
  renderList = ({
    children, start, tight, type,
  }) => {
    const style = getStyleSheet(this.props.theme);

    return <View style={style.paragraph}>
    <MarkdownList ordered={type !== 'bullet'} start={start} tight={tight}>
      {children}
    </MarkdownList>
    </View>
  }

  renderListItem = ({ children, context, ...otherProps }) => {
    const level = context.filter((type) => type === 'list').length;

    return (
      <MarkdownListItem
        bulletStyle={this.props.baseTextStyle}
        level={level}
        {...otherProps}
      >
        {children}
      </MarkdownListItem>
    );
  };

  renderHardBreak = () => <Text>{'\n'}</Text>;

  renderThematicBreak = () => (
    <View
      style={this.props.blockStyles.horizontalRule}
      testID="markdown_thematic_break"
    />
  );

  renderSoftBreak = () => <Text>{'\n'}</Text>;

  renderHtml = (props) => {
    let rendered = this.renderText(props);

    if (props.isBlock) {
      const style = getStyleSheet(this.props.theme);

      rendered = <View style={style.block}>{rendered}</View>;
    }

    return rendered;
  };

  renderTable = ({ children, numColumns }) => (
    <MarkdownTable theme={this.props.theme} showModal={this.props.showModal} numColumns={numColumns}>
      {children}
    </MarkdownTable>
  );

  renderTableRow = (args) => <MarkdownTableRow theme={this.props.theme} {...args} />;

  renderTableCell = (args) => <MarkdownTableCell theme={this.props.theme} {...args} />;

  renderLink = (data) => {
    const { href, children } = data;
    return <MarkdownLink href={href}>{children}</MarkdownLink>;
  };

  renderEditedIndicator = ({ context }) => {
    let spacer = '';
    if (context[0] === 'paragraph') {
      spacer = ' ';
    }

    const style = getStyleSheet(this.props.theme);
    const styles = [this.props.baseTextStyle, style.editedIndicatorText];

    return (
      <Text style={styles}>
        {spacer}
        <Text style={this.props.baseTextStyle}>(edited)</Text>
      </Text>
    );
  };

  render() {
    let ast = this.parser.parse(this.props.value.toString());

    ast = combineTextNodes(ast);
    ast = addListItemIndices(ast);
    ast = pullOutImages(ast);
    // ast = highlightMentions(ast, this.props.mentionKeys); //highlight all, here, current username in chat

    if (this.props.isEdited) {
      const editIndicatorNode = new Node('edited_indicator');
      if (
        ast.lastChild
        && ['heading', 'paragraph'].includes(ast.lastChild.type)
      ) {
        ast.lastChild.appendChild(editIndicatorNode);
      } else {
        const node = new Node('paragraph');
        node.appendChild(editIndicatorNode);

        ast.appendChild(node);
      }
    }

    return this.renderer.render(ast);
  }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
  return {
    block: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    paragraph: {
      marginBottom: spacing.margin.base,
    },
    editedIndicatorText: {
      color: theme.neutral30,
    },
    atMentionOpacity: {
      opacity: 1,
    },
  };
});
