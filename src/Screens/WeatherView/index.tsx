import React, {useEffect, useState} from 'react';
import {FlatList, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import Styled from 'styled-components/native';

const Container=Styled.SafeAreaView`
    flex:1;
    background-color:#EEE;
`;

//당겨서 갱신하기 기능을 사용하기 위해 View 대신 FlatList 사용
const WeatherContainer=Styled(FlatList)``; //FlatList는 styled-component 것이 아니라 괄호로 표현하는 것 같음

const LoadingView=Styled.View`
    flex:1;
    justify-content:center;
    align-items:center;
`;
const Loading=Styled.ActivityIndicator`
    margin-bottom:16px;
`;
const LoadingLabel=Styled.Text`
    font-size:16px;
`;
const WeatherItemContainer=Styled.View`
    height:100%;
    justify-content:center;
    align-items:center;
`;
const Weather=Styled.Text`
    margin-bottom:16px;
    font-size:24px;
    font-weight:bold;
`;
const Temperature=Styled.Text`
    font-size:16px;
`;

interface Props {}

const API_KEY='4dc743929018457f61452448c7bf040a';

//WetaherView 컴포넌트에서 사용할 정보를 타입스크립트를 사용하여 정의 -> 추후에 이 타입을 useState를 사용
interface IWeather{
    temperature?:number;
    weather?:string;
    isLoading:boolean;
}

const WeatherView=({}:Props)=>{
    const [weatherInfo, setWeatherInfo]=useState<IWeather>({
        temperature:undefined,
        weather:undefined,
        isLoading:false
    });
//위치 정보를 받아와 해당 위치의 날씨 정보를 가져오기 위한 함수
    const getCurrentWeather=()=>{
        setWeatherInfo({
            isLoading:false
        });
        Geolocation.getCurrentPosition(
            position=>{
                const {latitude, longitude}=position.coords; //좌표 받음
                //네트워크 처리, fetch API는 promise 함수이므로 then, catch를 이용해 정상 처리& 에러처리
                fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
                .then(response=>response.json())
                .then(json=>{
                    setWeatherInfo({
                        temperature:json.main.temp,
                        weather:json.weather[0].main,
                        isLoading:true
                    });
                })
                .catch(error=>{
                    setWeatherInfo({
                        isLoading:true
                    });
                    showError('날씨 정보를 가져오는데 실패하였다.');
                    console.log("날씨 정보 에러",error);
                });
            },
            // 좌표 받는 데에 실패할 시 여기로 error 호출
            error=>{
                setWeatherInfo({
                    isLoading:true
                });
                showError('위치 정보를 가져오는데 실패하였다.');
                console.log("위치정보 에러", error);
            }
        );
    };

    const showError=(message:string):void=>{
        setTimeout(()=>{
            Alert.alert(message);
        }, 500);
    };

    // useEffect의 두 번째 매개변수가 빈 문자열 -> props, state가 변경되어 화면이 업데이트될 떄에는 호출 x -> 즉, 처음 렌더링될 때만 실행
    useEffect(()=>{
        getCurrentWeather();
    }, []);

    let data=[];
    const {isLoading, weather, temperature}=weatherInfo; //바구조화할당
    if(weather&&temperature){
        data.push(weatherInfo);
    }

    return(
        <Container>
            <WeatherContainer 
            // onRefresh에서 당겨서 갱신할 떄 호출할 함수 정의
                onRefresh={()=>getCurrentWeather} 
                refreshing={!isLoading} //refreshing에는 당겨서 갱신하기 기능을 사용항 데이터를 갱신중인지, 데이터 갱신이 끝났는지를 설정
                data={data}
                keyExtractor={(item, index)=>{
                    return `Weather-${index}`;
                }}
                ListEmptyComponent={
                    <LoadingView>
                        <Loading size="large" color="#1976D2"/>
                        <LoadingLabel>Loading...</LoadingLabel>
                    </LoadingView>
                }
                renderItem={({item, index})=>(
                    <WeatherItemContainer>
                        {/* 타입스크립트 as: 다운캐스팅  */}
                        <Weather>{(item as IWeather).weather}</Weather> 
                        <Temperature>{(item as IWeather).temperature}도</Temperature>
                    </WeatherItemContainer>
                )}
                contentContainerStyle={{flex:1}}
            />
        </Container>
    );
}

export default WeatherView;