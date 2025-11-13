import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform
} from "react-native";

const getApiUrl = () => {
    return 'http://192.168.9.168:8080';
};

const API_URL = getApiUrl();

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        console.log('Starting sign up process...');
        
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (!username || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        
        try {
            console.log('Attempting to connect to:', `${API_URL}/api/users/register`);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                console.log('Request timed out after 15 seconds');
                controller.abort();
            }, 15000); 

            const response = await fetch(`${API_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            console.log('Response received with status:', response.status);

            const responseText = await response.text();
            console.log('Response status:', response.status);
            console.log('Response body:', responseText);
            console.log('Response headers:', JSON.stringify([...response.headers]));

            let data;
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                console.error('Raw response:', responseText);
                throw new Error(`Invalid server response: ${responseText}`);
            }

            if (response.ok) {
                console.log('Registration successful!');
                Alert.alert(
                    'Success', 
                    'Account created successfully!', 
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                console.log('Navigating to focus screen...');
                                router.push('/focusScreen');
                            }
                        }
                    ]
                );
            } else {
                console.error('Registration failed with status:', response.status);
                console.error('Error data:', JSON.stringify(data));
                
                let errorMsg = 'Please try again';
                
                if (response.status === 400) {
                    errorMsg = data.message || data.error || 'Invalid input. Please check your details.';
                } else if (response.status === 409) {
                    errorMsg = 'Username or email already exists';
                } else if (response.status === 500) {
                    errorMsg = 'Server error. Please try again later.';
                } else if (data.message || data.error) {
                    errorMsg = data.message || data.error;
                }
                
                Alert.alert('Registration Failed', errorMsg);
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            
            let errorMessage = 'An unexpected error occurred';
            
            if (error.name === 'AbortError') {
                errorMessage = `Connection timeout. Please check:\n\n1. Backend is running on port 8080\n2. Using correct URL: ${API_URL}\n3. No firewall blocking the connection`;
            } else if (error.message?.includes('Network request failed')) {
                errorMessage = `Cannot reach server at ${API_URL}\n\nMake sure:\n1. Backend server is running\n2. You're using the correct IP address`;
            } else {
                errorMessage = error.message || 'Please try again';
            }
            
            Alert.alert('Connection Error', errorMessage);
        } finally {
            console.log('Resetting loading state');
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../assets/images/background.png')} 
            style={styles.background}
        >
            <View style={styles.container}>
                <View style={styles.signupBox}>
                    <Text style={styles.title}>Create Account</Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#666"
                        autoCapitalize="words"
                        value={username}
                        onChangeText={setUsername}
                        editable={!loading}
                    />

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

                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#666"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        editable={!loading}
                    />
                    
                    <TouchableOpacity 
                        style={[styles.signupButton, loading && styles.disabledButton]}
                        onPress={handleSignUp}
                        disabled={loading}
                    >
                        <Text style={styles.signupButtonText}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    disabledButton: {
        backgroundColor: '#cccccc',
        opacity: 0.7,
    },
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
    signupBox: {
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
    signupButton: {
        backgroundColor: '#007AFF',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    signupButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    loginContainer: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
    },
    loginText: {
        color: '#666',
        fontSize: 14,
    },
    loginLink: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    }
});