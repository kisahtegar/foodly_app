import * as React from "react";
import { View, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#ff4081" }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
);

const ThreeRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#ffffff" }} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  three: ThreeRoute,
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
