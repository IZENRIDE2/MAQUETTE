import { useCallback, useEffect, useRef, useState } from 'react';
import { subscribeGroups } from './groups';
import { GroupError, toGroupError } from './errors';

/**
 * Charge une donnée asynchrone et la recharge à chaque changement signalé.
 * Par défaut : mutations de l'API groupes (et démo). `subscribe` permet de
 * brancher une autre source (temps réel d'un groupe). Les changements
 * rapprochés sont regroupés en un seul rechargement.
 */
export function useQuery<T>(
  load: () => Promise<T> | T,
  deps: unknown[],
  subscribe: (onChange: () => void) => () => void = subscribeGroups,
) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<GroupError | null>(null);
  const [loading, setLoading] = useState(true);
  const loadRef = useRef(load);
  loadRef.current = load;
  const subscribeRef = useRef(subscribe);
  subscribeRef.current = subscribe;

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
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(reload, 80);
    };
    setLoading(true);
    reload();
    const unsubscribe = subscribeRef.current(schedule);
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [reload]);

  return { data, error, loading, reload };
}
