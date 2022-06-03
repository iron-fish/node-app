// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import React, { ReactElement } from 'react'

configure({ adapter: new Adapter() })

// Mock i18n provider in the test suite
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, variables: Record<string, unknown> = {}): string =>
      key + Object.values(variables).join(','),
  }),
  // eslint-disable-next-line react/display-name
  Trans: (): ReactElement => <></>,
}))

jest.mock('i18next', () => ({
  t: (key: string, variables: Record<string, unknown> = {}): string =>
    key + Object.values(variables).join(','),
}))

// Mock useLocation hook in the test suite
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useLocation: () => ({
    pathname: '/dashboard',
  }),
  useParams: () => ({
    hash: 'group1',
  }),
}))
