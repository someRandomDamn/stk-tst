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
			<div className=' card border border-dark rounded-lg shadow-lg p-3 mb-5 bg-white rounded card-props'>
				<div className='card-body'>
					<Stake
						ethBalance={this.props.ethBalance}
						stakeTokenBalance={this.props.stakeTokenBalance}
						stake={this.props.stake}
						withdraw={this.props.withdraw}
						staking={this.props.staking}
						approve={this.props.approve}
						claim={this.props.claim}
						reinvest={this.props.reinvest}
						LPTokenBalance={this.props.LPTokenBalance}
						StakingContract={this.props.StakingContract}
						stakingcontractdata={this.props.stakingcontractdata}
						isStakeTokenApproved={this.props.isStakeTokenApproved}

						myStake={this.props.myStake}
						allRewardDebt={this.props.allRewardDebt}
						allPaidReward={this.props.allPaidReward}
						accTokensPerShare={this.props.accTokensPerShare}
						pendingReward={this.props.pendingReward}
						weeklyEstimate={this.props.weeklyEstimate}
						allStakedAmount={this.props.allStakedAmount}
						startTime={this.props.startTime}
						finishTime={this.props.finishTime}
						lastRewardTime={this.props.lastRewardTime}
					/>
				</div>
			</div>
		);
	}
}

export default Main;
