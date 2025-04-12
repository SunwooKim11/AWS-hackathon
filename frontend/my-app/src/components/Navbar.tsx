import { useState } from 'react';

interface NavbarProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export function Navbar({ isLoggedIn, onLoginClick, onLogoutClick }: NavbarProps) {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">K-BIOX</span>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button className="text-gray-700 hover:text-blue-600">마이페이지</button>
                <button 
                  className="text-gray-700 hover:text-blue-600"
                  onClick={onLogoutClick}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button 
                  className="text-gray-700 hover:text-blue-600"
                  onClick={onLoginClick}
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
  );
} 