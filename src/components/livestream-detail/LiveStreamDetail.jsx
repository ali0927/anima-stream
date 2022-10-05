/* eslint-disable */

import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { CometChatMessages } from "../../cometchat-pro-react-ui-kit/CometChatWorkspace/src";
import LiveStreamHeader from "../livestream-header/LiveStreamHeader";
import ToolBarMenu from "./ToolBarMenu";
import Notification from "./Notification";
import { AuthContext } from "../../contexts";
import { CometChat } from "@cometchat-pro/chat";
import * as firebaseService from "../../services/firebase";
import "./LiveStreamDetail.scss";

const PurchasingMenu = [
  {
    title: "Remove clothes",
    options: [
      {
        amount: 10,
        text: "10 seconds"
      },
      {
        amount: 30,
        text: "30 seconds"
      },
      {
        amount: 60,
        text: "60 seconds"
      }
    ]
  },
  {
    title: "Private show",
    options: [
      {
        amount: 60,
        text: "1 minute"
      },
    ]
  },
  {
    title: "Spy on private show",
    options: [
      {
        amount: 60,
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
        amount: 1,
        text: "1 second"
      },
      {
        amount: 3,
        text: "3 seconds"
      },
      {
        amount: 5,
        text: "5 seconds"
      },
      {
        amount: 15,
        text: "15 seconds"
      },
      {
        amount: 30,
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
  const { id } = useParams();
  const [activePublic, setAcivePublic] = useState(true);
  const [showPurchasing, setShowPurchasing] = useState(false);
  const [showLovence, setShowLovence] = useState(false);
  const { cometChat, user } = useContext(AuthContext);
  const [notification, setNotification] = useState(null);

  const history = useHistory();

  useEffect(() => {
    getLivestream(id);
  }, [id]);

  useEffect(() => {
    if (livestream && cometChat) {
      startDirectCall();
    }
  }, [livestream, cometChat]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!notification && livestream.createdBy.id === user.id) getNotificiation()
    }, 500);
    return () => clearInterval(interval);
  }, [livestream]);

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
              history.push("/planets/Neatis/rooms");
            }
          },
          onCallEnded: (call) => {
            history.push("/planets/Neatis/rooms");
          },
          onError: (error) => {
            history.push("/planets/Neatis/rooms");
          },
          onMediaDeviceListUpdated: (deviceList) => {},
          onUserMuted: (userMuted, userMutedBy) => {},
          onScreenShareStarted: () => {},
          onScreenShareStopped: () => {},
        })
      );
    }
  };

  const getLivestream = async (id) => {
    const livestream = await firebaseService.getSingleDataWithQuery({
      key: "livestreams",
      query: "id",
      criteria: id,
    });
    setLivestream(livestream);
  }

  const getNotificiation = async () => {
    const livestream = await firebaseService.getSingleDataWithQuery({
      key: "livestreams",
      query: "id",
      criteria: id,
    });
    
    let donations = livestream.donations ? livestream.donations: [];
    donations.forEach(async (donation) => {
      if (!donation.notify) {
        setNotification(`${donation.title} ${donation.text} from ${donation.user.fullname}`);
        donation.notify = true;
        await firebaseService.update({
          key: "livestreams",
          id: livestream.id,
          payload: {
            donations: donations
          },
        });
        return;
      }
    });
  };

  if (!livestream || !cometChat) return <React.Fragment></React.Fragment>;

  return (
    <div className="livestream">
      <LiveStreamHeader livestream={livestream} />
      <div className="livestream__container">
        <div className="livestream__left">
          <div className="livestream__control">
            {livestream && livestream.createdBy.id !== user.id &&
              <>
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
                    livestreamId={livestream.id}
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
                    livestreamId={livestream.id}
                    />
                </div>
                <button className="livestream__btn__emotic"></button>
              </>
            }
          </div>
          <button
            className="livestream__backBtn"
            onClick={() => history.push("/planets/Neatis/rooms")}
          />
          <Notification 
            isOpen={notification}
            onClose={() => setNotification(null)}
            notification={notification}
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
