import React, { useState } from "react";
import { View, Text, StatusBar, FlatList } from "react-native";
import { SearchBar } from "react-native-elements";
import { useSelector } from "react-redux";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../App";
import { SearchResult } from "../Components/SearchResult";

StatusBar.setBarStyle("dark-content", true);

const SearchScreen = (props) => {
  const following = useSelector((state) => state.userState.following);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const searchUsers = async (value = search) => {
    setSearch(value);
    const q = query(collection(db, "users"), where("name", ">=", value));
    const querySnap = await getDocs(q);
    const results = [];
    querySnap.forEach((doc) => {
      if (doc.data().name.toLowerCase().includes(value.toLowerCase())) {
        results.push({
          data: doc.data(),
          id: doc.id,
        });
      }
    });
    setSearchResults(results);
    console.log(results);
  };

  const selectHandler = (uid) => {
    props.navigation.navigate('OtherProfile',{
        uid:uid
    })
  };
  return (
    <View style={styles.mainContainer}>
      <SearchBar
        placeholder="Search"
        onChangeText={searchUsers}
        value={search}
        round={true}
        platform={"ios"}
      />
      <FlatList
        data={searchResults}
        onRefresh={searchUsers}
        refreshing={isRefreshing}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => <SearchResult data={itemData.item.data} onSelect={()=>{selectHandler(itemData.item.id)}} />}
      />
    </View>
  );
};

const styles = {
  mainContainer: {
    paddingTop: "11%",
    backgroundColor: "white",
  },
};

export default SearchScreen;