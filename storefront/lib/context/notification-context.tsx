import React, { useContext, useState, ReactNode, useEffect } from 'react';

interface NotificationContext {
  addNotification: (message: string) => void;
  notification: string | undefined;
  setNotification: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const NotificationContext = React.createContext<NotificationContext | null>(
  null
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === null) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};

interface NotificationProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProps) => {
  const [notification, setNotification] = useState<string>();

  const addNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  return (
    <NotificationContext.Provider
      value={{ addNotification, notification, setNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
