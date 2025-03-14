'use client'
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";

interface WalletHolding {
  balance: number;
  crypto_symbol: string;
}

export default function Dashboard() {
  const [holdings, setHoldings] = useState<WalletHolding[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const user_id = parseInt(sessionStorage.getItem('user_id') || 'NULL');
        console.log('Fetching wallet data with user_id:', user_id);

        const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_MICROSERVICE_URL}/graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query GetWalletHoldings($userId: Int!) {
                getWalletHoldings(user_id: $userId) {
                  balance
                  crypto_symbol
                }
              }
            `,
            variables: {
              userId: user_id
            }
          })
        });

        const result = await response.json();
        console.log('API Response:', result);
        
        if (result.data?.getWalletHoldings) {
          console.log('Setting holdings:', result.data.getWalletHoldings);
          setHoldings(result.data.getWalletHoldings);
        } else {
          console.log('No holdings data in response');
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    const fetchBalance = async () => {
      try {
        const user_id = parseInt(sessionStorage.getItem('user_id') || 'NULL');
        const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_MICROSERVICE_URL}/graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query RootQueryType($userId: Int) {
                getBalance(user_id: $userId)
              }
            `,
            variables: {
              userId: user_id
            }
          })
        });

        const result = await response.json();
        console.log('Balance API Response:', result);
        
        if (result.data?.getBalance) {
          console.log('Setting balance:', result.data.getBalance);
          setBalance(result.data.getBalance);
        } else {
          console.log('No balance data in response');
        }
      } catch (error) {
        console.error('Error fetching balance data:', error);
      }
    };

    fetchWalletData();
    fetchBalance();
  }, []);

  // Calculate total balance
  const totalBalance = holdings.reduce((sum, holding) => sum + holding.balance, 0);
  // const balanceINR = totalBalance * 80;

  return (
    <div className="min-h-screen bg-gray-100">
      
      
      <div className="container py-5">
        <h1>Dashboard</h1>
      <p style={{color: 'blue'}}>Dashboard feature is handled by wallet microservice</p>
      <p style={{color: 'blue'}}>User data is fetched from user microservice </p>
      <p style={{color: 'blue'}}>Both microservices are connected to the same mysql database</p>
        <div className="row">
          {/* Wallet Summary Card */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary rounded-circle p-3 me-3">
                    <i className="fas fa-wallet text-white"></i>
                  </div>
                  <div>
                    <h5 className="card-title mb-0">My Wallet</h5>
                    <small className="text-muted">Crypto Holdings</small>
                  </div>
                </div>
                <div className="border-top pt-3">
                  <h6 className="text-muted mb-2">Total Holdings</h6>
                  <h3 className="fw-bold">{totalBalance.toFixed(5)} Coins</h3>
                  <h3 className="fw-bold">₹{balance.toFixed(2)}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Holdings Summary */}
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">Your Crypto Holdings</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Crypto Symbol</th>
                        <th>Balance</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdings
                        .filter(holding => holding.balance !== 0) // Only show non-zero balances
                        .map((holding, index) => (
                          <tr key={index}>
                            <td>
                              <span className="fw-bold">{holding.crypto_symbol}</span>
                            </td>
                            <td>{holding.balance.toFixed(3)}</td>
                            <td>
                              <Link 
                                href={`/crypto/${holding.crypto_symbol.toLowerCase()}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                Trade
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
