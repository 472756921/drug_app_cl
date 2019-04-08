import Taro, { Component } from '@tarojs/taro'
import { View, Input, Button, Text } from '@tarojs/components'

import './index.less'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '新药查询'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <View className='seacher'>
          <View className='seacherBox'>
            <Input type='text' placeholder='输入药物名称或疾病' focus />
          </View>
        </View>
      </View>
    )
  }
}
