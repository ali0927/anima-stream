import React from "react";
import cn from "classnames";

import styles from "./SvgIcon.module.scss";

interface SvgProps extends React.SVGProps<SVGSVGElement> {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export const SvgIcon: React.FC<SvgProps> = ({ Icon, className, ...props }) => (
  <Icon className={cn(styles.icon, className)} {...props} />
);
