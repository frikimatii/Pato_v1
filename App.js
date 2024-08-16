import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Log from "./Scripr/Log";
import Sign from "./Scripr/SIng";
import Dashboard from "./Scripr/Dashboard";
import Game1 from "./Scripr/Game/Game1";
import Game2 from "./Scripr/Game/Game2";
import Game3 from "./Scripr/Game/Game3";
import Game4 from "./Scripr/Game/Game4";
import Game5 from "./Scripr/Game/Game5";
import Scoore from "./Scripr/Scoore";
import Pets from "./Scripr/Game/Pest";
import Index from "./Scripr/Index";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Log" component={Log} />
        <Stack.Screen name="Sign" component={Sign} />
        <Stack.Screen name="Game-1" component={Game1} />
        <Stack.Screen name="Game-2" component={Game2} />
        <Stack.Screen name="Game-4" component={Game4} />
        <Stack.Screen name="Game-3" component={Game3} />
        <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="Game-5" component={Game5} />
        <Stack.Screen name="Scoore" component={Scoore} />
        <Stack.Screen name="Pets" component={Pets} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
