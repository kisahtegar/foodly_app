import pages from "./page.style";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";

const Cart = () => {
  return (
    <SafeAreaView>
      <View style={pages.viewOne}>
        <View style={pages.viewTwo}></View>
      </View>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({});
