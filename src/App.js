import './App.css';
import Main from './Main.js'
import React, {Component} from 'react';
import Web3 from 'web3';
import stakingContractAbi from './abis/StakingContract.json';
import stakingCreationContractAbi from './abis/StakingCreationContract.json';
import NavbarLocal from './Navbar.js';
import CreateStaking from './CreateStaking.js';
import TokenAbi from './abis/Token.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import {Routes, Route} from 'react-router-dom';

class App extends Component {

	constructor(props) {
		super(props)
		this.state = {
			StakingContractsObjList: [],
			stakingCreationContract: '0x5564f5c9f63b8c69d0d1d188306c96f1cd9e3ffd',
			StakingCreationContractObj: {},
			stakingContracts: [
				'0x5a7502c918b14ac13d8c721e596da1c42ac3f2ec', // TODO: so there is always one by default, should be removed later
				'0x4De60A8210b4347a3f974E06339759dBABEF68e8', // TODO: so there is always one by default, should be removed later
			],
			approveAmount: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
			account: '',
			ethBalance: '0',
			loading: true,
		}
	}

	async componentDidMount() {
		await this.loadWeb3()
		await this.loadBlockchainData()
	}

	async loadBlockchainData() {
		const web3 = window.web3

		this.setState({loading: true})
		if (this.state.networkID !== 97) {
			window.alert('token to be staked not on this blockchain network, switch to BSC testnet')
			this.setState({loading: false})
			return;
		}

		const StakingCreationContractObj = new web3.eth.Contract(stakingCreationContractAbi, this.state.stakingCreationContract)
		this.setState({ StakingCreationContractObj })

		const cachedContracts = await this.getAllContractsFromCache();
		const stakingContractList = cachedContracts.reduce((contracts, cachedContract) => {
			if (!contracts.includes(cachedContract)) {
				contracts.push(cachedContract)
			}
			return contracts;
		}, this.state.stakingContracts);
		this.setState({ stakingContracts: stakingContractList});

		let contractDataPromiseList = [];
		for (const stakingContractAddress of this.state.stakingContracts) {
			contractDataPromiseList.push(this.getStakingContractData(stakingContractAddress));
		}

		this.setState({ StakingContractsObjList: await Promise.all(contractDataPromiseList) })
		this.setState({loading: false})
	}

	async getStakingContractData(stakingContractAddress) {
		const web3 = window.web3
		const StakingContractObj = new web3.eth.Contract(stakingContractAbi, stakingContractAddress)
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
			rewardTokenContractAddress,
			stakingTokenAmountContractAddress,
		] = await Promise.all([
			StakingContractObj.methods.getUserInfo(this.state.account).call(),
			StakingContractObj.methods.allRewardDebt().call(),
			StakingContractObj.methods.allPaidReward().call(),
			StakingContractObj.methods.accTokensPerShare().call(),
			StakingContractObj.methods.pendingReward(this.state.account).call(),
			StakingContractObj.methods.lastRewardTime().call(),
			StakingContractObj.methods.rewardPerSec().call(),
			StakingContractObj.methods.startTime().call(),
			StakingContractObj.methods.finishTime().call(),
			StakingContractObj.methods.allStakedAmount().call(),
			StakingContractObj.methods.rewardToken().call(),
			StakingContractObj.methods.stakingToken().call(),
		])

		myStake = window.web3.utils.fromWei(myStake[0].toString(), 'Ether');
		allRewardDebt = window.web3.utils.fromWei(allRewardDebt.toString(), 'Ether');
		allPaidReward = window.web3.utils.fromWei(allPaidReward.toString(), 'Ether');
		accTokensPerShare = window.web3.utils.fromWei(accTokensPerShare.toString(), 'Ether');
		pendingReward = window.web3.utils.fromWei(pendingReward.toString(), 'Ether');
		allStakedAmount = allStakedAmount ? window.web3.utils.fromWei(allStakedAmount.toString(), 'Ether') : 0;
		startTime = moment.unix(startTime).format("YYYY-MM-DD HH:mm");
		finishTime = moment.unix(finishTime).format("YYYY-MM-DD HH:mm");
		lastRewardTime = moment.unix(lastRewardTime).format("YYYY-MM-DD HH:mm");
		let weeklyEstimate = window.web3.utils.fromWei(
			window.web3.utils.toBN(rewardPerSec).muln(60 * 60 * 24 * 7),
			'Ether',
		)

