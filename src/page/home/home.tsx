
import TitlePage from "./components/title-homepage/title-page";
import Achieve from "./achieve";

import { Header } from "./header";
import IntroductionFeature from "./feature";
import Slogan from "./slogan";
import type { PropsSubTitleHomePage, PropsTitleHomePage } from "./components/title-homepage/props-title-homepage";
import LayoutApp from "../../layout";
import CustomerTalk from "./customer-talk";
import Performent from "./performent";



const titleAchirvee: PropsTitleHomePage = {
    text: ['Thành Tựu &', "Dịch Vụ"],
    className: 'text-center md:text-start'
}
const subTitleAchirver: PropsSubTitleHomePage = {
    text: 'Thành tựu đạt được phản ánh sự nỗ lực và cam kết của chúng tôi trong việc mang lại giá trị vượt trội, với hàng chục nghìn người dùng tin tưởng, hàng chục nghìn dự án hoàn thành, thời gian hoạt động gần như tuyệt đối và hỗ trợ liên tục 24/7.',
    className: 'text-center md:text-justify'
}
const titleFeature: PropsTitleHomePage = {
    text: ['Tính năng ', "nổi bật"],
    className: 'text-center md:text-start'
}
const subTitleFeature: PropsSubTitleHomePage = {
    text: '',
    className: 'text-center md:text-justify'
}
const customersTalkTitle: PropsTitleHomePage = {
    text: ['Khách hàng nói gì', 'về chúng tôi'],
    className: 'text-center md:text-justify'
}
const subTitleCustomersTalk: PropsSubTitleHomePage = {
    text: 'Hàng nghìn team đã tin tưởng sử dụng Task Manager',
    className: 'text-center md:text-justify'
}

export function HomePage() {
    return (
        <>
            <Header />
            <main className="bg-app">
                <Slogan />
                <LayoutApp className="flex justify-center flex-col  gap-5 items-center ">
                    <TitlePage subTitle={subTitleAchirver} title={titleAchirvee} className="md:space-y-10 text-justify" />
                </LayoutApp>
                <Achieve />
                <LayoutApp className="flex justify-center flex-col  gap-5 items-center ">
                    <TitlePage subTitle={subTitleFeature} title={titleFeature} className="md:space-y-10" />
                </LayoutApp>
                <IntroductionFeature />
                <LayoutApp className="flex justify-center flex-col  gap-5 items-center ">
                    <TitlePage subTitle={subTitleCustomersTalk} title={customersTalkTitle} className="md:space-y-10 text-justify" />
                </LayoutApp>
                <CustomerTalk />
                <Performent />
            </main>
        </>
    )
}