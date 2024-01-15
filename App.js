import { NavigationContainer } from '@react-navigation/native';
import {MainNavigator} from "./src/navigation/navigation";

export default function App() {
  return (
      <NavigationContainer>
       <MainNavigator />
      </NavigationContainer>
  );
}

