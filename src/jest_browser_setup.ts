import { ReadableStream, TransformStream, WritableStream } from 'stream/web';

// undici 6 (loaded by the polyfill below) needs the WHATWG stream globals at load time, and jsdom does not define them.
Object.assign(globalThis, { ReadableStream, TransformStream, WritableStream });
require('@inrupt/jest-jsdom-polyfills');
