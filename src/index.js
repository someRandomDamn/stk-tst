import {HashRouter as Router} from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
	<Router basename='/'>
		<App/>
	</Router>,
	document.getElementById('root')
);
