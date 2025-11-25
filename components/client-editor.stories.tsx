import type { Meta, StoryObj } from '@storybook/react';
import { ClientEditor } from './client-editor';
import type { Client } from 'beddel/server';

const meta: Meta<typeof ClientEditor> = {
  title: 'Admin/ClientEditor',
  component: ClientEditor,
};
export default meta;

type Story = StoryObj<typeof ClientEditor>;

const sampleClient: Client = {
  id: 'client_123',
  name: 'Acme Inc',
  email: 'ops@acme.co',
  apiKeys: ['opal_acme_key_abcd1234EFGH'],
  createdAt: new Date().toISOString(),
  rateLimit: 60,
};

export const New: Story = { args: { client: undefined } };
export const Existing: Story = { args: { client: sampleClient } };
export const Saving: Story = {
  render: (args) => <ClientEditor {...args} />,
  args: { client: sampleClient },
  parameters: { docs: { description: { story: 'Simulates typical editing state.' } } },
};
