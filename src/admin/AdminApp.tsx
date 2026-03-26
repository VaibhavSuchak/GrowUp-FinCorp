import { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AdminProvider } from './AdminContext';
import AdminLayout from './AdminLayout';

// Lazy load admin pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Enquiries = lazy(() => import('./pages/Enquiries'));


const SiteSettings = lazy(() => import('./pages/SiteSettings'));
const SEOSettings = lazy(() => import('./pages/SEOSettings'));
const ReviewsManager = lazy(() => import('./pages/ReviewsManager'));
const Login = lazy(() => import('./pages/Login'));

const ProtectedRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
    return <Outlet />;
};

export default function AdminApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <AdminProvider>
            <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading admin module...</div>}>
                <Routes>
                    <Route
                        path="login"
                        element={isAuthenticated ? <Navigate to="/admin" replace /> : <Login onLogin={() => setIsAuthenticated(true)} />}
                    />
                    <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                        <Route path="/" element={<AdminLayout onLogout={() => setIsAuthenticated(false)} />}>
                            <Route index element={<Dashboard />} />
                            <Route path="enquiries" element={<Enquiries />} />

                            <Route path="reviews" element={<ReviewsManager />} />
                            <Route path="seo" element={<SEOSettings />} />
                            <Route path="settings" element={<SiteSettings />} />
                        </Route>
                    </Route>
                </Routes>
            </Suspense>
        </AdminProvider>
    );
}
