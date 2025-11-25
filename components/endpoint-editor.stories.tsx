import type { Meta, StoryObj } from '@storybook/react';
import { EndpointEditor } from './endpoint-editor';
import type { Endpoint } from 'beddel/server';

const meta: Meta<typeof EndpointEditor> = {
  title: 'Admin/EndpointEditor',
  component: EndpointEditor,
};
export default meta;

type Story = StoryObj<typeof EndpointEditor>;

const sampleEndpoint: Endpoint = {
  id: 'endpoint_123',
  name: 'summarizeText',
  description: 'Summarize text using LLM',
  code: `async function execute(params, props) { return { ok: true }; }`,
  visibility: 'public',
  requiredProps: ['openaiApiKey'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const New: Story = { args: { endpoint: undefined } };
export const Existing: Story = { args: { endpoint: sampleEndpoint } };
