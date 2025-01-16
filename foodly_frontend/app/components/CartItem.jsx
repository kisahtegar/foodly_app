import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants/theme";
import NetworkImage from "../components/NetworkImage";
import { RatingInput } from "react-native-stock-star-rating";

const CartItem = ({ item, deleteItem }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.innerRow}>
        <NetworkImage
          source={item.productId.imageUrl[0]}
          width={100}
          height={100}
          radius={16}
        />

        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.restaurant}>{item.productId.title}</Text>
            {item.additives.length === 0 ? (
              <View style={{ height: 1 }} />
            ) : (
              <FlatList
                data={item.additives.slice(0, 3)}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                style={{ marginTop: 5 }}
                horizontal
                scrollEnabled
                renderItem={({ item }) => (
                  <View
                    style={{
                      right: 10,
                      marginHorizontal: 10,
                      backgroundColor: COLORS.gray2,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        paddingHorizontal: 4,
                        color: COLORS.lightWhite,
                        fontFamily: "regular",
                        fontSize: 11,
                      }}
                    >
                      {item.title}
                    </Text>
                  </View>
                )}
              />
            )}

            <View style={{ height: 5 }} />
            <RatingInput
              rating={item.productId.rating}
              color={COLORS.secondary}
              setRating={item.rating}
              size={18}
              maxStars={5}
              bordered={false}
            />

            <View style={{ height: 5 }} />

            <Text style={styles.reviews}>
              {item.productId.ratingCount} Reviews
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={deleteItem} style={styles.deleteButton}>
            <AntDesign name="delete" size={20} color={COLORS.red} />
          </TouchableOpacity>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{`Rp. ${item.totalPrice}`}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.lightWhite,
    width: SIZES.width - 30,
    height: 120,
    marginBottom: 10,
    borderRadius: 12,
  },
  innerRow: {
    flexDirection: "row",
    margin: 10,
    backgroundColor: COLORS.offwhite,
    borderRadius: 16,
  },
  row: {
    marginLeft: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  restaurant: {
    fontFamily: "medium",
    fontSize: 14,
  },
  reviews: {
    fontFamily: "medium",
    fontSize: 12,
    color: COLORS.gray,
  },
  actionsContainer: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  deleteButton: {
    marginBottom: 10,
  },
  priceContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    paddingHorizontal: 5,
  },
  price: {
    color: COLORS.lightWhite,
  },
});
