import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Input, Title } from 'react-figma-plugin-ds';

class App extends React.Component {
  state = {
    defaultPrefs: {xSpacing:0, ySpacing:0},
    xSpacing: '',
    ySpacing: '',
    loaded: false,
  }

  componentDidMount() {
    window.onmessage = (event: MessageEvent) => {
      let { pluginMessage: msg } = event.data;
      switch (msg.type) {
        case 'current-prefs': {
          let { prefs } = msg;
          let {xSpacing, ySpacing} = prefs;
          xSpacing = String(xSpacing);
          ySpacing = String(ySpacing);
          this.setState({defaultPrefs: prefs, xSpacing, ySpacing, loaded: true});
          break;
        }
      }
    };
  }

  handleSave = () => {
    let xSpacing = parseInt(this.state.xSpacing, 10);
    let ySpacing = parseInt(this.state.ySpacing, 10);
    if (isNaN(xSpacing)) {
      xSpacing = this.state.defaultPrefs.xSpacing;
    }
    if (isNaN(ySpacing)) {
      ySpacing = this.state.defaultPrefs.ySpacing;
    }
    parent.postMessage({
      pluginMessage: {
        type: 'save-prefs',
        prefs: {xSpacing, ySpacing},
      }
    }, '*');
  }

  handleClose = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel-prefs' } }, '*');
  }

  render() {
    let {loaded, xSpacing, ySpacing} = this.state;
    if (!loaded) {
      return 'Loading...';
    }

    return <React.Fragment>
      <Title weight="bold">"Rearrange" spacing for frames on this page:</Title>
      <Input
          placeholder="Horizontal"
          icon="dist-horiz-spacing"
          defaultValue={xSpacing}
          type="number"
          onChange={value => this.setState({ xSpacing: value })} />
      <Input
          placeholder="Vertical"
          icon="dist-vert-spacing"
          defaultValue={ySpacing}
          type="number"
          onChange={value => this.setState({ ySpacing: value })} />
      <div className="buttons">
        <Button onClick={this.handleSave}
            isDisabled={xSpacing === '' || ySpacing === ''}>Save</Button>
        <Button onClick={this.handleClose} isSecondary>Cancel</Button>
      </div>
    </React.Fragment>;
  }
}

ReactDOM.render(<App />, document.querySelector('.root'));
