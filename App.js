import React , { Component }from 'react';
import { StyleSheet, Text, View, Image, FlatList, WebView, TouchableHighlight } from 'react-native';
import Swiper from 'react-native-swiper';
import { StackNavigator } from 'react-navigation';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initData:[],
            topStories:[]
        }
    }

    renderImg() {
        let imageViews=[];
        let images = this.state.topStories;
        for(let i=0;i<images.length;i++){
            imageViews.push(
                <Image
                    key={i}
                    style={{height: 200,flex:1}}
                    source={{uri:images[i].image}}
                    onPress={()=>
                    {
                        this.props.navigation.navigate('Detail',{id:image[i].id});
                    }}
                />
            );
        }
        return imageViews;
    }

    componentDidMount () {
        return fetch('https://news-at.zhihu.com/api/4/news/latest')
            .then((rst)=>{
                let jsonResult = JSON.parse(rst._bodyInit).stories;
                let jsonResultTop = JSON.parse(rst._bodyInit).top_stories;
                let topImgList = [];
                for(let i = 0;i<jsonResultTop.length;i++){
                    topImgList.push({
                        image:jsonResultTop[i].image,
                        id:jsonResultTop[i].id
                    })
                }
                this.setState({
                    initData:jsonResult,
                    topStories:topImgList
                });
            })
            .catch((err)=>{
                console.log(err);
            })
    }

    render() {
    return (
      <View style={styles.container}>
          <Swiper height={320}
                  loop={true}
                  showsButtons={false}
                  autoplay={true}
                  horizontal={true}
                  style={{height:320}}
          >
              {this.renderImg()}
          </Swiper>
          <FlatList
              data = {this.state.initData}
              renderItem={({item}) =>
                  <View style={styles.itemView} key={item.id + 'view'}>
                      <Image source={{uri:item.images[0]}} style={{flex:1,width:30,height:80,padding:10}} key={item.id + 'img'}/>
                      <Text style={styles.item} key={item.id + 'text'} onPress={()=>
                      {
                          this.props.navigation.navigate('Detail',{id:item.id});
                      }}>{item.title}</Text>
                  </View>}
              style={{flex:3}}
          />
      </View>
    );
  }
}

class Detail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            detailData:'',
            css:''
        }
    }

    componentDidMount() {
        let id = this.props.navigation.state.params.id;
        return fetch('https://news-at.zhihu.com/api/4/news/' + id)
            .then((rst)=>{
                let css = JSON.parse(rst._bodyInit).css[0];
                let jsonResult = JSON.parse(rst._bodyInit).body + `<link href=${css} rel='stylesheet' type='text/css' />` ;
                this.setState({
                    detailData:jsonResult,
                    css:css
                })
            })
            .catch((err)=>{
                console.log(err)
            })
    }


    render() {

        return (
            <WebView
        source={{html:this.state.detailData}}
        />
        )
    }
}

const Navigate = StackNavigator({
    Home:{
        screen:App,
        navigationOptions:{
            title:'首页'
        }
    },
    Detail:{
        screen:Detail,
        navigationOptions:{
            title:'内容'
        }
    }
    });


const styles = StyleSheet.create({
    container:{
        flex:5,
        flexDirection:'column',
        justifyContent:'flex-start'
    },
    item: {
        padding:10,
        fontSize: 16,
        flex:3,
        alignItems:"center"
    },
    itemView:{
        flex:2,
        flexDirection:"row",
        padding: 10,
        height: 100,
    }
});
export default class registerApp extends React.Component {
    constructor(props){
        super(props)
    }

    render() {
        return (
            <Navigate/>
        );
    }
};

