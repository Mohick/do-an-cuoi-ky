import { MenuOutlined } from "@ant-design/icons";
import Logo from "../../components/logo";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import LayoutApp from "../../layout";







export function Header() {
    const [open, setOpen] = useState(false)
    return <header className={`bg-[#121828] fixed w-full z-50  top-0 left-0 right-0`}>
        <div className="flex w-full justify-between relative items-center">
            <LayoutApp className="flex w-full justify-between  items-center">
                <div className="flex w-full  justify-between items-center">
                    <div className="flex-1">
                        <Logo />
                    </div>
                    <div onClick={() => setOpen(!open)} className="p-2 rounded-md lg:hidden text-white bg-[#252528] ">
                        <MenuOutlined className="text-lg " />
                    </div>
                </div>
                <motion.div className={`lg:relative absolute lg:h-full top-full left-0  w-full bg-[#121828] overflow-hidden transform duration-500 ${open ? 'block h-screen' : ' h-0'}`}>
                    <LayoutApp className="lg:max-w-[100%]">
                        <ul className="text-white uppercase mt-2 block lg:flex justify-end gap-3">
                            <li className="border-b-2 lg:border-0">
                                <Link className=" block text-center py-2 text-[#ffb900] font-bold hover:text-white" to={'/auth'}>
                                    Bắt đầu ngay
                                </Link>
                            </li>
                        </ul>
                    </LayoutApp>
                </motion.div>
            </LayoutApp>
        </div>
        <hr className="w-full bg-white h-[1px] border-white" />
    </header>
}