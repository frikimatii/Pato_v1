import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  doc,
  updateDoc,
  increment,
  getDocs,
  query,
  where,
  collection,
} from "firebase/firestore";
import { auth, db } from "../../database/firebase_cong";
import rueda from "../../img/ruedacolor.png";
import Animated, { Easing, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from "react-native-reanimated";
import { Audio } from "expo-av";

const initialDuration = 2000;
const fastDuration = 500;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

export default function Game1({ navigation }) {
  const sv = useSharedValue(0);
  const [sound, setSound] = useState(null);

  const [points, setPoints] = useState(0);
  const [userDocId, setUserDocId] = useState(null);

  useEffect(() => {
    const loadUserPoints = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const q = query(
            collection(db, "User_new"),
            where("email", "==", user.email)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setPoints(userDoc.data().moneda1 || 0);
            setUserDocId(userDoc.id);
          } else {
            console.log("No user data found");
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      } else {
        Alert.alert("Error", "No se encontró un usuario autenticado.");
        navigation.navigate("Log");
      }
    };

    loadUserPoints();
  }, [navigation]);

  useEffect(() => {
    // Configurar la animación inicial para que gire indefinidamente
    sv.value = withRepeat(
      withTiming(1, { duration: initialDuration, easing }),
      -1,
      false
    );
  }, [sv]);

  // Preload the sound when the component mounts
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(require('../../sound/tap_ruleta.wav'));
        setSound(sound);
      } catch (error) {
        console.error("Error loading sound: ", error);
      }
    };

    loadSound();

    return () => {
      // Unload the sound when the component unmounts
      if (sound) {
        console.log("Unloading Sound");
        sound.unloadAsync();
      }
    };
  }, []);

  const playSound = async () => {
    try {
      if (sound) {
        console.log("Playing Sound");
        await sound.replayAsync(); // replayAsync ensures it plays from the start
      }
    } catch (error) {
      console.error("Error playing sound: ", error);
    }
  };

  const handlePress = async () => {
    playSound();

    // Temporarily speed up the animation
    sv.value = withTiming(sv.value + 1, { duration: fastDuration, easing }, () => {
      // After speeding up, adjust the animation to keep rotating
      sv.value = withRepeat(
        withTiming(sv.value + 1, { duration: initialDuration, easing }),
        -1,
        false
      );
    });

    // Update points in Firebase
    if (userDocId) {
      try {
        const userRef = doc(db, "User_new", userDocId);
        await updateDoc(userRef, {
          moneda1: increment(1),
        });
        setPoints((prevPoints) => prevPoints + 1);
      } catch (error) {
        console.error("Error updating points: ", error);
      }
    }
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sv.value * 360}deg` }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Text style={styles.title}>Ruleta</Text>
        <Text style={styles.subtitle}>Gira la ruleta y gana puntos</Text>
      </View>
      <TouchableOpacity onPress={handlePress} style={styles.boxruleta}>
        <Animated.Image source={rueda} style={[styles.img, animatedStyles]} />
      </TouchableOpacity>
      <Text style={styles.coin}>Puntos</Text>
      <Text style={styles.coinpuntos}>{points}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#1e1f26",
  },
  nav: {
    backgroundColor: "#ffffff",
    width: "100%",
    paddingVertical: 30,
    alignItems: "center",
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginTop: 5,
  },
  boxruleta: {
    marginTop: 50,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  img: {
    width: 350,
    height: 350,
    borderRadius: 150,
    marginTop: 100,
  },
  coin: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  coinpuntos: {
    color: "#FFD700", // Dorado
    fontSize: 48,
    fontWeight: "bold",
  },
});
