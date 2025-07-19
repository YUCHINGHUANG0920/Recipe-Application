// every tab has different screen

import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import { MealAPI } from "../../services/mealAPI";

import { homeStyles } from "../../assets/styles/home.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

import CategoryFilter from "../../components/CategoryFilter";
import RecipeCard from "../../components/RecipeCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const HomeScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const [apiCategories, randomMeals, featuredMeal] = await Promise.all([
        MealAPI.getCategories(),
        MealAPI.getRandomMeals(12),
        MealAPI.getRandomMeal(),
      ]);

      const transformedCategories = apiCategories.map((cat, index) => ({
        id: index + 1,
        name: cat.strCategory,
        image: cat.strCategoryThumb,
        description: cat.strCategoryDescription,
      }));

      setCategories(transformedCategories);

      // // set the default category as the first one when you enter the index page first time
      // if (!selectedCategory) setSelectedCategory(transformedCategories[0].name);

      const transformedMeals = randomMeals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);

      setRecipes(transformedMeals);

      const transformedFeatured = MealAPI.transformMealData(featuredMeal);
      setFeaturedRecipe(transformedFeatured); 
    } catch (error) {
      console.log("Error loading the data", error);
    } finally {
      setLoading(false);
    }
  };

  // use different category to get different random recipes
  const loadCategoryData = async (category) => {
    try {
      const meals = await MealAPI.filterByCategory(category);
      const transformedMeals = meals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);
      setRecipes(transformedMeals);
    } catch (error) {
      console.error("Error loading category data:", error);
      setRecipes([]);
    }
  };

  // for changing the category data when we press it
  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);      // 更新選中的分類（state）
    await loadCategoryData(category);   // 根據分類 去後端抓資料
  };
  
  // for refreshing the page
  const onRefresh = async () => {
    setRefreshing(true);
    await sleep(1000);
    await loadData();
    setRefreshing(false);
  };

  // when loading into index page, trigger loadData
  useEffect(() => {
    loadData();
  }, []);

  // 尚未完成資料載入時 設計顯示 loading spinner
  if (loading && !refreshing) return <LoadingSpinner message="Loading delicions recipes..." />;

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/* ICONS */}
        <View style={homeStyles.welcomeSection}>
          <Image
            source={require("../../assets/images/d1.png")}
            style={{
              width: 60,
              height: 60,
            }}
          />
          <Image
            source={require("../../assets/images/d2.png")}
            style={{
              width: 60,
              height: 60,
            }}
          />
          <Image
            source={require("../../assets/images/d3.png")}
            style={{
              width: 60,
              height: 60,
            }}
          />
          <Image
            source={require("../../assets/images/d4.png")}
            style={{
              width: 60,
              height: 60,
            }}
          />
          <Image
            source={require("../../assets/images/d5.png")}
            style={{
              width: 60,
              height: 60,
            }}
          />
        </View>

        {/* 分隔線 */}
        <View
          style={{
            height: 1,
            backgroundColor: '#ccc',
            marginVertical: 1,
            opacity: 0.5,
          }}
        />
        <View
          style={{
            height: 1,
            backgroundColor: '#ccc',
            marginVertical: 1,
            opacity: 0.5,
          }}
        />

        {/* FEATURED SECTION */}
        {featuredRecipe && (
          <View style={homeStyles.featuredSection}>
            <TouchableOpacity
              style={homeStyles.featuredCard}
              activeOpacity={0.9}
              onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
            >
              <View style={homeStyles.featuredImageContainer}>
                <Image
                  source={{ uri: featuredRecipe.image }}
                  style={homeStyles.featuredImage}
                  contentFit="cover"
                  transition={500}
                />
                {/* 以下為了加上recipe details 都在featuredImageContainer中 */}
                <View style={homeStyles.featuredOverlay}>
                  <View style={homeStyles.featuredBadge}>
                    <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                  </View>

                  <View style={homeStyles.featuredContent}>
                    <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                      {featuredRecipe.title}
                    </Text>
                    {/* belowing, the time and servings are default */}
                    <View style={homeStyles.featuredMeta}>
                      <View style={homeStyles.metaItem}>
                        <Ionicons name="time-outline" size={16} color={COLORS.white} />
                        <Text style={homeStyles.metaText}>{featuredRecipe.cookTime}</Text>
                      </View>
                      <View style={homeStyles.metaItem}>
                        <Ionicons name="people-outline" size={16} color={COLORS.white} />
                        <Text style={homeStyles.metaText}>{featuredRecipe.servings}</Text>
                      </View>
                      {featuredRecipe.area && (
                        <View style={homeStyles.metaItem}>
                          <Ionicons name="location-outline" size={16} color={COLORS.white} />
                          <Text style={homeStyles.metaText}>{featuredRecipe.area}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* CATEGORIES SECTION */}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}

        {/* RANDOM REVEPIES SECTION */}
        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
          </View>
          
          {/* 目前有抓到食譜資料的話... */}
          {/* 用 <FlatList /> 來呈現食譜卡片清單 */}
          <FlatList
            data={recipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}  // 用 RecipeCard 組件渲染每道食譜 這邊 item的命名是固定的不可變的
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}                                           // 兩欄的網格形式
            columnWrapperStyle={homeStyles.row}
            contentContainerStyle={homeStyles.recipesGrid}
            scrollEnabled={false}                                    // 關閉列表本身的滾動，讓父層的 ScrollView 控制滾動
            // 如果沒抓到食譜資料的話...
            ListEmptyComponent={
              <View style={homeStyles.emptyState}>
                <Ionicons name="restaurant-outline" size={64} color={COLORS.textLight} />
                <Text style={homeStyles.emptyTitle}>No recipes found</Text>
                <Text style={homeStyles.emptyDescription}>Try a different category</Text>
              </View>
            }
            />
          
        </View>
      </ScrollView>
    </View>
  );
};
export default HomeScreen;