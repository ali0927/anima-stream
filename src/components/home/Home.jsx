/* eslint-disable */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { useHistory } from "react-router-dom";

import Header from "../common/Header";

import * as cometChatService from "../../services/cometchat";
import * as firebaseService from "../../services/firebase";

import { AuthContext } from "../../contexts";

const Home = () => {
  const [livestreams, setLivestreams] = useState([]);

  const livestreamsRef = useRef(firebaseService.getRef("livestreams"));

  const { cometChat, user } = useContext(AuthContext);

  const history = useHistory();

  const loadLivestreams = useCallback(() => {
    firebaseService.getDataRealtime(livestreamsRef, onDataLoaded);
  }, []);

  const onDataLoaded = (val) => {
    if (val) {
      const keys = Object.keys(val);
      const data = keys.map((key) => val[key]);
      setLivestreams(data);
    }
  };

  useEffect(() => {
    loadLivestreams();
    return () => {
      firebaseService.offRealtimeDatabase(livestreamsRef.current);
    };
  }, [loadLivestreams]);

  const joinLivestream = (livestream) => async () => {
    try {
      await cometChatService.joinGroup(cometChat, livestream.id);
    } catch (error) {
      console.log(error);
    }
    setUpLivestream(livestream);
  };

  const startLiveStream = (livestream) => async () => {
    try {
      await cometChatService.joinGroup(cometChat, livestream.id);
    } catch (error) {
      console.log(error);
    }
    localStorage.setItem("livestream", JSON.stringify(livestream));
    history.push("/livestream");
  }

  const setUpLivestream = (livestream) => {
    localStorage.setItem("livestream", JSON.stringify(livestream));
    history.push("/donation");
  };

  return (
    <React.Fragment>
      <Header />
      <div className="home">
        <div>
          {livestreams?.map((livestream) => (
            <div className="livestream__item" key={livestream.id}>
              <p className="livestream__name">{livestream.name}</p>
              <p className="livestream__content">Streamer: <strong>{livestream.createdBy.fullname}</strong></p>
              <p className="livestream__content">Date: <strong>{livestream.date}</strong></p>
              <p className="livestream__content">{livestream.description}</p>
              {livestream.createdBy.id === user.id
                ? <button className="livestream__start" onClick={startLiveStream(livestream)}>Start</button>
                : <button onClick={joinLivestream(livestream)}>Join</button>
              }
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
