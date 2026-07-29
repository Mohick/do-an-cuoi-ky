import { Outlet, useNavigate, useParams } from "react-router-dom"
import SideBarLayout from "../dashboard/side-bar-layout"
import { BarChartOutlined, ControlOutlined, HomeOutlined, SettingFilled } from "@ant-design/icons"
import { useAccount } from "../../hooks/account"
import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import type { Props_Role_Group } from "../../api/props/task/create"

import { getRoleGroupAPI } from "../../api/group"
import { useRoleAccount } from "../../hooks/role"
import { socket } from "../../socket/socket.io"







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
            link: '/group/:id_group/process',
            icon: <BarChartOutlined />
        },
        {
            name: 'Cài đặt',
            link: '/group/:id_group/setting',
            icon: <SettingFilled />
        },
        {
            name: 'Dashboard',
            link: '/Dashboard',
            icon: <ControlOutlined />
        }
    ]





const replaceLink = (find: string, newReplace?: string) => {
    for (let i = 0; i < listSideBar.length; i++) {
        listSideBar[i].link = listSideBar[i].link.replace(find, newReplace as string)
    }
}



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
        console.log(id_group);
        
        socket.emit('join-group', id_group)
        replaceLink(':id_group', id_group as string)
        if (listRole[id_group as string] !== undefined) return;

        
        getRoleGroupAPI(id_group as string, socket.id as string).then((res: any) => {
            if (res.data.valid === false) return navigate('/')
            setReponsive(res.data)
            addOrUpdateRole(id_group as string, res.data.Role)
        }).catch((err) => {
            setReponsive(err.responsive.data)
        })
        return () => {
            socket.emit('leave-group', id_group)
            replaceLink(id_group as string, ':id_group')
        }
    }, [id_group])

    return (
        <div className={`grid grid-cols-12 min-h-screen max-h-screen h-screen overflow-hidden gap-2 bg-app text-white p-5 `}>
            <div className="grid col-span-12 lg:col-span-2">
                <SideBarLayout listSideBar={listSideBar} name="Group" />
            </div>
            <main className="col-span-12 lg:col-span-10 h-full overflow-y-auto p-6">
                <AnimatePresence>
                    <Outlet context={responsive.Role} />
                </AnimatePresence>
            </main>
        </div>
    )
}


export default LayoutGroup