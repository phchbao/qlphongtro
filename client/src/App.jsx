import { HashRouter as Router, Routes, Route } from "react-router-dom";
import {
    Login,
    Register,
    ForgotPassword,
    ResetPassword,
    HomepageOwner,
    HomepageLodger,
    Landing,
    AboutPage,
    Blog,
    PrivacyPoliciesPage,
    NotFound,
    PostRoom,
    RoomDetail,
    PersonalRoomDetail,
    SavedRoom,
    ProfilePageLodger,
    ProfilePageOwner,
    OwnerUserDetailPage,
    LodgerUserDetailPage,
    UpdateRoomDetail,
    AllContacts,
    CreateContractPage,
    ContractAgreementPage,
    ContractDetailPage,
    AllRentDetailPage,
    CreateRentDetail,
    SingleRentDetail,
    AllRentalRooms,
    RentalRoomDetail,
    ContractDetailPageLodger,
    SendPaymentEmailPage,
    CreatePaymentHistory,
    RentDetailLodgerPage,
    SendComplaint,
    VerifyEmailPage,
    VerificationMessagePage,
    AllContactsLodger,
    OwnerChat,
    LodgerChat,
    OwnerNoti,
    LodgerNoti,
    ManagementPage,
    NotiAll,
    ManagementElectric,
    ManagementWater,
    ManagementService,
} from "./pages";
import {
    SharedLayout,
    ProtectedRoutes,
    ScrollToTop,
} from "./components";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#ada2ff",
        },
        secondary: {
            main: "#EE9B01",
        },
        tertiary: {
            main: "#00ACCF",
            dark: "#0496b4",
        },

        tonalOffset: 0.2,
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <ScrollToTop /> {/*Scroll to top when route changes*/}
                <Routes>
                    <Route
                        path="/owner"
                        element={
                            <ProtectedRoutes source={"owner"}>
                                <SharedLayout />
                            </ProtectedRoutes>
                        }
                    >
                        <Route index element={<HomepageOwner />} />
                        <Route path="room/post" element={<PostRoom />} />
                        <Route
                            path="tro-so/:slug"
                            element={<PersonalRoomDetail />}
                        />
                        <Route
                            path="tro-so/update/:slug"
                            element={<UpdateRoomDetail />}
                        />
                        <Route path="profile" element={<ProfilePageOwner />} />
                        <Route
                            path="lodger-user/:slug"
                            element={<LodgerUserDetailPage />}
                        />
                        <Route path="contacts/all" element={<AllContacts />} />
                        <Route path="contract/create" element={<CreateContractPage />} />
                        <Route
                            path="contract/:roomId/:slug"
                            element={<ContractDetailPage />}
                        />
                        <Route path="rentDetail" element={<AllRentDetailPage />} />
                        <Route path="rentDetail/create" element={<CreateRentDetail />} />
                        <Route
                            path="rentDetail/:rentDetailId/:slug"
                            element={<SingleRentDetail />}
                        />
                        <Route
                            path="rentDetail/send-payment-email/:rentDetailId"
                            element={<SendPaymentEmailPage />}
                        />
                        <Route
                            path="rentDetail/paymentHistory/:rentDetailId/create"
                            element={<CreatePaymentHistory />}
                        />
                        <Route path="chat" element={<OwnerChat />} />
                        <Route path="noti" element={<OwnerNoti />} />
                        <Route path="/owner/manage" element={<ManagementPage />}>
                            <Route path="notiall" element={<NotiAll/>}/>
                            <Route path="electric" element={<ManagementElectric />} />
                            <Route path="water" element={<ManagementWater />} />
                            <Route path="services" element={<ManagementService />} />
                        </Route>
                    </Route>
                    <Route
                        path="/lodger"
                        element={
                            <ProtectedRoutes source={"lodger"}>
                                <SharedLayout />
                            </ProtectedRoutes>
                        }
                    >
                        <Route index element={<HomepageLodger />} />
                        <Route path="tro-so/:slug" element={<RoomDetail />} />
                        <Route path="tro-so/saved/all" element={<SavedRoom />} />
                        <Route path="profile" element={<ProfilePageLodger />} />
                        <Route path="owner-user/:slug" element={<OwnerUserDetailPage />} />
                        <Route
                            path="contract-agreement/:contractId"
                            element={<ContractAgreementPage />}
                        />
                        <Route
                            path="rental-rooms/all"
                            element={<AllRentalRooms />}
                        />
                        <Route
                            path="rental-rooms/:slug"
                            element={<RentalRoomDetail />}
                        />
                        <Route
                            path="contract/:roomId/:slug"
                            element={<ContractDetailPageLodger />}
                        />
                        <Route
                            path="rentDetail/:roomId/:slug"
                            element={<RentDetailLodgerPage />}
                        />
                        <Route path="send-complaint/:slug" element={<SendComplaint />} />
                        <Route path="contacts/all" element={<AllContactsLodger />} />
                        <Route path="chat" element={<LodgerChat />} />
                        <Route path="noti" element={<LodgerNoti />} />
                    </Route>
                    <Route path="/login/:role" element={<Login />} />
                    <Route path="/register/:role" element={<Register />} />
                    <Route path="/forgot-password/:role" element={<ForgotPassword />} />
                    <Route
                        path="/reset-password/:role/:token"
                        element={<ResetPassword />}
                    />
                    <Route
                        path="/account-created/:role"
                        element={<VerificationMessagePage />}
                    />
                    <Route
                        path="/verify-account/:role/:token"
                        element={<VerifyEmailPage />}
                    />
                    <Route index element={<Landing />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="blog" element ={<Blog/>}/>
                    <Route path="privacy" element={<PrivacyPoliciesPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
