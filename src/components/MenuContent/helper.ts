import { SpecificNotificationType } from "~/interfaces/INotification";
import { PostType } from "~/interfaces/IPost";
import { TargetType } from "~/interfaces/IReport";
import { LinkGeneratorTypes } from '~/utils/link';
import { MENU_KEYS } from "./constants";

export const getCopyLinkType = (contentType) => {
  if (contentType === PostType.POST) {
    return LinkGeneratorTypes.POST;
  }

  if (contentType === PostType.SERIES) {
    return LinkGeneratorTypes.SERIRES;
  }

  if (contentType === PostType.ARTICLE) {
    return LinkGeneratorTypes.ARTICLE;
  }
};

export const getReportContentType = (contentType) => {
  if (contentType === PostType.POST) {
    return TargetType.POST;
  }

  if (contentType === PostType.ARTICLE) {
    return TargetType.ARTICLE;
  }
};

export const getEnableNotificationType = (contentType) => {
  if (contentType === PostType.POST) {
    return SpecificNotificationType.post;
  }

  if (contentType === PostType.ARTICLE) {
    return SpecificNotificationType.article;
  }
};

export const getTitleContent = (contentType, menuType, isSave = false) => {
  if (contentType === PostType.POST) {
    if (menuType === MENU_KEYS.EDIT) {
      return 'post:post_menu_edit';
    }
    if (menuType === MENU_KEYS.SAVE) {
      return `post:post_menu_${isSave ? 'unsave' : 'save'}`;
    }
    if (menuType === MENU_KEYS.DELETE) {
      return 'post:post_menu_delete';
    }    
  }

  if (contentType === PostType.ARTICLE) {
    if (menuType === MENU_KEYS.EDIT) {
      return 'article:menu:edit';
    }
    if (menuType === MENU_KEYS.SAVE) {
      return `article:menu:${isSave ? 'unsave' : 'save'}`;
    }
    if (menuType === MENU_KEYS.DELETE) {
      return 'article:menu:delete';
    }   
  }

  if (contentType === PostType.SERIES) {
    if (menuType === MENU_KEYS.EDIT) {
      return 'series:menu_text_edit_series';
    }
    if (menuType === MENU_KEYS.SAVE) {
      return `series:menu_text_${isSave ? 'unsave' : 'save'}_series`;
    }
    if (menuType === MENU_KEYS.DELETE) {
      return 'series:menu_text_delete_series';
    }   
  }
};
