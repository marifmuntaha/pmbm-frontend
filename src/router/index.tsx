import React, { useEffect, type ReactNode } from "react";
import { Routes, Route, useLocation, BrowserRouter } from "react-router-dom";
import ThemeProvider from "@/layout/provider/theme";
import { NoSidebar, WithSidebar } from '@/layout';
import Dashboard from '@/pages/dashboard';
import ProtectedRoute from "@/router/protectedRoute";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import { ToastContainer } from "react-toastify";
import ForgetPassword from "@/pages/auth/forget-password";
import Year from "@/pages/master/year";
import InstitutionList from "@/pages/institution/list";
import InstitutionDetails from "@/pages/institution/detail";
import Logout from "@/pages/auth/logout";
import Error404 from "@/pages/error/error404";
import Boarding from "@/pages/master/boarding";
import Room from "@/pages/master/room";
import PhoneVerification from "@/pages/auth/phone-verification";
import Payment from "@/pages/payment/index";
import PaymentDetail from "@/pages/payment/detail";
import Product from "@/pages/master/product";
import AdminRoute from "@/router/adminRoute";
import OperatorRoute from "@/router/operatorRoute";
import User from "@/pages/user";
import StudentPersonal from "@/pages/register/partials/personal";
import StudentParent from "@/pages/register/partials/parent";
import StudentAddress from "@/pages/register/partials/address";
import StudentProgram from "@/pages/register/partials/program";
import StudentOrigin from "@/pages/register/partials/origin";
import StudentAchievement from "@/pages/register/partials/achievement";
import StudentFile from "@/pages/register/file";
import Student from "@/pages/student";
import Invoice from "@/pages/invoice";
import InvoiceDetail from "@/pages/invoice/detail";
import InvoicePrint from "@/pages/invoice/print";
import Print from "@/pages/print";
import InvoiceReportStudent from "@/pages/report/invoiceStudent";
import PaymentReport from "@/pages/report/payment";
import ApplicantsReport from "@/pages/report/applicants";
import DiscountsReport from "@/pages/report/discounts";
import Institution from "@/pages/institution";
import InstitutionActivity from "@/pages/institution/activity";
import GuestRules from "@/pages/guest/rules";
import GuestSchedule from "@/pages/guest/schedule";
import GuestFlow from "@/pages/guest/flow";
import InstitutionProgram from "@/pages/institution/program";
import InstitutionPeriod from "@/pages/institution/period";
import StudentAdd from "@/pages/student/add";
import PaymentSettings from "@/pages/payment/settings";
import MasterRules from "@/pages/master/rules";
import InstitutionRules from "@/pages/institution/rules";
import VerifyReceipt from "@/pages/verify/verify-receipt";
import VerifyRegistration from "@/pages/verify/[token]";

import StudentBoardingPrint from "@/pages/student/print-boarding";
import InvoiceReportPrint from "@/pages/report/invoice-print";
import PaymentReportPrint from "@/pages/report/payment-print";
import ApplicantsReportPrint from "@/pages/report/applicants-print";
import DiscountsReportPrint from "@/pages/report/discounts-print";
import InvoiceItemReportPrint from "@/pages/report/invoice-item-print";

interface ScrollToTopProps {
    children: ReactNode;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ children }) => {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return <>{children}</>;
};

import SystemLog from "@/pages/dashboard/log";
import IntegrationTest from "@/pages/dashboard/test";
import AnnouncementPage from "@/pages/announcement";
import Whatsapp from "@/pages/setting/whatsapp";
import InvoiceReportItem from "@/pages/report/invoiceItem";

