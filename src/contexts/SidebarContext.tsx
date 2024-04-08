"use client"
import { useState, ReactNode, useEffect, createContext } from 'react';
import { useSession } from "next-auth/react"

type SidebarContext = {
  sidebarToggle: any;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  userData: any;
  setUserData: ({} : any) => void;
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
  });

  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };

  const closeSidebar = () => {
    setSidebarToggle(false);
  };

  const setUserData = (user: any) => {
    _setUserData({...userData, id: user.id, name: user.name, email: user.email, image: user.image})
  };

  const loadData = async () => {
    setLoading(true)
    
    try {
      let response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (data && data.error) {
        _setUserData({...userData, id: '', name: '', email: '', image: ''})
      } else {
        _setUserData({...userData, id: data.profile.id, name: data.profile.name, email: data.profile.email, image: data.profile.image})
      }
    } catch(err) {
      console.log(err)
    }
    
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <SidebarContext.Provider
      value={{ sidebarToggle, toggleSidebar, closeSidebar, userData, setUserData }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
