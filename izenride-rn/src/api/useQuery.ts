import { useCallback, useEffect, useRef, useState } from 'react';
import { subscribeGroups } from './groups';
import { GroupError, toGroupError } from './errors';

/**
 * Charge une donnée asynchrone et la recharge à chaque changement signalé
 * par l'API groupes (mutation locale ou démo).
 */
export function useQuery<T>(load: () => Promise<T> | T, deps: unknown[]) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<GroupError | null>(null);
  const [loading, setLoading] = useState(true);
  const loadRef = useRef(load);
  loadRef.current = load;

  const reload = useCallback(async () => {
    try {
      const value = await loadRef.current();
      setData(value);
      setError(null);
    } catch (e) {
      setError(toGroupError(e));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    setLoading(true);
    reload();
    return subscribeGroups(reload);
  }, [reload]);

  return { data, error, loading, reload };
}
