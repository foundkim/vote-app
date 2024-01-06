//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import { Colors, Fonts } from "../constants";
import { fontPixel, heightPixel, widthPixel } from "./Scaling";

// create a component
export const Buttons = ({
  color,
  label,
  icon,
  width,
  height,
  disabled,
  onClick,
}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      activeOpacity={0.8}
      disabled={disabled}
      style={{
        backgroundColor: disabled
          ? "#D9D9D9"
          : color
          ? color
          : Colors.DEFAULT_BLUE,
        width: widthPixel(width ? width : 380),
        height: heightPixel(height ? height : 50),
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontFamily: Fonts.MANROPE_REGULAR,
          fontSize: fontPixel(18),
          color: "white",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
});
