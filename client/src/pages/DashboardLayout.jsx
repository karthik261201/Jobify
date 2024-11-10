import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom"
import Wrapper from '../assets/wrappers/Dashboard';
import { BigSidebar, Navbar, SmallSidebar } from "../components";
import { createContext, useContext, useState } from "react";
import { checkDefaultTheme } from "../App";
import customFetch from "../utils/customFetch";

const DashboardContext = createContext()

const DashboardLayout = () => {

    const { user } = useLoaderData();
    // const user = {name: "John"}
    const navigate = useNavigate()
    const [showSidebar, setShowSidebar] = useState(false)
    const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme())

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
        navigate('/');
        await customFetch.get('/auth/logout');
        toast.success('Logging out...');
    }

    return (
        <DashboardContext.Provider value={{ user, showSidebar, isDarkTheme, setShowSidebar, toggleSidebar, toggleDarkTheme, setIsDarkTheme, logoutUser }}>
            <Wrapper>
                <main className='dashboard'>
                <SmallSidebar />
                <BigSidebar />
                <div>
                    <Navbar />
                    <div className='dashboard-page'>
                    <Outlet context={{user}}/>
                    </div>
                </div>
                </main>
            </Wrapper>
        </DashboardContext.Provider>
    );
}

export const loader = async () => {
    try {
        const { data } = await customFetch('/users/current-user');
        return data;
    } catch (error) {
        return redirect('/');
    }
}

export const useDashboardContext = () => useContext(DashboardContext)

export default DashboardLayout