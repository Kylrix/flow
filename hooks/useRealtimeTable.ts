import { useEffect } from 'react';
import { Models } from 'appwrite';
import { subscribeToTable } from '../lib/whisperrflow';

export function useRealtimeTable<T extends Models.Row>(
    tableId: string,
    onEvent: (event: { type: 'create' | 'update' | 'delete', payload: T }) => void
) {
    useEffect(() => {
        const unsubscribe = subscribeToTable<T>(tableId, onEvent);
        return () => {
            unsubscribe();
        };
    }, [tableId, onEvent]);
}
