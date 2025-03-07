import {useState} from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useRouter} from 'expo-router';
import {Check, Image as ImageIcon, X} from 'lucide-react-native';
import {PostService} from '@/services/PostService';
import * as ImagePicker from 'expo-image-picker';
import {MediaTypeOptions} from 'expo-image-picker';

export default function CreatePostScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageName, setImageName] = useState('');
    const [imageType, setImageType] = useState('');
    const [errors, setErrors] = useState({title: '', content: ''});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {title: '', content: ''};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
            isValid = false;
        }

        if (!content.trim()) {
            newErrors.content = 'Content is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const pickImage = async () => {
        // Request permission
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setImageName(result.assets[0].fileName || 'image.jpg');
            setImageType(result.assets[0].mimeType || 'image/jpeg');
        }
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                setIsSubmitting(true);
                const image = imageUri ? {
                    uri: imageUri,
                    name: imageName,
                    type: imageType
                } : undefined;
                await PostService.createPost(
                    {title, content},
                    image
                ).then((success)=>router.push('/posts'))
                .catch((err) => {

                    console.log("Request Payload:", err.config.data);
                    console.log("Request Headers:", err.config.headers);
                    if (err.response) {
                        console.error("Server responded with error:", err.response.data);
                    } else if (err.request) {
                        console.error("No response received from server. Check network connectivity.");
                        console.error("Request Details:", err.request);
                    } else {
                        console.error("Unexpected error occurred:", err.message);
                    }
                })


                Alert.alert(
                    "Success",
                    "Post created successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => router.push(`/posts`)
                        }
                    ]
                );
            } catch (error) {
                console.error('Error creating post:', error);
                Alert.alert(
                    "Error",
                    "Failed to create post. Please check your connection and try again."
                );
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={[styles.input, errors.title ? styles.inputError : null]}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter post title"
                    />
                    {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Content</Text>
                    <TextInput
                        style={[styles.textArea, errors.content ? styles.inputError : null]}
                        value={content}
                        onChangeText={setContent}
                        placeholder="Enter post content"
                        multiline
                        numberOfLines={10}
                        textAlignVertical="top"
                    />
                    {errors.content ? <Text style={styles.errorText}>{errors.content}</Text> : null}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Image (Optional)</Text>
                    <TouchableOpacity
                        style={styles.imagePicker}
                        onPress={pickImage}
                    >
                        {imageUri ? (
                            <Image source={{uri: imageUri}} style={styles.previewImage}/>
                        ) : (
                            <View style={styles.imagePickerPlaceholder}>
                                <ImageIcon size={24} color="#666"/>
                                <Text style={styles.imagePickerText}>Tap to select an image</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    {imageUri && (
                        <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={() => setImageUri(null)}
                        >
                            <Text style={styles.removeImageText}>Remove Image</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => router.back()}
                        disabled={isSubmitting}
                    >
                        <X size={20} color="#FF3B30"/>
                        <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.submitButton,
                            isSubmitting && styles.disabledButton
                        ]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <Check size={20} color="#fff"/>
                        <Text style={styles.buttonText}>
                            {isSubmitting ? 'Creating...' : 'Create Post'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    formContainer: {
        padding: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 150,
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        marginTop: 5,
    },
    imagePicker: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
    },
    imagePickerPlaceholder: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePickerText: {
        marginTop: 8,
        color: '#666',
    },
    previewImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    removeImageButton: {
        marginTop: 8,
        alignSelf: 'flex-end',
    },
    removeImageText: {
        color: '#FF3B30',
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
    },
    submitButton: {
        backgroundColor: '#007AFF',
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    disabledButton: {
        backgroundColor: '#B0C4DE',
        opacity: 0.7,
    },
    buttonText: {
        fontWeight: 'bold',
        marginLeft: 8,
        color: '#fff',
    },
    cancelButtonText: {
        color: '#FF3B30',
    },
});