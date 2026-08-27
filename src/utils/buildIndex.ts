export function buildIndex<T, K extends PropertyKey>(
  list: T[],
  getKey: (val: T) => K,
): Record<K, T> {
  const index: Record<K, T> = {} as Record<K, T>;
  list.forEach((val) => (index[getKey(val)] = val));

  return index;
}
