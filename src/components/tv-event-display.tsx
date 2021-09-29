// Wrap TV event display in its own component
import React, { useState } from 'react';
import { View, Text } from 'react-native-ui-lib';
import { Platform, useTVEventHandler } from 'react-native';

type TVEventDisplayProps = {};

export const TVEventDisplayComponent: React.FC<TVEventDisplayProps> = ({}: TVEventDisplayProps) => {
  const [eventType, setEventType] = useState('');
  useTVEventHandler((evt: any) => {
    if (Platform.isTV && evt.eventType !== 'focus' && evt.eventType !== 'blur') {
      setEventType(evt.eventType);
    }
  });
  return (
    <View>
      {Platform.isTV ? (
        <Text marginB-s text60R textColor>
          Last TV event: {eventType}
        </Text>
      ) : null}
    </View>
  );
};
