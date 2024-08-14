import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { auth, db } from "../../database/firebase_cong";
import {
  doc,
  updateDoc,
  increment,
  getDocs,
  query,
  where,
  collection,
} from "firebase/firestore";

export default function Game5() {
  const [puntos, setPuntos] = useState(0);
  const [carril1, setCarril1] = useState("a");
  const [carril2, setCarril2] = useState("a");
  const [carril3, setCarril3] = useState("a");
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
            setPuntos(userDoc.data().moneda5 || 0);
            setUserDocId(userDoc.id);
          } else {
            console.log("No user Data Found");
          }
        } catch (error) {
          console.log("Error Fetching use Data", error);
        }
      } else {
        Alert.alert("Error", "No se encontro un usuario autenticado");
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

    setTimeout(() => {
      if (newCarril1 === newCarril2 && newCarril2 === newCarril3) {
        console.log("GANO");
        const add = async () => {
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
        };
        add()
      } else {
        console.log("NO Gano");
      }
    }, 500);
  };

  return (
    <View>
      <Text> TragaPerras</Text>
      <View>
        <View>
          <Text>{carril1}</Text>
          <Text>{carril2}</Text>
          <Text>{carril3}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={spinReels}>
        <Text>Jugar</Text>
      </TouchableOpacity>
      <Text>Puntos {puntos}</Text>
    </View>
  );
}
