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

export const UPDATE_NOTIFICATION_PREFERENCES = gql`
  mutation UpdateNotificationPreferences(
    $emailBusiness: Boolean!
    $emailCampaigns: Boolean!
    $emailReferrals: Boolean!
    $emailRewards: Boolean!
    $emailSystem: Boolean!
    $realtimeSystem: Boolean!
    $realtimeReferrals: Boolean!
    $realtimeRewards: Boolean!
    $realtimeBusiness: Boolean!
    $realtimeCampaigns: Boolean!
  ) {
    updateNotificationPreferences(
      emailBusiness: $emailBusiness
      emailCampaigns: $emailCampaigns
      emailReferrals: $emailReferrals
      emailRewards: $emailRewards
      emailSystem: $emailSystem
      realtimeSystem: $realtimeSystem
      realtimeReferrals: $realtimeReferrals
      realtimeRewards: $realtimeRewards
      realtimeBusiness: $realtimeBusiness
      realtimeCampaigns: $realtimeCampaigns
    ) {
      success
      message
    }
  }
`;