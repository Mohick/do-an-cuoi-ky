import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./page/home-page/home-page";
import Auth from "./page/auth/auth";


export default function Router() {
    return <Suspense>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="auth" element={<Auth/>}/>
        </Routes>
    </Suspense>
}