import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 
            flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg 
                shadow-md w-full max-w-md">
                
                <h2 className="text-2xl font-bold 
                    text-center mb-6 text-gray-800">
                    Login
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-600 
                        p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 
                            text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border 
                                rounded-lg focus:outline-none 
                                focus:border-blue-500"
                            placeholder="Enter email"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 
                            text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border 
                                rounded-lg focus:outline-none 
                                focus:border-blue-500"
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white 
                            py-2 rounded-lg hover:bg-blue-600 
                            transition duration-200 font-bold"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" 
                        className="text-blue-500 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;