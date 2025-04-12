import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Networking from './pages/Networking';
import MyPage from './pages/MyPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-2xl font-bold text-blue-600">K-BIOX</Link>
                <div className="flex items-center space-x-6">
                  <Link to="/networking" className="text-gray-700 hover:text-blue-600 font-medium">
                    Networking
                  </Link>
                  <Link to="/mypage" className="text-gray-700 hover:text-blue-600 font-medium">
                    MyPage
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                  <button 
                    className="text-gray-700 hover:text-blue-600"
                    onClick={() => setIsLoggedIn(false)}
                  >
                    로그아웃
                  </button>
                ) : (
                  <>
                    <button 
                      className="text-gray-700 hover:text-blue-600"
                      onClick={() => setIsLoggedIn(true)}
                    >
                      로그인
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      회원가입
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/networking" element={<Networking />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/" element={<div>Home - Coming Soon</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;