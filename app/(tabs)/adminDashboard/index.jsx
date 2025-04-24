import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { cropList, IMAGE_PATH } from "../../../apis/memberApi";
import { FlatList } from 'react-native';


const ProfileHomeScreen = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    cropList()
      .then((res) => {
        console.log(res);
        setList(res.data);
      })
      .catch();
  }, []);
  const renderItem = ({ item: crop }) => (
    <TouchableOpacity
      style={styles.infoCon}
      onPress={() => navigation.navigate("PlantDetail", { id: crop.id })}
    >
      <View style={styles.picCon}>
        <Image
          source={{ uri: `${IMAGE_PATH}/${crop.imgName}` }}
          style={styles.cropImage}
        />
      </View>

      <View style={styles.textCon}>
        <View style={styles.titleCon}>
          <Text style={styles.title}>{crop.crop}</Text>
          <Text style={styles.subtitle}>{crop.engName}</Text>
        </View>

        <View style={styles.textBox}>
          <View style={styles.textBoxRow}>
            <Text style={styles.envLabel}>온도</Text>
            <Text
              style={styles.envValue}
            >{`${crop.tempMin} ~ ${crop.tempMax}℃`}</Text>
          </View>
          <View style={styles.textBoxRow}>
            <Text style={styles.envLabel}>습도</Text>
            <Text
              style={styles.envValue}
            >{`${crop.humidMin} ~ ${crop.humidMax}%`}</Text>
          </View>
          <View style={styles.textBoxRow}>
            <Text style={styles.envLabel}>조도</Text>
            <Text
              style={styles.envValue}
            >{`${crop.adcMin} ~ ${crop.adcMax}`}</Text>
          </View>
          <View style={styles.textBoxRow}>
            <Text style={styles.envLabel}>토양</Text>
            <Text
              style={styles.envValue}
            >{`${crop.soilMin} ~ ${crop.soilMax}%`}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainCon}>
      {/* FlatList */}
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={styles.subCon}
      />
    </View>
  );
};

export default ProfileHomeScreen;

const styles = StyleSheet.create({
  mainCon: {
    width: "100%",
    paddingHorizontal: 10,
  },
  banner: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  subCon: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  infoCon: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 30,
    padding: 10,
    backgroundColor: "#fff",
    elevation: 3, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
  },
  infoConHover: {
    shadowOpacity: 0.25,
    shadowRadius: 14,
  },
  picCon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cropImage: {
    width: "180%",
    height: "100%",
    resizeMode: "cover",
  },
  textCon: {
    flex: 1,
    height: 100,
    justifyContent: "space-between",
  },
  titleCon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#575757",
  },
  subtitle: {
    fontSize: 12,
    color: "#575757",
  },
  textBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "space-between",
  },
  textBoxRow: {
    flexDirection: "column",
    borderTopWidth: 1,
    borderTopColor: "#b1b1b1",
    borderBottomWidth: 1,
    borderBottomColor: "#b1b1b1",
    paddingVertical: 5,
    marginBottom: 5,
    width: "48%",
  },
  envLabel: {
    paddingLeft: 5,
    marginBottom: 5,
    color: "#27b06e",
  },
  envValue: {
    backgroundColor: "#27b06e",
    color: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  fontBold: {
    fontWeight: "900", // Pretendard-Black 대체
  },
  fontLight: {
    fontWeight: "300", // Pretendard-Light 대체
  },
});
