import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PropertyStackParamList } from "./types";
import PropertiesListScreen from "../screens/properties/PropertiesListScreen";
import PropertyDetailScreen from "../screens/properties/PropertyDetailScreen";
import PropertyDocumentsScreen from "../screens/properties/PropertyDocumentsScreen";

const Stack = createNativeStackNavigator<PropertyStackParamList>();

const PropertyNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="PropertiesList"
        component={PropertiesListScreen}
        options={{ title: "My Properties" }}
      />
      <Stack.Screen
        name="PropertyDetail"
        component={PropertyDetailScreen}
        options={{ title: "Property Details" }}
      />
      <Stack.Screen
        name="PropertyDocuments"
        component={PropertyDocumentsScreen}
        options={{ title: "Documents" }}
      />
    </Stack.Navigator>
  );
};

export default PropertyNavigator;
