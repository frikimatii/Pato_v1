import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import { doc, updateDoc, increment, getDocs, query, where, collection } from "firebase/firestore";
import { auth, db } from "../../database/firebase_cong";

export default function Game1({ navigation }) {
    const [points, setPoints] = useState(0);
    const [userDocId, setUserDocId] = useState(null);

    useEffect(() => {
        const loadUserPoints = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    // Buscamos el documento por correo electrónico
                    const q = query(collection(db, "User_new"), where("email", "==", user.email));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        setPoints(userDoc.data().moneda1 || 0); // Cargar los puntos actuales
                        setUserDocId(userDoc.id); // Guardar el ID del documento
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
                    moneda1: increment(1)
                });
                setPoints(points + 1);
            } catch (error) {
                console.error("Error updating points: ", error);
            }
        }
    };

    return (
        <View>
            <Text>Game 1</Text>
            <Text>Puntos: {points}</Text>
            <Button title="Sumar Punto" onPress={addPoint} />
        </View>
    );
}
