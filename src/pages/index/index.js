import Taro, { Component } from '@tarojs/taro'
import { View, Input, Text, ScrollView, Image } from '@tarojs/components'
import moment from 'moment'
import {deepCopy, getCookie} from '../../utile';
import './index.less'

export default class Index extends Component {

  state = {
    scrollTop: 20,
    valueS: '',
    listData: [],
    allData: [],
    page: 1,
    totalPage: 1,
    bottomMessage: '已经到底了',
  }

  config = {
    navigationBarTitleText: '美联医邦新药查询系统'
  }

  componentWillMount () { }

  componentDidMount () {
    this.getHotDrugList();
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  checkDatile = ({ id }) => {
    // this.$preload('data', data)
    Taro.navigateTo({
      url: '/pages/datile/index?id=' + id,
    })
  }

  getHotDrugList() {
    Taro.request({
      url: 'http://mb.medebound.com/drugSystem/drug/getHotDrug',
    }).then((data) => {
      this.setState({
        listData: data.data.results || [],
        scrollTop: 0,
      });
    }).catch((e) => {
      console.log(e);
      Taro.showToast({
        title: '数据出了点故障',
        icon: 'loading'
      })
    })
  }

  vchange = (e) => {
    this.setState({
      valueS: e.detail.value
    })
  }
  sercher = () => {
    this.setState({
      listData: []
    })
    Taro.showLoading({
      title:'查询中',
      icon: 'loading'
    });
    const { valueS } = this.state;
    Taro.request({
      url: 'http://mb.medebound.com/drugSystem/drug/list',
      data: {name: valueS},
    }).then(({data}) => {
      Taro.hideLoading();
      const d = data.data || [];
      const a = deepCopy(d);
      if(d.length === 0) {
        this.setState({
          bottomMessage: '暂无数据'
        })
      } else {
        this.setState({
          allData: a,
          listData: d.splice(0, 10),
          page: 1,
          totalPage: Math.ceil(a.length / 10),
          bottomMessage: Math.ceil(a.length / 10) === 1 ? '已经到底了' : '下拉加载更多',
          scrollTop: 0
        })
      }
    }).catch(() => {
      Taro.showToast({
        title: '数据出了点故障',
        icon: 'loading'
      })
    })
  }

  nextPage = () => {
    const { page, allData, totalPage, listData } = this.state;
    if(page < totalPage) {
      const newPage = page+1;
      const d = deepCopy(allData);
      this.setState({
        listData: [...listData, ...d.splice(page * 10, 10)],
        page: newPage,
      })
      if(totalPage - page === 1) {
        this.setState({
          bottomMessage: '已经到底了'
        })
      }
    }
  }

  render () {
    const { listData, bottomMessage, scrollTop } = this.state;
    return (
      <View className='index'>
        <View className='seacher'>
          <View className='seacherBox'>
            <Input onInput={this.vchange} placeholder='输入药物名称或疾病' focus className='seacherInput' />
            <View className='btn_seacher' onClick={() => this.sercher()}>查询</View>
          </View>
        </View>
        <ScrollView className='listContent'
          scrollY
          scrollWithAnimation
          scrollTop={scrollTop}
          onScrollToLower={this.nextPage}
        >
          {
            listData.map((it) => {
              return (
                <View key={it.id} className='list' onClick={() => this.checkDatile(it)}>
                  <View className='message'>
                    <View><Text>通用名：{it.name1} / {it.name3}</Text></View>
                    <View><Text>商品名：{it.name2} / {it.name4}</Text></View>
                    <View>
                      <View style='float:left'>上市日期：</View>
                      <View style='float: left'>
                        <View style='float: left'>
                          <Image
                            mode='widthFix'
                            style='width: 16px;float:left;margin: 5px'
                            src='http://mb.medebound.com/drug/static/media/usa.bde8a7a1.svg'
                          />
                        </View>
                        <View style='float: left'>
                          <Text>{it.USDate ? moment(it.USDate).format('YYYY-MM-DD') : '未上市'}</Text>
                        </View>
                      </View>

                      <View style='float: left'>
                        <View style='float: left'>
                          <Image
                            mode='widthFix'
                            style='width: 16px;float:left;margin: 5px'
                            src='http://mb.medebound.com/drug/static/media/china.e2fa5a3e.svg'
                          />
                        </View>
                        <View style='float: left'>
                          <Text>{it.CHData ? moment(it.CHData).format('YYYY-MM-DD') : '未上市'}</Text>
                        </View>
                      </View>
                    </View>
                    <View style='clear:both'><Text>分类：{it.diseaseName}</Text></View>
                  </View>
                  <View className='option'> ▶ </View>
                </View>
              )
            })
          }
          <View className='bottomMessage'>----- {bottomMessage} -----</View>
        </ScrollView>
      </View>
    )
  }
}
