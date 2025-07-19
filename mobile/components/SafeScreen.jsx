import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";

// children: the entire APP
// paddingTop: insets.top --> for calculating where the top boundary of the safearea is
const SafeScreen = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top, flex: 1, backgroundColor: COLORS.background }}>
      {children}
    </View>
  );
};
export default SafeScreen;