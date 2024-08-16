import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import { auth, db } from "../../database/firebase_cong";
import { doc, updateDoc, increment, getDocs, query, where, collection } from "firebase/firestore";

import siete from '../../img/siete.png';
import fichas from '../../img/fichas.png';
import star from '../../img/start.png';
import trebol from '../../img/trebol.png';
import cereza from '../../img/cereza.png';

const symbolsMap = {
  "🍒": cereza,
  "7": siete,
  "⭐": star,
  "🔔": fichas,
  "🍋": trebol,
};

export default function Game5() {
  const [puntos, setPuntos] = useState(0);
  const [carril1, setCarril1] = useState("🍒");
  const [carril2, setCarril2] = useState("🍒");
  const [carril3, setCarril3] = useState("🍒");
  const [userDocId, setUserDocId] = useState(null);

  useEffect(() => {
    const loadUserPoints = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const q = query(collection(db, "User_new"), where("email", "==", user.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setPuntos(userDoc.data().moneda5 || 0);
            setUserDocId(userDoc.id);
          } else {
            console.log("No user Data Found");
          }
        } catch (error) {
          console.log("Error Fetching user Data", error);
        }
      } else {
        Alert.alert("Error", "No se encontró un usuario autenticado");
      }
    };
    loadUserPoints();
  }, []);

  function getRandonSymbol() {
    const symbols = ["🍒", "🍋", "🔔", "⭐", "7"];
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  const spinReels = async () => {
    const newCarril1 = getRandonSymbol();
    const newCarril2 = getRandonSymbol();
    const newCarril3 = getRandonSymbol();

    setCarril1(newCarril1);
    setCarril2(newCarril2);
    setCarril3(newCarril3);

    setTimeout( async () => {
      if (newCarril1 === newCarril2 && newCarril2 === newCarril3) {
        console.log("GANO");
        if (userDocId) {
          try {
            const userRef = doc(db, "User_new", userDocId);
            await updateDoc(userRef, {
              moneda5: increment(7),
            });
            setPuntos((prevePunto) => prevePunto + 7);
          } catch (error) {
            console.error("Error Updating point: ", error);
          }
        }
      } else {
        console.log("NO Gano");
      }
    }, 500);
  };

  return (
    <View style={styles.container}>
    <View style={styles.nav}>
      <Text style={styles.title}>Ruleta</Text>
      <Text style={styles.subtitle}>Gira la ruleta y gana puntos</Text>
    </View>
      <View style={styles.reelContainer}>
        <Image source={symbolsMap[carril1]} style={styles.symbol} />
        <Image source={symbolsMap[carril2]} style={styles.symbol} />
        <Image source={symbolsMap[carril3]} style={styles.symbol} />
      </View>
      <TouchableOpacity onPress={spinReels} style={styles.button}>
        <Text style={styles.buttonText}>Tirar</Text>
      </TouchableOpacity>
      <Text style={styles.points}>Puntos: {puntos}</Text>
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
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333333",
  },
  reelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  symbol: {
    width: 80,
    height: 80,
  },
  button: {
    backgroundColor: '#8E44AD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  points: {
    fontSize: 24,
    color: '#fff',
    marginTop: 20,
  },
});
