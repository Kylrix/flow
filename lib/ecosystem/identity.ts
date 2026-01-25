import { tablesDB, account } from '../appwrite';
import { APPWRITE_CONFIG } from '../config';

const CONNECT_DATABASE_ID = 'chat';
const CONNECT_COLLECTION_ID_USERS = 'users';

const PROFILE_SYNC_KEY = 'whisperr_ecosystem_identity_synced';

/**
 * Ensures the user has a record in the global WhisperrConnect Directory.
 * Uses a lightweight "local-first" check to avoid redundant DB calls.
 */
export async function ensureGlobalIdentity(user: any, force = false) {
    if (!user?.$id) return;

    if (typeof window !== 'undefined' && !force) {
        const lastSync = localStorage.getItem(PROFILE_SYNC_KEY);
        if (lastSync && (Date.now() - parseInt(lastSync)) < 24 * 60 * 60 * 1000) {
            return;
        }
    }

    try {
        let profile;
        try {
            profile = await tablesDB.getRow({
                databaseId: CONNECT_DATABASE_ID,
                tableId: CONNECT_COLLECTION_ID_USERS,
                rowId: user.$id
            });
        } catch (e: any) {
            if (e.code === 404) {
                // Create new global profile
                const username = user.prefs?.username || `user${user.$id.slice(0, 6)}`;

                profile = await tablesDB.createRow({
                    databaseId: CONNECT_DATABASE_ID,
                    tableId: CONNECT_COLLECTION_ID_USERS,
                    rowId: user.$id,
                    data: {
                        username,
                        displayName: user.name || username,
                        appsActive: ['flow'],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        bio: '',
                        avatarUrl: user.prefs?.avatarUrl || null,
                        privacySettings: JSON.stringify({ public: true })
                    },
                    permissions: [
                        'read("any")',
                        `update("user:${user.$id}")`,
                        `delete("user:${user.$id}")`
                    ]
                });
            } else {
                throw e;
            }
        }

        if (profile && Array.isArray(profile.appsActive) && !profile.appsActive.includes('flow')) {
            await tablesDB.updateRow({
                databaseId: CONNECT_DATABASE_ID,
                tableId: CONNECT_COLLECTION_ID_USERS,
                rowId: user.$id,
                data: {
                    appsActive: [...profile.appsActive, 'flow'],
                    updatedAt: new Date().toISOString()
                }
            });
        }

        if (typeof window !== 'undefined') {
            localStorage.setItem(PROFILE_SYNC_KEY, Date.now().toString());
        }
    } catch (error) {
        console.warn('[Identity] Global identity sync failed:', error);
    }
}

import { Query } from 'appwrite';

/**
 * Searches for users across the entire ecosystem.
 */
export async function searchGlobalUsers(query: string, limit = 10) {
    if (!query || query.length < 2) return [];

    try {
        const res = await tablesDB.listRows({
            databaseId: CONNECT_DATABASE_ID,
            tableId: CONNECT_COLLECTION_ID_USERS,
            queries: [
                Query.or([
                    Query.startsWith('username', query.toLowerCase()),
                    Query.search('displayName', query)
                ]),
                Query.limit(limit)
            ]
        });

        return res.rows.map((doc: any) => ({
            id: doc.$id,
            title: doc.displayName || doc.username,
            subtitle: `@${doc.username}`,
            avatar: doc.avatarUrl,
            profilePicId: doc.avatarFileId || doc.profilePicId,
            apps: doc.appsActive || []
        }));
    } catch (error) {
        console.error('[Identity] Global search failed:', error);
        return [];
    }
}
