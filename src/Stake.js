import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.js';
import {Button} from "react-bootstrap";
import WithdrawPopup from "./WithdrawPopup";
import StakePopup from "./StakePopup";


class Stake extends Component {

	constructor(props) {
		super(props)
		this.state = {
			stakeAmount: '0'
		}
	}


	render() {

		let isReinvestEnabled = this.props.StakingContractData.stakingTokenData.tokenContractAddress ===
			this.props.StakingContractData.rewardTokenData.tokenContractAddress;

		let button;
		if (!this.props.StakingContractData.stakingTokenData.isTokenApproved) {
			button =
				<div>
					<Button type="submit" className="stakenow-btn btn-lg" onClick={(event) => {
						event.preventDefault()
						if (this.props.StakingContractData) {
							this.props.approve(this.props.StakingContractData)
						}
					}}> Approve </Button>
				</div>
		} else {
			button = <div>
				<Button type="submit" className="btn btn-lg center-block claimAndWithdrawBtn" onClick={(event) => {
					event.preventDefault()
					if (this.props.StakingContractData) {
						this.props.claim(this.props.StakingContractData)
					}
				}}> Claim </Button>

				<Button type="submit"
								className="btn btn-lg center-block claimAndWithdrawBtn"
								disabled={!isReinvestEnabled}
								onClick={(event) => {
									event.preventDefault()
									if (this.props.StakingContractData) {
										this.props.reinvest(this.props.StakingContractData)
									}
								}}> Reinvest </Button>

				<WithdrawPopup
					StakingContractData={this.props.StakingContractData}
					withdraw={this.props.withdraw}
				/>
			</div>
		}

		return (

			<div className="table-responsive">
				<div className='tokenNameDiv'>

					<table className='table table-borderless table-sm'>
						<tbody>
						<tr>
							<td><h3> {this.props.StakingContractData.stakingTokenData.name}</h3></td>
							<td className='token-heading-btn'>
								<StakePopup
									StakingContractData={this.props.StakingContractData}
									stake={this.props.stake}
								/>
							</td>
						</tr>
						</tbody>
					</table>
				</div>

				<table className='table table-borderless table-sm'>
					<tbody>
					<tr>
						<td className='token-declaration-text'> Total Staked</td>
						<td
							className='infoTableValue'> {this.props.StakingContractData.allStakedAmount} {this.props.StakingContractData.stakingTokenData.symbol} </td>
					</tr>
					<tr>
						<td className='token-declaration-text'> APR</td>
						{/*TODO: change to correct APR*/}
						<td className='infoTableValue'> 10%</td>
					</tr>
					<tr>
						<td className='token-declaration-text'> My Wallet</td>
						<td
							className='infoTableValue'> {this.props.StakingContractData.stakeTokenBalance} {this.props.StakingContractData.stakingTokenData.symbol} </td>
					</tr>
					<tr>
						<td className='token-declaration-text'> My Stake</td>
						<td
							className='infoTableValue'> {this.props.StakingContractData.myStake} {this.props.StakingContractData.stakingTokenData.symbol} </td>
					</tr>
					<tr>
						<td className='token-declaration-text'> My Rewards</td>
						<td
							className='infoTableValue'> {this.props.StakingContractData.pendingReward} {this.props.StakingContractData.rewardTokenData.symbol} </td>
					</tr>
					<tr>
						<td className='token-declaration-text'> Weekly Estimate</td>
						{/*TODO: change to correct Estimate*/}
						<td
							className='infoTableValue'> {this.props.StakingContractData.weeklyEstimate} {this.props.StakingContractData.rewardTokenData.symbol} </td>
					</tr>
					<tr>
						<td className='token-declaration-text'> Pool End Date (UTC)</td>
						<td className='infoTableValue'> {this.props.StakingContractData.finishTime} </td>
					</tr>
					</tbody>
				</table>

				{button}

			</div>

		);
	}
}

export default Stake;
