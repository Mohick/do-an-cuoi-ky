import { TitleDashboard } from "../../dashboard/side-bar-layout"
import MemberTable from "./achiver-member/achiver-member"
import CircleChart from "./Chart/circle-chart"





export default function ProgressTask() {
    return (
        <div className="w-full">
            <TitleDashboard text="Tiến độ hoàn thành của dự án" />

            <div className="w-full mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Bảng thành viên bên trái (hoặc phải tùy bro) */}
                <div className="w-full h-fit max-h-[720px] overflow-hidden rounded-xl shadow">
                    <MemberTable />
                </div>

                {/* Biểu đồ */}
                <div className="w-full h-fit min-h-[350px] flex items-center justify-center rounded-xl shadow p-4">
                    <CircleChart />
                </div>

            </div>
        </div>
    );
}