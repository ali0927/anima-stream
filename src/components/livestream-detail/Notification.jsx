/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import { useEffect } from "react";
import "./LiveStreamDetail.css";

const Notification = ({ isOpen, onClose, notification }) => {
  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, 2000);
  }, [isOpen]);

  return (
    <>
      {isOpen && 
        <div className="livestream__notification"> 
          {notification}
        </div>
      }
    </>
  );
}

export default Notification;