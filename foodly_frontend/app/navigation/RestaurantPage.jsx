import Menu from "../screens/restaurant/Menu";
import Directions from "../screens/restaurant/Directions";
import New from "../screens/restaurant/New";
import * as React from "react";
import { useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";

const renderScene = SceneMap({
  first: Menu,
  second: Directions,
  three: New,
});

const routes = [
  { key: "first", title: "Menu" },
  { key: "second", title: "Directions" },
  { key: "three", title: "New" },
];

const RestaurantPage = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
};

export default RestaurantPage;
