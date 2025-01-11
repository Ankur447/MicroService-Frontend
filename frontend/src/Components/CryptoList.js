"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Link from "next/link";
import Navbar from "./Navbar";
import { useRouter } from 'next/navigation';

const CryptoList = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter((crypto) => {
    return crypto.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleRedirect = (cryptoId) => {
    router.push(`/crypto/${cryptoId}`);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent p-4 my-6 tracking-tight">
          Crypto Paper Trader
        </h1>
        <input
          type="text"
          placeholder="Search crypto name"
          className="form-control mb-4"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <table className="table">
          <thead className="bg-dark">
            <tr>
              <th className="bg-info">Name</th>
              <th className="bg-info">Symbol</th>
              <th className="bg-info">Price</th>
              <th className="bg-info">Market Cap</th>
              <th className="bg-info">1h change</th>
              <th className="bg-info">24h change</th>
              <th className="bg-info">7D Change</th>
              <th className="bg-info">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((crypto) => (
              <tr key={crypto.id}>
                <td>
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="rounded-circle mr-2"
                    style={{ width: "30px", height: "30px" }}
                  />
                  <Link
                    href={`/crypto/${crypto.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    {crypto.name}
                  </Link>
                </td>
                <td>{crypto.symbol.toUpperCase()}</td>
                <td>₹{crypto.current_price.toFixed(2)}</td>
                <td>₹{crypto.market_cap.toLocaleString("en-US")}</td>
                <td
                  style={{
                    color:
                      crypto.price_change_percentage_1h_in_currency < 0
                        ? "red"
                        : "green",
                  }}
                >
                  {Number(
                    crypto.price_change_percentage_1h_in_currency
                  ).toFixed(2)}
                  %
                </td>
                <td
                  style={{
                    color:
                      crypto.price_change_percentage_24h_in_currency < 0
                        ? "red"
                        : "green",
                  }}
                >
                  {Number(
                    crypto.price_change_percentage_24h_in_currency
                  ).toFixed(2)}
                  %
                </td>
                <td
                  style={{
                    color:
                      crypto.price_change_percentage_7d_in_currency < 0
                        ? "red"
                        : "green",
                  }}
                >
                  {Number(
                    crypto.price_change_percentage_7d_in_currency
                  ).toFixed(2)}
                  %
                </td>
                <td>
                  <button
                    className="btn btn-success mr-2"
                    onClick={() => handleRedirect(crypto.id)}
                  >
                    Buy
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRedirect(crypto.id)}
                  >
                    Sell
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CryptoList;
