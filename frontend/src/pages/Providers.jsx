import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { providerService, bookingService } from '../services/api';

function Providers() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingProvider, setBookingProvider] = useState(null);
    const [bookingData, setBookingData] = useState({ date: '', duration: 1 });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const search = useLocation().search;
    const categoryId = new URLSearchParams(search).get('category');
    const serviceId = new URLSearchParams(search).get('service');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true);
            try {
                let response;
                // Since providers are currently associated with Category, 
                // we still fetch by category, but the booking will record the service.
                if (categoryId) {
                    response = await providerService.getByCategory(categoryId);
                } else {
                    response = await providerService.getByLocation('Anywhere');
                }
                setProviders(response.data);
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProviders();
    }, [categoryId]);

    const handleBooking = async (provider) => {
        if (!user.id) {
            alert("Please login to book a service");
            navigate("/");
            return;
        }

        setIsSubmitting(true);
        try {
            const bookingRequest = {
                customer: { id: user.id },
                provider: { providerId: provider.providerId },
                category: { categoryId: categoryId },
                serviceItem: serviceId ? { id: serviceId } : null,
                bookingDateTime: `${bookingData.date}T10:00:00`,
                durationHours: parseInt(bookingData.duration),
                hourlyRate: provider.serviceCharge || 499,
                totalAmount: (provider.serviceCharge || 499) * bookingData.duration,
                status: 'PENDING'
            };

            await bookingService.create(bookingRequest);
            alert("Booking submitted! Waiting for provider to accept.");
            setBookingProvider(null);
            navigate("/bookings"); // We will create this page next
        } catch (err) {
            alert("Failed to create booking: " + (err.response?.data || "Server error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="loading-container"><div className="loader"></div></div>;

    return (
        <div className="container" style={{ padding: '30px 20px' }}>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem' }}>Available Professionals</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Quality services guaranteed with our verified partners.</p>
            </div>

            <div className="grid">
                {providers.map((p) => (
                    <div className="card" key={p.providerId} style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>{p.user?.name || "Professional"}</h3>
                            <span className="status-badge status-booked" style={{ fontSize: '0.7rem' }}>
                                ★ {p.rating || '4.8'}
                            </span>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
                            <strong>Experience:</strong> {p.experience || 3} Years
                        </p>
                        <p style={{ fontSize: '1.2rem', color: 'var(--accent-color)', fontWeight: '700', marginBottom: '20px' }}>
                            ₹{p.serviceCharge || 499} <span style={{ fontSize: '0.8rem', fontWeight: '400', color: 'var(--text-secondary)' }}>/ hr</span>
                        </p>

                        {bookingProvider === p.providerId ? (
                            <div className="booking-section">
                                <div className="form-group">
                                    <label style={{ fontSize: '0.8rem' }}>Select Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.8rem' }}>Duration (Hours)</label>
                                    <select
                                        className="form-control"
                                        onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
                                    >
                                        {[1, 2, 3, 4, 5].map(h => <option key={h} value={h}>{h} hr{h > 1 ? 's' : ''}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ flex: 1 }}
                                        onClick={() => handleBooking(p)}
                                        disabled={isSubmitting || !bookingData.date}
                                    >
                                        {isSubmitting ? '...' : 'Confirm'}
                                    </button>
                                    <button
                                        className="btn"
                                        style={{ background: '#eee' }}
                                        onClick={() => setBookingProvider(null)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                onClick={() => setBookingProvider(p.providerId)}
                            >
                                Book Now
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {providers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>No providers found in this category yet.</p>
                </div>
            )}
        </div>
    );
}

export default Providers;