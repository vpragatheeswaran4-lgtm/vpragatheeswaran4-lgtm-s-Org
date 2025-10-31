import React, { useState } from 'react';
import { UserRole } from '../types';
import Modal from './Modal';

interface HeaderProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const AdminLoginModal: React.FC<{ onLogin: (password: string) => void; onCancel: () => void; }> = ({ onLogin, onCancel }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(password);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="admin-password"
                       className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input
                    type="password"
                    id="admin-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoFocus
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                >
                    Enter
                </button>
            </div>
        </form>
    );
};


const Header: React.FC<HeaderProps> = ({ userRole, onRoleChange }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const handleAdminClick = () => {
    if (userRole !== UserRole.Admin) {
      setShowLoginModal(true);
    }
  };

  const handleLogin = (password: string) => {
    if (password === 'STUDENT HUB') {
      onRoleChange(UserRole.Admin);
      setShowLoginModal(false);
    } else {
      alert("Incorrect password.");
    }
  };
  
  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              EEE'24 VEC Hub
            </h1>
            <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => onRoleChange(UserRole.Student)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  userRole === UserRole.Student
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Student
              </button>
              <button
                onClick={handleAdminClick}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  userRole === UserRole.Admin
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </header>
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} title="Admin Access">
          <AdminLoginModal onLogin={handleLogin} onCancel={() => setShowLoginModal(false)} />
      </Modal>
    </>
  );
};

export default Header;