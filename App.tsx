/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';
import {scaleTime, scaleLinear, line, curveBasis} from 'd3';
import {
  SkPath,
  Skia,
  Canvas,
  Path,
  Line,
  vec,
} from '@shopify/react-native-skia';
declare const global: {HermesInternal: null | {}};

interface DataProps {
  current_price: number;
  symbol: string;
  name: string;
  id: string;
  price_change_percentage_24h: number;
  price_change_24h: number;
  total_volume: number;
  sparkline_in_7d: number[];
}

export type DataPoint = {
  date: string;
  value: number;
};
interface GraphData {
  min: number;
  max: number;
  curve: SkPath;
}

const GRAPH_HEIGHT = 100;
const GRAPH_WIDTH = 170;

const App = () => {
  const [marketData, setMarketData] = useState<DataProps[]>();
  const [graphData, setGraphData] = useState<GraphData>();

  const getMarketCap = async () => {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page =100&page=1&sparkline=true',
    );

    setGraphData(makeGraph(response.data.sparkline_in_7d));

    setMarketData(response.data);
    console.log(response.data);
  };

  const getCompactNumber = (value: number) =>
    Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);

  const makeGraph = (data: DataPoint[]): GraphData => {
    const max = Math.max(...data.map((val) => val.value));
    const min = Math.min(...data.map((val) => val.value));
    const y = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 35]);

    const x = scaleTime()
      .domain([new Date(2000, 1, 1), new Date(2000, 1, 15)])
      .range([10, GRAPH_WIDTH - 10]);

    const curvedLine = line<DataPoint>()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.value))
      .curve(curveBasis)(data);

    const skPath = Skia.Path.MakeFromSVGString(curvedLine!);

    return {
      max,
      min,
      curve: skPath!,
    };
  };

  useEffect(() => {
    getMarketCap();
  }, []);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            {/* <View style={styles.marketRow}>
              <View>
                <Text style={styles.rowHeaderText}>BTC/USD</Text>
                <Text style={styles.rowSubtitleText}>156.0M Vol</Text>
              </View>
              <View>
                <Text style={styles.rowHeaderText}>53,699.90</Text>
                <Text style={styles.rowSubtitleText}>+4.35%</Text>
              </View>
            </View> */}
            <FlatList
              data={marketData}
              renderItem={({item}) => {
                return (
                  <View
                    style={{
                      ...styles.marketRow,
                      backgroundColor:
                        item.price_change_percentage_24h > 0
                          ? '#07250f'
                          : '#2f080e',
                    }}>
                    <View>
                      <Text style={styles.rowHeaderText}>{item.symbol}</Text>
                      <Text
                        style={styles.leftColSubtitleText}>{`${getCompactNumber(
                        item.total_volume,
                      )} Vol`}</Text>

                      {graphData && (
                        <Canvas
                          style={{
                            width: GRAPH_WIDTH,
                            height: GRAPH_HEIGHT,
                          }}>
                          <Line
                            p1={vec(10, 130)}
                            p2={vec(400, 130)}
                            color="lightgrey"
                            style="stroke"
                            strokeWidth={1}
                          />
                          <Line
                            p1={vec(10, 250)}
                            p2={vec(400, 250)}
                            color="lightgrey"
                            style="stroke"
                            strokeWidth={1}
                          />
                          <Line
                            p1={vec(10, 370)}
                            p2={vec(400, 370)}
                            color="lightgrey"
                            style="stroke"
                            strokeWidth={1}
                          />
                          <Path
                            style="stroke"
                            path={graphData.curve}
                            strokeWidth={4}
                            color="#6231ff"
                          />
                        </Canvas>
                      )}
                    </View>
                    <View>
                      <Text style={styles.rightColHeaderText}>
                        {item.current_price.toLocaleString()}
                      </Text>
                      <Text
                        style={{
                          ...styles.rightColSubtitleText,
                          color:
                            item.price_change_percentage_24h > 0
                              ? '#298a50'
                              : '#8b2136',
                        }}>
                        {`${item.price_change_percentage_24h.toFixed(2)}%`}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.tsx</Text> to change
                this screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  marketRow: {
    backgroundColor: 'green',
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 8,
    // opacity: 0.55,
  },
  rowHeaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  rightColHeaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'right',
  },
  leftColSubtitleText: {
    color: '#798278',
    fontSize: 12,
    fontWeight: '600',
  },
  rightColSubtitleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
