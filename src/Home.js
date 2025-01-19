// Home.js
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <header className="App-header">
      <h1 className="text-4xl font-bold text-white mb-6">Pose Detection App</h1>
      <div className="flex flex-row gap-4 justify-center items-center">
        <Link to="/analysis" className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg">
          Users List
        </Link>
        {/* <Link to="/analysis" className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg">
          Analysis
        </Link> */}
      </div>
    </header>
  );
}

export default Home;
