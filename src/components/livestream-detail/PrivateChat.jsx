/* eslint-disable */ // plz fix linting and remove this comment
import Eye from "../../assets/icons/eye.svg";
import Clock from "../../assets/icons/clock.svg";
import { useContext } from "react";
import { AuthContext } from "../../contexts";
import * as cometChatService from "../../services/cometchat";
import * as firebaseService from "../../services/firebase";
import * as uiService from "../../services/ui";
import { v4 as uuidv4 } from "uuid";
import "./LiveStreamDetail.css";

const PrivateChat = ({ show, onClose, livestreamId }) => {
  const { user, setUser, cometChat } = useContext(AuthContext);

  const handleBuy = async () => {
    const amount = 20
    try {
      uiService.showLoading();
      if (user.balance > amount) {
        await firebaseService.update({
          key: "users",
          id: user.id,
          payload: {
            balance: user.balance - amount
          },
        });

        const livestream = await firebaseService.getSingleDataWithQuery({
          key: "livestreams",
          query: "id",
          criteria: livestreamId,
        });

        let chats = livestream.chats ? livestream.chats: [];

        const idx = chats.findIndex((chat) => chat.userId === user.id);
        if (idx !== -1) {
          const lastTime = chats[chats.length - 1].start + 1000 * 60;
          chats[idx].start = lastTime > Date.now() ? lastTime: Date.now();
          chats.sort((a, b) => a.start - b.start);
        }
        else {
          const chatId = uuidv4();
          await cometChatService.createGroup({
            cometChat,
            id: chatId,
            name: `ChatWith${user.fullname}`,
          });

          let lastChat = {
            time: 1000 * 60,
            start: chats.length > 0 ? chats[chats.length - 1].start + 1000 * 60: Date.now(),
            userId: user.id,
            userName: user.fullname,
            chatId: chatId,
          }

          chats = [
            ...chats,
            lastChat
          ];
        }

        await firebaseService.update({
          key: "livestreams",
          id: livestreamId,
          payload: {
            balance: livestream.balance + amount,
            chats: chats
          },
        });

        setUser({...user, balance: user.balance - amount});
      }
    } catch (error) {
      console.log(error)
      uiService.alert(`Failure to purchase`);
    }
    uiService.hideLoading();
    onClose();
  }

  return (
    <>
      {show &&
        <div className="livestream__privateChat">
          <div className="triangle"></div>
          <div style={{marginBottom: "5px"}}>
            PRIVATE CHAT
          </div>
          <div className="contentBox">
            <div style={{display: "flex", alignItems: "flex-start"}}>
              <img src={Eye} alt="eye" />
              <p style={{fontSize: "12px", margin: "2px"}}>
                Private communication with streamer
              </p>
            </div>
            <div style={{display: "flex", alignItems: "flex-start"}}>
              <img src={Clock} alt="eye" />
              <p style={{fontSize: "12px", margin: "2px"}}>
                Access for 1 min
              </p>
            </div>
          </div>
          <div className="divider"></div>
          <div style={{margin: "5px 0"}}>
            Price: 200 Seconds
          </div>
          <button onClick={() => handleBuy()}>
            BUY
          </button>
        </div>
      }
    </>
  )
}

export default PrivateChat;
