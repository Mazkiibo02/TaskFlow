// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

jest.mock('@fluentui/react-components', () => {
  return {
    Toaster: () => 'Toaster',
    useToastController: () => ({ dispatchToast: jest.fn() }),
    Toast: () => 'Toast',
    ToastTitle: () => 'ToastTitle',
    useId: () => 'mock-id',
    FluentProvider: ({ children }: any) => children,
    Button: () => 'Button',
    Input: () => 'Input',
    Dropdown: () => 'Dropdown',
    Option: () => 'Option',
    Badge: () => 'Badge',
    Spinner: () => 'Spinner',
    Title2: () => 'Title2',
    Table: () => 'Table',
    TableHeader: () => 'TableHeader',
    TableRow: () => 'TableRow',
    TableHeaderCell: () => 'TableHeaderCell',
    TableBody: () => 'TableBody',
    TableCell: () => 'TableCell',
    TableCellLayout: () => 'TableCellLayout',
    TabList: () => 'TabList',
    Tab: () => 'Tab',
    Dialog: () => 'Dialog',
    DialogTrigger: () => 'DialogTrigger',
    DialogSurface: () => 'DialogSurface',
    DialogTitle: () => 'DialogTitle',
    DialogContent: () => 'DialogContent',
    DialogBody: () => 'DialogBody',
    DialogActions: () => 'DialogActions',
    Label: () => 'Label',
    makeStyles: () => () => ({}),
    tokens: new Proxy({}, { get: () => 'mock-token' }),
    shorthands: {
      padding: () => ({}),
      margin: () => ({}),
      border: () => ({}),
      gap: () => ({}),
      borderRadius: () => ({}),
      overflow: () => ({})
    }
  };
});
