import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CreditCard as Edit2, Trash2, ArrowLeft } from 'lucide-react-native';
import { PostService } from '@/services/PostService';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const postId = parseInt(id);
          const foundPost = await PostService.getPostById(postId);
          if (foundPost) {
            setPost(foundPost);
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

  const arrayBufferToBase64 = (buffer: Uint8Array) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return window.btoa(binary);
  };

  const handleDelete = async () => {
    if (!post?.id) return;
    
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
              const success = await PostService.deletePost(post.id!);
              if (success) {
                router.replace('/posts');
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
      <View style={styles.postHeader}>
        <Text style={styles.postTitle}>{post.title}</Text>
      </View>
      
      {post.image && (
        <View style={styles.imageContainer}>
          <Image 
            source={{uri:`data:image/jpeg;base64,${post.image}`}}
            style={styles.postImage}
            resizeMode="cover"
          />
        </View>
      )}
      
      <View style={styles.postContent}>
        <Text style={styles.postText}>{post.content}</Text>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => router.push({ pathname: '/posts/edit', params: { id: post.id } })}
        >
          <Edit2 size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Edit Post</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Trash2 size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Delete Post</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  postHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postContent: {
    padding: 20,
  },
  postText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#34C759',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});