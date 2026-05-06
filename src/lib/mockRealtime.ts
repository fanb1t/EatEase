type Listener<T> = (payload: T) => void;

const listeners = new Map<string, Set<Listener<unknown>>>();

export function emitMockEvent<T>(channel: string, payload: T) {
  listeners.get(channel)?.forEach((listener) => listener(payload));
}

export function subscribeMockEvent<T>(channel: string, listener: Listener<T>) {
  const typedListener = listener as Listener<unknown>;
  const channelListeners = listeners.get(channel) ?? new Set<Listener<unknown>>();
  channelListeners.add(typedListener);
  listeners.set(channel, channelListeners);

  return () => {
    channelListeners.delete(typedListener);
    if (channelListeners.size === 0) {
      listeners.delete(channel);
    }
  };
}
