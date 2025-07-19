import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";
import { homeStyles } from "../assets/styles/home.styles";

function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <View style={homeStyles.categoryFilterContainer}>
      <ScrollView
        horizontal // 可橫向滑動
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={homeStyles.categoryFilterScrollContent}
      >
        {/* go through each catagory */}
        {/* 判斷目前這個分類是不是被選取的，用來套用不同的 style */}
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;
          return (
            <TouchableOpacity
              key={category.id}
              style={[homeStyles.categoryButton, isSelected && homeStyles.selectedCategory]}
              onPress={() => onSelectCategory(category.name)} 
              // 當使用者點擊某個分類按鈕時，就呼叫 onSelectCategory()，並把目前這個分類的名稱傳給它
              // 實際上是執行index.js中的handleCategorySelect 
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: category.image }}
                style={[homeStyles.categoryImage, isSelected && homeStyles.selectedCategoryImage]}
                contentFit="cover"
                transition={300}
              />
              <Text
                style={[homeStyles.categoryText, isSelected && homeStyles.selectedCategoryText]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}


export default CategoryFilter;