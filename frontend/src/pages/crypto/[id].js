import React, {
    useState,
    useEffect
} from 'react';
import axios from 'axios';
import {
    useRouter
} from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '@/Components/Navbar';

const CryptoDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [cryptoData, setCryptoData] = useState(null);
    const [quantity, setQuantity] = useState('1.0');
    

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        // Allow only numbers and decimals
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setQuantity(value === '' ? '0' : value);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://api.coingecko.com/api/v3/coins/${id}`);
                setCryptoData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (id) {
            fetchData();
        }
    }, [id]);

    if (!cryptoData) {
        return <div className="container">Loading...</div>;
    }

    // Extract description up to the first period (.)
    const description = cryptoData.description.en.split('.')[0];

    return (
        <>
            <Navbar />
            <div className="container mt-5 d-flex justify-content-center">
                <div className="card">
                    <img src={cryptoData.image.small}
                        className="card-img-top img-fluid" alt=""
                        style={{ maxWidth: '200px' }} />
                    <div className="card-body">
                        <h1 className="card-title">{cryptoData.name}</h1>
                        <h5 className="card-text">{description}</h5>
                        <p className="card-text">
                            <b>Symbol:</b>
                            {cryptoData.symbol.toUpperCase()}
                        </p>
                        <p className="card-text">
                            <b>Rank:</b>
                            {cryptoData.market_cap_rank}
                        </p>
                        <p className="card-text">
                            <b>Market Cap:</b>
                            {cryptoData.market_data.market_cap.inr}
                        </p>
                        <p className="card-text">
                            <b>Current Price:</b>
                            {cryptoData.market_data.current_price.inr}
                        </p>
                        <p className="card-text">
                            <b>Total Supply:</b>
                            {cryptoData.market_data.total_supply}
                        </p>
                        <p className="card-text">
                            <b>Market Cap Change (24h):</b>
                            {cryptoData.market_data.market_cap_change_percentage_24h}%
                        </p>
                        <p className="card-text">
                            <b>High (24h):</b>
                            {cryptoData.market_data.high_24h.inr}
                        </p>
                        <p className="card-text">
                            <b>Low (24h):</b>
                            {cryptoData.market_data.low_24h.inr}
                        </p>
                        <p className="card-text">
                            <b>Total Volume (24h):</b>
                            {cryptoData.market_data.total_volume.inr}
                        </p>
                        <p className="card-text">
                            <b>Circulating Supply:</b>
                            {cryptoData.market_data.circulating_supply}
                        </p>

                        {/* Trading Section */}
                        <div className="mt-4 p-3 border rounded">
                            <h4>Trade {cryptoData.symbol.toUpperCase()}</h4>
                            <div className="form-group mb-3">
                                <label htmlFor="quantity">Quantity:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="quantity"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    placeholder="0.0"
                                    step="any"
                                />
                            </div>
                            <div className="d-flex gap-2 mb-3">
                                <button className="btn btn-success flex-grow-1" onClick={() => alert('Buy order placed!')}>
                                    Buy
                                </button>
                                <button className="btn btn-danger flex-grow-1" onClick={() => alert('Sell order placed!')}>
                                    Sell
                                </button>
                            </div>
                            <p className="text-muted">
                                Total Cost: ₹{(cryptoData.market_data.current_price.inr * parseFloat(quantity || 0)).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

};

export default CryptoDetails;
