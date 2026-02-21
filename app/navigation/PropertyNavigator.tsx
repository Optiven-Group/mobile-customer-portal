import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../utils/colors";
import { PropertyStackParamList } from "./types";
import PropertiesListScreen from "../screens/properties/PropertiesListScreen";
import PropertyDetailScreen from "../screens/properties/PropertyDetailScreen";
import PropertyDocumentsScreen from "../screens/properties/PropertyDocumentsScreen";

const Stack = createNativeStackNavigator<PropertyStackParamList>();

const PropertyNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerRight: () => (
          <TouchableOpacity
            onPress={() => (navigation as any).navigate("Notifications")}
            style={{ marginRight: 15 }}
          >
            <MaterialCommunityIcons name="bell-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen
        name="PropertiesList"
        component={PropertiesListScreen}
        options={({ navigation }) => ({ 
          title: "My Properties",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => (navigation as any).openDrawer()}
            >
              <MaterialCommunityIcons name="menu" size={28} color={colors.primary} />
            </TouchableOpacity>
          ),
        })}
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
