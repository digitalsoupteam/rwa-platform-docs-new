import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { appName } from './shared';
import { CustomFolder, CustomItem } from '@/components/sidebar-components';

export function baseOptions() {
  return {
    nav: {
      enabled: false, // we have our own navbar in root layout
    },
    // keep search context enabled (for navbar search icon) but hide sidebar search
    searchToggle: {
      enabled: true,
    },
    themeSwitch: {
      enabled: false, // we render ThemeSwitch in our own navbar
    },
    links: [],
    sidebar: {
      collapsible: false,
      defaultOpenLevel: 1,
      components: {
        Folder: CustomFolder,
        Item: CustomItem,
      },
    },
    // hide the full search bar from sidebar (search is in navbar)
    slots: {
      searchTrigger: false,
    },
  } satisfies Omit<DocsLayoutProps, 'tree' | 'children'>;
}
