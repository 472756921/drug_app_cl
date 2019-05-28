import Taro, { Component } from '@tarojs/taro'
import { WebView } from '@tarojs/components'



export default class Index extends Component {
  state = {
    link: ''
  }
  componentWillMount () {
    if(this.$router.params)
      this.setState({
        link: this.$router.params.link
      })
  }
  render() {
    return (
      <WebView src={this.state.link}  />
    )
  }
}
