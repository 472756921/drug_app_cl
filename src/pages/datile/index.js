import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import moment from 'moment'

export default class Index extends Component {
  state = {
    data: {
      name1: 'Afatinib',
      name2: 'GILOTRIF',
      name3: '阿法替尼',
      name4: '吉泰瑞',
      factory: '辉瑞',
      USDate: '2013-07-12',
      CHData: '2016-08-16',
      Indication: '头颈部肿瘤头颈部肿瘤头颈部肿瘤头颈部肿瘤头颈部肿',
      articleLink: 'https://www.medebound.com/guide/282',
      classType: '肺癌 , 头颈部肿瘤',
    },
  }

  config = {
    navigationBarTitleText: '药品详情'
  }

  componentDidMount () {
    if (this.$router.params) {
      Taro.request({
        url: 'http://mb.medebound.com/drugSystem/drug/find',
        method: 'GET',
        data: {id:this.$router.params.id}
      }).then( ({data}) => {
        this.setState({
          data: data.drug,
        })
        Taro.setNavigationBarTitle({
          title: data.drug.name1 + ' | ' + data.drug.name3
        })
        Taro.request({
          url: 'http://mb.medebound.com/drugSystem/drug/drugCountByPhone',
          method: 'GET',
          data: {id: data.drug.id, checkCount: data.drug.checkCount}
        })
      })
    }
  }

  componentWillUnmount () { }
  componentDidShow () { }
  componentDidHide () { }

  lickTO = (data) => {
    Taro.navigateTo({
      url: '/pages/article/index?link='+data
    })
  }
  callPhone = () => {
    Taro.makePhoneCall({phoneNumber: '400-052-1655'});
  }

  render() {
    const { data } = this.state;
    return (
      <View style='padding: 20px 20px 80px 20px;font-size: 12px; line-height: 30px;position:relative; min-height: 80vh'>
        <View>
          <Text style='color:#4F86C6'>通用名：</Text>
          <Text>{data.name1 + ' / ' + data.name3}</Text>
        </View>
        <View>
          <Text style='color:#4F86C6'>商品名：</Text>
          <Text>{data.name2 + ' / ' + data.name4}</Text>
        </View>
        <View>
          <Text style='color:#4F86C6'>生产厂家：</Text>
          <Text>{data.factory}</Text>
        </View>
        <View>
          <View style='float:left;color:#4F86C6'>上市日期：</View>
          <View style='float: left'>
            <View style='float: left'>
              <Image
                mode='widthFix'
                style='width: 16px;float:left;margin: 7px'
                src='http://mb.medebound.com/drug/static/media/usa.bde8a7a1.svg'
              />
            </View>
            <View style='float: left'>
              <Text>{moment(data.USDate).format('YYYY-MM-DD')}</Text>
            </View>
          </View>
          <View style='float: left'>
            <View style='float: left'>
              <Image
                mode='widthFix'
                style='width: 16px;float:left;margin: 7px'
                src='http://mb.medebound.com/drug/static/media/china.e2fa5a3e.svg'
              />
            </View>
            <View style='float: left'>
              <Text>{data.CHData ? moment(data.CHData).format('YYYY-MM-DD') : '未上市'}</Text>
            </View>
          </View>
        </View>
        <View style='clear:both'>
          <Text style='color:#4F86C6'>分类：</Text>
          <Text>{data.diseaseName}</Text>
        </View>
        <View>
          <Text style='color:#4F86C6'>相关文章：</Text>
          <Text onClick={() => this.lickTO(data.articleLink)} style='color:#4F86C6;text-decoration: underline;' >{data.articleLink}</Text>
        </View>
        <View style='background: #fcfcfc; line-height: 20px'>
          <Text style='color:#4F86C6'>适应症：</Text>
          <Text>{data.Indication}</Text>
        </View>
        <Button
          open-type='contact'
          // onClick={() => this.callPhone()}
          size='default'
          type='primary'
          style='font-size: 14px;bottom: 20px;width: 80%;left: 50%;transform: translateX(-50%); position: absolute;'
        >
          药品咨询
        </Button>
      </View>
    )
  }
}
