//import liraries
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import { Images, Colors, Fonts, Configs } from "../constants";
import {
  heightPixel,
  fontPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from "../components/Scaling";
import { Buttons } from "../components/Button";

const { width } = Dimensions.get("screen");

// const election = {
//   title: "ELECTION DU PLUS GROS BOIS",
//   candidates: [
//     {
//       photo: require("../../assets/kfondio.jpg"),
//       name: "FONDIO Kimba",
//       promotion: 3,
//       year: 2019,
//       id: 1,
//     },
//     {
//       photo: require("../../assets/aurel.jpeg"),
//       name: "ATTERE Aurel",
//       promotion: 3,
//       year: 2019,
//       id: 3,
//     },
//     {
//       photo: require("../../assets/monsia.jpeg"),
//       name: "DOUGBAN Monsia",
//       promotion: 3,
//       year: 2019,
//       id: 4,
//     },
//     {
//       photo: require("../../assets/diomande.jpeg"),
//       name: "DIOMANDE Ahmadou",
//       promotion: 3,
//       year: 2019,
//       id: 2,
//     },
//   ],
// };

const Candidate = ({ candidate, hasVote, onVote }) => {
  const { first_name, last_name, id, picture } = candidate;
  return (
    <View
      key={id}
      style={{
        width: "45%",
        marginBottom: pixelSizeVertical(20),
        borderRadius: 10,
      }}
    >
      <Image
        resizeMode="cover"
        source={{ uri: picture }}
        style={{ width: "45", height: 200, borderRadius: 10 }}
      />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.text}>{first_name + " " + last_name}</Text>
          {/* <Text style={styles.text}>{`Promo ${promotion} (${year})`}</Text> */}
        </View>
        <Buttons
          onClick={() => onVote(candidate.id)}
          label={"VOTER"}
          color={Colors.DEFAULT_BLUE}
          disabled={hasVote}
          width={"100"}
          height={heightPixel(35)}
        />
      </View>
    </View>
  );
};

const Vote = ({ navigation, route }) => {
  const [candidates, setCandidates] = useState([]);
  const [currentVoter, setVoter] = useState([]);
  const [election, setElection] = useState(null);
  const { voter, token } = route.params;

  useEffect(() => {
    fetch(Configs.BASE_URL + "candidates")
      .then((res) => res.json())
      .then((data) => setCandidates(data))
      .catch((err) => console.log(err));

    fetch(Configs.BASE_URL + "subscribe-election")
      .then((res) => res.json())
      .then((data) => setVoter(data.find((v) => v.id === voter.id)))
      .catch((err) => console.log(err));

    fetch(Configs.BASE_URL + "elections/" + voter.election)
      .then((res) => res.json())
      .then((data) => {
        setElection(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const onVote = (candidate) => {
    fetch(Configs.BASE_URL + "vote/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token,
        candidate: candidate,
        election: election.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        Alert.alert(
          data.non_field_errors ? data.non_field_errors[0] : "Vous avez voté"
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          resizeMode="contain"
          source={Images.LOGO}
          style={{ width: widthPixel(160) }}
        />
        <View style={{ width: widthPixel(160) }}>
          <Text style={styles.election}>{election && election.name}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <FlatList
          numColumns={2}
          columnWrapperStyle={{
            flex: 1,
            justifyContent: "space-around",
          }}
          keyExtractor={(item, index) => item.id}
          data={candidates.filter(
            (cdt) => cdt.election === currentVoter.election
          )}
          renderItem={({ item }) => (
            <Candidate
              candidate={item}
              hasVote={currentVoter.has_voted}
              onVote={onVote}
            />
          )}
          style={{ flex: 1 }}
        />

        <Buttons
          onClick={() => navigation.goBack()}
          label={"Se deconnecter"}
          color={Colors.DEFAULT_RED}
        />
      </View>
    </View>
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
    height: heightPixel(150),
    width: width,
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: pixelSizeHorizontal(10),
  },
  election: {
    fontFamily: Fonts.MANROPE_REGULAR,
    color: "white",
    fontSize: fontPixel(16),
  },
  body: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: pixelSizeVertical(25),
  },
  text: { fontFamily: Fonts.MANROPE_BOLD, fontSize: fontPixel(16) },
});

//make this component available to the app
export default Vote;
