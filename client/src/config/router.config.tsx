import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "sonner";

import AuthLayout from "../pages/layout/AuthLayoutPage";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import ForgetPasswordPage from "../pages/auth/ForgetPaasswordPage";
import AppLayout from "../pages/layout/AppLayoutPage";
import { UserRoles } from "./constant";
import ActivateAccountPage from "../pages/auth/ActivationPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import CreateApplicationPage from "../pages/application/ApplicationCreate";
import ApplicationDetails from "../pages/application/StudentViewApplication";
import EmployerApplicationsPage from "../pages/application/EmployerApplication";
import AdminApplicationsDesign from "../pages/application/AdminApplicationPage";
import AllGigViewPage from "../pages/application/AllGigViewPage";
import KhaltiInitiatePage from "../pages/khalti/KhaltiInitiatePage";
import KhaltiSuccessPage from "../pages/khalti/KhaltiSucessPage";
import PaymentsListPage from "../pages/khalti/GetKhaltiTransaction";
import ReviewPage from "../pages/review/CreateReview";
import GetReviewsPage from "../pages/review/ViewReviewsPage";
import AdminReviewsPage from "../pages/review/AdminReviewPage";
import AdminViewUserList from "../pages/user/AdminViewUserList";
import AdminViewPaymentsPage from "../pages/khalti/AdminPaymentsViewList";
import NotificationsPage from "../pages/notification/NotificationPage";
import AdminGigsPage from "../pages/gig/AdminGigView";
import AdminDashboardPage from "../pages/dashboard/AdminDashboardPage";
import AdminResumeControlPage from "../pages/resume/AdminReumeControl";
import StudentDashboardPage from "../pages/dashboard/StudentDashboardPage";
import StudentResumeView from "../pages/resume/StudentViewResume";
import StudentResumePage from "../pages/resume/ReumeProfilePage";
import EmployerDashboardPage from "../pages/dashboard/EmployerDashboardPage";
import CompanyResumePage from "../pages/resume/CompanyResumePage";
import EmployerResumeView from "../pages/resume/CompanyResumeDisplay";
import { CreateGigPage } from "../pages/gig/CreateGig";
import EmployerGigViewPage from "../pages/gig/EmployerGigViewPage";
import PublicEmployers from "../pages/public/PublicPage";

const RouterPathConfig = createBrowserRouter([
    {path:"/", Component: PublicEmployers},
    {
        path: "/auth",
        Component: AuthLayout,
        children: [
            { index: true, element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "activate/:token",element:<ActivateAccountPage/>},
            { path: "forget-password", element: <ForgetPasswordPage /> },
            { path: "reset-password/:token", element: <ResetPasswordPage/>}
        ],
    },
    { path: "/admin", element: <AppLayout role = {UserRoles.ADMIN}/>, children:[
        { path: "dashboard", element: <AdminDashboardPage/> },
        { path: "resume", element: <AdminResumeControlPage/>},
        {path:"applications",element: <AdminApplicationsDesign/>},
        {path: "gigview",element: <AllGigViewPage/>},
        {path:"review/EReview",element:<AdminReviewsPage/>},
        {path:"list/user", element:<AdminViewUserList/>},
        {path:"khalti/viewpayments",element:<AdminViewPaymentsPage/>},
        {path:"gigforadmin",element:<AdminGigsPage/>}
        
    ]},
    { path: "/student", element: <AppLayout role = {UserRoles.STUDENT}/>,children:[
        { path: "dashboard",element: <StudentDashboardPage/>},
        { path: "resume",element: <StudentResumeView/>},
        { path: "resume/create",element: <StudentResumePage/>},
        { path: "applications",element: <ApplicationDetails/>},
        { path: "applications/apply",element: <CreateApplicationPage/>},
        {path: "gigview",element: <AllGigViewPage/>},
        {path:"review/studentGiveReview", element: <ReviewPage/>},
        {path:"studentReview", element: <GetReviewsPage/>},
       
        
    ]},
    { path: "/employer", element: <AppLayout role = {UserRoles.EMPLOYER}/>,children:[
        {path:"dashboard", element: <EmployerDashboardPage/>},
        {path:"companyresume", element: <EmployerResumeView/>},
        {path:"companyresume/create", element: <CompanyResumePage/>},
        {path:"gig", element: <EmployerGigViewPage/>},
        {path:"gig/create", element: <CreateGigPage/>},
        {path:"applications",element: <EmployerApplicationsPage/>},
        {path: "gigview/active",element: <AllGigViewPage/>},
        {path:"initiatePayment", element: <KhaltiInitiatePage/>},
        {path:"khalti/transaction", element: <PaymentsListPage/>},
        {path:"khalti-success", element:<KhaltiSuccessPage/>},
        {path:"review/employerGive", element: <ReviewPage/>},
        {path:"review/EReview",element:<GetReviewsPage/>},
        {path:"notification",element:<NotificationsPage/>},
        
    ] },

]);

const RouterConfig = () => {
    return (
        <>
            <Toaster richColors />
            <RouterProvider router={RouterPathConfig} />
        </>
    );
};

export default RouterConfig;
