import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";

const BlogPage = ({ route, navigation }) => {
  const { blog } = route.params || {};
  const [title, setTitle] = useState(blog ? blog.title : "");
  const [content, setContent] = useState(blog ? blog.content : "");
  const [pageState, setPageState] = useState(blog ? "edit" : "new");
  const [blogData, setBlogData] = useState(blog ? blog : {});
  const newBlog = async () => {
    if (!title || !content) {
      Alert.alert("Lỗi !! ", "Hãy nhập đầy đủ thông tin ", [
        {
          text: "OK",
        },
      ]);
      return;
    }

    let blogs = await AsyncStorage.getItem("blogs");
    blogs = JSON.parse(blogs) || [];
    let blogTempData = {
      title: title,
      content: content,
      id: new Date().getTime().toString(),
    };
    blogs.push(blogTempData);
    await AsyncStorage.setItem("blogs", JSON.stringify(blogs));
    Alert.alert("Đã Lưu !!!", "Blog của bạn đã lưu thành công ", [
      {
        text: "OK",
        onPress: () => navigation.navigate("Index"),
      },
    ]);
  };

  const editBlog = async () => {
    let blogs = await AsyncStorage.getItem("blogs");
    blogs = JSON.parse(blogs);
    let blogTempData = {
      ...blogData,
      title: title,
      content: content,
    };

    let blogIndex = blogs.findIndex((blog) => blog.id === blogData.id);
    blogs[blogIndex] = blogTempData;
    await AsyncStorage.setItem("blogs", JSON.stringify(blogs));
    Alert.alert("Đã Lưu !!!", "Blog của bạn đã lưu thành công ", [
      {
        text: "OK",
        onPress: () => navigation.navigate("Index"),
      },
    ]);
  };

  const deleteBlog = async () => {
    let blogs = await AsyncStorage.getItem("blogs");
    blogs = JSON.parse(blogs);
    let blogIndex = blogs.findIndex((blog) => blog.id === blogData.id);
    blogs.splice(blogIndex, 1);
    await AsyncStorage.setItem("blogs", JSON.stringify(blogs));
    Alert.alert("Đã Xoá !!!!", "Blog của bạn đã xoá thành công", [
      {
        text: "OK",
        onPress: () => navigation.navigate("Index"),
      },
    ]);
  };
  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View
            style={{
              backgroundColor: "#6169AC",
              padding: 10,
              marginTop: StatusBar.currentHeight,
            }}
          >
            <SafeAreaView>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (pageState === "new") {
                      newBlog();
                    } else {
                      editBlog();
                    }
                  }}
                >
                  <FontAwesome5 name="check" size={24} color="white" />
                </TouchableOpacity>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 30,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {pageState === "new"
                    ? title
                      ? title
                      : "Blog Mới"
                    : "Chỉnh Sửa"}
                </Text>
                {pageState === "edit" ? (
                  <TouchableOpacity
                    onPress={() => {
                      deleteBlog();
                    }}
                  >
                    <FontAwesome5 name="trash" size={24} color="white" />
                  </TouchableOpacity>
                ) : (
                  <View></View>
                )}
              </View>
            </SafeAreaView>
          </View>
          <View style={styles.container}>
            <SafeAreaView>
              <TextInput
                style={styles.input}
                placeholder="Tiêu đề"
                placeholderTextColor={"#777"}
                onChangeText={(text) => setTitle(text)}
                value={title}
              />
              <TextInput
                style={{ ...styles.input, fontSize: 16, marginTop: 20 }}
                placeholder="Hãy viết điều gì đó..."
                placeholderTextColor={"#777"}
                onChangeText={(text) => setContent(text)}
                value={content}
                multiline={true}
              />
            </SafeAreaView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "500%",
    backgroundColor: "#0B203E",
    padding: 10,
  },
  input: {
    color: "#fff",
    fontSize: 30,
  },
});

export default BlogPage;
