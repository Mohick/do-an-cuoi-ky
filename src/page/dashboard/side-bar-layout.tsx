
import { Link, useLocation,  } from "react-router-dom"





export const TitleDashboard = ({ text }: { text: string }) => {
    return <h1 className="text-3xl mb-3 uppercase font-bold w-full text-white">
        {text}
    </h1>
}

const SideBarLayout = ({
    listSideBar,
    name
}: {
    listSideBar: {
        name: string,
        link: string,
        icon: React.ReactNode
    }[],
    name: string
}) => {
    const location = useLocation();


    return <div className="space-y-2">
        <TitleDashboard text={name} />
        {
            listSideBar.map((item) =>
                <Link to={item.link} key={item.link}
                    className={`flex items-center gap-3 p-2 text-gray-500 rounded-md hover:bg-[#252528] ${location.pathname.trim().toLowerCase() === item.link.trim().toLowerCase() ? 'bg-[#252528] text-white' : ''}`}>
                    <div className="">
                        {item.icon}
                    </div>
                    <div className="font-bold">
                        {item.name}
                    </div>
                </Link>
            )
        }
    </div>
}

export default SideBarLayout