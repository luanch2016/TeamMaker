'use client';

import { useState } from 'react';

interface RemoveMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    memberEmail: string;
    leaderEmail: string;
}

export default function RemoveMemberModal({
    isOpen,
    onClose,
    onConfirm,
    memberEmail,
    leaderEmail,
}: RemoveMemberModalProps) {
    const [emailInput, setEmailInput] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (emailInput === memberEmail || emailInput === leaderEmail) {
            onConfirm();
            onClose();
            setEmailInput('');
            setError('');
        } else {
            setError('Email does not match member or leader email.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Confirm Member Removal
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    To confirm the removal of this member, please enter their email address or the team leader's email address below:
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => {
                            setEmailInput(e.target.value);
                            setError('');
                        }}
                        placeholder="Enter email address"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                        >
                            Remove Member
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
