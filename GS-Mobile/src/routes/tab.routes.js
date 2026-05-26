import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import EstadoPlan from "../srceens/EstadoPlan";
import Home from "../srceens/Home";
import Perfil from "../srceens/Perfil";
import Plantacao from "../srceens/Plantacao";
import Sobre from "../srceens/Sobre";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111111",
          borderTopWidth: 1,
          borderTopColor: "#2A2A2A",
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#C8A96E",
        tabBarInactiveTintColor: "#555",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 1,
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={Home}
        options={{
          tabBarLabel: "INÍCIO",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="plantacao"
        component={Plantacao}
        options={{
          tabBarLabel: "PLANTAÇÃO",
          tabBarIcon: ({ color, size }) => (
            <Feather name="sun" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="EstadoPlan"
        component={EstadoPlan}
        options={{
          tabBarLabel: "ESTADO",
          tabBarIcon: ({ color, size }) => (
            <Feather name="activity" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Sobre"
        component={Sobre}
        options={{
          tabBarLabel: "SOBRE",
          tabBarIcon: ({ color, size }) => (
            <Feather name="info" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarLabel: "PERFIL",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}