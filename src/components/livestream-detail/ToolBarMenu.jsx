/* eslint-disable */ // plz fix linting and remove this comment
import { useContext } from "react";
import { AuthContext } from "../../contexts";
import * as firebaseService from "../../services/firebase";
import * as uiService from "../../services/ui";
import "./LiveStreamDetail.css";

const ToolBarMenu = ({ items, show, onClose, livestreamId }) => {
  const { user, setUser } = useContext(AuthContext);

  const handleOption = async (item, option) => {
    try {
      uiService.showLoading();
      if (user.balance > option.amount) {
        await firebaseService.update({
          key: "users",
          id: user.id,
          payload: {
            balance: user.balance - option.amount
          },
        });

        const livestream = await firebaseService.getSingleDataWithQuery({
          key: "livestreams",
          query: "id",
          criteria: livestreamId,
        });

        let donations = livestream.donations ? livestream.donations: [];
        donations = [
          ...donations,
          {
            title: item.title,
            amount: option.amount,
            text: option.text,
            notify: false,
            user: user
          }
        ];

        await firebaseService.update({
          key: "livestreams",
          id: livestreamId,
          payload: {
            balance: livestream.balance + option.amount,
            donations: donations
          },
        });

        setUser({...user, balance: user.balance - option.amount});
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
        <div className="livestream__menu">
          {items.map(item =>
            <>
              <div className="livestream__menu__title">{item.title}</div>
              {item.options.map(option =>
                <div 
                  className="livestream__menu__option" 
                  onClick={() => handleOption(item, option)} 
                  key={`{items.title}{option.amount}`}
                >
                  {option.text}
                </div>
              )}
            </>
          )}
        </div>
      }
    </>
  )
}

export default ToolBarMenu;
