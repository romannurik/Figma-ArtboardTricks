import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Input, Title } from 'react-figma-plugin-ds';

class App extends React.Component {
  state = {
    padding: '0',
    loaded: false,
  }

  componentDidMount() {
    window.onmessage = (event: MessageEvent) => {
      let { pluginMessage: msg } = event.data;
      switch (msg.type) {
        case 'init': {
          let { padding } = msg;
          this.setState({padding: String(padding), loaded: true});
          break;
        }
      }
    };
  }

  handleFit = () => {
    let padding = parseInt(this.state.padding, 10);
    parent.postMessage({
      pluginMessage: {
        type: 'perform-fit',
        padding,
      }
    }, '*');
  }

  handleCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  }

  render() {
    let {loaded, padding} = this.state;
    if (!loaded) {
      return 'Loading...';
    }

    return <React.Fragment>
      <Title weight="bold">Padding around contents:</Title>
      <Input
          placeholder="Padding"
          icon="resize-to-fit"
          defaultValue={padding}
          type="number"
          onChange={value => this.setState({ padding: value })} />
      <div className="buttons">
        <Button onClick={this.handleFit} isDisabled={padding === ''}>Fit</Button>
        <Button onClick={this.handleCancel} isSecondary>Cancel</Button>
      </div>
    </React.Fragment>;
  }
}

ReactDOM.render(<App />, document.querySelector('.root'));
