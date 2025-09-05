import { gql } from "@apollo/client";

export const GET_NOTIFICATION_STATS = gql`
  query GetNotificationStats {
    notificationStats {
      totalCount
      unreadCount
      readCount
      typeCounts
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications(
    $first: Int
    $after: String
    $unreadOnly: Boolean
    $notificationType: String
  ) {
    notifications(
      first: $first
      after: $after
      unreadOnly: $unreadOnly
      notificationType: $notificationType
    ) {
      edges {
        node {
          id
          title
          message
          notificationType
          data
          actionUrl
          actionText
          isRead
          createdAt
          readAt
          business {
            id
            name
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      unreadCount
    }
  }
`;
