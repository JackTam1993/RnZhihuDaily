import React , { Component }from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import Swiper from 'react-native-swiper';

export default class App extends React.Component {
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
        // let images = ['https://yt3.ggpht.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAAAAAA/OixOH_h84Po/s900-c-k-no-mo-rj-c0xffffff/photo.jpg','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuQdH2uUFgiS3YAzAMb6zzY7zqw3lcJnq-ayF9QOQ0yv8bylZI5Q'];
        for(let i=0;i<images.length;i++){
            imageViews.push(
                <Image
                    key={i}
                    style={{height: 200,flex:1}}
                    source={{uri:images[i]}}
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
                    topImgList.push(jsonResultTop[i].image);
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
                      <Text style={styles.item} key={item.id + 'text'}>{item.title}</Text>
                  </View>}
              style={{flex:3}}
          />
      </View>

    );
  }
}

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
