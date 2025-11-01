import { Outlet, useNavigate, useParams } from "react-router-dom"
import SideBarLayout from "../dashboard/side-bar-layout"
import { HomeOutlined } from "@ant-design/icons"
import { useAccount } from "../../hooks/account"
import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import type { Props_Role_Group } from "../../api/props/task/create"

import { getRoleGroupAPI } from "../../api/group"
import { useRoleAccount } from "../../hooks/role"







const listSideBar: {
    name: string,
    link: string,
    icon: React.ReactNode
}[] = [
        {
            name: 'Trang Chủ',
            link: '/group/:id_group',
            icon: <HomeOutlined />
        }, {
            name: 'Tiến Độ Hoàn Thành',
            link: '/group/:id_group/library',
            icon: <HomeOutlined />
        },
        {
            name: 'Dashboard',
            link: '/group/:id_group/Dashboard',
            icon: <HomeOutlined />
        }
    ]








const LayoutGroup = () => {
    const { data } = useAccount()
    const navigate = useNavigate();
    const { id_group } = useParams()
    const [responsive, setReponsive] = useState<Props_Role_Group>({
        valid: false,
        Role: ''
    })
    const { listRole, addOrUpdateRole } = useRoleAccount()
    useEffect(() => {
        if (data?.data.user.verify === false) {
            navigate('/verify-email')
        }
        if(listRole[id_group as string] !== undefined) return;
        getRoleGroupAPI(id_group as string).then((res: any) => {
            if (res.data.valid === false) return navigate('/')
            setReponsive(res.data)
            addOrUpdateRole(id_group as string, res.data.Role)
        }).catch((err) => {
            setReponsive(err.responsive.data)
        })
        listSideBar[0].link = `/group/${id_group}`
    }, [])
    if (!responsive.valid) return <div>Loading...</div>
    return (
        <div className={`grid grid-cols-12 min-h-screen gap-2 bg-black text-white p-5 `}>
            <div className="grid col-span-2">
                <SideBarLayout listSideBar={listSideBar} name="Group" />
            </div>
            <main className="col-span-10  p-6">
                <AnimatePresence>
                    <Outlet context={responsive.Role} />
                </AnimatePresence>
            </main>
        </div>
    )
}


export default LayoutGroup