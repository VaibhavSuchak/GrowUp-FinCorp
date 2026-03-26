import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import { ArrowRight, Calculator } from 'lucide-react';
import { useState } from 'react';
import RevealText from '../ui/animations/RevealText';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroSlider = () => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);

    const SLIDES = [
        {
            id: 'home-loan',
            image: '/assets/slider/homeloan.png',
            fallback: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000&auto=format&fit=crop',
            tag: 'GrowUp FinCorp',
            title: 'Your Dream Home',
            titleColored: 'Starts Here',
            desc: 'Get the best Home Loan in Rajkot with competitive interest rates starting from 8.5% p.a. Fast approvals, doorstep service, and flexible repayment options.',
        },
        {
            id: 'lap',
            image: '/assets/slider/mortgage.png',
            fallback: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop',
            tag: 'Unlock Property Value',
            title: 'Loan Against',
            titleColored: 'Property',
            desc: 'Leverage your residential or commercial property to get high-value mortgage loans for business expansion, medical emergencies, or other financial goals.',
        },
        {
            id: 'business',
            image: '/assets/slider/business.png',
            fallback: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2000&auto=format&fit=crop',
            tag: 'Empowering Enterprise',
            title: 'Business & MSME',
            titleColored: 'Loans',
            desc: 'Smart capital for Rajkot\'s entrepreneurs. Collateral-free CGTMSE loans and flexible working capital to power your business growth.',
        },
        {
            id: 'auto',
            image: '/assets/slider/auto.png',
            fallback: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop',
            tag: 'Drive Your Dream',
            title: 'New & Used',
            titleColored: 'Auto or Vehicle Loans',
            desc: 'Up to 90% financing on new and pre-owned cars. Get on the road faster with minimal documentation and instant approval.',
        },
        {
            id: 'personal',
            image: '/assets/slider/personal.png',
            fallback: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2000&auto=format&fit=crop',
            tag: 'Instant Funds',
            title: 'Quick Personal',
            titleColored: 'Loans',
            desc: 'No collateral required. Access instant funds for weddings, travel, or emergencies with complete transparency and low interest rates.',
        }
    ];

    return (
        <section style={{ height: '100vh', position: 'relative', background: '#0f172a', overflow: 'hidden' }}>
            <Swiper
                modules={[Autoplay, EffectFade, Pagination, Navigation]}
                effect="fade"
                speed={1000}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                pagination={{
                    clickable: true,
                    renderBullet: function (_index, className) {
                        return `<span class="${className} custom-bullet"></span>`;
                    },
                }}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                style={{ width: '100%', height: '100%' }}
                loop={true}
            >
                {SLIDES.map((slide, index) => (
                    <SwiperSlide key={slide.id}>
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            {/* Background Image with Fallback */}
                            <img
                                src={slide.image}
                                onError={(e) => { e.currentTarget.src = slide.fallback; }}
                                alt={slide.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'transform 8s ease-out'
                                }}
                            />

                            {/* Gradient Overlays for Readability */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(90deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.6) 50%, rgba(15,23,42,0.1) 100%)',
                                zIndex: 1
                            }} />

                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(0deg, rgba(15,23,42,0.8) 0%, transparent 40%)',
                                zIndex: 1
                            }} />

                            {/* Content Container */}
                            <div className="container" style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                zIndex: 2,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <div style={{ maxWidth: '700px', marginTop: '130px', paddingLeft: 'clamp(3rem, 6vw, 5rem)' }}>
                                    <AnimatePresence mode="wait">
                                        {activeIndex === index && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                            >
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    transition={{ duration: 0.6, delay: 0.2 }}
                                                    style={{
                                                        display: 'inline-block',
                                                        background: 'rgba(46, 196, 182, 0.15)',
                                                        border: '1px solid rgba(46, 196, 182, 0.3)',
                                                        color: '#2ec4b6',
                                                        padding: '0.4rem 1.2rem',
                                                        borderRadius: '30px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 700,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1px',
                                                        marginBottom: '1.5rem',
                                                        backdropFilter: 'blur(10px)'
                                                    }}
                                                >
                                                    {slide.tag}
                                                </motion.div>

                                                <RevealText
                                                    text={slide.title}
                                                    type="words"
                                                    delay={0.3}
                                                    className="hero-title-main"
                                                    style={{
                                                        fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                                                        fontWeight: 800,
                                                        color: '#ffffff',
                                                        lineHeight: 1.1,
                                                        marginBottom: '0.5rem',
                                                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                                        fontFamily: "'Outfit', sans-serif"
                                                    }}
                                                />
                                                <RevealText
                                                    text={slide.titleColored}
                                                    type="words"
                                                    delay={0.5}
                                                    className="hero-title-colored"
                                                    style={{
                                                        fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                                                        fontWeight: 800,
                                                        color: '#2ec4b6',
                                                        lineHeight: 1.1,
                                                        marginBottom: '1.5rem',
                                                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                                        fontFamily: "'Outfit', sans-serif"
                                                    }}
                                                />

                                                <motion.p
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.8, delay: 0.7 }}
                                                    style={{
                                                        fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
                                                        color: 'rgba(255, 255, 255, 0.85)',
                                                        lineHeight: 1.6,
                                                        marginBottom: '2.5rem',
                                                        maxWidth: '600px',
                                                        fontWeight: 400
                                                    }}
                                                >
                                                    {slide.desc}
                                                </motion.p>

                                                {/* Action Buttons */}
                                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                                    <motion.button
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.5, delay: 0.9 }}
                                                        onClick={() => navigate('/contact')}
                                                        style={{
                                                            background: '#2ec4b6',
                                                            color: '#ffffff',
                                                            border: 'none',
                                                            padding: '1rem 2.5rem',
                                                            borderRadius: '50px',
                                                            fontSize: '1rem',
                                                            fontWeight: 700,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.3s',
                                                            boxShadow: '0 10px 25px rgba(46, 196, 182, 0.3)'
                                                        }}
                                                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(46, 196, 182, 0.4)'; }}
                                                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(46, 196, 182, 0.3)'; }}
                                                    >
                                                        Contact Now <ArrowRight size={18} />
                                                    </motion.button>

                                                    <motion.button
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.5, delay: 1.0 }}
                                                        onClick={() => navigate('/emi-calculator')}
                                                        style={{
                                                            background: 'transparent',
                                                            color: '#ffffff',
                                                            border: '2px solid rgba(255, 255, 255, 0.3)',
                                                            padding: '1rem 2.5rem',
                                                            borderRadius: '50px',
                                                            fontSize: '1rem',
                                                            fontWeight: 700,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.3s',
                                                            backdropFilter: 'blur(5px)'
                                                        }}
                                                        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.borderColor = '#ffffff'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                                        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                                    >
                                                        <Calculator size={18} /> EMI Calculator
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* Custom Navigation */}
                <div className="swiper-button-prev-custom" style={{
                    position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 20,
                    width: '40px', height: '40px', background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer',
                    backdropFilter: 'blur(4px)', transition: 'background 0.2s, transform 0.2s',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(46,196,182,0.9)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(15,23,42,0.4)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </div>

                <div className="swiper-button-next-custom" style={{
                    position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 20,
                    width: '40px', height: '40px', background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer',
                    backdropFilter: 'blur(4px)', transition: 'background 0.2s, transform 0.2s',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(46,196,182,0.9)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(15,23,42,0.4)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </div>
            </Swiper>

            <style>{`
                .custom-bullet {
                    width: 12px;
                    height: 12px;
                    background: rgba(255,255,255,0.3);
                    border-radius: 50%;
                    display: inline-block;
                    margin: 0 6px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .custom-bullet.swiper-pagination-bullet-active {
                    background: #2ec4b6;
                    width: 30px;
                    border-radius: 6px;
                }
                .swiper-pagination {
                    bottom: 2rem !important;
                    z-index: 10;
                }
            `}</style>
        </section>
    );
};

export default HeroSlider;
