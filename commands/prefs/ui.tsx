import { createIframeMessenger } from 'figma-messenger';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button, Input, Title } from 'react-figma-plugin-ds';
import './ui.scss';

const messenger = createIframeMessenger<PrefsIframeToMain, PrefsMainToIframe>();

function App() {
  let [defaultPrefs, setDefaultPrefs] = useState({ xSpacing: 0, ySpacing: 0 });
  let [xSpacing, setXSpacing] = useState('');
  let [ySpacing, setYSpacing] = useState('');
  let [loaded, setLoaded] = useState(false);

  useEffect(() => {
    messenger.on('init', ({ prefs }) => {
      setDefaultPrefs(prefs);
      setXSpacing(String(prefs.xSpacing));
      setYSpacing(String(prefs.ySpacing));
      setLoaded(true);
    });
  }, []);

  function handleSave() {
    let xs = parseInt(xSpacing, 10);
    let ys = parseInt(ySpacing, 10);
    if (isNaN(xs)) {
      xs = defaultPrefs.xSpacing;
    }
    if (isNaN(ys)) {
      ys = defaultPrefs.ySpacing;
    }
    messenger.send('savePrefs', { prefs: { xSpacing: xs, ySpacing: ys } });
  }

  if (!loaded) {
    return <>'Loading...'</>;
  }

  return <>
    <Title weight="bold">"Rearrange" spacing for frames on this page:</Title>
    <Input
      placeholder="Horizontal"
      icon="distribute-horizontal-spacing"
      iconColor="black"
      defaultValue={xSpacing}
      type="number"
      onChange={value => setXSpacing(value)} />
    <Input
      placeholder="Vertical"
      icon="distribute-vertical-spacing"
      iconColor="black"
      defaultValue={ySpacing}
      type="number"
      onChange={value => setYSpacing(value)} />
    <div className="buttons">
      <Button onClick={handleSave}
        isDisabled={xSpacing === '' || ySpacing === ''}>Save</Button>
      <Button onClick={() => messenger.send('cancel')} isSecondary>Cancel</Button>
    </div>
  </>;
}


ReactDOM.render(<App />, document.querySelector('.root'));