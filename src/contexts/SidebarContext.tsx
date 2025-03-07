"use client"
import { useState, ReactNode, useEffect, createContext } from 'react';
import type UserTypes from '@/next-user';
import { useSession } from "next-auth/react"
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

type SidebarContext = {
  sidebarToggle: any;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  userData: UserTypes.IUser;
  setUserData: ({} : UserTypes.IUser) => void;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SidebarContext = createContext<SidebarContext>(
  {} as SidebarContext
);

type Props = {
  children: ReactNode;
};

export function SidebarProvider({ children }: Props) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [userData, _setUserData] = useState({
    id: '',
    name: '',
    email: '',
    image: '',
    user_role: [] as UserTypes.IRole[],
  });

  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };

  const closeSidebar = () => {
    setSidebarToggle(false);
  };

  const setUserData = (user: UserTypes.IUser) => {
    _setUserData({...userData, id: user.id, name: user.name, email: user.email, image: user.image, user_role: user.user_role })
  };

  const loadData = async () => {
    setLoading(true)
    
    try {
      if (session) {
        let response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        if (data && data.error) {
          _setUserData({...userData, id: '', name: '', email: '', image: '', user_role: []})
        } else {
          _setUserData({...userData, id: data.profile.id, name: data.profile.name, email: data.profile.email, image: data.profile.image, user_role: data.profile.user_role})
        }
      } else {
        _setUserData({...userData, id: '', name: '', email: '', image: '', user_role: []})
      }
    } catch(err) {
      console.log(err)
    }
    
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [session])

  return (
    <SidebarContext.Provider
      value={{ sidebarToggle, toggleSidebar, closeSidebar, userData, setUserData }}
    >
      {children}
      <ProgressBar />
    </SidebarContext.Provider>
  );
}
