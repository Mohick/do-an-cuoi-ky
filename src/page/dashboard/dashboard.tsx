"use client";
import { HomeOutlined } from "@ant-design/icons";
import SideBarLayout from "./side-bar-layout";
import { Outlet, useNavigate } from "react-router-dom";
import { useAccount } from "../../hooks/account";
import { useEffect } from "react";


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
        {
            name: 'Thư viện',
            link: '/library',
            icon: <HomeOutlined />
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
        <div className={`grid grid-cols-12 min-h-screen gap-2 bg-black text-white p-5 `}>
            <div className="grid col-span-2">
                <SideBarLayout listSideBar={listSideBar} name="Dashboard" />
            </div>
            <main className="col-span-10  p-6">
                <Outlet />
            </main>
        </div>
    );
}
