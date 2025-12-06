import { Suspense, useEffect } from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import { HomePage } from "./page/home/home"
import Auth from "./page/auth/auth"
import LayoutDashboard from "./page/dashboard/dashboard"
import CreateGroup from "./page/dashboard/models/create-group"
import HomeDashboard from "./page/dashboard/home/dashboard"
import LayoutGroup from "./page/group/group"
import CreateTask from "./page/group/models/model-create"
import { useAccount } from "./hooks/account"
import NotFoundPage from "./page/404/404"
import VerifyEmailPage from "./page/auth/verify/verify-email"
import CheckVerify from "./page/auth/verify/Check-Verify"
import FullViewsTask from "./page/group/models/model-views"
import HomeTask from "./page/group/home/home"
import AwaitingTask from "./page/group/home/task/awaiting"
import HandlingTask from "./page/group/home/work/handling"
import PendingTask from "./page/group/home/pending/pending"
import CompletedTask from "./page/group/home/completed/completed"
import ProgressTask from "./page/group/progress/progress"
import Setting from "./page/group/setting/setting"
import ModelsAddMember from "./page/group/models/model-add-member"
import JoinGroup from "./page/group/join-group/join-group"
import { ModelUpdateInfoGroup } from "./page/group/models/model-update-group"

export default function Router() {
    const { data } = useAccount()
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="auth" element={<Auth />} />
                {!data?.blockcall && (
                    <>
                        {data?.data.user.verify &&
                            <>
                                <Route path="dashboard" element={<LayoutDashboard />}>
                                    <Route path="" element={<HomeDashboard />} >
                                        <Route path="create-group" element={<CreateGroup />} />
                                    </Route>
                                </Route>
                                <Route path="group/" element={<LayoutGroup />}>
                                    <Route path=":id_group">
                                        <Route index element={<HomeTask />} />
                                        <Route path="process" element={<ProgressTask />} />
                                        <Route path="setting" element={<Setting />} >
                                            <Route path="add-member" element={<ModelsAddMember />} />
                                            <Route path="edit-group" element={<ModelUpdateInfoGroup />} />
                                        </Route>
                                        <Route path="waiting" element={<AwaitingTask />} >
                                            <Route path="create" element={<CreateTask />} />
                                            <Route path="views/:id_task" element={<FullViewsTask />} />
                                        </Route>
                                        <Route path="handling" element={<HandlingTask />} >
                                            <Route path="views/:id_task" element={<FullViewsTask />} />
                                        </Route>
                                        <Route path="pending" element={<PendingTask />} >
                                            <Route path="views/:id_task" element={<FullViewsTask />} />
                                        </Route>
                                        <Route path="completed" element={<CompletedTask />} >
                                            <Route path="views/:id_task" element={<FullViewsTask />} />
                                        </Route>
                                    </Route>
                                </Route>
                                <Route path="/join-group" element={<JoinGroup />} />
                            </>
                        }
                        {!data?.data.user.verify && <Route path="verify-email" element={<VerifyEmailPage />} />}
                        {!data?.data.user.verify && <Route path="verify-email/:id" element={<CheckVerify />} />}
                    </>
                )}

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    )
}
