import { createIframeMessenger } from 'figma-messenger';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button, Input, Title } from 'react-figma-plugin-ds';
import './ui.scss';

const messenger = createIframeMessenger<FitIframeToMain, FitMainToIframe>();

function App() {
  let [padding, setPadding] = useState('0');
  let [loaded, setLoaded] = useState(false);

  useEffect(() => {
    messenger.on('init', ({ padding }) => {
      setPadding(String(padding));
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return 'Loading...';
  }

  return <>
    <Title weight="bold">Padding around contents:</Title>
    <Input
      placeholder="Padding"
      icon="resize-to-fit"
      iconColor="black"
      defaultValue={padding}
      type="number"
      onChange={value => setPadding(value)} />
    <div className="buttons">
      <Button
        onClick={() => messenger.send('performFit', { padding: parseInt(padding, 10) })}
        isDisabled={padding === ''}>Fit</Button>
      <Button onClick={() => messenger.send('cancel')} isSecondary>Cancel</Button>
    </div>
  </>;
}

ReactDOM.render(<App />, document.querySelector('.root'));
