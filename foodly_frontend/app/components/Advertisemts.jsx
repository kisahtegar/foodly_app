import React from "react";
import NetworkImage from "./NetworkImage";
import { SIZES } from "../constants/theme";

const Advertisemts = () => {
  return (
    <NetworkImage
      source={
        "https://res.cloudinary.com/dc7i32d3v/image/upload/v1734400159/images/randoms/ads-on-internet.png"
      }
      width={SIZES.width}
      height={SIZES.height / 5.8}
      radius={16}
    />
  );
};

export default Advertisemts;
