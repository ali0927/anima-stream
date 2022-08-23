import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import Link from "next/link";
import { Streamers } from "../../lib/dummy";
import * as cometChatService from "../../services/cometchat";
import * as firebaseService from "../../services/firebase";
import { AuthContext } from "../../contexts";

const StreamList = () => {
  const [livestreams, setLivestreams] = useState([]);
  const livestreamsRef = useRef(firebaseService.getRef("livestreams"));
  const { cometChat } = useContext(AuthContext);

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
      setUpLivestream(livestream);
    } catch (error) {
      setUpLivestream(livestream);
    }
  };

  const setUpLivestream = (livestream) => {
    localStorage.setItem("livestream", JSON.stringify(livestream));
    // history.push("/livestream-detail");
  };

  return (
    <div className="grid grid-cols-3 gap-4 mt-10">
      {Streamers.map((streamer, idx) => 
        <Link href={`/stream/${idx}`}>
          <div key={idx} className="border rounded p-4 space-y-4 cursor-pointer">
            <h1 className="text-2xl">{streamer.title}</h1>
            <div className="flex flex-col">
              <span>{`Steramer: ${streamer.name}`}</span>
              <span>{`Description: ${streamer.description}`}</span>
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}

export default StreamList;