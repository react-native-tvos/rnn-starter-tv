import React, { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  Alert,
  TVMenuControl,
  useTVEventHandler,
  HWFocusEvent,
} from 'react-native';
import { View, Button, Text } from 'react-native-ui-lib';
import { NavigationFunctionComponent } from 'react-native-navigation';
import { useNavigationButtonPress } from 'react-native-navigation-hooks/dist';
import { observer } from 'mobx-react';
import 'react-native/tvos-types.d';

import { useServices } from '../services';
import { useStores } from '../stores';

import { Section } from '../components/section';
import { Reanimated2 } from '../components/reanimated2';
import { randomNum } from '../utils/help';
import { withSharedTransitions } from '../services/navigation/sharedTransition';

export const Main: NavigationFunctionComponent = observer(({ componentId }) => {
  const { nav, t, api } = useServices();
  const { counter, ui } = useStores();

  useNavigationButtonPress(counter.inc, componentId, 'inc');
  useNavigationButtonPress(counter.dec, componentId, 'dec');
  useNavigationButtonPress(() => nav.push(componentId, 'Settings'), componentId, 'settings');

  useEffect(() => {
    start();
  }, [componentId]);

  const start = async () => {
    try {
      await api.counter.get(true); // Change to false to reach out to the real counter API
    } catch (e) {
      Alert.alert('Error', 'There was a problem fetching data :(');
    }
  };

  const [eventType, setEventType] = useState('');
  useTVEventHandler((evt: any) => {
    // For now, only do this on Apple TV
    // (Android TV seems to be having perf issues with setting this state)
    if (Platform.isTV && Platform.OS === 'ios') {
      setEventType(evt.eventType);
    }
  });

  return (
    <View flex bg-bgColor>
      <ScrollView contentInsetAdjustmentBehavior={Platform.isTV ? 'automatic' : 'always'}>
        <View padding-m>
          <Section title={t.do('section.navigation.title')}>
            {Platform.isTV && Platform.OS === 'ios' ? (
              <Text marginB-s text60R textColor>
                Last TV event: {eventType}
              </Text>
            ) : null}
            <Button
              marginV-xs
              label={t.do('section.navigation.button.push')}
              onPress={() => nav.push(componentId, 'Example')}
            />
            <Button
              marginV-xs
              label={t.do('section.navigation.button.show')}
              onPress={() => nav.show('Example')}
            />
            <Button
              marginV-xs
              label={t.do('section.navigation.button.passProps')}
              onPress={() =>
                nav.push<ExampleScreenProps>(componentId, 'Example', { value: randomNum() })
              }
            />
            <Button
              marginV-xs
              label={t.do('section.navigation.button.sharedTransition')}
              onPress={() =>
                nav.push<ExampleScreenProps>(
                  componentId,
                  'Example',
                  { value: randomNum() },
                  withSharedTransitions([{ id: 'reanimated2', pop: true }]),
                )
              }
            />
          </Section>

          <Section title="Reanimated 2">
            <Reanimated2 stID="reanimated2" />
          </Section>

          <Section title="MobX">
            <View centerV>
              <Text marginB-s text60R textColor>
                App launches: {ui.appLaunches}
              </Text>
              <Text marginB-s text60R textColor>
                Counter: {counter.loading ? 'Loading...' : counter.value}
              </Text>
              <Button margin-xs label="-" onPress={counter.dec} />
              <Button margin-xs label="+" onPress={counter.inc} />
              {Platform.isTV ? (
                <Button
                  margin-xs
                  label="Enable menu key"
                  onPress={() => TVMenuControl.enableTVMenuKey()}
                />
              ) : null}
              {Platform.isTV ? (
                <Button
                  margin-xs
                  label="Disable menu key"
                  onPress={() => TVMenuControl.disableTVMenuKey()}
                />
              ) : null}
              <Button margin-xs label="reset" onPress={counter.reset} link />
            </View>
          </Section>

          <Section title="API">
            <Button margin-xs label="Update counter value from API" onPress={api.counter.get} />
          </Section>
        </View>
      </ScrollView>
    </View>
  );
});
