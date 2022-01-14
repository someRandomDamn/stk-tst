import './App.css';
import Stake from './Stake.js';
import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class Main extends Component {

	constructor(props) {
		super(props)
		this.state = {
			staking: 'true',
			StakeBgColor: '',
			WithdrawBgColor: ''
		}
	}

	render() {

		return (
			<section className='myCards'>
			{
				this.props.StakingContractsObjList.map((StakingContractData, i) =>
					<div className='myCard border-dark rounded-lg shadow-lg p-3 mb-5 bg-white rounded ' key={i}>
						<Stake
							stake={this.props.stake}
							withdraw={this.props.withdraw}
							approve={this.props.approve}
							claim={this.props.claim}
							reinvest={this.props.reinvest}
							StakingContractData={StakingContractData}
						/>
					</div>
				)
			}
			</section>
		);
	}
}

export default Main;
