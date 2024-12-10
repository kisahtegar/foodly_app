import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { COLORS, SIZES } from "../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import pages from "./page.style";
import HomeHeader from "../components/HomeHeader";
import CategoryList from "../components/CategoryList";
import ChoicesList from "../components/ChoicesList";
import Heading from "../components/Heading";
import Divider from "../components/Divider";
import NearByRestaurants from "../components/NearByRestaurants";
import NewFoodList from "../components/NewFoodList";
import HomeCategories from "../components/HomeCategories";
import axios from "axios";

const Home = () => {
  const code = "banten";
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState(null);

  const fetchCategory = async () => {
    setIsLoading(true);

    try {
      console.log("Home.fetchCategory.selectedCategory: ", selectedCategory);
      const response = await axios.get(
        `http://192.168.0.17:6002/api/foods/${selectedCategory}/${code}`
      );

      setCategory(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
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
            style={{ borderBottomEndRadius: 30, borderBottomStartRadius: 30 }}
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
                  heading={`Browse ${selectedValue}`}
                  onPress={() => {}}
                />

                <HomeCategories category={category} isLoading={isLoading} />
              </View>
            ) : (
              <View>
                <Heading heading={"Nearby Restaurants"} onPress={() => {}} />
                <NearByRestaurants code={code} />
                <Divider />

                <Heading heading={"Try Something New"} onPress={() => {}} />
                <NewFoodList code={code} />
                <Divider />

                <Heading heading={"Fastest Near You"} onPress={() => {}} />
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

const styles = StyleSheet.create({});
