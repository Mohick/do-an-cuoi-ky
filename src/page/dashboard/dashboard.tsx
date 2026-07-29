"use client";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import SideBarLayout from "./side-bar-layout";
import { Outlet, useNavigate } from "react-router-dom";
import { useAccount } from "../../hooks/account";
import { useEffect } from "react";
import { AlertComponent } from "../../components/alert/alert.componet";

const listSideBar: {
    name: string,
    link: string,
    icon: React.ReactNode
}[] = [
        {
            name: 'Trang Chủ',
            link: '/dashboard',
            icon: <HomeOutlined />
        },
        // {
        //     name: 'Thư viện',
        //     link: '/library',
        //     icon: <HomeOutlined />
        // },
        {
            name: "Tài khoản",
            link: "/dashboard/account",
            icon: <UserOutlined />
        }
    ]
export default function LayoutDashboard() {

    const { data } = useAccount()
    const navigate = useNavigate();
    useEffect(() => {
        if (data?.data.user.verify === false) {
            navigate('/verify-email')
        }
    }, [])

    return (
        <div className={`grid grid-cols-12  min-h-screen overflow-hidden max-h-screen gap-2 bg-app text-white p-5 `}>
            <div className="grid  col-span-12 lg:col-span-2">
                <SideBarLayout listSideBar={listSideBar} name="Dashboard" />
            </div>
            <main className="col-span-12  lg:col-span-10 p-6 h-full max-h-screen overflow-auto">
                <Outlet />
            </main>
            <AlertComponent />
        </div>
    );
}
