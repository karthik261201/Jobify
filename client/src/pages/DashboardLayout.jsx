import { Outlet, redirect, useNavigate, useNavigation } from "react-router-dom"
import Wrapper from '../assets/wrappers/Dashboard';
import { BigSidebar, Loading, Navbar, SmallSidebar } from "../components";
import { createContext, useContext, useEffect, useState } from "react";
import { checkDefaultTheme } from "../App";
import customFetch from "../utils/customFetch";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const userQuery = {
    queryKey: ['user'],
    queryFn: async () => {
      const response = await customFetch.get('/users/current-user');
      return response.data;
    },
};

const DashboardContext = createContext()

const DashboardLayout = ({ queryClient }) => {

    const { user } = useQuery(userQuery).data;
    const [isAuthError, setIsAuthError] = useState(false);
    const navigate = useNavigate()
    const [showSidebar, setShowSidebar] = useState(false)
    const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme())

    const navigation = useNavigation();
    const isPageLoading = navigation.state === 'loading';

    const toggleDarkTheme = () => {
        const newDarkTheme = !isDarkTheme
        setIsDarkTheme(newDarkTheme)
        document.body.classList.toggle('dark-theme',newDarkTheme)
        localStorage.setItem("darkTheme",newDarkTheme)
    }

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar)
    }

    const logoutUser = async () => {
        await customFetch.get('/auth/logout');
        toast.success('Logging out...');
        navigate('/');
    }

    customFetch.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          if (error?.response?.status === 401) {
            setIsAuthError(true);
          }
          return Promise.reject(error);
        }
    );

    useEffect(() => {
        if (!isAuthError) return;
        logoutUser();
    }, [isAuthError]);

    return (
        <DashboardContext.Provider value={{ user, showSidebar, isDarkTheme, setShowSidebar, toggleSidebar, toggleDarkTheme, setIsDarkTheme, logoutUser }}>
            <Wrapper>
                <main className='dashboard'>
                <SmallSidebar />
                <BigSidebar />
                <div>
                    <Navbar />
                    <div className='dashboard-page'>
                        {isPageLoading ? <Loading /> : <Outlet context={{ user }} />}
                    </div>
                </div>
                </main>
            </Wrapper>
        </DashboardContext.Provider>
    );
}

export const loader = (queryClient) => async () => {
    try {
        return await queryClient.ensureQueryData(userQuery);
    } catch (error) {
        return redirect('/');
    }
}

export const useDashboardContext = () => useContext(DashboardContext)

export default DashboardLayout