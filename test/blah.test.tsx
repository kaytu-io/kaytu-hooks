import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useURLParam } from '../src/urlparam';

function TestHook() {
  const [value, setValue] = useURLParam('question', 'who am I?')

  return <input value={value} onChange={(e) => setValue(e.target.value)} />
}

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TestHook />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