const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <ScrollToTop>
                <Routes>
                    <Route element={<ThemeProvider />}>
                        <Route element={<WithSidebar />}>
                            <Route element={<ProtectedRoute />}>
                                <Route path='/dashboard' element={<Dashboard />} />
                                <Route element={<AdminRoute roles={[1]} />}>
                                    <Route path="/log-sistem" element={<SystemLog />} />
                                    <Route path="/test-integrasi" element={<IntegrationTest />} />
                                </Route>
                                <Route element={<AdminRoute roles={[1, 2]} />}>
                                    <Route path="/data-pengguna" element={<User />} />
                                    <Route path="/pengumuman" element={<AnnouncementPage />} />
                                    <Route path="/pengaturan/whatsapp" element={<Whatsapp/>}/>
                                </Route>
                                <Route element={<OperatorRoute />}>
                                    <Route path="/master-data/program-lembaga" element={<InstitutionProgram />} />
                                    <Route path="/master-data/aktifitas-lembaga" element={<InstitutionActivity />} />
                                    <Route path="/master-data/aturan-lembaga" element={<InstitutionRules />} />
                                    <Route path="/master-data/periode-pendaftaran" element={<InstitutionPeriod />} />
                                    <Route path="/data-lembaga" element={<Institution />} />
                                    <Route path="/data-pendaftar/tambah" element={<StudentAdd />} />
                                    <Route path="/data-pendaftar/:id/ubah" element={<StudentAdd />} />
                                    <Route path="/data-pengguna" element={<User />} />
                                </Route>
                                <Route path='/master-data/tahun-pelajaran' element={<Year />} />
                                <Route path='/master-data/program-ponpes' element={<Boarding />} />
                                <Route path='/master-data/data-kamar' element={<Room />} />
                                <Route path="/master-data/item-pembayaran" element={<Product />} />
                                <Route path="/master-data/aturan-umum" element={<MasterRules />} />
                                <Route path="/master-data/konfigurasi-pembayaran" element={<PaymentSettings />} />
                                <Route path='/lembaga/:id/detail' element={<InstitutionDetails />} />
                                <Route path='/lembaga/data-lembaga' element={<InstitutionList />} />
                                <Route path="/pendaftaran/data-pribadi" element={<StudentPersonal />} />
                                <Route path="/pendaftaran/data-orangtua" element={<StudentParent />} />
                                <Route path="/pendaftaran/data-tempat-tinggal" element={<StudentAddress />} />
                                <Route path="/pendaftaran/program-pilihan" element={<StudentProgram />} />
                                <Route path="/pendaftaran/data-sekolah-asal" element={<StudentOrigin />} />
                                <Route path="/pendaftaran/data-prestasi" element={<StudentAchievement />} />
                                <Route path="/pendaftaran/unggah-berkas" element={<StudentFile />} />
                                <Route path="/data-pendaftar" element={<Student />} />
                                <Route path="/data-tagihan" element={<Invoice />} />
                                <Route path="/data-tagihan/:id/lihat" element={<InvoiceDetail />} />
                                <Route path="/pembayaran" element={<Payment />} />
                                <Route path="/pembayaran/:id/lihat" element={<PaymentDetail />} />
                                <Route path="/cetak-kartu" element={<Print />} />
                                <Route path="/laporan/tagihan/siswa" element={<InvoiceReportStudent />} />
                                <Route path="/laporan/tagihan/item" element={<InvoiceReportItem />} />
                                <Route path="/laporan/pembayaran" element={<PaymentReport />} />
                                <Route path="/laporan/pendaftar" element={<ApplicantsReport />} />
                                <Route path="/laporan/potongan" element={<DiscountsReport />} />
                            </Route>
                            <Route path='/' element={<Dashboard />} />
                            <Route path="/aturan-prosedur" element={<GuestRules />} />
                            <Route path="/jadwal-pelaksanaan" element={<GuestSchedule />} />
                            <Route path="/alur-pelaksanaan" element={<GuestFlow />} />
                        </Route>
                        <Route element={<NoSidebar />}>
                            <Route path="/auth/masuk" element={<Login />} />
                            <Route path="/auth/buat-akun" element={<Register />} />
                            <Route path="/auth/lupa-sandi" element={<ForgetPassword />} />
                            <Route path="/auth/verifikasi" element={<PhoneVerification />} />
                            <Route element={<ProtectedRoute />}>
                                <Route path="/auth/keluar" element={<Logout />} />
                            </Route>
                            <Route path="/error/403" element={<Error404 />} />
                            <Route path="/data-tagihan/:id/cetak" element={<InvoicePrint />} />
                            <Route path="/laporan/boarding/cetak" element={<StudentBoardingPrint />} />
                            <Route path="/laporan/tagihan/cetak" element={<InvoiceReportPrint />} />
                            <Route path="/laporan/tagihan-item/cetak" element={<InvoiceItemReportPrint />} />
                            <Route path="/laporan/pembayaran/cetak" element={<PaymentReportPrint />} />
                            <Route path="/laporan/pendaftar/cetak" element={<ApplicantsReportPrint />} />
                            <Route path="/laporan/potongan/cetak" element={<DiscountsReportPrint />} />
                            <Route path="/verify-receipt/:token" element={<VerifyReceipt />} />
                            <Route path="/verify/:token" element={<VerifyRegistration />} />
                            <Route path="*" element={<Error404 />} />
                        </Route>
                    </Route>
                </Routes>
            </ScrollToTop>
            <ToastContainer />
        </BrowserRouter>
    );
};

export default Router;
