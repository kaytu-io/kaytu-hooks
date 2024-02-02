import { atom, useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const getLocationSearch = () =>
  window.location.search.at(0) === '?'
    ? window.location.search.slice(1, 100000)
    : window.location.search;
const searchAtom = atom<string>(getLocationSearch());

export function useURLParams<T>(
  defaultValue: T,
  serialize: (v: T) => Map<string, string[]>,
  deserialize: (v: Map<string, string[]>) => T
): [T, (v: T) => void] {
  const [search, setSearch] = useAtom(searchAtom);

  const currentParams = () => {
    const params = new URLSearchParams();
    getLocationSearch()
      .split('&')
      .map(v2 => v2.split('=').map(v3 => decodeURIComponent(v3)))
      .forEach(i => {
        if (i[0] !== '') {
          params.append(i[0], i[1]);
        }
      });
    return params;
  };

  const currentValue = () => {
    const serialized = serialize(defaultValue);
    const params = currentParams();

    const v: [string, string[]][] = [];
    serialized.forEach((defValue, key) => {
      const value = params.has(key) ? params.getAll(key) : defValue;
      v.push([key, value]);
    });

    return deserialize(new Map(v));
  };

  const [state, setState] = useState<T>(currentValue());

  const updateSearch = () => {
    // keeping search in sync with url
    const nSearch = getLocationSearch();
    if (search !== nSearch) {
      setSearch(nSearch);
    }
  };

  const setValue = (v: T) => {
    console.log(v);
    const serialized = serialize(v);
    const newParams = new URLSearchParams();
    currentParams().forEach((value, key) => newParams.append(key, value));

    serialized.forEach((value, key) => {
      newParams.delete(key);
      value.forEach(item => {
        newParams.append(key, item);
      });
    });

    window.history.pushState({}, '', `?${newParams.toString()}`);
    updateSearch();
  };

  useEffect(() => {
    setState(currentValue());
  }, [search]);

  try {
    const [searchParams] = useSearchParams();
    useEffect(() => {
      updateSearch();
    }, [searchParams]);
  } catch (e) {
    // ignore
  }

  return [state, setValue];
}

export function useURLParam<T>(
  urlParam: string,
  defaultValue: T,
  serialize?: (v: T) => string,
  deserialize?: (v: string) => T
) {
  const serializeFn = serialize !== undefined ? serialize : (v: T) => String(v);
  const deserializeFn =
    deserialize !== undefined ? deserialize : (v: string) => (v as any) as T;
  return useURLParams<T>(
    defaultValue,
    v => {
      const res = new Map<string, string[]>();
      res.set(urlParam, [serializeFn(v)]);
      return res;
    },
    v => {
      const m = v.get(urlParam) || [];
      return deserializeFn(m[0]);
    }
  );
}
