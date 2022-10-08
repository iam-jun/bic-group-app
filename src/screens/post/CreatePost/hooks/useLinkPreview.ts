import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import groupApi from '~/api/GroupApi';
import { useKeySelector } from '~/hooks/selector';
import { ILinkPreviewCreatePost } from '~/interfaces/IPost';
import postActions from '~/storeRedux/post/actions';
import postKeySelector from '~/storeRedux/post/keySelector';
import { getUrlFromText } from '~/utils/common';
import {
  createNewArrayLinkPreview,
  filterRemovedLinkPreviewNoLongerExists,
  getLstNotRemovedLinkPreview,
  removeLinkPreviewExistsInAdditionalLinkPreview,
  removeLinkPreviewNoLongerExists,
} from '../helper';

const useLinkPreview = () => {
  const dispatch = useDispatch();

  const refHandleLinkPreview = useRef<any>();

  const linkPreview = useKeySelector(postKeySelector.createPost.linkPreview);
  const { lstLinkPreview, lstRemovedLinkPreview } = linkPreview;

  const debounceHandleLinkPreview = (text: string) => {
    if (refHandleLinkPreview?.current) {
      clearTimeout(refHandleLinkPreview.current);
    }
    refHandleLinkPreview.current = setTimeout(
      () => handleLinkPreview(text),
      250,
    );
  };

  const handleLinkPreview = (
    text: string,
    // in case of editing post, we have linkPreview field, so we need to
    // add to lstLinkPreview
    additionalLinkPreview?: ILinkPreviewCreatePost[],
  ) => {
    const urls = getUrlFromText(text, []);

    if (urls.length === 0) {
      if (additionalLinkPreview) {
        dispatch(
          postActions.updateLinkPreview({
            lstLinkPreview: [...additionalLinkPreview],
          }),
        );
      }
      // reset lstRemovedLinkPreview
      dispatch(
        postActions.updateLinkPreview({
          lstRemovedLinkPreview: [],
        }),
      );
      return;
    }

    // get links that not removed
    const lstNotRemovedLinkPreview = getLstNotRemovedLinkPreview(
      urls,
      lstRemovedLinkPreview,
    );
    // create new array link preview with no duplicate url
    const newLstLinkPreview = createNewArrayLinkPreview(
      lstNotRemovedLinkPreview,
      lstLinkPreview,
    );
    // remove link preview in newLstLinkPreview if it no longer exists in lstNotRemovedLinkPreview
    const lstValidLinkPreview = removeLinkPreviewNoLongerExists(
      lstNotRemovedLinkPreview,
      newLstLinkPreview,
    );
    // remove items in lstRemovedLinkPreview if that no longer exist in urls
    const lstRemovedLinkPreviewUpdate = filterRemovedLinkPreviewNoLongerExists(
      urls,
      lstRemovedLinkPreview,
    );

    let lstLinkPreviewUpdate = [...lstValidLinkPreview];
    if (additionalLinkPreview) {
      // remove link in lstLinkPreviewUpdate if it exists in additionalLinkPreview
      const lstLinkPreviewNotInAdditionalLinkPreview
        = removeLinkPreviewExistsInAdditionalLinkPreview(
          lstLinkPreviewUpdate,
          additionalLinkPreview,
        );
      lstLinkPreviewUpdate = [
        ...lstLinkPreviewNotInAdditionalLinkPreview,
        ...additionalLinkPreview,
      ];
    }

    dispatch(
      postActions.updateLinkPreview({
        lstLinkPreview: lstLinkPreviewUpdate,
        lstRemovedLinkPreview: lstRemovedLinkPreviewUpdate,
      }),
    );
  };

  const onCloseLinkPreview = () => {
    const newLstLinkPreview = [...lstLinkPreview];
    const newLstRemovedLinkPreview = [...lstRemovedLinkPreview];
    const removedLinkPreviewItem = newLstLinkPreview.pop();
    newLstRemovedLinkPreview.push(removedLinkPreviewItem.url);

    dispatch(
      postActions.updateLinkPreview({
        lstLinkPreview: newLstLinkPreview,
        lstRemovedLinkPreview: newLstRemovedLinkPreview,
      }),
    );
  };

  const updateLinkPreviewState = (
    url: string,
    data: ILinkPreviewCreatePost,
  ) => {
    const updateLinkPreviewState = lstLinkPreview.map((item) => {
      if (item.url === url) {
        return {
          ...item,
          ...data,
        };
      }
      return item;
    });
    dispatch(
      postActions.updateLinkPreview({
        lstLinkPreview: updateLinkPreviewState,
      }),
    );
  };

  const loadLinkPreview = async (url: string) => {
    try {
      updateLinkPreviewState(url, { isLoading: true });

      const response = await groupApi.getLinkPreview(url);
      const {
        title, domain, image, description,
      } = response.data;

      updateLinkPreviewState(url, {
        title,
        domain,
        image,
        description,
        isLoading: false,
      });
    } catch (e) {
      console.error('loadLinkPreview error', e);
      updateLinkPreviewState(url, {
        domain: url,
        isLoading: false,
      });
    }
  };

  return {
    linkPreview,
    debounceHandleLinkPreview,
    handleLinkPreview,
    onCloseLinkPreview,
    loadLinkPreview,
  };
};

export default useLinkPreview;
