import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [userId] = useState("c61a93d1-9281-4875-82e5-e3b0675cfe9e"); // Change this UUID as needed
  const [symbol, setSymbol] = useState("SBIN-EQ");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [type, setType] = useState("BUY");
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(null);

  const loadBalance = async () => {
    const res = await axios.get("http://localhost:8080/api/wallet/balance", {
      params: { userId },
    });
    setBalance(res.data.balance);
  };

  const placeTrade = async () => {
    const res = await axios.post("http://localhost:8080/api/trade/place", null, {
      params: { userId, symbol, price, quantity, type },
    });
    setMessage(res.data);
    loadBalance();
  };

  useEffect(() => {
    loadBalance();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-4">Virtual Trading Simulator</h1>

      <div className="bg-white p-4 rounded-xl shadow w-full md:w-2/3">
        <p className="text-lg mb-2">Balance: ₹{balance}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Symbol (e.g., SBIN-EQ)"
            className="border p-2 rounded"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            placeholder="Price"
            className="border p-2 rounded"
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            placeholder="Quantity"
            className="border p-2 rounded"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>

        <button
          onClick={placeTrade}
          className="bg-blue-600 text-white mt-4 px-4 py-2 rounded hover:bg-blue-700"
        >
          Place Trade
        </button>

        {message && <p className="mt-3 text-green-700">{message}</p>}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold">Chart</h2>
        <iframe
          src={`https://charts.fyers.in/chart?symbol=${symbol}&theme=light`}
          width="100%"
          height="500"
          className="rounded-xl border"
        ></iframe>
      </div>
    </div>
  );
}
