/* eslint-disable */ // plz fix linting and remove this comment
import { useContext } from "react";
import { AuthContext } from "../../contexts";
import * as firebaseService from "../../services/firebase";
import * as uiService from "../../services/ui";
import "./LiveStreamDetail.css";

const ToolBarMenu = ({ items, show, onClose }) => {
  const { user, setUser } = useContext(AuthContext);

  const handleOption = async (item) => {
    try {
      uiService.showLoading();
      await firebaseService.update({
        key: "users",
        id: user.id,
        payload: {
          balance: user.balance - item.amount
        },
      });

      setUser({...user, balance: user.balance - item.amount});
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
                <div className="livestream__menu__option" onClick={() => handleOption(option)}>
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
