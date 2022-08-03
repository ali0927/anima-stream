import React, { useState } from "react";
import { shortAddr } from "../../lib/utils";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth: "300px"
  },
};

Modal.setAppElement('#__next');

const CallToAction = (props) => {
  return (
    <Modal
      isOpen={props.isOpen}
      contentLabel="Example Modal"
      style={customStyles}
    >
      <div className="flex justify-between">
        <h2 className="text-xl">Select Streamers</h2>
        <button onClick={props.closeModal}>X</button>
      </div>
      <div className="border rounded mt-4 overflow-auto max-h-40">
        {Streamers.map(streamer =>
          <div className="grid grid-cols-3 gap-2 p-2 cursor-pointer hover:bg-slate-200">
            <span>{streamer.name}</span>
            <span>{streamer.description}</span>
            <span>{shortAddr(streamer.wallet.address)}</span>
          </div>
        )}
      </div>

    </Modal>
  )
}

export default CallToAction;