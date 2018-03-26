import React from 'react';
import { Button, Spin } from 'antd';

import styles from './login.less';

export default class Login extends React.PureComponent {
	render() {
		return (
			<div className={styles.xxa}>
				<div className={styles.xxx}>
					<p className={styles.x1}><Button>fuck</Button></p>
					<div className={styles.x1}><Spin /></div>
				</div>
			</div>
		);
	}
}
