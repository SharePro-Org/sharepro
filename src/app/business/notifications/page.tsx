"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ArrowLeft, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_NOTIFICATIONS } from "@/apollo/queries/notification";
import { MARK_NOTIFICATION_AS_READ } from "@/apollo/mutations/notification";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  notificationType: string;
  business?: {
    name: string;
  };
};

type NotificationsQueryData = {
  notifications: {
    edges: {
      node: Notification;
      cursor: string;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
    unreadCount: number;
  };
};

const notifications = () => {
  const router = useRouter();

  type MarkNotificationAsReadResult = {
    markNotificationAsRead?: {
      success: boolean;
      notification: Notification;
    };
  };

  const [markAsRead] = useMutation<MarkNotificationAsReadResult>(MARK_NOTIFICATION_AS_READ, {
    onError: (error) => {
      console.error('Error marking notification as read:', error);
    },
    update: (cache, { data: mutationData }) => {
      if (mutationData?.markNotificationAsRead?.success) {
        const updatedNotification = mutationData.markNotificationAsRead.notification;
        cache.modify({
          fields: {
            notifications: (existingData = { edges: [] }) => {
              const updatedEdges = existingData.edges.map((edge: any) => {
                if (edge.node.id === updatedNotification.id) {
                  return {
                    ...edge,
                    node: { ...edge.node, isRead: true, readAt: new Date().toISOString() }
                  };
                }
                return edge;
              });
              return { ...existingData, edges: updatedEdges };
            }
          }
        });
      }
    }
  });

  const handleNotificationClick = (notificationId: string) => {
    markAsRead({ variables: { notificationId } });
  };

  const { data, loading, error } = useQuery<NotificationsQueryData>(GET_NOTIFICATIONS, {
    variables: {
      first: 20, // Load 20 notifications initially
      unreadOnly: false,
    },
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <DashboardLayout>
        <section className="bg-white rounded-md md:p-6 p-3">
          <div className="text-center py-8">Loading notifications...</div>
        </section>
      </DashboardLayout>
    );
  }

  if (error) {
    console.error('GraphQL Error:', error);
    return (
      <DashboardLayout>
        <section className="bg-white rounded-md md:p-6 p-3">
          <div className="text-center py-8 text-red-500">
            Error loading notifications: {error.message}
          </div>
        </section>
      </DashboardLayout>
    );
  }

  console.log('Raw GraphQL Response:', data);
  const notificationsData = data?.notifications?.edges?.map(edge => edge.node) || [];
  console.log('Processed Notifications:', notificationsData);
  console.log("Notifications Data:", notificationsData);

  return (
    <DashboardLayout>
      <section className="bg-white rounded-md md:p-6 p-3 ">
        <button
          className="text-black cursor-pointer flex mb-6 items-center"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-3" />
          <span className="text-lg font-semibold capitalize">
            Notifications
          </span>
        </button>

        <>
          {notificationsData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No notifications found
            </div>
          ) : (
            notificationsData.map((notification: Notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={`p-3 border-b border-b-[#EAECF0] flex justify-between ${!notification.isRead ? "bg-blue-50" : ""
                  } cursor-pointer hover:bg-gray-50 transition-colors`}
              >
                <div className="flex gap-3">
                  <button
                    className={`flex justify-center items-center w-12 h-12 rounded-sm ${notification.notificationType === "REFERRAL_SUCCESS"
                      ? "bg-[#ABEFC6] text-[#067647]"
                      : notification.notificationType === "SUCCESS" || "INFO"
                        ? "bg-[#FEDF89] text-[#B54708]"
                        : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {notification.notificationType === "SUCCESS" || "INFO" ? (
                      <UserCircle />
                    ) : notification.notificationType === "BONUS_EARNED" ? (
                      <BsCurrencyDollar size={24} />
                    ) : (
                      <UserCircle />
                    )}
                  </button>
                  <div className="my-auto">
                    <p className="font-medium mb-1">{notification.title}</p>
                    <p className="text-sm">{notification.message}</p>
                    {notification.business && (
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.business.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="my-auto text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                  {!notification.isRead && (
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                  )}
                </div>
              </div>
            ))
          )}
        </>
      </section>
    </DashboardLayout>
  );
};

export default notifications;
