import { createClient } from "redis";

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
})

client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => {
    console.log('Redis Client Connected');
}
);
client.on('ready', () => {
    console.log('Redis Client Ready');
}
);
client.on('end', () => {
    console.log('Redis Client Disconnected');
}
);
client.on('reconnecting', () => {
    console.log('Redis Client Reconnecting');
}
);
client.on('warning', (warning) => {
    console.log('Redis Client Warning', warning);
}
);

(async () => {
  await client.connect();
})();

export const cache = {
  get: async (key: string): Promise<string | null> => {
    return await client.get(key);
  },
  set: async (key: string, value: string, expiry?: number): Promise<void> => {
    if (expiry) {
      await client.setEx(key, expiry, value);
    } else {
      await client.set(key, value);
    }
  },
  del: async (key: string): Promise<void> => {
    await client.del(key);
  },
  quit: async (): Promise<void> => {
    await client.quit();
  },
};