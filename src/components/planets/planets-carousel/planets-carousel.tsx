import * as React from "react";
import { PlanetCarouselItem } from "./planets-carousel-item/planet-carousel-item";
import classNames from "classnames";
import styles from "./planets-carousel.module.scss";

/* assets */
import orbitImage from "../../../assets/geometry/orbit.svg";
import { Layout } from "../layout/layout";
/* ****** */

export const PlanetsCarousel = () => {
  const planets = [
    {
      title: "Anima",
    },
    {
      title: "Nexus",
    },
    {
      title: "Sataru",
    },
  ];

  // const [activePlanet, setActivePlanet] = React.useState(planets[1].title);

  return (
    <Layout>
      <div
        className={classNames(
          "full-height-norelative full-width-norelative flex column justify-space-between align-center overflow-hidden",
          styles["planets-carousel"]
        )}
      >
        <img
          src={orbitImage}
          alt="orbit"
          className={classNames(styles["orbit-image"])}
        />

        <div
          className={classNames(
            "flex row full-height align-center justify-space-between",
            styles["planets-carousel"]
          )}
        >
          {planets &&
            planets.map((planet) => (
              <PlanetCarouselItem
                title={planet.title}
                key={planet.title}
                isActive={planet.title === planets[1].title}
              />
            ))}
        </div>
      </div>
    </Layout>
  );
};
