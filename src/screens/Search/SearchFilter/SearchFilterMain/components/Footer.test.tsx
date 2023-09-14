import React from 'react';
import { fireEvent, renderHook, waitFor } from '@testing-library/react-native';
import useSearchStore from '~/screens/Search/store';
import { renderWithRedux } from '~/test/testUtils';
import Footer from './Footer';
import { PostType } from '~/interfaces/IPost';

describe('Footer component', () => {
  it('should reset all', async () => {
    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      filter: {
        contentType: [PostType.POST],
      },
      tempFilter: {
        contentType: [PostType.ARTICLE],
      },
    });

    const rendered = renderWithRedux(<Footer searchScreenKey="123" />);

    const btnReset = rendered.getByTestId('footer.btn_reset');

    fireEvent.press(btnReset);

    await waitFor(() => {
      expect(result.current.search['123'].tempFilter).toBeUndefined();
    });
  });

  it('should confirm', async () => {
    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      filter: {
        contentType: [PostType.POST],
      },
      tempFilter: {
        contentType: [PostType.ARTICLE],
      },
    });

    const rendered = renderWithRedux(<Footer searchScreenKey="123" />);

    const btnConfirm = rendered.getByTestId('footer.btn_confirm');

    fireEvent.press(btnConfirm);

    await waitFor(() => {
      expect(result.current.search['123'].filter.contentType[0]).toBe(PostType.ARTICLE);
    });
  });
});
