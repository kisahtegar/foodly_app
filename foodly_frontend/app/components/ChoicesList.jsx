import uidata from "../constants/uidata";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";

const ChoicesList = ({ setSelectedChoice, setSelectedSection }) => {
  const [selected, setSelected] = useState(null);

  const handleSelectChoice = (item) => {
    if (selected === item.value) {
      setSelected(null);
      setSelectedChoice(null);
      setSelectedSection(null);
    } else {
      setSelected(item.value);
      setSelectedChoice(item.value);
      setSelectedSection("restaurant");
    }
  };

  return (
    <View>
      <Text
        style={{
          marginLeft: 16,
          marginVertical: 8,
          fontSize: 18,
          fontFamily: "bold",
        }}
      >
        Pick Restaurants
      </Text>

      <FlatList
        data={uidata.choicesList}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        scrollEnabled
        style={{ marginTop: 5 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              handleSelectChoice(item);
            }}
            style={{
              backgroundColor:
                item.value === selected ? COLORS.secondary : COLORS.lightWhite,
              height: 40,
              borderRadius: 12,
              marginHorizontal: 8,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                marginHorizontal: 10,
                fontFamily: "regular",
                fontSize: 13,
                color:
                  item.value === selected ? COLORS.lightWhite : COLORS.gray,
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChoicesList;
