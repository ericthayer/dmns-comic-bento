import { startServer } from './server.js';
const preview = await startServer(Number(process.env.PORT ?? 4173));
console.log(`Local: ${preview.url}`);
for (const signal of ['SIGINT','SIGTERM'] as const) process.on(signal, () => { void preview.close().then(() => process.exit(0)); });
