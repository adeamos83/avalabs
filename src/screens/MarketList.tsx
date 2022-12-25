import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';
import {DataProps} from '../types/MarketTypes';
import {MarketListRow} from '../components/MarketListRow';
import AvalancheLogo from '../assets/avalanche.svg';

export const MarketList = () => {
  const [marketData, setMarketData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  console.log('marketData', marketData);
  const getMarketCap = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${page}&sparkline=true`,
      );
      setPage(page + 1);
      setMarketData([...marketData, ...response.data]);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setMarketData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMarketCap();
  }, []);

  if (loading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.headerContainer}>
              <AvalancheLogo width={75} height={75} />
              <Text style={styles.header}>Watchlist</Text>
            </View>
            {marketData.length === 0 && (
              <View style={styles.noMarketData}>
                <Text style={styles.header}>No market data</Text>
              </View>
            )}
            {marketData.length > 0 && (
              <FlatList
                data={marketData}
                renderItem={({item}) => <MarketListRow data={item} />}
                onEndReached={getMarketCap}
                onEndReachedThreshold={0.7}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#070707',
    display: 'flex',
    flexGrow: 1,
    alignItems: 'flex-start',
  },
  spinnerContainer: {
    backgroundColor: '#070707',
    padding: 20,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  body: {
    backgroundColor: '#070707',
    padding: 10,
    width: '100%',
    height: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.white,
    marginTop: 40,
  },
  headerContainer: {
    padding: 10,
  },
  noMarketData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
