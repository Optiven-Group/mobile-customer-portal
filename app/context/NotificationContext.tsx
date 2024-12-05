import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { AppNotification } from "../navigation/types";
import api from "../utils/api";
import { useAuth } from "./AuthContext"; // Import useAuth

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (notification: AppNotification) => void;
  setNotifications: (notifications: AppNotification[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const { isLoggedIn } = useAuth(); // Get isLoggedIn from AuthContext

  const addNotification = (notification: AppNotification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  useEffect(() => {
    if (!isLoggedIn) return; // Do not fetch if not logged in

    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications");
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, [isLoggedIn]); // Depend on isLoggedIn

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, setNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
