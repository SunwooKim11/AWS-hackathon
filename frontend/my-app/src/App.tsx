import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Networking from './pages/Networking';
import MyPage from './pages/MyPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated, logout } = useAuthStore();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);

  // isAuthenticated 상태가 변경될 때 isLoggedIn 상태도 업데이트
  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

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
                    onClick={() => {
                      logout();
                      setIsLoggedIn(false);
                    }}
                  >
                    로그아웃
                  </button>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="text-gray-700 hover:text-blue-600"
                    >
                      로그인
                    </Link>
                    <Link 
                      to="/signup" 
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      회원가입
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/networking" element={
            <ProtectedRoute>
              <Networking />
            </ProtectedRoute>
          } />
          <Route path="/mypage" element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<div>Home - Coming Soon</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;