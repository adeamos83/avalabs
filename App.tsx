import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';

import {NativeRouter, Route, Routes} from 'react-router-native';
import {MarketList} from './src/screens/MarketList';
import {QuoteDetail} from './src/screens/QuoteDetail';

const App = () => (
  <NativeRouter>
    <SafeAreaView style={{backgroundColor: '#070707'}}>
      <View style={styles.container}>
        <Routes>
          <Route index path="/" element={<MarketList />} />
          <Route path="/quote/:id" element={<QuoteDetail />} />
        </Routes>

        {/* <Route path="/topics" component={Topics} /> */}
      </View>
    </SafeAreaView>
  </NativeRouter>
);

const styles = StyleSheet.create({
  container: {
    // marginTop: 25,
    // padding: 10,
    backgroundColor: 'black',
  },
});

export default App;
