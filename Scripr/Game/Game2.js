import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image, Alert } from "react-native";
import { doc, updateDoc, increment, getDocs, query, where, collection } from "firebase/firestore";
import { auth, db } from "../../database/firebase_cong";

import Cara1 from "../../img/dado1.png";
import Cara2 from "../../img/dado2.png";
import Cara3 from "../../img/dado3.png";
import Cara4 from "../../img/dado4.png";
import Cara5 from "../../img/dado5.png";
import Cara6 from "../../img/dado6.png";

const list = [Cara1, Cara2, Cara3, Cara4, Cara5, Cara6];

const NumRan = () => Math.floor(Math.random() * 6) + 1;

export default function Game2({ navigation }) {
    const [resultado, setResultado] = useState(0);
    const [moneda2, setMoneda2] = useState(0);
    const [dado1, setDado1] = useState(null);
    const [dado2, setDado2] = useState(null);
    const [dado3, setDado3] = useState(null);
    const [userDocId, setUserDocId] = useState(null);

    useEffect(() => {
        const loadUserMoneda2 = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    // Buscamos el documento por correo electrónico
                    const q = query(collection(db, "User_new"), where("email", "==", user.email));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        setMoneda2(userDoc.data().moneda2 || 0); // Cargar los puntos actuales
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

        loadUserMoneda2();
    }, [navigation]);

    const Tirar = async () => {
        const n1 = NumRan();
        const n2 = NumRan();
        const n3 = NumRan();
        const total = n1 + n2 + n3;

        setResultado(total);
        setDado1(list[n1 - 1]);
        setDado2(list[n2 - 1]);
        setDado3(list[n3 - 1]);

        if (userDocId) {
            try {
                const userRef = doc(db, "User_new", userDocId);
                await updateDoc(userRef, {
                    moneda2: increment(total)
                });
                setMoneda2(prevMoneda2 => prevMoneda2 + total);
            } catch (error) {
                console.error("Error updating moneda2: ", error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text>Game 2</Text>
            <View style={styles.caja}>
                <Image style={styles.dado} source={dado1 || Cara1} />
                <Image style={styles.dado} source={dado2 || Cara2} />
                <Image style={styles.dado} source={dado3 || Cara3} />
            </View>
            <View>
                <Text>Resultado: {resultado}</Text>
                <Text>Puntos Totales: {moneda2}</Text>
            </View>
            <Button title="TIRA" onPress={Tirar} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    caja: {
        flexDirection: "row",
        alignItems: "center",
    },
    dado: {
        margin: 15,
        height: 100,
        width: 100,
    }
});
