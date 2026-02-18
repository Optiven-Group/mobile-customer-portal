import { DashboardSummary, ActivityFeedItem, Project } from "../navigation/types";
import api from "../utils/api";

// Mock data for development
const MOCK_SUMMARY: DashboardSummary = {
  totalProperties: 3,
  paymentsDue: 2,
  walletBalance: 45000,
  nextPaymentDate: "2024-05-15",
};

const MOCK_ACTIVITIES: ActivityFeedItem[] = [
  {
    id: 1,
    type: "payment",
    title: "Payment Received",
    description: "KES 15,000 received for Plot 45 in Aмани Ridge",
    date: "2024-04-20T10:30:00Z",
    read: false,
  },
  {
    id: 2,
    type: "property",
    title: "Title Deed Ready",
    description: "Your title deed for Plot 12 in Love Gardens is ready for collection",
    date: "2024-04-18T14:15:00Z",
    read: true,
  },
  {
    id: 3,
    type: "system",
    title: "System Maintenance",
    description: "Scheduled maintenance on Sunday 2am-4am",
    date: "2024-04-15T09:00:00Z",
    read: true,
  },
];

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  // Simulate API call
  // const response = await api.get("/dashboard/summary");
  // return response.data;
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_SUMMARY), 1000);
  });
};

export const getRecentActivity = async (): Promise<ActivityFeedItem[]> => {
  // const response = await api.get("/dashboard/activity");
  // return response.data;
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_ACTIVITIES), 1200);
  });
};
