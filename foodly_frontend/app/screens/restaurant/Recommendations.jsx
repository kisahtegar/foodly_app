import { View, FlatList } from "react-native";
import React, { useContext } from "react";
import { COLORS, SIZES } from "../../constants/theme";
import FoodTile from "../../components/FoodTile";
import { useNavigation } from "@react-navigation/native";
import fetchFoodRecommendations from "../../hook/fetchFoodRecommendations";
import { RestaurantContext } from "../../context/RestaurantContext";
import CookLoader from "../../components/CookLoader";

const Recommendations = () => {
  const navigation = useNavigation();
  /*if(restaurantObj==undefined)return(<Text style={[styles.small, { marginLeft: 10, color: "white" }]}>
  This shop does not exist
</Text>); */
  const { restaurantObj, setRestaurant } = useContext(RestaurantContext);
  const { recommendations, isLoading, error, refetch } =
    fetchFoodRecommendations(restaurantObj.code);

  if (isLoading) {
    return <CookLoader />;
  }

  return (
    <View
      style={{ backgroundColor: COLORS.lightWhite, height: SIZES.height / 2 }}
    >
      <View style={{ marginTop: 10 }}>
        <FlatList
          data={recommendations}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          style={{ marginTop: 5 }}
          numColumns={2}
          scrollEnabled
          renderItem={({ item }) => (
            <FoodTile
              item={item}
              showDetails={() => navigation.navigate("food-nav", item)}
            />
          )}
        />
      </View>
    </View>
  );
};

export default Recommendations;
