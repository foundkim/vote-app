//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { Fonts, Colors, Images } from "../constants";
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from "../components/Scaling";
import { Buttons } from "../components/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import Configs from "../constants/Configs";

const { width } = Dimensions.get("screen");

// create a component
const Login = ({ navigation }) => {
  const initialState = {
    code: "",
  };
  const [voters, setVoter] = useState([]);
  const valiationSchema = Yup.object().shape({
    code: Yup.string()
      .min(10)
      .required("Veuillez entrer votre code d'election"),
  });
  useEffect(() => {
    fetch(Configs.BASE_URL + "subscribe-election")
      .then((res) => {
        return res.json();
      })
      .then((data) => setVoter(data))
      .catch((err) => console.log(err));
  }, []);

  const onSubmit = (values) => {
    const voter = voters.find((voter) => values.code === voter.token);
    if (voter) {
      navigation.navigate("Vote", { voter: voter, token: values.code });
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled={false}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={Images.LOGO} />
          <Text style={styles.welcome}>Bienvenue dans l’App de Vote</Text>
        </View>
        <View style={styles.body}>
          <Formik
            initialValues={initialState}
            validationSchema={valiationSchema}
            onSubmit={(values) => onSubmit(values)}
          >
            {({
              handleSubmit,
              errors,
              values,
              isSubmitting,
              touched,
              handleBlur,
              handleChange,
            }) => (
              <>
                <View>
                  <Text style={styles.errors}>
                    {errors.code && touched.code && errors.code}
                  </Text>
                  <TextInput
                    style={styles.input}
                    maxLength={10}
                    onChangeText={handleChange("code")}
                    onBlur={handleBlur("code")}
                    value={values.code}
                  />
                </View>

                <Buttons
                  onClick={() => handleSubmit()}
                  label={"Acceder au vote"}
                  disabled={!values.code || errors.code}
                />
              </>
            )}
          </Formik>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: Colors.DEFAULT_BLUE,
    height: heightPixel(300),
    width: width,
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  welcome: {
    fontFamily: Fonts.MANROPE_SEMIBOLD,
    color: "white",
    fontSize: fontPixel(20),
    top: pixelSizeVertical(50),
  },
  body: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: pixelSizeVertical(25),
  },
  input: {
    width: pixelSizeHorizontal(380),
    height: pixelSizeVertical(60),
    backgroundColor: "#999999",
    borderRadius: 5,
    fontFamily: Fonts.MANROPE_SEMIBOLD,
    paddingHorizontal: pixelSizeHorizontal(30),
    fontSize: fontPixel(24),
    justifyContent: "center",
    alignItems: "center",
  },
  errors: {
    color: "red",
    alignSelf: "center",
    fontFamily: Fonts.MANROPE_REGULAR,
    marginVertical: pixelSizeVertical(10),
    height: heightPixel(15),
  },
});

//make this component available to the app
export default Login;
