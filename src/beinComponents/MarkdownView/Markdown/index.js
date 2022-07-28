/* eslint-disable */
/**
 * Base Markdown component
 * @author Mient-jan Stelling + contributors
 */

/**
 * Markdown display
 * https://github.com/iamacup/react-native-markdown-display
 * version: 7.0.0-alpha.2
 */

import React, {useMemo} from 'react';
import {Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import parser from './src/parser';
import getUniqueID from './src/util/getUniqueID';
import hasParents from './src/util/hasParents';
import tokensToAST from './src/util/tokensToAST';
import renderRules from './src/renderRules';
import AstRenderer from './src/AstRenderer';
import MarkdownIt from 'markdown-it';
import removeTextStyleProps from './src/util/removeTextStyleProps';
import {styles} from './src/styles';
import {stringToTokens} from './src/util/stringToTokens';
import FitImage from 'react-native-fit-image';
import textStyleProps from './src/data/textStyleProps';
import emojiShortcuts from '../emoji/shortcuts';
import emojiDefs from '../emoji/defs';
import emojiPlugin from '../emoji/plugin';
import regexPlugin from '../regex/plugin';
import { openUrl } from '~/utils/link';

export {
  getUniqueID,
  openUrl,
  hasParents,
  renderRules,
  AstRenderer,
  parser,
  stringToTokens,
  tokensToAST,
  MarkdownIt,
  styles,
  removeTextStyleProps,
  FitImage,
  textStyleProps,
  emojiShortcuts,
  emojiDefs,
  emojiPlugin,
  regexPlugin,
};

// we use StyleSheet.flatten here to make sure we have an object, in case someone
// passes in a StyleSheet.create result to the style prop
const getStyle = (mergeStyle, style) => {
  let useStyles = {};

  if (mergeStyle === true && style !== null) {
    // make sure we get anything user defuned
    Object.keys(style).forEach(value => {
      useStyles[value] = {
        ...StyleSheet.flatten(style[value]),
      };
    });

    // combine any existing styles
    Object.keys(styles).forEach(value => {
      useStyles[value] = {
        ...styles[value],
        ...StyleSheet.flatten(style[value]),
      };
    });
  } else {
    useStyles = {
      ...styles,
    };

    if (style !== null) {
      Object.keys(style).forEach(value => {
        useStyles[value] = {
          ...StyleSheet.flatten(style[value]),
        };
      });
    }
  }

  Object.keys(useStyles).forEach(value => {
    useStyles['_VIEW_SAFE_' + value] = removeTextStyleProps(useStyles[value]);
  });

  return StyleSheet.create(useStyles);
};

const getRenderer = (
  renderer,
  rules,
  style,
  mergeStyle,
  onLinkPress,
  maxTopLevelChildren,
  topLevelMaxExceededItem,
  allowedImageHandlers,
  defaultImageHandler,
  debugPrintTree,
) => {
  if (renderer && rules) {
    console.warn(
      'react-native-markdown-display you are using renderer and rules at the same time. This is not possible, props.rules is ignored',
    );
  }

  if (renderer && style) {
    console.warn(
      'react-native-markdown-display you are using renderer and style at the same time. This is not possible, props.style is ignored',
    );
  }

  // these checks are here to prevent extra overhead.
  if (renderer) {
    if (!(typeof renderer === 'function') || renderer instanceof AstRenderer) {
      return renderer;
    } else {
      throw new Error(
        'Provided renderer is not compatible with function or AstRenderer. please change',
      );
    }
  } else {
    let useStyles = getStyle(mergeStyle, style);

    return new AstRenderer(
      {
        ...renderRules,
        ...(rules || {}),
      },
      useStyles,
      onLinkPress,
      maxTopLevelChildren,
      topLevelMaxExceededItem,
      allowedImageHandlers,
      defaultImageHandler,
      debugPrintTree,
    );
  }
};

const Markdown = React.memo(
  ({
    children,
    renderer = null,
    rules = null,
    style = null,
    mergeStyle = true,
    markdownit = MarkdownIt({
      typographer: true,
    }),
    onLinkPress,
    maxTopLevelChildren = null,
    topLevelMaxExceededItem = <Text key="dotdotdot">...</Text>,
    allowedImageHandlers = [
      'data:image/png;base64',
      'data:image/gif;base64',
      'data:image/jpeg;base64',
      'https://',
      'http://',
    ],
    defaultImageHandler = 'https://',
    debugPrintTree = false,
  }) => {
    const momoizedRenderer = useMemo(
      () =>
        getRenderer(
          renderer,
          rules,
          style,
          mergeStyle,
          onLinkPress,
          maxTopLevelChildren,
          topLevelMaxExceededItem,
          allowedImageHandlers,
          defaultImageHandler,
          debugPrintTree,
        ),
      [
        maxTopLevelChildren,
        onLinkPress,
        renderer,
        rules,
        style,
        mergeStyle,
        topLevelMaxExceededItem,
        allowedImageHandlers,
        defaultImageHandler,
        debugPrintTree,
      ],
    );

    const momoizedParser = useMemo(() => markdownit, [markdownit]);

    return parser(children, momoizedRenderer.render, momoizedParser);
  },
);

Markdown.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]).isRequired,
  renderer: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.instanceOf(AstRenderer),
  ]),
  onLinkPress: PropTypes.func,
  maxTopLevelChildren: PropTypes.number,
  topLevelMaxExceededItem: PropTypes.any,
  rules: (props, propName, componentName) => {
    let invalidProps = [];
    const prop = props[propName];

    if (!prop) {
      return;
    }

    if (typeof prop === 'object') {
      invalidProps = Object.keys(prop).filter(
        key => typeof prop[key] !== 'function',
      );
    }

    if (typeof prop !== 'object') {
      return new Error(
        `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Must be of shape {[index:string]:function} `,
      );
    } else if (invalidProps.length > 0) {
      return new Error(
        `Invalid prop \`${propName}\` supplied to \`${componentName}\`. These ` +
          `props are not of type function \`${invalidProps.join(', ')}\` `,
      );
    }
  },
  markdownit: PropTypes.instanceOf(MarkdownIt),
  style: PropTypes.any,
  mergeStyle: PropTypes.bool,
  allowedImageHandlers: PropTypes.arrayOf(PropTypes.string),
  defaultImageHandler: PropTypes.string,
  debugPrintTree: PropTypes.bool,
};

export default Markdown;
