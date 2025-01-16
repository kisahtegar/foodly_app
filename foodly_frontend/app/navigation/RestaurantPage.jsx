import * as React from "react";
import { useWindowDimensions, View } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { COLORS, SIZES } from "../constants/theme";
import Delivery from "../screens/restaurant/Delivery";
import Pickup from "../screens/restaurant/Pickup";
import Recommendations from "../screens/restaurant/Recommendations";

const renderScene = SceneMap({
  first: Delivery,
  second: Pickup,
  three: Recommendations,
});

const routes = [
  { key: "first", title: "Delivery" },
  { key: "second", title: "Pick Up" },
  { key: "three", title: "Recommendations" },
];

const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{
      backgroundColor: COLORS.primary,
      width: 20,
      left: (100 - 30) / 2,
    }}
    style={{
      backgroundColor: COLORS.secondary1,
      borderRadius: 8,
      marginBottom: 10,
    }}
    activeColor={COLORS.secondary}
    inactiveColor={COLORS.gray2}
    labelStyle={{ fontFamily: "medium" }}
  />
);

const RestaurantPage = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <View style={{ flex: 1, marginHorizontal: 10 }}>
      <TabView
        renderTabBar={renderTabBar}
        style={{ borderRadius: 8 }}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        sceneContainerStyle={{ borderRadius: 8, height: SIZES.height / 2 }}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
};

export default RestaurantPage;
