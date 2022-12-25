import React, {useState, useRef} from 'react';
import {StyleSheet, View, Dimensions, PanResponder} from 'react-native';
import {convertToCurrency, getCompactNumber} from '../utils/graphHelpers';
import {LineChart, YAxis} from 'react-native-svg-charts';
import {G, Rect, Circle, Line, Text as SvgText} from 'react-native-svg';

interface QuoteGraphProps {
  data: number[];
  width: number;
  priceChange: number;
}
export const QuoteGraph: React.FC<QuoteGraphProps> = ({
  data,
  width,
  priceChange,
}) => {
  const [positionX, setPositionX] = useState(-1); // The currently selected X coordinate position
  const size = useRef(data.length);
  const styles = getStyles({width});

  const apx = (apxSize = 0) => {
    let windowWidth = Dimensions.get('window').width;
    return (windowWidth / 750) * apxSize;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => true,

      onPanResponderGrant: evt => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderMove: evt => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderRelease: () => {
        setPositionX(-1);
      },
    }),
  );

  const updatePosition = (x: number) => {
    const YAxisWidth = apx(130);
    const x0 = apx(0);
    const chartWidth = apx(750) - YAxisWidth - x0;
    const xN = x0 + chartWidth;
    const xDistance = chartWidth / size.current;
    if (x <= x0) {
      x = x0;
    }
    if (x >= xN) {
      x = xN;
    }

    let value = Number(((x - x0) / xDistance).toFixed(0));
    if (value >= size.current - 1) {
      value = size.current - 1;
    }

    setPositionX(Number(value));
  };

  const Tooltip = ({x, y, ticks}: {x: any; y: any; ticks: number[]}) => {
    if (positionX < 0) {
      return null;
    }

    console.log(positionX);
    const date = data[positionX];

    return (
      <G x={x(positionX)} key="tooltip">
        <G
          x={positionX > size.current / 2 ? -apx(300 + 10) : apx(10)}
          y={y(data[positionX]) - apx(10)}>
          <Rect
            y={-apx(24 + 24 + 20) / 2}
            rx={apx(12)}
            ry={apx(12)}
            width={apx(200)}
            height={apx(55)}
            stroke="rgba(254, 190, 24, 0.27)"
            fill="rgba(255, 255, 255, 0.8)"
          />

          <SvgText
            x={apx(20)}
            fill="black"
            opacity={0.65}
            fontSize={apx(24)}
            fontWeight="bold">
            {convertToCurrency(date)}
          </SvgText>
        </G>

        <G x={x}>
          <Line
            y1={ticks[0]}
            y2={ticks[Number(ticks.length)]}
            stroke="white"
            strokeWidth={apx(2)}
            strokeDasharray={[6, 3]}
          />

          <Circle
            cy={y(data[positionX])}
            r={apx(20 / 2)}
            stroke="#fff"
            strokeWidth={apx(2)}
            fill="white"
          />
        </G>
      </G>
    );
  };
  return (
    <View style={styles.graphContainer} {...panResponder.current.panHandlers}>
      <YAxis
        data={data}
        contentInset={{top: 20, bottom: 20}}
        svg={{
          fill: 'white',
          fontSize: 10,
        }}
        numberOfTicks={10}
        formatLabel={(value: number) => `$${getCompactNumber(value, 4)}`}
      />
      <LineChart
        style={styles.lineChart}
        data={data}
        svg={{
          stroke: priceChange > 0 ? '#32ab63' : '#c12f4c',
        }}
        contentInset={{top: 20, bottom: 20}}>
        <Tooltip />
      </LineChart>
    </View>
  );
};

interface StyleProps {
  width: number;
}
const getStyles = ({width}: StyleProps) =>
  StyleSheet.create({
    graphContainer: {
      height: 400,
      flexDirection: 'row',
    },
    lineChart: {
      height: 400,
      width: width - 75,
    },
  });
