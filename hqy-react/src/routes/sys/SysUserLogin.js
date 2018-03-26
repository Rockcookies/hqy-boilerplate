import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { Icon, Form, Input, Checkbox, Button, Alert, notification } from 'antd';
import { PORTAL_LOGO, PORTAL_COPYRIGHT, PORTAL_LINKS } from '../../config';
import log from '../../utils/log-utils';
import { getQuery, redirectRouterTo } from '../../utils/history-utils';
import { adminLogin } from '../../services/sys';

import GlobalFooter from '../../components/GlobalFooter';

import styles from './SysLogin.less';

const FormItem = Form.Item;

const pic = require.context('./images');

class SysUserLogin extends React.Component {
	static propTypes = {
		form: PropTypes.object
	}

	state = {
		loginPosting: false,
		loginPostingError: null
	}

	handleSubmit = (e) => {
		// 阻止事件冒泡
		e.preventDefault();

		const { form } = this.props;

		form.validateFields({ force: true }, (formError, values) => {
			if (formError) {
				return;
			}

			const { loginPosting } = this.state;
			if (loginPosting) {
				return;
			}

			// 设置为登录中
			this.setState({ loginPosting: true });

			// 服务器登录
			adminLogin(values).then(({ error }) => {
				// 帐号异常
				if (error) {
					this.setState({
						loginPosting: false,
						loginPostingError: error
					});
				// 登录成功
				} else {
					const query = getQuery();

					if (query.from) {
						window.location.href = query.from;
					} else {
						redirectRouterTo('app', 'portal');
					}
				}
			}).catch((error) => {
				// 服务器异常
				notification.error({
					message: `错误 [${error.errorCode}]`,
					description: error.message
				});
				log.error(error);
				this.setState({
					loginPosting: false,
					loginPostingError: null
				});
			});
		});
	}

	renderError = (error) => {
		return error ? (
			<Alert
				style={{ marginBottom: 24 }}
				message={error}
				type='error'
				showIcon
			/>
		) : null;
	}

	render() {
		const { form } = this.props;
		const { getFieldDecorator } = form;
		const { loginPosting, loginPostingError } = this.state;

		return (
			<DocumentTitle title={`登录 - ${PORTAL_LOGO}`}>
				<div className={styles.container} style={{ backgroundImage: `url(${pic('./login-bg.svg')})` }}>
					<div className={styles.top}>
						<div className={styles.header}>
							<Icon type='pie-chart' className={styles.logo} />
							<span className={styles.title}>{PORTAL_LOGO}</span>
						</div>
						<div className={styles.desc}>Copyright <Icon type='copyright' /> {PORTAL_COPYRIGHT}</div>
					</div>
					<div className={styles.main}>
						<Form onSubmit={this.handleSubmit}>
							{this.renderError(loginPostingError)}
							<FormItem>
								{getFieldDecorator('username', {
									initialValue: '13545087825',
									rules: [{
										required: true,
										message: '请输入账户名！',
										whitespace: true,
										min: 6,
										max: 20
									}]
								})(
									<Input
										size='large'
										prefix={<Icon type='user' />}
										placeholder='请输入账户名'
									/>
								)}
							</FormItem>
							<FormItem>
								{getFieldDecorator('password', {
									initialValue: '123456',
									rules: [{
										required: true,
										message: '请输入密码！',
										whitespace: true,
										min: 6,
										max: 20
									}]
								})(
									<Input
										size='large'
										prefix={<Icon type='lock' />}
										type='password'
										placeholder='请输入密码'
									/>
								)}
							</FormItem>
							<FormItem className={styles.additional}>
								{getFieldDecorator('remember', {
									valuePropName: 'checked',
									initialValue: true
								})(
									<Checkbox className={styles.autoLogin}>自动登录</Checkbox>
								)}
								<a className={styles.forgot}>忘记密码</a>
								<Button size='large' loading={loginPosting} className={styles.submit} type='primary' htmlType='submit'>登录</Button>
							</FormItem>
						</Form>
					</div>
					<GlobalFooter className={styles.footer} links={PORTAL_LINKS} copyright={<div>Copyright <Icon type='copyright' /> {PORTAL_COPYRIGHT}</div>} />
				</div>
			</DocumentTitle >
		);
	}
}

export default Form.create()(SysUserLogin);
