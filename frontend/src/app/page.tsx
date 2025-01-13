'use client';

import React from 'react'
import CryptoList from '../Components/CryptoList.js';

const Page = () => {
    console.log("Main page component mounted");
    return (
        <div>
            <CryptoList />
        </div>
    )
}

export default Page