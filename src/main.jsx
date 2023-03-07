import { render } from 'preact'
import { App } from './App'


import './style/app_style.scss';
import './style/shared.scss'
import './style/index.scss';
import "./style/custom_themes.scss";
import './style/color_themes.scss';
import "./style/initVariables.scss"

render(<App />, document.getElementById('app'))
