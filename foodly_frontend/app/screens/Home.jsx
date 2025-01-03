import { ScrollView, View } from "react-native";
import React, { useEffect, useState } from "react";
import { BaseUrl, COLORS, SIZES } from "../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeHeader from "../components/HomeHeader";
import CategoryList from "../components/CategoryList";
import ChoicesList from "../components/ChoicesList";
import Heading from "../components/Heading";
import Divider from "../components/Divider";
import NearByRestaurants from "../components/NearByRestaurants";
import NewFoodList from "../components/NewFoodList";
import HomeCategory from "../components/HomeCategory";
import axios from "axios";

const Home = ({ navigation }) => {
  const code = "banten";
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      console.log("[Home.fetchData]: selectedCategory = ", selectedCategory);
      const response = await axios.get(
        `${BaseUrl}/api/foods/category/${selectedCategory}`
      );

      setCategory(response.data);
      setIsLoading(false);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedSection]);

  return (
    <SafeAreaView>
      <View style={{ backgroundColor: COLORS.primary, height: SIZES.height }}>
        <View
          style={{
            backgroundColor: COLORS.offwhite,
            height: SIZES.height - 80,
            borderBottomEndRadius: 30,
            borderBottomStartRadius: 30,
            overflow: "hidden",
          }}
        >
          <HomeHeader />

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              borderBottomEndRadius: 30,
              borderBottomStartRadius: 30,
            }}
          >
            <CategoryList
              setSelectedCategory={setSelectedCategory}
              setSelectedSection={setSelectedSection}
              setSelectedValue={setSelectedValue}
            />

            <ChoicesList
              setSelectedChoice={setSelectedChoice}
              setSelectedSection={setSelectedSection}
            />
            {selectedCategory !== null && selectedSection !== null ? (
              <View>
                <Heading
                  heading={`Browse ${selectedValue} Category`}
                  onPress={() => {}}
                />
                <HomeCategory category={category} isLoading={isLoading} />
              </View>
            ) : (
              <View>
                <Heading
                  heading={"Nearby Restaurants"}
                  onPress={() => {
                    navigation.navigate("nearby_restaurants");
                  }}
                />
                <NearByRestaurants code={code} />
                <Divider />

                <Heading
                  heading={"Try Something New"}
                  onPress={() => {
                    navigation.navigate("fastest");
                  }}
                />
                <NewFoodList code={code} />
                <Divider />

                <Heading
                  heading={"Fastest Near You"}
                  onPress={() => {
                    navigation.navigate("fastest");
                  }}
                />
                <NewFoodList code={code} />
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
