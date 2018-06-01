import React from 'react';
import logo from './logo.svg';
import { Rate } from 'antd';
import styles from './App.module.less';

class App extends React.Component {
	render() {
		return (
			<div className={styles.App}>
				<header className={styles.AppHeader}>
					<img src={logo} className={styles.AppLogo} alt='logo' />
					<h1 className={styles.AppTitle}>Welcome to React</h1>
				</header>
				<p className={styles.AppIntro}>To get started, edit <code>src/App.tsx</code> and save to reload.</p>
				<Rate character='6' />
			</div>
		);
	}
}

export default App;
