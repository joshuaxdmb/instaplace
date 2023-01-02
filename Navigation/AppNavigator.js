import { NavigationContainer } from "@react-navigation/native";
import LandingScreen from "../Screens/LandingScreen";
import { createStackNavigator } from "@react-navigation/stack";
import RegisterScreen from "../Screens/RegisterScreen";
import LoginScreen from "../Screens/LoginScreen";
import FeedScreen from "../Screens/FeedScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "../Screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import AddScreen from "../Screens/AddScreen";
import SaveScreen from "../Screens/SaveScreen";
import SearchScreen from "../Screens/SearchScreen";
import PostScreen from "../Screens/PostScreen";
import AddProfilePhotoScreen from "../Screens/AddProfilePhotoScreen";
import { View } from "react-native";
import { AppleColorsDark, defaultColors } from "../Constants/Colors";
import PostLocationScreen from "../Screens/PostLocationScreen";

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const MainStack = createStackNavigator();

const EmptyScreen = () => {
  return null;
};

const BottomNavigator = (props) => {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: defaultColors.background,
          borderTopWidth: 0.25,
          marginBottom: 5,
        },
        tabBarActiveTintColor: "white",
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="md-person-circle-outline"
              color={color}
              size={size}
            />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="Add"
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("MainAdd");
          },
        })}
        component={EmptyScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size} />
          ),
          tabBarShowLabel: false,
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
          tabBarShowLabel: false,
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = (props) => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="BottomNavigator"
        component={BottomNavigator}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="MainAdd"
        component={AddScreen}
        options={{ title: "" }}
      />
      <MainStack.Screen name="Save" component={SaveScreen} />
      <MainStack.Screen
        name="OtherProfile"
        component={ProfileScreen}
        options={{ title: "" }}
      />
      <MainStack.Screen
        name="ProfileFeed"
        component={FeedScreen}
        options={{ title: "" }}
      />
      <MainStack.Screen
        name="PostScreen"
        component={PostScreen}
        options={{
          title: "Comments",
          gestureEnabled: true,
          detachPreviousScreen: false,
        }}
      />
      <MainStack.Screen
        name="PostLocationScreen"
        component={PostLocationScreen}
        options={{
          title: "Location",
          gestureEnabled: true,
          detachPreviousScreen: false,
        }}
      />
    </MainStack.Navigator>
  );
};

const AppNavigator = (props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddProfilePhoto"
          component={AddProfilePhotoScreen}
          options={{ title: "" }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