		let [
			rewardTokenData,
			stakingTokenData,
		] = await Promise.all([
			this.getTokenContractData(rewardTokenContractAddress, stakingContractAddress),
			this.getTokenContractData(stakingTokenAmountContractAddress, stakingContractAddress),
		])

		return {
			StakingContractObj,
			stakingContractAddress,
			stakingTokenData,
			rewardTokenData,
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
		}
	}

	async getTokenContractData(tokenContractAddress, stakingContractAddress) {

		const web3 = window.web3
		const TokenObj = new web3.eth.Contract(TokenAbi, tokenContractAddress)
		let [
			stakeTokenBalance,
			allowance,
			symbol,
			name,
		] = await Promise.all([
			TokenObj.methods.balanceOf(this.state.account).call(),
			stakingContractAddress ? TokenObj.methods.allowance(this.state.account, stakingContractAddress).call() : null,
			TokenObj.methods.symbol().call(),
			TokenObj.methods.name().call(),
		])

		return {
			tokenContractAddress,
			TokenObj,
			tokenBalance: window.web3.utils.fromWei(stakeTokenBalance.toString(), 'Ether'),
			isTokenApproved: allowance?.length >= 50, // TODO: fix allowance check to more appropriate. This one used for demo.
			symbol,
			name,
		};
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

			this.setState({networkID: networkID})
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
			const web3 = window.web3

			const accounts = await web3.eth.getAccounts()
			this.setState({account: accounts[0]})

			const ethBalance = await web3.eth.getBalance(this.state.account)
			this.setState({ethBalance: ethBalance})

			const networkID = await web3.eth.net.getId()

			this.setState({networkID: networkID})
		} else {
			window.alert('Non-Ethereum browser detected. Please install metamask chrome extension and refresh page')
		}
	}

	approve = (StakingContractData) => {
		this.setState({loading: true})
		if (this.state.networkID === 97) {
			StakingContractData.stakingTokenData.TokenObj.methods
				// make it +/- max approve so its needed only once
				.approve(StakingContractData.stakingContractAddress, this.state.approveAmount)
				.send({from: this.state.account})
				.on('confirmation', (confirmationNumber) => {
					this.setState({
						StakingContractsObjList: this.state.StakingContractsObjList.map(contract => {
							if (contract.stakingContractAddress === StakingContractData.stakingContractAddress) {
								contract.stakingTokenData.isTokenApproved = true;
							}
							return contract;
						})
					})
				})
		} else {
			window.alert('approve: staking contract not live on this blockchain')
		}
	}

	stake = (StakingContractData, AmountStaked) => {
		this.setState({loading: true})
		if (this.state.networkID === 97) {
			if (StakingContractData.stakingTokenData.isTokenApproved) {
				StakingContractData.StakingContractObj.methods
					.stakeTokens(AmountStaked)
					.send({from: this.state.account})
					.on('confirmation', (confirmationNumber, receipt) => {
						this.loadBlockchainData()
						this.setState({loading: false})
					})
			} else {
				window.alert('staking contract has no enough access to the owners token')
			}

		} else {
			window.alert('stake: staking contract not live on this blockchain')
		}
	}

	withdraw = (StakingContractData, AmountToBeWithdrawn) => {
		this.setState({loading: true})
		if (this.state.networkID === 97) {
			StakingContractData.StakingContractObj.methods
				.withdrawStake(AmountToBeWithdrawn)
				.send({from: this.state.account})
				.on('confirmation', (confirmationNumber, receipt) => {
					this.loadBlockchainData()
					this.setState({loading: false})
				})
		} else {
			window.alert('withdraw: staking contract not live on this blockchain')
		}
	}

	claim = (StakingContractData) => {
		this.setState({loading: true})
		if (this.state.networkID === 97) {
			StakingContractData.StakingContractObj.methods
				.withdrawStake(0)
				.send({from: this.state.account})
				.on('confirmation', (confirmationNumber, receipt) => {
					this.loadBlockchainData()
					this.setState({loading: false})
				})
		} else {
			window.alert('claim: staking contract not live on this blockchain')
		}
	}

	reinvest = async (StakingContractData) => {

		if (StakingContractData.stakingTokenData.tokenContractAddress !== StakingContractData.rewardTokenData.tokenContractAddress) {
			window.alert('Reinvest disabled, because staking and pool tokens does not match')
			return;
		}

		this.setState({loading: true})
		if (this.state.networkID === 97) {
			StakingContractData.StakingContractObj.methods
				.reinvestTokens()
				.send({from: this.state.account})
				.on('confirmation', (confirmationNumber, receipt) => {
					this.loadBlockchainData()
					this.setState({loading: false})
				})
		} else {
			window.alert('reinvest: staking contract not live on this blockchain')
		}
	}

	createStakingPool = async (stakingObject) => {

		this.setState({loading: true})
		if (this.state.networkID === 97) {

			let convertedToWei = window.web3.utils.toWei(stakingObject.poolTokenSupply, 'Ether');
			let rewardTokenData = await this.getTokenContractData(stakingObject.poolAddress);

			rewardTokenData.TokenObj.methods
				.approve(this.state.stakingCreationContract, this.state.approveAmount)
				.send({from: this.state.account})
				.on('transactionHash', (hash) => {
					// create staking
					this.state.StakingCreationContractObj.methods.createStakingPool(
						stakingObject.stakeAddress,
						stakingObject.poolAddress,
						stakingObject.startBlock,
						stakingObject.finishBlock,
						convertedToWei,
						stakingObject.hasWhitelisting,
					)
					.send({from: this.state.account})
					.on('confirmation', (confirmationNumber, receipt) => {
						this.setState({loading: false})
						if (receipt?.events?.StakingPoolCreated?.returnValues?.pool) {
							this.storeInCache(receipt.events.StakingPoolCreated.returnValues.pool)
							this.loadBlockchainData()
						}
					});
				})
				.on('confirmation', (confirmationNumber, receipt) => {
					this.setState({loading: false})
				});

		} else {
			window.alert('create: staking contract not live on this blockchain')
		}
	};

	// TODO: its a temporary solution, because contracts are not stored in BE or Main Contract for now
	async storeInCache(contractAddress) {
		if ('caches' in window) {
			const cacheStorage = await caches.open('contracts');
			const cachedContractList = await this.getAllContractsFromCache();
			if (!cachedContractList.includes(contractAddress)) {
				cachedContractList.push(contractAddress)
				await cacheStorage.put('/', new Response(JSON.stringify(cachedContractList)));
			}
		}
	}
	// TODO: its a temporary solution, because contracts are not stored in BE or Main Contract for now
	async getAllContractsFromCache() {
		// Opening that particular cache
		const cacheStorage = await caches.open('contracts');

		// Fetching that particular cache data
		const cachedResponse = await cacheStorage.match('/');
		return cachedResponse?.json() || [];
	}

	render() {

		return (
			<div className='secondDiv'>
				<div className="App secondDiv">
					<NavbarLocal account={this.state.account} loading={this.state.loading}/>
					<div style={{ background: 0}}>
						<Routes>
							<Route exact path='/' element={<CreateStaking
								createStakingPool={this.createStakingPool}
							/>}/>
							<Route path='/staking-list' element={<Main
								stakeTokenBalance={this.state.stakeTokenBalance}
								stake={this.stake}
								withdraw={this.withdraw}
								claim={this.claim}
								reinvest={this.reinvest}
								approve={this.approve}
								RewardTokenBalance={this.state.RewardTokenBalance}
								StakingContract={this.state.StakingContract}
								stakingcontractdata={this.state.stakingcontractdata}
								loading={this.state.loading}
								StakingContractsObjList={this.state.StakingContractsObjList}
							/>}/>
						</Routes>
					</div>

				</div>
			</div>
		);

	}
}

export default App;
