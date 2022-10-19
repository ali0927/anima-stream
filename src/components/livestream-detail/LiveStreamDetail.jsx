/* eslint-disable */

import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { CometChatMessages } from "../../cometchat-pro-react-ui-kit/CometChatWorkspace/src";
import LiveStreamHeader from "../livestream-header/LiveStreamHeader";
import ToolBarMenu from "./ToolBarMenu";
import PrivateChat from "./PrivateChat";
import Notification from "./Notification";
import { AuthContext } from "../../contexts";
import { CometChat } from "@cometchat-pro/chat";
import * as firebaseService from "../../services/firebase";
import Lock from "../../assets/icons/lock.svg";
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
  const [privateChat, setPrivateChat] = useState(null);
  const [lastPrivateChat, setLastPrivateChat] = useState(null);
  const { id } = useParams();
  const [activePublic, setAcivePublic] = useState(true);
  const [showPurchasing, setShowPurchasing] = useState(false);
  const [showLovence, setShowLovence] = useState(false);
  const [showPrivate, setShowPrivate] = useState(false);
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
      if (!notification && livestream.createdBy.id === user.id) getNotificiation();
    }, 1000);
    return () => clearInterval(interval);
  }, [livestream]);

  useEffect(() => {
    const interval = setInterval(() => {
      getLastPrivateChat();
    }, 1000);
    return () => clearInterval(interval);
  }, [livestream]);

  useEffect(() => {
    if ((!privateChat && lastPrivateChat) || (lastPrivateChat && lastPrivateChat.chatId !== privateChat.chatId)) {
      if (livestream.createdBy.id !== user.id && lastPrivateChat.userId === user.id && !notification) {
        setNotification(`Starting private chat with streamer`);
      }
      else if (livestream.createdBy.id === user.id && !notification) {
        setNotification(`Starting private chat with ${lastPrivateChat.userName}`);
      }
    }
    setPrivateChat(lastPrivateChat);
  }, [lastPrivateChat]);

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

  const getNotificiation = useCallback(async () => {
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
  }, []);

  const getPrivateChat = useCallback(async () => {
    const livestream = await firebaseService.getSingleDataWithQuery({
      key: "livestreams",
      query: "id",
      criteria: id,
    });
    let chats = livestream.chats ? livestream.chats: [];
    chats = chats.filter(chat => chat.start + chat.time > Date.now());
    chats.sort((a, b) => a.start - b.start);
    if (chats.length <= 0) {
      setPrivateChat(null);
      return;
    }
    if (privateChat && privateChat.chatId === chats[0].chatId) return;
    setPrivateChat(chats[0]);

    if (livestream.createdBy.id !== user.id && chats[0].userId === user.id) {
      setNotification(`Starting private chat with streamer`);
    }
    else if (livestream.createdBy.id === user.id) {
      setNotification(`Starting private chat with ${chats[0].userName}`);
    }
  }, [privateChat]);

  const getLastPrivateChat = async () => {
    const livestream = await firebaseService.getSingleDataWithQuery({
      key: "livestreams",
      query: "id",
      criteria: id,
    });
    let chats = livestream.chats ? livestream.chats: [];
    chats = chats.filter(chat => chat.start + chat.time > Date.now());
    chats.sort((a, b) => a.start - b.start);
    if (chats.length <= 0) setLastPrivateChat(null);
    else setLastPrivateChat(chats[0]);   
  }

  if (!livestream || !cometChat) return <></>;

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
                onClick={() => setAcivePublic(true)}
              >
                GENERAL CHAT
              </button>
              <button
                className={activePublic ? '': 'active'}
                onClick={() => setAcivePublic(false)}
              >
                CHAT WITH
                {livestream.createdBy.id === user.id 
                  ? <span style={{fontSize: "12px", margin: "2px"}}>
                      {privateChat && ` (${privateChat.userName})`}
                    </span>
                  : privateChat && privateChat.userId === user.id
                    ? <></>
                    : <img
                        src={Lock}
                        className="livestream__lockIcon"
                        onClick={() => setShowPrivate(!showPrivate)}
                      />
                }
              </button>
            </div>
            {activePublic &&
              <div className="livestream__chat">
                <CometChatMessages chatWithGroup={livestream.id} />
              </div>
            }
            {!activePublic && 
              <div className="livestream__chat">
                {privateChat && livestream && (privateChat.userId === user.id || livestream.createdBy.id === user.id)
                  ? <CometChatMessages chatWithGroup={privateChat.chatId} />
                  : <div className="livestream__public__description">
                      {livestream && livestream.createdBy.id !== user.id && 
                        `You need to purchase for private chat and wait until streamer is available.`
                      }
                    </div>
                }
              </div>
            }
            <PrivateChat 
              show={showPrivate}
              onClose={() => setShowPrivate(false)}
              livestreamId={livestream.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamDetail;
