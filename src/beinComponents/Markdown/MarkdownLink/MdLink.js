import PropTypes from 'prop-types';
import React, { Children, PureComponent } from 'react';
import { Alert, Text } from 'react-native';
import urlParse from 'url-parse';
import { preventDoubleTap } from '../utils/utils';
import {
  normalizeProtocol,
} from '../utils/url';
import {
  ExperimentalNormalizeMarkdownLinks,
} from '../utils/config';
import { openUrl } from '~/utils/link';

export default class MdLink extends PureComponent {
  static propTypes = {
    actions: PropTypes.shape({
      handleSelectChannelByName: PropTypes.func.isRequired,
      showPermalink: PropTypes.func.isRequired,
    }),
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf([PropTypes.node]),
    ]),
    href: PropTypes.string.isRequired,
    serverURL: PropTypes.string,
    siteURL: PropTypes.string.isRequired,
    currentTeamName: PropTypes.string,
  };

  static defaultProps = {
    serverURL: '',
    siteURL: '',
  };

  handlePress = preventDoubleTap(async () => {
    const {
      href,
    } = this.props;
    const url = normalizeProtocol(href);

    if (!url) {
      return;
    }

    const onError = () => {
      Alert.alert('Error', 'Unable to open the link.');
    };
    openUrl(url, onError);
  });

  parseLinkLiteral = (literal) => {
    let nextLiteral = literal;

    const WWW_REGEX = /\b^(?:www.)/i;
    if (nextLiteral.match(WWW_REGEX)) {
      nextLiteral = literal.replace(WWW_REGEX, 'www.');
    }

    const parsed = urlParse(nextLiteral, {});

    return parsed.href;
  };

  parseChildren = () => Children.map(this.props.children, (child) => {
    if (
      !child.props.literal
        || typeof child.props.literal !== 'string'
        || (child.props.context
          && child.props.context.length
          && !child.props.context.includes('link'))
    ) {
      return child;
    }

    const { props, ...otherChildProps } = child;
    const { literal, ...otherProps } = props;

    const nextProps = {
      literal: this.parseLinkLiteral(literal),
      ...otherProps,
    };

    return {
      props: nextProps,
      ...otherChildProps,
    };
  });

  render() {
    const children = ExperimentalNormalizeMarkdownLinks
      ? this.parseChildren()
      : this.props.children;

    return (
      <Text onPress={this.handlePress}>
        {children}
      </Text>
    );
  }
}
