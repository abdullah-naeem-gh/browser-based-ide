export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  expanded?: boolean;
}

export const mockFileTree: FileItem[] = [
  { name: 'App.js', type: 'file' },
  { name: 'app.json', type: 'file' },
  { name: 'package.json', type: 'file' },
  { name: 'babel.config.js', type: 'file' },
  {
    name: 'components',
    type: 'folder',
    expanded: true,
    children: [
      { name: 'Button.js', type: 'file' },
      { name: 'Header.js', type: 'file' },
      { name: 'Card.js', type: 'file' }
    ]
  },
  {
    name: 'screens',
    type: 'folder',
    expanded: true,
    children: [
      { name: 'HomeScreen.js', type: 'file' },
      { name: 'ProfileScreen.js', type: 'file' },
      { name: 'SettingsScreen.js', type: 'file' }
    ]
  },
  {
    name: 'assets',
    type: 'folder',
    expanded: false,
    children: [
      { name: 'icon.png', type: 'file' },
      { name: 'splash.png', type: 'file' },
      { name: 'adaptive-icon.png', type: 'file' }
    ]
  }
];
