import React from "react";
import styles from "./rooms.module.scss";
import { Layout } from "../../layout/layout";
import classNames from "classnames";

export const Rooms = ({ title }: { title: string }) => {
  return (
    <Layout>
      <div className={classNames(styles["rooms"])}>rooms {title}</div>
    </Layout>
  );
};
