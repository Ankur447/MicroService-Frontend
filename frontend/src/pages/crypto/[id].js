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
    const [quantity, setQuantity] = useState('0.0');
    
    const handleBuyClick = async () => {
        try {
            // Get user_id and wallet_id from session storage
            const user_id = parseInt(sessionStorage.getItem('user_id') || '1');
            const wallet_id = parseInt(sessionStorage.getItem('wallet_id') || '1');
            
            const buyData = {
                user_id: user_id,
                crypto_symbol: id, // Using URL parameter directly
                amount: Math.abs(parseFloat(quantity)),
                price: cryptoData.market_data.current_price.inr,
                wallet_id: wallet_id
            };
            
            console.log('=== Buy Transaction Data ===');
            console.log(JSON.stringify(buyData, null, 2));
            console.log('==========================');
            
            const response = await fetch('http://localhost:3001/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        mutation CreatePurchase($user_id: Int!, $crypto_symbol: String!, $amount: Float!, $price: Float!, $wallet_id: Int!) {
                            createPurchase(
                                user_id: $user_id,        
                                crypto_symbol: $crypto_symbol, 
                                amount: $amount,         
                                price: $price,
                                wallet_id: $wallet_id   
                            ) {
                                purchase_id
                                crypto_symbol
                                amount
                                price
                                wallet_id
                            }
                        }
                    `,
                    variables: buyData
                })
            });

            const result = await response.json();
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }
            alert('Purchase successful!');
        } catch (error) {
            console.error('Error making purchase:', error);
            alert('Failed to make purchase: ' + error.message);
        }
    };

    const handleSellClick = async () => {
        try {
            // Get user_id and wallet_id from session storage
            const user_id = parseInt(sessionStorage.getItem('user_id') || '1');
            const wallet_id = parseInt(sessionStorage.getItem('wallet_id') || '1');
            
            const sellData = {
                user_id: user_id,
                crypto_symbol: id,
                amount: -1 * parseFloat(quantity), // Make amount negative for selling
                price: cryptoData.market_data.current_price.inr,
                wallet_id: wallet_id
            };
            
            console.log('=== Sell Transaction Data ===');
            console.log(JSON.stringify(sellData, null, 2));
            console.log('===========================');
            
            const response = await fetch('http://localhost:3001/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        mutation CreatePurchase($user_id: Int!, $crypto_symbol: String!, $amount: Float!, $price: Float!, $wallet_id: Int!) {
                            createPurchase(
                                user_id: $user_id,        
                                crypto_symbol: $crypto_symbol, 
                                amount: $amount,         
                                price: $price,
                                wallet_id: $wallet_id   
                            ) {
                                purchase_id
                                crypto_symbol
                                amount
                                price
                                wallet_id
                            }
                        }
                    `,
                    variables: sellData
                })
            });

            const result = await response.json();
            console.log('Server response:', result);
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }
            alert('Sale successful!');
        } catch (error) {
            console.error('Error making sale:', error);
            alert('Failed to make sale: ' + error.message);
        }
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        // Allow only numbers and decimals
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setQuantity(value === '' ? '0' : value);
        }
    };

    useEffect(() => {
        console.log("CryptoDetails component mounted, id:", id);
        const fetchData = async () => {
            console.log("Attempting to fetch crypto details for id:", id);
            try {
                const response = await axios.get(
                    `https://api.coingecko.com/api/v3/coins/${id}`);
                console.log("Crypto details received for:", id);
                setCryptoData(response.data);
            } catch (error) {
                console.error('Error fetching crypto details:', error);
            }
        };
        if (id) {
            fetchData();
        } else {
            console.log("No id available yet");
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
                                <button className="btn btn-success flex-grow-1" onClick={handleBuyClick}>
                                    Buy
                                </button>
                                <button className="btn btn-danger flex-grow-1" onClick={handleSellClick}>
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
