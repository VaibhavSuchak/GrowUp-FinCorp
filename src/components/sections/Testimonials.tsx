import { useState, useEffect } from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { supabase } from '../../supabaseClient';
import { useSupabaseQuery, invalidateSupabaseCache } from '../../hooks/useSupabaseQuery';
import { SERVICES_DATA } from '../../data/servicesData';
import 'swiper/css';
import 'swiper/css/navigation';

const Testimonials = () => {
    const [swiperInstance, setSwiperInstance] = useState<any>(null);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);
    const [formData, setFormData] = useState({ name: '', rating: 5, content: '', loanType: '' });

    const { data: reviewsData } = useSupabaseQuery('reviews', async () =>
        await supabase
            .from('reviews')
            .select('*')
            .eq('approved', true)
            .order('created_at', { ascending: false })
    );

    useEffect(() => {
        if (reviewsData && (reviewsData as any[]).length > 0) {
            setTestimonials((reviewsData as any[]).map(r => ({
                name: r.customer_name,
                loanType: r.loan_type || 'Loan Service',
                content: r.review_text,
                rating: r.rating
            })));
        } else {
            setTestimonials([]);
        }
    }, [reviewsData]);

    return (
        <>
            <section className="testimonials" style={{ padding: '8rem 0', background: 'var(--bg-secondary)', overflow: 'hidden', borderTop: '1px solid var(--glass-border)' }}>
                <style>
                    {`
                .testimonials-grid-layout {
                    display: grid;
                    grid-template-columns: 450px 1fr;
                    gap: 4rem;
                    align-items: center;
                }
                @media (max-width: 1200px) {
                    .testimonials-grid-layout {
                        grid-template-columns: 350px 1fr;
                        gap: 3rem;
                    }
                }
                @media (max-width: 1023px) {
                    .testimonials-grid-layout {
                        display: flex;
                        flex-direction: column;
                        gap: 3rem;
                        text-align: center;
                    }
                    .testimonials-header {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .testi-heading {
                        margin-bottom: 1rem;
                    }
                }
                 .testi-heading {
                    font-size: clamp(2.5rem, 8vw, 4rem);
                    font-weight: 800;
                    line-height: 1.1;
                    color: var(--text-primary);
                    margin-bottom: 1.5rem;
                    letter-spacing: -1px;
                }
                .testi-heading span {
                    color: var(--primary-color);
                }
                .testimonial-swiper {
                    overflow: visible !important;
                }
                .testimonial-swiper .swiper-slide {
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 0.4;
                    filter: blur(2px);
                    transform: scale(0.9);
                }
                .testimonial-swiper .swiper-slide-active {
                    opacity: 1;
                    filter: blur(0px);
                    transform: scale(1);
                    z-index: 2;
                }
                .testi-nav-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 1px solid var(--glass-border);
                    background: var(--bg-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: var(--text-primary);
                    box-shadow: var(--shadow-soft);
                }
                .testi-nav-btn:hover {
                    background: var(--primary-color);
                    color: #ffffff;
                    border-color: var(--primary-color);
                    transform: translateY(-2px);
                }
                 .left-content-mask {
                    position: absolute;
                    top: -50vh; bottom: -50vh; left: -50vw; right: -2rem;
                    background: linear-gradient(to right, var(--bg-secondary) 85%, transparent 100%);
                    z-index: -1;
                    pointer-events: none;
                }
                .nav-buttons-desktop {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2rem;
                }
                .nav-buttons-mobile {
                    display: none;
                }
                @media (max-width: 1023px) {
                    .left-content-mask {
                        display: none;
                    }
                    .nav-buttons-desktop {
                        display: none;
                    }
                    .nav-buttons-mobile {
                        display: flex;
                        gap: 1rem;
                        justify-content: center;
                        margin-top: 2rem;
                    }
                }
                `}
                </style>

                <div className="container testimonials-grid-layout">
                    {/* Left Side Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="testimonials-header"
                        style={{ position: 'relative', zIndex: 10 }}
                    >
                        <div className="left-content-mask" />
                        <h2 className="testi-heading">
                            What our<br /><span>clients</span> say
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.15rem)', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '400px', position: 'relative' }}>
                            We're more than just financial consultants - we're your growth partners. Don't just take our word for it, see what clients have to say about working with us.
                        </p>

                        <button
                            onClick={() => setShowForm(true)}
                            style={{
                                padding: '1rem 2rem',
                                borderRadius: '12px',
                                background: 'var(--primary-color)',
                                color: '#fff',
                                border: 'none',
                                fontWeight: 700,
                                letterSpacing: '0.5px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                boxShadow: '0 8px 25px rgba(46,196,182,0.3)',
                                marginBottom: '1rem'
                            }}
                        >
                            <Star size={18} fill="#fff" /> Write a Review
                        </button>

                        <div className="nav-buttons-desktop">
                            <button
                                className="testi-nav-btn"
                                onClick={() => swiperInstance?.slidePrev()}
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <button
                                className="testi-nav-btn"
                                onClick={() => swiperInstance?.slideNext()}
                            >
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Side Swiper */}
                    <div style={{ width: '100%', minWidth: 0, overflow: 'visible' }}>
                        {testimonials.length === 0 ? (
                            <div style={{
                                background: 'var(--bg-primary)',
                                padding: '3rem',
                                borderRadius: '24px',
                                border: '1px solid var(--glass-border)',
                                textAlign: 'center',
                                color: 'var(--text-secondary)'
                            }}>
                                <Star size={48} color="var(--glass-border)" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No reviews yet</h3>
                                <p>Be the first to share your experience with GrowUp FinCorp!</p>
                            </div>
                        ) : (
                            <Swiper
                                modules={[Autoplay, Navigation]}
                                onSwiper={setSwiperInstance}
                                spaceBetween={20}
                                slidesPerView={1.1}
                                centeredSlides={true}
                                loop={true}
                                autoplay={{ delay: 5000, disableOnInteraction: false }}
                                className="testimonial-swiper"
                                breakpoints={{
                                    640: { slidesPerView: 1.2, spaceBetween: 30, centeredSlides: true },
                                    1024: { slidesPerView: 1.5, spaceBetween: 40, centeredSlides: true },
                                    1400: { slidesPerView: 1.8, spaceBetween: 50, centeredSlides: true }
                                }}
                            >
                                {testimonials.map((t, idx) => (
                                    <SwiperSlide key={idx} style={{ padding: '2rem 0' }}>
                                        <div style={{
                                            background: 'var(--bg-primary)',
                                            padding: 'clamp(2rem, 5vw, 3rem)',
                                            borderRadius: '32px',
                                            boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
                                            border: '1px solid var(--glass-border)',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '1.5rem',
                                            minHeight: '340px'
                                        }}>
                                            <div style={{ display: 'flex', gap: '0.2rem' }}>
                                                {[...Array(t.rating)].map((_, i) => (
                                                    <Star key={`filled-${i}`} size={18} fill="var(--primary-color)" color="var(--primary-color)" />
                                                ))}
                                                {[...Array(5 - t.rating)].map((_, i) => (
                                                    <Star key={`empty-${i}`} size={18} color="var(--glass-border)" />
                                                ))}
                                            </div>

                                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.7', flexGrow: 1, fontStyle: 'italic' }}>
                                                "{t.content}"
                                            </p>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                                                <div style={{
                                                    width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(46,196,182,0.1)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'var(--primary-color)', fontWeight: 800, fontSize: '1.2rem',
                                                    border: '1px solid rgba(46,196,182,0.2)'
                                                }}>
                                                    {t.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.2px' }}>{t.name}</h4>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)' }}>{t.loanType}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}

                        <div className="nav-buttons-mobile">
                            <button
                                className="testi-nav-btn"
                                onClick={() => swiperInstance?.slidePrev()}
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <button
                                className="testi-nav-btn"
                                onClick={() => swiperInstance?.slideNext()}
                            >
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Review Submission Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(15,32,80,0.6)',
                            backdropFilter: 'blur(8px)', zIndex: 9999,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                        }}
                        onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            style={{
                                background: 'var(--bg-primary)', padding: '2.5rem', borderRadius: '32px',
                                width: '100%', maxWidth: '500px', boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
                                border: '1px solid var(--glass-border)', position: 'relative'
                            }}
                        >
                            {formSuccess ? (
                                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                    <div style={{ width: 80, height: 80, background: 'rgba(46,196,182,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary-color)' }}>
                                        <Star size={40} fill="var(--primary-color)" />
                                    </div>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>Thank You!</h3>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                                        Your review has been successfully submitted and is now pending moderation. It will be live on our website shortly!
                                    </p>
                                    <button
                                        onClick={() => { setShowForm(false); setFormSuccess(false); }}
                                        style={{ padding: '1rem 2.5rem', borderRadius: '12px', background: 'var(--primary-color)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    setSubmitting(true);
                                    try {
                                        const { error } = await supabase.from('reviews').insert([{
                                            customer_name: formData.name,
                                            rating: formData.rating,
                                            review_text: formData.content,
                                            loan_type: formData.loanType,
                                            approved: false
                                        }]);
                                        if (!error) {
                                            setFormSuccess(true);
                                            setFormData({ name: '', rating: 5, content: '', loanType: '' });
                                            invalidateSupabaseCache('reviews');
                                        }
                                    } catch (err) { console.error(err); }
                                    setSubmitting(false);
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Write a Review</h3>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.3rem 0 0' }}>Share your experience with us</p>
                                        </div>
                                        <button
                                            type="button" onClick={() => setShowForm(false)}
                                            style={{ background: 'var(--bg-secondary)', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}
                                        >
                                            <ArrowLeft size={18} />
                                        </button>
                                    </div>

                                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
                                            <input
                                                required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Enter your name"
                                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', outline: 'none' }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Loan Service</label>
                                            <select
                                                value={formData.loanType} onChange={e => setFormData({ ...formData, loanType: e.target.value })}
                                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', outline: 'none', appearance: 'none' }}
                                            >
                                                <option value="">Select Service (Optional)</option>
                                                {SERVICES_DATA.map(s => (
                                                    <option key={s.id} value={s.title}>{s.title}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Rating</label>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star
                                                        key={s} size={24}
                                                        fill={s <= formData.rating ? 'var(--primary-color)' : 'none'}
                                                        color={s <= formData.rating ? 'var(--primary-color)' : 'var(--glass-border)'}
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => setFormData({ ...formData, rating: s })}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Your Experience</label>
                                            <textarea
                                                required rows={4} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}
                                                placeholder="Tell us what you liked..."
                                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', outline: 'none', resize: 'none' }}
                                            />
                                        </div>

                                        <button
                                            type="submit" disabled={submitting}
                                            style={{ padding: '1.2rem', borderRadius: '12px', background: 'var(--primary-color)', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s', opacity: submitting ? 0.7 : 1 }}
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Testimonials;
