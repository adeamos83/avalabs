import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {DataProps} from '../types/MarketTypes';
import {getCompactNumber} from '../utils/graphHelpers';
import {useNavigate} from 'react-router-native';
import {LineChart} from 'react-native-svg-charts';

interface MarketListRowProps {
  data: DataProps;
}
export const MarketListRow: React.FC<MarketListRowProps> = ({data}) => {
  const navigate = useNavigate();
  const styles = getStyles({
    price_change_percentage_24h: data.price_change_percentage_24h,
  });

  return (
    <TouchableOpacity onPress={() => navigate(`quote/${data.id}`)}>
      <View style={styles.marketRow}>
        <View style={styles.columnContainer}>
          <Text style={styles.rowHeaderText}>{data.symbol}</Text>
          <Text style={styles.leftColSubtitleText}>{`${getCompactNumber(
            data.total_volume,
          )} Vol`}</Text>
        </View>
        <View>
          <LineChart
            style={styles.lineChart}
            data={data.sparkline_in_7d.price}
            svg={{
              stroke:
                data.price_change_percentage_24h > 0 ? '#32ab63' : '#c12f4c',
            }}
            contentInset={{}}
          />
        </View>
        <View style={styles.columnContainer}>
          <Text style={styles.rightColHeaderText}>
            {`$${data.current_price.toLocaleString()}`}
          </Text>
          <Text style={styles.rightColSubtitleText}>
            {`${data.price_change_percentage_24h.toFixed(2)}%`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface StyleProps {
  price_change_percentage_24h: number;
}

const getStyles = ({price_change_percentage_24h}: StyleProps) =>
  StyleSheet.create({
    marketRow: {
      backgroundColor: price_change_percentage_24h > 0 ? '#07250f' : '#2f080e',
      borderRadius: 6,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      marginVertical: 2,
      marginHorizontal: 8,
    },
    columnContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    lineChart: {
      height: 60,
      width: 70,
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
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'right',
      color: price_change_percentage_24h > 0 ? '#32ab63' : '#c12f4c',
    },
  });
