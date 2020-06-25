import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Input, Title, Checkbox } from 'react-figma-plugin-ds';

class App extends React.Component {
  state = {
    defaultPrefs: {xSpacing:0, ySpacing:0, shouldRename:false},
    xSpacing: '',
    ySpacing: '',
    shouldRename: false,
    loaded: false,
  }

  componentDidMount() {
    window.onmessage = (event: MessageEvent) => {
      let { pluginMessage: msg } = event.data;
      switch (msg.type) {
        case 'current-prefs': {
          let { prefs } = msg;
          let {xSpacing, ySpacing, shouldRename} = prefs;
          xSpacing = String(xSpacing);
          ySpacing = String(ySpacing);
          shouldRename = Boolean(shouldRename);
          this.setState({defaultPrefs: prefs, xSpacing, ySpacing, shouldRename, loaded: true});
          break;
        }
      }
    };
  }

  handleSave = () => {
    let xSpacing = parseInt(this.state.xSpacing, 10);
    let ySpacing = parseInt(this.state.ySpacing, 10);
    let shouldRename = this.state.shouldRename;

    if (isNaN(xSpacing)) {
      xSpacing = this.state.defaultPrefs.xSpacing;
    }
    if (isNaN(ySpacing)) {
      ySpacing = this.state.defaultPrefs.ySpacing;
    }
    parent.postMessage({
      pluginMessage: {
        type: 'save-prefs',
        prefs: {xSpacing, ySpacing, shouldRename},
      }
    }, '*');
  }

  handleClose = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel-prefs' } }, '*');
  }

  render() {
    let {loaded, xSpacing, ySpacing, shouldRename} = this.state;
    if (!loaded) {
      return 'Loading...';
    }

    return <React.Fragment>
      <Title weight="medium">"Rearrange" spacing for frames on this page:</Title>
      <div className='row'>
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
      </div>
      <Checkbox
        className=''
        isCheckbox
        label='Rename frames (e.g A01, A02 etc..)'
        defaultValue={shouldRename}
        onChange={(value) => {
          this.setState({ shouldRename: value });
        }}
      />
      <div className="buttons">
        <Button onClick={this.handleSave}
            isDisabled={xSpacing === '' || ySpacing === ''}>Save</Button>
        <Button onClick={this.handleClose} isSecondary>Cancel</Button>
      </div>
    </React.Fragment>;
  }
}

ReactDOM.render(<App />, document.querySelector('.root'));
