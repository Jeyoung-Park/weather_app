import React from 'react';
import Styled from 'styled-components/native';

import WeatherView from '~/Screens/WeatherView';

import {Platform, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const Container=Styled.View`
  flex:1;
  background-color:#EEE;  
`;

interface Props {}

async function requestPermissions() {
  // if (Platform.OS === 'ios') {
  //   Geolocation.requestAuthorization();
  //   Geolocation.setRNConfiguration({
  //     skipPermissionRequests: false,
  //    authorizationLevel: 'whenInUse',
  //  });
  // }

  if (Platform.OS === 'android') {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  }
}

const App=({}:Props)=>{
  console.log('App 실행 시작');
  requestPermissions();
  return(
    <Container>
      <WeatherView />
    </Container>
  );
};

export default App;