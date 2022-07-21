import Clipboard from '@react-native-clipboard/clipboard';

import PropTypes from 'prop-types';
import React, { Children, PureComponent } from 'react';
import { Alert, Text } from 'react-native';
import urlParse from 'url-parse';
import { preventDoubleTap } from '../utils/utils';
import {
  tryOpenURL,
  normalizeProtocol,
  matchDeepLink,
  PERMALINK_GENERIC_TEAM_NAME_REDIRECT,
} from '../utils/url';
import {
  DeepLinkTypes,
  CURRENT_SERVER,
  mmConfig,
  ExperimentalNormalizeMarkdownLinks,
} from '../utils/config';

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
      actions, currentTeamName, href, serverURL, siteURL,
    } = this.props;
    // const {handleSelectChannelByName, showPermalink} = actions;
    const url = normalizeProtocol(href);

    if (!url) {
      return;
    }

    const onError = () => {
      Alert.alert('Error', 'Unable to open the link.');
    };
    tryOpenURL(url, onError);

    // let serverUrl = serverURL;
    // if (!serverUrl) {
    //   serverUrl = CURRENT_SERVER;
    // }
    //
    // const match = matchDeepLink(url, serverURL, siteURL);
    //
    // if (match) {
    //   switch (match.type) {
    //     case DeepLinkTypes.CHANNEL:
    //       await handleSelectChannelByName(
    //         match.channelName,
    //         match.teamName,
    //         errorBadChannel,
    //         intl,
    //       );
    //       await dismissAllModals();
    //       await popToRoot();
    //       break;
    //     case DeepLinkTypes.PERMALINK: {
    //       const teamName =
    //         match.teamName === PERMALINK_GENERIC_TEAM_NAME_REDIRECT
    //           ? currentTeamName
    //           : match.teamName;
    //       showPermalink(intl, teamName, match.postId);
    //       break;
    //     }
    //     case DeepLinkTypes.PLUGIN:
    //       showModal('PluginInternal', match.id, {link: url});
    //       break;
    //   }
    // } else {
    //   const onError = () => {
    //     Alert.alert('Error', 'Unable to open the link.');
    //   };
    //   tryOpenURL(url, onError);
    // }
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

  handleLongPress = async () => {
    console.log('\x1b[36m🐣️ MdLink handleLongPress\x1b[0m');
    // const {formatMessage} = this.context.intl;
    //
    // // const config = mattermostManaged.getCachedConfig();
    // const config = mmConfig;
    //
    // if (config?.copyAndPasteProtection !== 'true') {
    //   const cancelText = formatMessage({
    //     id: 'mobile.post.cancel',
    //     defaultMessage: 'Cancel',
    //   });
    //   const actionText = formatMessage({
    //     id: 'mobile.markdown.link.copy_url',
    //     defaultMessage: 'Copy URL',
    //   });
    //   BottomSheet.showBottomSheetWithOptions(
    //     {
    //       options: [actionText, cancelText],
    //     },
    //     value => {
    //       if (value !== 1) {
    //         this.handleLinkCopy();
    //       }
    //     },
    //   );
    // }
  };

  handleLinkCopy = () => {
    Clipboard.setString(this.props.href);
  };

  render() {
    const children = ExperimentalNormalizeMarkdownLinks
      ? this.parseChildren()
      : this.props.children;

    return (
      <Text onPress={this.handlePress} onLongPress={this.handleLongPress}>
        {children}
      </Text>
    );
  }
}
