import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";

import { CometChatMessages } from "../../cometchat-pro-react-ui-kit/CometChatWorkspace/src";
import LiveStreamHeader from "../livestream-header/LiveStreamHeader";

import { AuthContext } from "../../contexts";

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
      const screenShare = streamerId === user.id ? true: true;
      const muteAudio = streamerId === user.id ? true: true;
      const pauseVideo = streamerId === user.id ? true: true;
      const endCall = streamerId === user.id ? true: true;
      const startAudioMuted = true;
      const startVideoMuted = true;

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
        .build();

      cometChat.startCall(
        callSettings,
        document.getElementById("call__screen"),
        new cometChat.OngoingCallListener({
          onUserListUpdated: (userList) => {},
          onCallEnded: (call) => {
            history.push("/");
          },
          onError: (error) => {
            history.push("/");
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
              {livestream.createdBy.fullname}
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
