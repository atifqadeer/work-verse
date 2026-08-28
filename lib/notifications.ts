import { prisma } from './prisma';
import { getAdminFirestore } from './firebase-admin';
import { makeId, toIso } from './ids';
import type { NotificationItem } from '@/src/types';

type NotificationInput = {
  userId: string;
  title: string;
  message: string;
  type: NotificationItem['type'];
  link?: string;
};

export async function createLiveNotification(input: NotificationInput): Promise<NotificationItem> {
  const notification: NotificationItem = {
    id: makeId('notif'),
    userId: input.userId,
    title: input.title,
    message: input.message,
    type: input.type,
    isRead: false,
    createdAt: new Date().toISOString(),
    link: input.link
  };

  await prisma.notification.create({
    data: {
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: false,
      createdAt: new Date(notification.createdAt),
      link: notification.link
    }
  });

  const firestore = getAdminFirestore();
  if (firestore) {
    await firestore
      .collection('users')
      .doc(notification.userId)
      .collection('notifications')
      .doc(notification.id)
      .set({
        ...notification,
        createdAt: notification.createdAt
      });
  }

  return notification;
}

export async function markLiveNotificationRead(userId: string, notificationId: string) {
  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true }
  });

  const firestore = getAdminFirestore();
  if (firestore) {
    await firestore
      .collection('users')
      .doc(userId)
      .collection('notifications')
      .doc(notificationId)
      .set({ isRead: true }, { merge: true });
  }
}

export function serializeNotification(row: {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  link: string | null;
}): NotificationItem {
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    message: row.message,
    type: row.type as NotificationItem['type'],
    isRead: row.isRead,
    createdAt: toIso(row.createdAt),
    link: row.link ?? undefined
  };
}
