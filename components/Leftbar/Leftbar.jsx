import Image from "next/image";
import Home from "../../shared/icon/home.png";
import Star from "../../shared/icon/star.png";
import People from "../../shared/icon/people.png";
import Notification from "../../shared/icon/notification.png";
import styles from "./Leftbar.module.scss";

const Leftbar = () => {
  return (
    <div className={styles.leftbar}>
      <div className={styles.leftbar_icon}>
        <Image src={Home} width={30} height={30} />
      </div>
      <div className={styles.leftbar_icon}>
        <Image src={Star} width={30} height={30} />
      </div>
      <div className={styles.leftbar_icon}>
        <Image src={People} width={30} height={30} />
      </div>
      <div className={styles.leftbar_icon}>
        <Image src={Notification} width={30} height={30} />
      </div>
    </div>
  )
}

export default Leftbar;