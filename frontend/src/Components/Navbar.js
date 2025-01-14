'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const userId = sessionStorage.getItem('user_id');
        setIsLoggedIn(!!userId);
    }, []);

    const handleLogout = () => {
        // Clear all storage
        sessionStorage.removeItem('user_id');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        router.push('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" href="/">
                    Buy/Sell 
                </Link>
                
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                         (
                            <li className="nav-item mx-2">
                                <Link className="btn btn-primary" href="/dashboard">
                                    Dashboard
                                </Link>
                            </li>
                        )
                        <li className="nav-item mx-2">
                            {isLoggedIn ? (
                                <button 
                                    onClick={handleLogout}
                                    className="btn btn-outline-light"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link className="btn btn-outline-light" href="/login">
                                    Login / Register
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
