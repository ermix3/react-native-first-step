import {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, Platform} from 'react-native';
import {useRouter} from 'expo-router';
import {Plus, CreditCard as Edit2, Trash2} from 'lucide-react-native';
import {PostService} from '@/services/PostService';
import {Post} from '@/models/Post';

export default function PostsScreen() {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPosts();
    }, []);
 
    const loadPosts = async () => {
        try {
            setLoading(true);
            const allPosts = await PostService.getPosts();
            console.log("allPosts", allPosts);
            
            setPosts(allPosts);
        } catch (error) {
            console.error('Error loading posts:', error);
            Alert.alert("Error", "Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (id: number) => {
        if (Platform.OS == "web") {
            PostService.deletePost(id)
                .then(_ => router.push('/posts'));
        }

        Alert.alert(
            "Delete Post",
            "Are you sure you want to delete this post?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const success = await PostService.deletePost(id);
                            if (success) {
                                loadPosts();
                            } else {
                                Alert.alert("Error", "Failed to delete post");
                            }
                        } catch (error) {
                            console.error('Error deleting post:', error);
                            Alert.alert("Error", "Failed to delete post");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const renderItem = ({item}: { item: Post }) => (
        <View style={styles.postItem}>
            <TouchableOpacity
                style={styles.postContent}
                onPress={() => router.push(`/posts/${item.id}`)}
            >
                <View style={styles.postTextContent}>
                    <Text style={styles.postTitle}>{item.title}</Text>
                    <Text style={styles.postPreview} numberOfLines={2}>
                        {item.content}
                    </Text>
                </View>

                {item.imageUrl && (
                    <View style={styles.thumbnailContainer}>
                        <Image
                            source={{uri: item.imageUrl}}
                            style={styles.thumbnail}
                            resizeMode="cover"
                        />
                    </View>
                )}
            </TouchableOpacity>
            <View style={styles.postActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => router.push({pathname: '/posts/edit', params: {id: item.id}})}
                >
                    <Edit2 size={16} color="#fff"/>
                    <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeletePost(item.id!)}
                >
                    <Trash2 size={16} color="#fff"/>
                    <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>All Posts</Text>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => router.push('/posts/create')}
                >
                    <Plus size={18} color="#fff"/>
                    <Text style={styles.createButtonText}>New Post</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text>Loading posts...</Text>
                </View>
            ) : posts.length > 0 ? (
                <FlatList
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id!.toString()}
                    contentContainerStyle={styles.listContainer}
                    onRefresh={loadPosts}
                    refreshing={loading}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No posts yet</Text>
                    <TouchableOpacity
                        style={styles.createFirstButton}
                        onPress={() => router.push('/posts/create')}
                    >
                        <Text style={styles.createFirstButtonText}>Create your first post</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    createButtonText: {
        color: '#fff',
        marginLeft: 5,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 15,
    },
    postItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    postContent: {
        marginBottom: 10,
        flexDirection: 'row',
    },
    postTextContent: {
        flex: 1,
        marginRight: 10,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    postPreview: {
        fontSize: 14,
        color: '#666',
    },
    thumbnailContainer: {
        width: 80,
        height: 80,
        borderRadius: 5,
        overflow: 'hidden',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginLeft: 10,
    },
    editButton: {
        backgroundColor: '#34C759',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    actionButtonText: {
        color: '#fff',
        marginLeft: 5,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#8E8E93',
        marginBottom: 15,
    },
    createFirstButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
    },
    createFirstButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});