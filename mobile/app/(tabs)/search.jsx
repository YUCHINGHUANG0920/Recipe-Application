import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { MealAPI } from "../../services/mealAPI";
import { useDebounce } from "../../hooks/useDebounce";
import { searchStyles } from "../../assets/styles/search.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/RecipeCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 600);

  // Main Search Function
  const performSearch = async (query) => {
    // if no search query, show random recipes
    if (!query.trim()) {
      const randomMeals = await MealAPI.getRandomMeals(12);
      return randomMeals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);
    }

    // search by name first, then search by ingredient if no results
    const nameResults = await MealAPI.searchMealsByName(query);
    let results = nameResults;

    // search by ingredient if no results
    if (results.length === 0) {
      const ingredientResults = await MealAPI.filterByIngredient(query);
      results = ingredientResults;
    }

    return results
      .slice(0, 12)
      .map((meal) => MealAPI.transformMealData(meal))
      .filter((meal) => meal !== null);
  };

  // component 初次載入時
  // performSearch("")  因為第一次渲染 所以query是“”空字串
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const results = await performSearch("");
        setRecipes(results);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // 之後根據搜尋文字變化觸發
  // 會先setLoading(true) 所以UI會呈現LoadingSpinner 等load完 setLoading(false) UI就呈現結果
  useEffect(() => {
    if (initialLoading) return;
    const handleSearch = async () => {
      setLoading(true);
      try {
        const results = await performSearch(debouncedSearchQuery);
        setRecipes(results);
      } catch (error) {
        console.error("Error searching:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    handleSearch();
  }, [debouncedSearchQuery, initialLoading]);

  // 初次loading 尚未完成資料載入時 設計顯示 loading spinner
  if (initialLoading) return <LoadingSpinner message="Loading recipes..." />;

  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchSection}>
        <View style={searchStyles.searchContainer}>

          {/* Search Bar Section */}
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textLight}
            style={searchStyles.searchIcon}
          />
          <TextInput
            style={searchStyles.searchInput}
            placeholder="Search recipes, ingredients..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={searchStyles.clearButton}>
              <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          )}

        </View>
      </View>
      
      {/* Results Section */}
      <View style={searchStyles.resultsSection}>
        <View style={searchStyles.resultsHeader}>
          <Text style={searchStyles.resultsTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : "Popular Recipes"}
          </Text>
          <Text style={searchStyles.resultsCount}>{recipes.length} found</Text>
        </View>
        
        {/* 如果還在loading */}
        {loading ? (
          <View style={searchStyles.loadingContainer}>
            <LoadingSpinner message="Searching recipes..." size="small" />
          </View>
        ) : (
          // loading完之後 會呈現的東西
          <FlatList
            data={recipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={searchStyles.row}
            contentContainerStyle={searchStyles.recipesGrid}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NoResultsFound />} // 沒有結果的話
          />
        )}
      </View>
    </View>
  );
};
export default SearchScreen;

function NoResultsFound() {
  return (
    <View style={searchStyles.emptyState}>
      <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
      <Text style={searchStyles.emptyTitle}>No recipes found</Text>
      <Text style={searchStyles.emptyDescription}>
        Try adjusting your search or try different keywords
      </Text>
    </View>
  );
}