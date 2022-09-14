import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";

import { CometChatMessages } from "../../cometchat-pro-react-ui-kit/CometChatWorkspace/src";
import LiveStreamHeader from "../livestream-header/LiveStreamHeader";

import { AuthContext } from "../../contexts";
import { CometChat } from "@cometchat-pro/chat";

const LiveStreamDetail = () => {
  const [livestream, setLivestream] = useState(null);
  const [activePublic, setAcivePublic] = useState(true);

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
      const screenShare = streamerId === user.id ? true: false;
      const muteAudio = streamerId === user.id ? true: false;
      const pauseVideo = streamerId === user.id ? true: false;
      const endCall = streamerId === user.id ? true: false;
      const startAudioMuted = true;
      const startVideoMuted = true;
      const mode = CometChat.CALL_MODE.SPOTLIGHT;

      let CSS = `
        .local-video-container { 
          display: none;
        }
        #menu-list-grow > li:first-child {
          display: none;
        }
      `

      if (streamerId === user.id) {

      }
      else {
        CSS += `
          .bottom-buttons-other-options { 
            display: none;
          }
        `
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
            if (idx === -1) {
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
    <React.Fragment>
      <LiveStreamHeader livestream={livestream} />
      <div className="livestream">
        <div className="livestream__left">
          <div id="call__screen"></div>
        </div>
        <div className="livestrem__right">
          <div className="livestream__tabs">
            <button 
              className={activePublic ? 'active': ''}
            >
              Public
            </button>
            <button
              className={activePublic ? '': 'active'}
            >
              Private
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
    </React.Fragment>
  );
};

export default LiveStreamDetail;
