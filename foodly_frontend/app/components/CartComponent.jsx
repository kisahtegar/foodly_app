import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants/theme";
import NetworkImage from "./NetworkImage";
import { RatingInput } from "react-native-stock-star-rating";

const CartComponent = ({ item, deleteItem }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.innerRow}>
        <View style={styles.priceLayer}>
          <Text style={styles.price}>{`\$ ${item.totalPrice}`}</Text>
        </View>

        <TouchableOpacity style={styles.delete} onPress={deleteItem}>
          <AntDesign name="delete" size={20} color={COLORS.red} />
        </TouchableOpacity>

        <NetworkImage
          data={item.productId.imageUrl[0]}
          width={100}
          height={100}
          radius={16}
        />

        <View style={styles.row}>
          <View>
            <Text style={styles.food}>{item.productId.title}</Text>

            {item.additives.length === 0 ? (
              <View style={{ height: 1 }} />
            ) : (
              <FlatList
                data={item.additives.slice(0, 3)}
                showsVerticalScrollIndicator={false}
                key={(item) => item.id}
                style={{ marginTop: 5 }}
                horizontal
                scrollEnabled
                renderItem={({ item }) => (
                  <View style={styles.additives}>
                    <Text style={styles.adText}>{item.title}</Text>
                  </View>
                )}
              />
            )}

            {/* <View style={{height: 5}}/> */}

            <RatingInput
              rating={item.productId.rating}
              color={COLORS.secondary}
              size={18}
            />

            <Text
              style={[styles.adText, { color: COLORS.gray, fontSize: 13 }]}
            >{`${item.productId.ratingCount} rating reviews`}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartComponent;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.lightWhite,
    width: SIZES.width - 30,
    height: 120,
    marginBottom: 10,
    borderRadius: 12,
  },
  adText: {
    paddingHorizontal: 4,
    color: COLORS.lightWhite,
    fontFamily: "regular",
    fontSize: 11,
  },
  additives: {
    right: 10,
    height: 20,
    justifyContent: "center",
    marginHorizontal: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
  },
  innerRow: {
    flexDirection: "row",
    margin: 10,
    backgroundColor: COLORS.offwhite,
    borderRadius: 16,
  },
  priceLayer: {
    position: "absolute",
    right: 5,
    top: 5,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
  },
  price: {
    color: COLORS.lightWhite,
    marginHorizontal: 5,
    fontFamily: "medium",
    fontSize: 14,
  },
  delete: {
    position: "absolute",
    right: 10,
    top: SIZES.xxLarge + 20,
  },
  row: {
    flexDirection: "row",
    marginLeft: 10,
    marginTop: 10,
    justifyContent: "space-between",
  },
  food: {
    fontFamily: "medium",
    fontSize: 14,
  },
});
