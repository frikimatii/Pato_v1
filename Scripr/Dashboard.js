import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button } from "react-native";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../database/firebase_cong";

export default function Dashboard({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const q = query(collection(db, "User_new"), where('email', '==', user.email));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0].data();
                        setUserData(userDoc);
                    } else {
                        console.log("No Such Document!");
                    }
                } catch (error) {
                    console.error("Error fetching user data", error);
                } finally {
                    setLoading(false);
                }
            } else {
                console.log("No authenticated user found.");
                navigation.navigate("Log");
            }
        };
        fetchUserData();
    }, [auth, navigation]);

    const handleSignOut = () => {
        auth.signOut().then(() => {
            navigation.navigate("Log");
        }).catch((error) => {
            console.error("Error Signing Out: ", error);
        });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#a000ff" />;
    }

    if (!userData) {
        return <Text>No user data found</Text>;
    }

    return (
        <View>
            <Text>Dashboard</Text>
            <View>
                <Text>User: {userData.user}</Text>
                <Text>Email: {userData.email}</Text>
            </View>
            <View>
                <Text>Games</Text>
                <Button
                    title="Game-1"
                    onPress={() => navigation.navigate("Game-1", { userData: userData })} />

                <Button
                    title="Game-2"
                    onPress={() => navigation.navigate("Game2", { userData: userData })} />

                <Button
                    title="Game-3"
                    onPress={() => navigation.navigate("Game3", { userData: userData })} />

                <Button
                    title="Game-4"
                    onPress={() => navigation.navigate("Game4", { userData: userData })} />

                <Button
                    title="Game-5"
                    onPress={() => navigation.navigate("Game5", { userData: userData })} />
            </View>
            <Button
                title="Sign Out"
                onPress={handleSignOut} />
        </View>
    );
}
