import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ShadowModeGate from '../screens/ShadowMode/ShadowModeGate';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  isFocused: jest.fn(),
  canGoBack: jest.fn(),
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
} as never;

describe('ShadowModeGate', () => {
  it('requires settings toggle before begin session', () => {
    const { getByText } = render(
      <ShadowModeGate navigation={mockNavigation} route={{ key: 'ShadowGate', name: 'ShadowGate' }} />
    );
    const beginBtn = getByText('Begin Session');
    fireEvent.press(beginBtn);
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('shows confirmation modal after enabling settings', () => {
    const { getByText, getAllByRole } = render(
      <ShadowModeGate navigation={mockNavigation} route={{ key: 'ShadowGate', name: 'ShadowGate' }} />
    );
    const switches = getAllByRole('switch');
    fireEvent(switches[0], 'valueChange', true);
    fireEvent.press(getByText('Begin Session'));
    expect(getByText('Confirm Session')).toBeTruthy();
  });
});
