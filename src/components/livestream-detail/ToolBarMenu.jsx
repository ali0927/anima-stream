/* eslint-disable */ // plz fix linting and remove this comment

import "./LiveStreamDetail.css";

const ToolBarMenu = ({ items, show, onClose }) => {
  const handleOption = () => {
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
                <div className="livestream__menu__option" onClick={handleOption}>
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
