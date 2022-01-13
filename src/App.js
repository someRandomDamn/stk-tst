import './App.css';
import {MutatingDots} from "react-loader-spinner";
import Main from './Main.js'
import React, {Component} from 'react';
import Web3 from 'web3';
import stakingContract from './abis/StakingContract.json';
import stakingCreationContract from './abis/StakingCreationContract.json';
import NavbarLocal from './Navbar.js';
import CreateStaking from './CreateStaking.js';
import StakeToken from './abis/StakeToken.json';
import RewardToken from './abis/RewardToken.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import {Routes, Route} from 'react-router-dom';

class App extends Component {

	constructor(props) {
		super(props)
		this.state = {
			approveAmount: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
			account: '',
			ethBalance: '0',
			StakingContract: {},
			loading: true,
			staketoken: {},
			staking: 'true', // deprecated
			rewardtoken: {},
			RewardTokenBalance: '0',
			StakingContractAddress: '',
			StakingCreationContractAddress: '',
			stakingcontractdata: true,
			isStakeTokenApproved: false,
			stakingCreationContractData: false,
			StakingCreationContract: {},

			stakeTokenBalance: '0',
			myStake: '0',
			allRewardDebt: '0',
			allPaidReward: '0',
			accTokensPerShare: '0',
			pendingReward: '0',
			weeklyEstimate: '0',
			allStakedAmount: '0',
			startTime: '',
			finishTime: '',
			lastRewardTime: '',
		}
	}

	async componentDidMount() {
		await this.loadWeb3()
		await this.loadBlockchainData()
	}

	async loadBlockchainData() {
		const web3 = window.web3

		// load stake token and stake token bal of connected address
		const StakeTokenData = StakeToken.networks[this.state.networkID]
		if (StakeTokenData) {
			const StakeTokenAddress = StakeToken.networks[this.state.networkID].address
			const staketoken = new web3.eth.Contract(StakeToken.abi, StakeTokenAddress)
			this.setState({staketoken})

			let [
				stakeTokenBalance,
				allowance,
			] = await Promise.all([
				staketoken.methods.balanceOf(this.state.account).call(),
				staketoken.methods.allowance(this.state.account, stakingContract.networks[this.state.networkID].address).call(),
			])

			this.setState({
				stakeTokenBalance: window.web3.utils.fromWei(stakeTokenBalance.toString(), 'Ether'),
				isStakeTokenApproved: allowance === this.state.approveAmount,
			})

		} else {
			window.alert('token to be staked not on this blockchain network, switch to ropsten')
		}

		// load stake token and stake token bal of connected address
		const RewardTokenData = RewardToken.networks[this.state.networkID]
		if (RewardTokenData) {
			const RewardTokenAddress = RewardToken.networks[this.state.networkID].address

			const rewardtoken = new web3.eth.Contract(RewardToken.abi, RewardTokenAddress)
			this.setState({rewardtoken: rewardtoken})

			let RewardTokenBalance = await rewardtoken.methods.balanceOf(this.state.account).call()

			this.setState({
				RewardTokenBalance: RewardTokenBalance.toString()
			})

		} else {
		}


		// load staking contract
		const StakingContractData = stakingContract.networks[this.state.networkID]
		if (StakingContractData) {
			this.setState({stakingcontractdata: true})
			const StakingContractAddress = stakingContract.networks[this.state.networkID].address
			this.setState({StakingContractAddress: StakingContractAddress})

			const StakingContract = new web3.eth.Contract(stakingContract.abi, StakingContractAddress)

			let [
				myStake,
				allRewardDebt,
				allPaidReward,
				accTokensPerShare,
				pendingReward,
				lastRewardTime,
				rewardPerSec,
				startTime,
				finishTime,
				allStakedAmount,
			] = await Promise.all([
				StakingContract.methods.getUserInfo(this.state.account).call(),
				StakingContract.methods.allRewardDebt().call(),
				StakingContract.methods.allPaidReward().call(),
				StakingContract.methods.accTokensPerShare().call(),
				StakingContract.methods.pendingReward(this.state.account).call(),
				StakingContract.methods.lastRewardTime().call(),
				StakingContract.methods.rewardPerSec().call(),
				StakingContract.methods.startTime().call(),
				StakingContract.methods.finishTime().call(),
				StakingContract.methods.allStakedAmount().call(),
			])

			myStake = window.web3.utils.fromWei(myStake[0].toString(), 'Ether');
			allRewardDebt = window.web3.utils.fromWei(allRewardDebt.toString(), 'Ether');
			allPaidReward = window.web3.utils.fromWei(allPaidReward.toString(), 'Ether');
			accTokensPerShare = window.web3.utils.fromWei(accTokensPerShare.toString(), 'Ether');
			pendingReward = window.web3.utils.fromWei(pendingReward.toString(), 'Ether');
			// rewardPerSec = window.web3.utils.fromWei(rewardPerSec.toString(), 'Ether');
			allStakedAmount = allStakedAmount ? window.web3.utils.fromWei(allStakedAmount.toString(), 'Ether') : 0;
			startTime = moment.unix(startTime).format("YYYY-MM-DD HH:mm");
			finishTime = moment.unix(finishTime).format("YYYY-MM-DD HH:mm");
			lastRewardTime = moment.unix(lastRewardTime).format("YYYY-MM-DD HH:mm");
			let weeklyEstimate = window.web3.utils.fromWei(
				window.web3.utils.toBN(rewardPerSec).muln(60 * 60 * 24 * 7),
				'Ether',
			)

			this.setState({
				StakingContract,
				myStake,
				allRewardDebt,
				allPaidReward,
				accTokensPerShare,
				pendingReward,
				weeklyEstimate,
				allStakedAmount,
				startTime,
				finishTime,
				lastRewardTime,
			})

		} else {
			this.setState({stakingcontractdata: false})
			window.alert('staking contract not live on this blockchain, please switch to ropsten')
		}

		// load staking creation contract
		const StakingCreationContractData = stakingCreationContract.networks[this.state.networkID]
		if (StakingCreationContractData) {
			this.setState({stakingCreationContractData: true})
			const StakingCreationContractAddress = stakingCreationContract.networks[this.state.networkID].address
			this.setState({StakingCreationContractAddress: StakingCreationContractAddress})

			const StakingCreationContract = new web3.eth.Contract(stakingCreationContract.abi, StakingCreationContractAddress)
			this.setState({
				StakingCreationContract,
			})

		} else {
			this.setState({stakingCreationContractData: false})
			window.alert('staking creation contract not live on this blockchain, please switch to ropsten')
		}

		this.setState({loading: false})
	}

