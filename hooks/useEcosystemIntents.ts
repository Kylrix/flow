'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EcosystemBridge, EcosystemIntent } from '@/lib/ecosystem/bridge';
import { useTask } from '@/context/TaskContext';

export const useEcosystemIntents = () => {
    const searchParams = useSearchParams();
    const { openTaskDialog } = useTask();

    useEffect(() => {
        const intentData = EcosystemBridge.parseIntent(window.location.href);
        if (!intentData) return;

        switch (intentData.intent) {
            case 'create_task':
                // Implement task creation logic or open modal
                console.log('Ecosystem Intent: Create Task', intentData.data);
                if (openTaskDialog) {
                    openTaskDialog({
                        title: intentData.data.title || '',
                        description: intentData.data.body || ''
                    });
                }
                break;
            // Add more cases as needed
        }

        // Clean up URL if autoClose is true or after handling?
        // Usually better to keep it for refresh, or use router.replace
    }, [searchParams, openTaskDialog]);
};
