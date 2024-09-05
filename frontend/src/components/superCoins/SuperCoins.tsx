import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

export default () => {
    const user = useSelector((state: any) => state.user.user);

    const [supercoin, setSupercoin] = useState(user?.supercoin);
    console.log(supercoin);
    
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <img
        src="images/supercoin.gif" 
        alt="Supercoin"
        onClick={openModal}
        className="border border-blue-950 w-16 h-16 rounded-full cursor-pointer fixed bottom-32 right-5 z-50"
      />
      <Modal isOpen={isModalOpen} onClose={closeModal} supercoin={supercoin} />
    </div>
  );
}

function Modal({ isOpen, onClose,supercoin }:any) {




  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-end justify-end p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm h-auto flex flex-col">
        <div className="bg-blue-600 text-white p-4 flex items-center rounded-t-lg">
          <img
            src="images/images.jpg"
            alt="Hasth"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h1 className="text-xl font-bold">Hasth</h1>
            <p className="text-sm">Supercoin Wallet</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto p-2 text-white rounded-full hover:bg-red-600"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">Supercoin Balance</h2>
          <p className="text-4xl text-blue-600 font-bold mb-4">{supercoin.balance} SC</p>
          <div className="space-y-2">
            <p className="text-sm">Earn more coins by participating in offers and promotions.</p>
            <p className="text-sm">Redeem Supercoins for exclusive deals and discounts.</p>
            <p className="text-sm">Last updated: {new Date(supercoin.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
