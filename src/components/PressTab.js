import { Pressable, Text, StyleSheet } from 'react-native'
import React from 'react'

const PressTab = ({text, idx, checkActive, setCheckActive}) => {
  return (
    <Pressable onPress={()=>setCheckActive(idx)} >
      <Text style={[styles.tabs,{color: checkActive === idx ? "coral": "white"}]}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tabs: {
    color: "white",
    marginHorizontal: 10,
    fontSize: 18,
    paddingHorizontal: 10,
    // paddingVertical: 3,
    backgroundColor: "#0077b6",
    borderRadius: 2,
  },
})

export default PressTab;