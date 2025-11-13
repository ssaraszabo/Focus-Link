import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const getApiUrl = () => {
    return 'http://192.168.9.168:8080';
};
const API_URL = getApiUrl();

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      console.log('Signing in to:', `${API_URL}/api/users/signin`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Sign-in request timed out after 15s');
        controller.abort();
      }, 15000);

      const requestBody = { email, password };
      console.log('Request body:', JSON.stringify(requestBody));

      const response = await fetch(`${API_URL}/api/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseText = await response.text();
      console.log('Sign-in status:', response.status);
      console.log('Sign-in raw body:', responseText);
      console.log('Response headers:', JSON.stringify([...response.headers]));

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Failed to parse sign-in response JSON:', e);
        throw new Error(`Invalid server response: ${responseText}`);
      }

      if (response.ok) {
        console.log('Sign-in successful:', data);
        router.push('/focusScreen');
      } else {
        console.error('Sign-in failed:', response.status, data);
        let msg = 'Sign in failed. Please try again';
        if (response.status === 400) msg = data.message || 'Invalid input';
        else if (response.status === 401) msg = 'Invalid credentials';
        else if (response.status === 500) msg = 'Server error. Try later';
        else if (data.message) msg = data.message;
        Alert.alert('Sign In Failed', msg);
      }
    } catch (error: any) {
      console.error('Sign-in error:', error);
      if (error.name === 'AbortError') {
        Alert.alert('Connection Error', `Request timed out. Check backend at ${API_URL}`);
      } else if (error.message?.includes('Network request failed')) {
        Alert.alert('Connection Error', `Cannot reach server at ${API_URL}. Make sure backend is running.`);
      } else {
        Alert.alert('Error', error.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ImageBackground
      source={require('../assets/images/background.png')} 
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.loginBox}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Signing In...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.SignUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.SignUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  SignUpText: {
    color: '#666',
    fontSize: 14,
  },
  SignUpLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});