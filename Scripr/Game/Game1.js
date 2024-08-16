import React, { useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet, Image, TouchableOpacity } from "react-native";
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

export default function Game1({ navigation }) {
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

  const addPoint = async () => {
    if (userDocId) {
      try {
        const userRef = doc(db, "User_new", userDocId);
        await updateDoc(userRef, {
          moneda1: increment(1),
        });
        setPoints(points + 1);
      } catch (error) {
        console.error("Error updating points: ", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Text style={styles.title}>Ruleta</Text>
        <Text style={styles.subtitle}>Gira la ruleta y gana puntos</Text>
      </View>

      <TouchableOpacity onPress={addPoint} style={styles.boxruleta}>
        <Image source={rueda} style={styles.img} />
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
    justifyContent: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  img: {
    width: 300,
    height: 300,
    borderRadius: 150,
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
