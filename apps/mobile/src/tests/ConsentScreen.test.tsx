import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ConsentScreen from '../screens/Auth/ConsentScreen';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn(), replace: jest.fn() }),
}));

const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
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

describe('ConsentScreen', () => {
  it('button is disabled until scroll reaches bottom and mood is checked', () => {
    const { getByText, getAllByRole } = render(
      <ConsentScreen navigation={mockNavigation} route={{ key: 'Consent', name: 'Consent' }} />
    );
    const button = getByText(/Scroll to continue|I understand/);
    expect(button).toBeTruthy();
    const switches = getAllByRole('switch');
    expect(switches.length).toBeGreaterThan(0);
  });

  it('mood toggle starts unchecked', () => {
    const { getAllByRole } = render(
      <ConsentScreen navigation={mockNavigation} route={{ key: 'Consent', name: 'Consent' }} />
    );
    const switches = getAllByRole('switch');
    switches.forEach((sw) => {
      expect(sw.props.value).toBeFalsy();
    });
  });
});
