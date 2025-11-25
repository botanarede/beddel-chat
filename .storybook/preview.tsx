import type { Preview } from "@storybook/react";
import React from 'react';
import '../styles/globals.css';
import { ThemeProvider } from '../components/theme-provider';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="p-6">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;
