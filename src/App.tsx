import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingSocial from './components/layout/FloatingSocial';
import ScrollToTop from './components/ui/ScrollToTop';
import SmoothScroll from './components/ui/SmoothScroll';
import LoadingAnimation from './components/ui/LoadingAnimation';
import TopProgressBar from './components/ui/TopProgressBar';
import { LoadingProvider, useLoadingContext } from './contexts/LoadingContext';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const EMICalculatorPage = lazy(() => import('./pages/EMICalculatorPage'));
const Contact = lazy(() => import('./pages/Contact'));

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const AdminApp = lazy(() => import('./admin/AdminApp'));

import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
    const { showLoading, hideLoading, isLoading, text, type } = useLoadingContext();
    const location = useLocation();

    // Trigger Branded Loading on every route change for a "Premium Buffer"
    useEffect(() => {
        showLoading('', 'branded');
        const timer = setTimeout(() => {
            hideLoading();
        }, 1200); // 1.2s for a professional "ecosystem" reveal
        return () => clearTimeout(timer);
    }, [location.pathname, showLoading, hideLoading]);

    // Custom Professional Page Variants
    const pageVariants = {
        initial: { opacity: 0, y: 10, scale: 0.99 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 1.01 },
    };

    const pageTransition = {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as any,
    };

    return (
        <>{/* ... existing div structure ... */}
            <div className="app-container">
                <Routes>
                    {/* Admin Panel Routes - No Navbar/Footer wrapper */}
                    <Route path="/admin/*" element={
                        <Suspense fallback={<LoadingAnimation type="branded" fullScreen={true} text="Opening Admin Portal..." />}>
                            <AdminApp />
                        </Suspense>
                    } />

                    {/* Main Website Routes */}
                    <Route path="/*" element={
                        <>
                            <Navbar />
                            <FloatingSocial />
                            <main style={{ position: 'relative' }}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={location.pathname}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        variants={pageVariants}
                                        transition={pageTransition}
                                        style={{ width: '100%' }}
                                    >
                                        <Suspense fallback={
                                            <LoadingAnimation type="branded" fullScreen={true} text="Initializing Experience..." />
                                        }>
                                            <Routes location={location} key={location.pathname}>
                                                <Route path="/" element={<Home />} />
                                                <Route path="/about" element={<About />} />
                                                <Route path="/services" element={<ServicesPage />} />
                                                <Route path="/emi-calculator" element={<EMICalculatorPage />} />
                                                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                                <Route path="/terms-of-service" element={<TermsOfService />} />
                                                <Route path="/disclaimer" element={<Disclaimer />} />
                                                <Route path="/contact" element={<Contact />} />
                                            </Routes>
                                        </Suspense>
                                    </motion.div>
                                </AnimatePresence>
                            </main>
                            <Footer />
                        </>
                    } />
                </Routes>
            </div>

            {/* Global Loading Overlay */}
            {isLoading && (
                <LoadingAnimation
                    type={type}
                    text={text}
                    fullScreen={true}
                />
            )}
            <Toaster position="top-right" />
        </>
    );
}

function App() {
    return (
        <Router>
            <TopProgressBar />
            <SmoothScroll />
            <ScrollToTop />
            <LoadingProvider>
                <AppContent />
            </LoadingProvider>
        </Router>
    );
}

export default App;
