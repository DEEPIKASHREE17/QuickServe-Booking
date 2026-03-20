import api from '../services/api';

function ServiceItems() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const search = useLocation().search;
    const categoryId = new URLSearchParams(search).get('category');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get(`/services/byCategory/${categoryId}`);
                setServices(response.data);
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };
        if (categoryId) fetchServices();
    }, [categoryId]);

    if (loading) return <div className="loading-container"><div className="loader"></div></div>;

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '15px', color: 'var(--text-primary)' }}>Select Specific Service</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Tell us exactly what you need.</p>
            </div>

            <div className="categories-grid">
                {services.map(service => (
                    <div
                        key={service.id}
                        className="category-card"
                        onClick={() => navigate(`/providers?category=${categoryId}&service=${service.id}`)}
                    >
                        <div className="category-icon">🛠️</div>
                        <h3>{service.name}</h3>
                        <p>{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ServiceItems;
