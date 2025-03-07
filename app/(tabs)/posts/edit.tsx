import {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image, Platform} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {Check, X, Image as ImageIcon} from 'lucide-react-native';
import {PostService} from '@/services/PostService';
import * as ImagePicker from 'expo-image-picker';

export default function EditPostScreen() {
    const {id} = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [post, setPost] = useState<PostResponse | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageName, setImageName] = useState('');
    const [imageType, setImageType] = useState('');
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState({title: '', content: ''});
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            if (id) {
                try {
                    const postId = parseInt(id);
                    const foundPost = await PostService.getPostById(postId);
                    if (foundPost) {
                        setPost(foundPost);
                        setTitle(foundPost.title);
                        setContent(foundPost.content);
                        if (foundPost.imageUrl) {
                            setExistingImageUrl(foundPost.imageUrl);
                        }
                    } else {
                        Alert.alert("Error", "Post not found");
                        router.back();
                    }
                } catch (error) {
                    console.error('Error fetching post:', error);
                    Alert.alert("Error", "Failed to load post");
                    router.back();
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPost();
    }, [id]);

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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setImageName(result.assets[0].fileName || 'image.jpg');
            setImageType(result.assets[0].mimeType || 'image/jpeg');
            setExistingImageUrl(null); // Clear existing image when new one is selected
        }
    };

    const handleSubmit = async () => {
        if (!post?.id) return;

        if (validateForm()) {
            try {
                setIsSubmitting(true);
                const image = imageUri ? {
                    uri: imageUri,
                    name: imageName,
                    type: imageType
                } : undefined;
                const updatedPost = await PostService.updatePost(
                    {
                        id: post.id,
                        title,
                        content,
                        imageUrl: existingImageUrl || undefined
                    },
                    image
                );


                if (updatedPost) {
                    router.push('/posts')
                    Alert.alert(
                        "Success",
                        "Post updated successfully",
                        [
                            {
                                text: "OK",
                                onPress: () => router.push('/posts')
                            }
                        ]
                    );
                } else {
                    Alert.alert("Error", "Failed to update post");
                }
            } catch (error) {
                console.error('Error updating post:', error);
                Alert.alert("Error", "Failed to update post");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!post) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Post not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backLink}>Go back</Text>
                </TouchableOpacity>
            </View>
        );
    }

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
                        ) : existingImageUrl ? (
                            <Image source={{uri: `data:image/jpeg;base64,${post.image}`}} style={styles.previewImage}/>
                        ) : (
                            <View style={styles.imagePickerPlaceholder}>
                                <ImageIcon size={24} color="#666"/>
                                <Text style={styles.imagePickerText}>Tap to select an image</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    {(imageUri || existingImageUrl) && (
                        <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={() => {
                                setImageUri(null);
                                setExistingImageUrl(null);
                            }}
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
                            {isSubmitting ? 'Updating...' : 'Update Post'}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#FF3B30',
        marginBottom: 10,
    },
    backLink: {
        color: '#007AFF',
        fontSize: 16,
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