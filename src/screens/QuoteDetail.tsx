import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useNavigate, useMatch} from 'react-router-native';
import axios from 'axios';
import {convertToCurrency, getCompactNumber} from '../utils/graphHelpers';
import {QuoteGraph} from '../components/QuoteGraph';
import BackArrow from '../assets/left-arrow.svg';
export interface QuoteDataProps {
  market_data: {
    sparkline_7d: {
      price: number[];
    };
    current_price: {
      usd: number;
    };
    price_change_24h: number;
    price_change_percentage_24h: number;
    total_supply: number;
    total_volume: {
      usd: number;
    };
  };
  symbol: string;
  name: string;
}

const {width} = Dimensions.get('screen');

export const QuoteDetail = () => {
  const navigate = useNavigate();
  const match = useMatch('/quote/:id');
  const symbol = match?.params.id;

  const [quoteData, setQuoteData] = useState<QuoteDataProps>();
  const [loading, setLoading] = useState(false);
  const styles = getStyles({
    price_change_24h: quoteData?.market_data.price_change_24h,
  });

  const getQuoteDetails = async () => {
    setLoading(true);
    try {
      const {data} = await axios.get<QuoteDataProps>(
        `https://api.coingecko.com/api/v3/coins/${symbol}?&sparkline=true`,
      );
      console.log(data);
      setQuoteData(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuoteDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  if (!quoteData) {
    return (
      <View style={styles.spinnerContainer}>
        <Text style={styles.header}>Data not available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View style={styles.scrollView}>
        <View style={styles.body}>
          <TouchableOpacity
            onPress={() => navigate(-1)}
            style={styles.backButtonContainer}>
            <BackArrow width={20} height={20} style={styles.backIcon} />
            <Text style={styles.title}>Go back</Text>
          </TouchableOpacity>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>{quoteData?.name}</Text>
            <Text style={styles.header}>
              {convertToCurrency(quoteData?.market_data.current_price.usd)}
            </Text>
            <Text style={styles.priceDetails}>
              {convertToCurrency(quoteData?.market_data.price_change_24h)}
              {` (${quoteData?.market_data.price_change_percentage_24h.toFixed(
                2,
              )}%)`}
            </Text>
          </View>
          <View style={styles.graphOuterContainer}>
            {quoteData && (
              <QuoteGraph
                data={quoteData.market_data.sparkline_7d.price}
                width={width}
                priceChange={quoteData?.market_data.price_change_24h}
              />
            )}
          </View>
          <View>
            <Text style={styles.title}>{`Total volume ${getCompactNumber(
              quoteData?.market_data.total_volume.usd,
              4,
            )}`}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

interface StyleProps {
  price_change_24h: number | undefined;
}
const getStyles = ({price_change_24h}: StyleProps) =>
  StyleSheet.create({
    scrollView: {
      backgroundColor: '#070707',
      display: 'flex',
      flexGrow: 1,
    },
    spinnerContainer: {
      backgroundColor: '#070707',
      padding: 20,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerContainer: {
      marginVertical: 25,
    },
    body: {
      backgroundColor: '#070707',
      padding: 20,
      width: '100%',
      height: '100%',
    },
    header: {
      fontSize: 24,
      fontWeight: '600',
      color: 'white',
      textTransform: 'capitalize',
      marginBottom: 6,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
    },
    priceDetails: {
      fontSize: 16,
      fontWeight: '600',
      ...(price_change_24h && {
        color: price_change_24h > 0 ? '#32ab63' : '#c12f4c',
      }),
    },
    graphOuterContainer: {
      display: 'flex',
      flex: 1,
    },
    graphContainer: {
      height: 400,
      flexDirection: 'row',
    },
    backButtonContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    backIcon: {
      marginRight: 6,
    },
  });
