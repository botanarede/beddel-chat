import { createBeddelHandler } from 'beddel/server';

export const POST = createBeddelHandler({
    agentsPath: 'packages/beddel/examples/agents'
});
