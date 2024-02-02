import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Thing } from '../.';
import { useURLParam } from '.././src/urlparam/index';

const App = () => {
  const [value, setValue] = useURLParam<boolean>(
    'lights',
    false,
    v => String(v),
    v => v === 'true'
  );
  
  return (
    <div>
      <button
        onClick={() => {
          setValue(value === true ? false : true);
        }}
      >
        {value === true ? 'Off' : 'On'}
      </button>
      <Thing />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
