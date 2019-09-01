import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Welcome } from '@storybook/react/demo';
import Button from '../components/Button';
import Footer from '../components/Footer';
import Header from '../components/Header';
import HubButton from '../components/HubButton';
import Input from '../components/Input';
import Misc from '../components/Misc';
import TabbedView from '../components/TabbedView';
import Table from '../components/Table';
import ToggleButton from '../components/ToggleButton';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

storiesOf('Footer', module)
    .add('With RACTF code', () => <Footer></Footer>)

storiesOf('Header', module)


storiesOf('HubButton', module)


storiesOf('Input', module)


storiesOf('Misc', module)


storiesOf('TabbedView', module)


storiesOf('Table', module)


storiesOf('ToggleButtom', module)