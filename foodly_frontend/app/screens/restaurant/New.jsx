import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { RestaurantContext } from "../../context/RestaurantContext";
import uidata from "../../constants/uidata";
import CategoryFoodComp from "../../components/CategoryFoodComp";
import fetchRecommendations from "../../hook/recommendationsHook";
import ReusableShimmer from "../../components/Shimmers/ReusableShimmer";
import { SIZES } from "../../constants/theme";

const New = () => {
  const navigation = useNavigation();
  const { restaurantObj, setRestaurantObj } = useContext(RestaurantContext);
  const code = restaurantObj.code;

  const { recommendations, isLoading, error, refetch } =
    fetchRecommendations(code);

  if (isLoading) {
    return (
      <View style={{ marginTop: 5 }}>
        <FlatList
          data={uidata.foods}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 5 }}
          keyExtractor={(item) => item._id}
          scrollEnabled
          renderItem={({ item }) => (
            <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
              <ReusableShimmer
                width={SIZES.width - 20}
                height={120}
                radius={12}
              />
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View style={{ marginTop: 5 }}>
      <FlatList
        data={recommendations}
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 5 }}
        keyExtractor={(item) => item._id}
        scrollEnabled
        renderItem={({ item }) => (
          <View style={{ left: 10 }}>
            <CategoryFoodComp
              item={item}
              onPress={() => navigation.navigate("food-nav", item)}
            />
          </View>
        )}
      />
    </View>
  );
};

export default New;

const styles = StyleSheet.create({});
