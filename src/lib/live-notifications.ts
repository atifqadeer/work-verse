import { collection, onSnapshot } from 'firebase/firestore';
import { getClientFirestore, isFirebaseLiveEnabled } from './firebase-client';
import type { NotificationItem } from '../types';

export function subscribeToLiveNotifications(
  userId: string,
  onChange: (items: NotificationItem[]) => void
): () => void {
  const db = getClientFirestore();
  if (!db || !isFirebaseLiveEnabled()) {
    return () => undefined;
  }

  return onSnapshot(collection(db, 'users', userId, 'notifications'), snapshot => {
    const items = snapshot.docs
      .map(doc => doc.data() as NotificationItem)
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    onChange(items);
  });
}
