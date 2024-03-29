import { Bold, Button, Container, IconDistributeHorizontalSpacing32, IconDistributeVerticalSpacing32, Inline, render, Stack, Text, TextboxNumeric, useInitialFocus, VerticalSpace } from '@create-figma-plugin/ui';
import { emit } from '@create-figma-plugin/utilities';
import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { Prefs } from '../../prefs';

function Plugin({ prefs: defaultPrefs, scope }: { prefs: Prefs, scope: string }) {
  let [xSpacing, setXSpacing] = useState(String(defaultPrefs.xSpacing));
  let [ySpacing, setYSpacing] = useState(String(defaultPrefs.ySpacing));

  let xs = parseInt(xSpacing, 10);
  let ys = parseInt(ySpacing, 10);

  function handleSave() {
    if (isNaN(xs) || isNaN(ys)) {
      return;
    }

    emit('SAVE_PREFS', { prefs: { xSpacing: xs, ySpacing: ys } });
  }

  return <Container space="small" onKeyDown={ev => {
    if (ev.key === 'Escape') {
      emit('CANCEL');
    } else if (ev.key === 'Enter') {
      handleSave();
    }
  }}>
    <VerticalSpace space='small' />
    <Stack space="small">
      <Text>
        <Bold>"Rearrange" spacing for {scope}:</Bold>
      </Text>
      <TextboxNumeric
        variant="border"
        {...useInitialFocus()}
        placeholder="Horizontal"
        minimum={0}
        revertOnEscapeKeyDown
        icon={<IconDistributeHorizontalSpacing32 />}
        value={xSpacing}
        onValueInput={value => setXSpacing(value)} />
      <TextboxNumeric
        variant="border"
        placeholder="Vertical"
        minimum={0}
        revertOnEscapeKeyDown
        icon={<IconDistributeVerticalSpacing32 />}
        value={ySpacing}
        onValueInput={value => setYSpacing(value)} />
      <Inline style={{ display: 'flex', justifyContent: 'flex-end' }} space='small'>
        <Button secondary onClick={() => emit('CANCEL')}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isNaN(xs) || isNaN(ys)}>
          Save
        </Button>
      </Inline>
    </Stack>
    <VerticalSpace space='small' />
  </Container>;
}

export default render(Plugin);