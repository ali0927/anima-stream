import Leftbar from "../Leftbar/Leftbar";
import styles from "./StreamView.module.scss";

const StreamView = (props) => {
  return (
    <div className={styles.stream}>
      <Leftbar />
      <h1 className="header1 text-white">Streaming Name</h1>
    </div>
  )
}

export default StreamView;