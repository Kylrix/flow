const getRequiredEnv = (key: string, value: string | undefined): string => {
  if (!value) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(`[config] Missing environment variable: ${key}. Using placeholder for build.`);
      return '';
    }
    return ''; // Return empty instead of throwing to avoid build issues
  }
  return value;
};

export const APPWRITE_CONFIG = {
  ENDPOINT: 'https://fra.cloud.appwrite.io/v1',
  PROJECT_ID: '67fe9627001d97e37ef3',
  DATABASE_ID: 'kylrixflow',
  TABLES: {
    CALENDARS: 'calendars',
    TASKS: 'tasks',
    EVENTS: 'events',
    EVENT_GUESTS: 'eventGuests',
    FOCUS_SESSIONS: 'focusSessions',
    NOTES: '67ff05f3002502ef239e',
  },
  NOTE_DATABASE_ID: '67ff05a9000296822396',
  BUCKETS: {
    TASK_ATTACHMENTS: 'task_attachments',
    EVENT_COVERS: 'event_covers',
  },
  AUTH: {
    SUBDOMAIN: 'accounts',
    DOMAIN: 'kylrixnote.space',
  }
};
