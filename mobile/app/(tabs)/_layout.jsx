import { Redirect, Tabs } from "expo-router" // Stack 像網頁的「前進 / 返回」機制，讓你可以在螢幕間前後切換
import { useAuth } from "@clerk/clerk-expo"

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const TabsLayout = () => {
  // 讀取目前使用者的身份認證狀態（auth state） 知道「使用者有沒有登入」
  const { isSignedIn, isLoaded } = useAuth(); 

  if (!isLoaded) return null;

  // 如果使用者還沒登入，就把他導回 /sign-in 頁面（在 auth 資料夾裡）
  // 如果登入了，就顯示 <Stack />，也就是這個 tab 下的子頁面會開始顯示 或是直接寫成顯示<Tabs />
  if (!isSignedIn) return <Redirect href={"/(auth)/sign-in"} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        }
      }}
    >

      {/* How many Tabs do you want, Add here */}
      {/* 設計 底部的 Tab Navigator */}
      {/* 意思是 當使用者瀏覽 /、/search、/favorites 時，都會在相同的 Tab Layout 中切換畫面 */}
      <Tabs.Screen
        name="index" // should match with the .jsx file name
        options={{
          title: "Recipes",
          tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search" // should match with the .jsx file name
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites" // should match with the .jsx file name
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
};
  

export default TabsLayout