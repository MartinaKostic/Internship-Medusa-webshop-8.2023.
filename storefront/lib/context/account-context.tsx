'use client';

import { medusaClient } from '@/lib/config';
import { ChangeInfo } from '@/pages/my-account';
import { FormData } from '@/pages/my-account/register';
import { Customer } from '@medusajs/medusa';
import { useMutation } from '@tanstack/react-query';
import { useMeCustomer } from 'medusa-react';
import { useRouter } from 'next/navigation';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { AddressPayload } from '@medusajs/medusa';

export enum LOGIN_VIEW {
  SIGN_IN = 'sign-in',
  REGISTER = 'register',
}

interface Response {
  customer: Omit<Customer, 'password_hash'> | undefined;
  error: string;
}

interface AccountContext {
  customer?: Omit<Customer, 'password_hash'>;
  retrievingCustomer: boolean;
  loginView: [LOGIN_VIEW, React.Dispatch<React.SetStateAction<LOGIN_VIEW>>];
  checkSession: () => void;
  refetchCustomer: () => void;
  handleLogout: () => void;
  handleLogin: (email: string, pass: string) => Promise<Response>;
  handleRegister: (user: FormData) => Promise<Response>;
  handleCustomerChange: (user: ChangeInfo) => void;
  addCustomerBilling: (address: AddressPayload) => void;
}

const AccountContext = createContext<AccountContext | null>(null);

interface AccountProviderProps {
  children?: React.ReactNode;
}

const handleDeleteSession = () => {
  return medusaClient.auth.deleteSession();
};

export const AccountProvider = ({ children }: AccountProviderProps) => {
  const {
    customer,
    isLoading: retrievingCustomer,
    refetch,
    remove,
  } = useMeCustomer({ onError: () => {} });

  const loginView = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN);

  const router = useRouter();

  const handleLogin = useCallback(async (email: string, pass: string) => {
    const response: Response = {
      customer: undefined,
      error: '',
    };
    try {
      const { customer } = await medusaClient.auth.authenticate({
        email: email,
        password: pass,
      });
      response.customer = customer;
      refetch();
    } catch (error) {
      response.error =
        'A customer with the given email already has an account. Log in instead';
    }

    return response;
  }, []);

  const checkSession = useCallback(() => {
    if (!customer && !retrievingCustomer) {
      router.push('/account/login');
    }
  }, [customer, retrievingCustomer, router]);

  const useDeleteSession = useMutation({
    mutationFn: handleDeleteSession,
    mutationKey: ['delete-session'],
  });

  const handleLogout = () => {
    useDeleteSession.mutate(undefined, {
      onSuccess: () => {
        remove();
        loginView[1](LOGIN_VIEW.SIGN_IN);
        router.push('/my-account/login');
      },
    });
  };

  const handleRegister = async (user: FormData) => {
    const response: Response = {
      customer: undefined,
      error: '',
    };

    try {
      const { customer } = await medusaClient.customers.create({
        first_name: user.firstname,
        last_name: user.lastname,
        email: user.email,
        password: user.password,
      });

      response.customer = customer;
    } catch (error) {
      response.error =
        'A customer with the given email already has an account. Log in instead';
    }

    return response;
  };

  const handleCustomerChange = async (user: ChangeInfo) => {
    const response = await medusaClient.customers.update({
      first_name: user.firstname,
      last_name: user.lastname,
      phone: user.phone,
    });
    if (response.customer) {
      refetch();
    }
  };
  const addCustomerBilling = async (address: AddressPayload) => {
    const response = await medusaClient.customers.update({
      billing_address: {
        ...address,
      },
    });
    if (response.customer) {
      refetch();
    }
  };

  return (
    <AccountContext.Provider
      value={{
        customer,
        retrievingCustomer,
        loginView,
        checkSession,
        refetchCustomer: refetch,
        handleLogout,
        handleLogin,
        handleRegister,
        handleCustomerChange,
        addCustomerBilling,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);

  if (context === null) {
    throw new Error('useAccount must be used within a AccountProvider');
  }
  return context;
};
