/* eslint-disable */

import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";

import { CometChatMessages } from "../../cometchat-pro-react-ui-kit/CometChatWorkspace/src";
import LiveStreamHeader from "../livestream-header/LiveStreamHeader";
import ToolBarMenu from "./ToolBarMenu";
import { AuthContext } from "../../contexts";
import { CometChat } from "@cometchat-pro/chat";
import "./LiveStreamDetail.scss";

const PurchasingMenu = [
  {
    title: "Remove clothes",
    options: [
      {
        text: "10 seconds"
      },
      {
        text: "30 seconds"
      },
      {
        text: "60 seconds"
      }
    ]
  },
  {
    title: "Private show",
    options: [
      {
        text: "1 minute"
      },
    ]
  },
  {
    title: "Spy on private show",
    options: [
      {
        text: "1 minute"
      },
    ]
  }
];

const LovenceMenu = [
  {
    title: "Lovence",
    options: [
      {
        text: "1 second"
      },
      {
        text: "3 seconds"
      },
      {
        text: "5 seconds"
      },
      {
        text: "15 seconds"
      },
      {
        text: "30 seconds"
      }
    ]
  },
  {
    title: "Lovence death from orgasm",
    options: [
      {
        text: "3 minutes"
      }
    ]
  }
];

const LiveStreamDetail = () => {
  const [livestream, setLivestream] = useState(null);
  const [activePublic, setAcivePublic] = useState(true);
  const [showPurchasing, setShowPurchasing] = useState(false);
  const [showLovence, setShowLovence] = useState(false);
  const { cometChat, user } = useContext(AuthContext);

  const history = useHistory();

  useEffect(() => {
    const livestream = JSON.parse(localStorage.getItem("livestream"));
    if (livestream) {
      setLivestream(livestream);
    }
  }, []);

  useEffect(() => {
    if (livestream && cometChat) {
      startDirectCall();
    }
  }, [livestream, cometChat]);

  const startDirectCall = () => {
    if (cometChat && livestream) {
      const streamerId = livestream.createdBy.id;
      const sessionID = livestream.id;
      const defaultLayout = true;
      const audioOnly = false;
      const screenShare = streamerId === user.id ? true : false;
      const muteAudio = streamerId === user.id ? true : false;
      const pauseVideo = streamerId === user.id ? true : false;
      const endCall = streamerId === user.id ? true : false;
      const startAudioMuted = true;
      const startVideoMuted = true;
      const mode = CometChat.CALL_MODE.SPOTLIGHT;

      let CSS = `
        .local-video-container { 
          display: none;
        }
        #menu-list-grow li:first-child {
          display: none;
        }
        .spotlight-main-container div:nth-child(2) {
          display: none !important;
        }
        .main-container {
          background-color: transparent;
        }
        .main-container .bottom-buttons {
          background-image: none;
        }
        .main-container .spotlight-main-container .video-container {
          border-radius: 20px;
        }
      `
      if (streamerId === user.id) {
      } else {
        CSS += `
          .bottom-buttons-other-options { 
            display: none;
          }
        `;
      }

      const callSettings = new cometChat.CallSettingsBuilder()
        .setSessionID(sessionID)
        .enableDefaultLayout(defaultLayout)
        .showEndCallButton(endCall)
        .setIsAudioOnlyCall(audioOnly)
        .showMuteAudioButton(muteAudio)
        .showPauseVideoButton(pauseVideo)
        .showScreenShareButton(screenShare)
        .startWithAudioMuted(startAudioMuted)
        .startWithVideoMuted(startVideoMuted)
        .setMode(mode)
        .setCustomCSS(CSS)
        .build();

      cometChat.startCall(
        callSettings,
        document.getElementById("call__screen"),
        new cometChat.OngoingCallListener({
          onUserListUpdated: (userList) => {
            const idx = userList.findIndex(member => member.uid === streamerId.toLowerCase());
            if (idx === -1 && streamerId !== user.id) {
              alert('LiveStream is not started yet!');
              history.push("/home");
            }
          },
          onCallEnded: (call) => {
            history.push("/home");
          },
          onError: (error) => {
            history.push("/home");
          },
          onMediaDeviceListUpdated: (deviceList) => {},
          onUserMuted: (userMuted, userMutedBy) => {},
          onScreenShareStarted: () => {},
          onScreenShareStopped: () => {},
        })
      );
    }
  };

  if (!livestream || !cometChat) return <React.Fragment></React.Fragment>;

  return (
    <div className="livestream">
      <LiveStreamHeader livestream={livestream} />
      <div className="livestream__container">
        <div className="livestream__left">
          <div className="livestream__control">
            <div style={{position: "relative"}}>
              <button
                className="livestream__btn__purchasing"
                onClick={() => {
                  setShowPurchasing(!showPurchasing)
                  setShowLovence(false)
                }}
              />
              <ToolBarMenu
                items={PurchasingMenu}
                show={showPurchasing}
                onClose={() => setShowPurchasing(false)}
                />
            </div>
            <div style={{position: "relative"}}>
              <button
                className="livestream__btn__lovence"
                onClick={() => {
                  setShowLovence(!showLovence)
                  setShowPurchasing(false)
                }}
              />
              <ToolBarMenu
                items={LovenceMenu}
                show={showLovence}
                onClose={() => setShowLovence(false)}
                />
            </div>
            <button className="livestream__btn__emotic"></button>
          </div>
          <button
            className="livestream__backBtn"
            onClick={() => history.push("/home")}
          />
          {livestream.createdBy.id !== user.id &&
            <div className="livestream__metaverse">
              <button>
                JOIN METAVERSE
              </button>
            </div>
          }
          <div id="call__screen"></div>
        </div>
        <div style={{padding: "5px 0 0 15px"}}>
          <div className="livestrem__right">
            <div className="livestream__tabs">
              <button
                className={activePublic ? 'active': ''}
              >
                GENERAL CHAT
              </button>
              <button
                className={activePublic ? '': 'active'}
              >
                CHAT WITH
              </button>

            </div>
            <div className="livestream__chat">
              <CometChatMessages chatWithGroup={livestream.id} />
            </div>
            {/* <div className="livestream__right">
              <CometChatMessages chatWithGroup={livestream.id} />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamDetail;
