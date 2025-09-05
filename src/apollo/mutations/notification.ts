import { gql } from "@apollo/client";


export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($notificationId: ID!) {
    markNotificationAsRead(notificationId: $notificationId) {
      success
      message
      notification {
        id
        isRead
        readAt
      }
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation MarkAllNotificationsAsRead($notificationType: String) {
    markAllNotificationsAsRead(notificationType: $notificationType) {
      success
      markedCount
      message
    }
  }
`;