	async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable()
			const web3 = window.web3

			const accounts = await web3.eth.getAccounts()
			this.setState({account: accounts[0]})

			const ethBalance = await web3.eth.getBalance(this.state.account)
			this.setState({ethBalance: ethBalance})

			const networkID = await web3.eth.net.getId()
			console.log(networkID)
			this.setState({networkID: networkID})
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
			const web3 = window.web3

			const accounts = await web3.eth.getAccounts()
			this.setState({account: accounts[0]})

			const ethBalance = await web3.eth.getBalance(this.state.account)
			this.setState({ethBalance: ethBalance})

			const networkID = await web3.eth.net.getId()
			console.log(networkID)
			this.setState({networkID: networkID})
		} else {
			window.alert('Non-Ethereum browser detected. Please install metamask chrome extension and refresh page')
		}
	}

	approve = () => {
		if (this.state.stakingcontractdata === true) {
			this.state.staketoken.methods
				// make it +/- max approve so its needed only once
				.approve(this.state.StakingContractAddress, this.state.approveAmount)
				.send({from: this.state.account})
				.on('transactionHash', (hash) => {
				})
				.on('confirmation', (confirmationNumber) => {
					this.setState({isStakeTokenApproved: true})
				})
		} else {
			window.alert('staking contract not live on this blockchain')
		}
	}

	stake = (AmountStaked) => {
		if (this.state.stakingcontractdata === true) {

			if (this.state.isStakeTokenApproved) {
				this.state.StakingContract.methods.stakeTokens(AmountStaked).send({from: this.state.account}).on('transactionHash', (hash) => {
					this.loadBlockchainData()
					this.setState({loading: false})
				})
			} else {
				window.alert('staking contract has no enough access to the owners token')
			}

		} else {
			window.alert('staking contract not live on this blockchain')
		}
	}

	withdraw = (AmountToBeWithdrawn) => {
		if (this.state.stakingcontractdata === true) {
			this.state.StakingContract.methods
				.withdrawStake(AmountToBeWithdrawn)
				.send({from: this.state.account})
				.on('transactionHash', (hash) => {
					this.setState({loading: false})
				})
				.on('receipt', (receipt) => {
					this.setState({loading: false})
				})
				.on('confirmation', (confirmationNumber, receipt) => {
					this.loadBlockchainData()
					this.setState({loading: false})
				})
				.on('error', function (error) {
					this.setState({loading: false})
				});
		} else {
			window.alert('staking contract not live on this blockchain')
		}
	}

	claim = () => {
		this.setState({loading: true})
		if (this.state.stakingcontractdata === true) {
			this.state.StakingContract.methods
				.withdrawStake(0)
				.send({from: this.state.account})
				.on('transactionHash', (hash) => {
					this.setState({loading: false})
				})
				.on('receipt', (receipt) => {
					this.setState({loading: false})
				})
				.on('confirmation', (confirmationNumber, receipt) => {
					this.loadBlockchainData()
					this.setState({loading: false})
				})
				.on('error', function (error) {
					this.setState({loading: false})
				});
		} else {
			window.alert('staking contract not live on this blockchain')
		}
	}

	reinvest = () => {
		this.setState({loading: true})
		if (this.state.stakingcontractdata === true) {
			this.state.StakingContract.methods
				.reinvestTokens()
				.send({from: this.state.account})
				.on('transactionHash', (hash) => {
					this.setState({loading: false})
				})
				.on('receipt', (receipt) => {
					this.setState({loading: false})
				})
				.on('confirmation', (confirmationNumber, receipt) => {
					this.loadBlockchainData()
					this.setState({loading: false})
				})
				.on('error', function (error) {
					this.setState({loading: false})
				});
		} else {
			window.alert('staking contract not live on this blockchain')
		}
	}

	createStakingPoolHandler = (stakingObject) => {
		console.log(stakingObject);

		this.setState({loading: true})
		if (this.state.stakingCreationContractData === true) {
			let convertedToWei = window.web3.utils.toWei(stakingObject.poolTokenSupply, 'Ether');

			this.state.staketoken.methods
				.approve(this.state.StakingCreationContractAddress, convertedToWei)
				.send({from: this.state.account})
				.on('transactionHash', (hash) => {
					this.state.StakingCreationContract.methods.createStakingPool(
						stakingObject.stakeAddress,
						stakingObject.poolAddress,
						stakingObject.startBlock,
						stakingObject.finishBlock,
						convertedToWei,
						stakingObject.hasWhitelisting,
					)
						.send({from: this.state.account})
						.on('transactionHash', (hash) => {
							this.setState({loading: false})
						})
						.on('receipt', (receipt) => {
							this.setState({loading: false})
						})
						.on('confirmation', (confirmationNumber, receipt) => {
							this.setState({loading: false})
						});
				})
				.on('error', function (error) {
					this.setState({loading: false})
				});

		} else {
			window.alert('staking contract not live on this blockchain')
		}
	};

	render() {

		return (
			<div className='secondDiv'>
				<div className="App secondDiv">
					<NavbarLocal account={this.state.account} loading={this.state.loading}/>
					<div style={{ background: 0}}>
						<Routes>
							<Route path='/' element={<CreateStaking
								createStakingPoolHandler={this.createStakingPoolHandler}
							/>}/>
							<Route path='/staking-list' element={<Main
								ethBalance={this.state.ethBalance}
								stakeTokenBalance={this.state.stakeTokenBalance}
								staking={this.state.staking}
								stake={this.stake}
								withdraw={this.withdraw}
								claim={this.claim}
								reinvest={this.reinvest}
								approve={this.approve}
								RewardTokenBalance={this.state.RewardTokenBalance}
								StakingContract={this.state.StakingContract}
								stakingcontractdata={this.state.stakingcontractdata}
								isStakeTokenApproved={this.state.isStakeTokenApproved}
								loading={this.state.loading}


								myStake={this.state.myStake}
								allRewardDebt={this.state.allRewardDebt}
								allPaidReward={this.state.allPaidReward}
								accTokensPerShare={this.state.accTokensPerShare}
								pendingReward={this.state.pendingReward}
								weeklyEstimate={this.state.weeklyEstimate}
								allStakedAmount={this.state.allStakedAmount}
								startTime={this.state.startTime}
								finishTime={this.state.finishTime}
								lastRewardTime={this.state.lastRewardTime}
							/>}/>
						</Routes>
					</div>

				</div>
			</div>
		);

	}
}

export default App;
