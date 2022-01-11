import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import classes from './App.module.css';
import TestTokenAbi from '../src/abis/TestToken.json';
import TokenStakingAbi from '../src/abis/StakingCreation.json';
import StakingAbi from '../src/abis/Staking.json';
import CreateStaking from "./components/CreateStaking";
import Info from "./components/Info";
import Staking from './components/Staking';
import moment from 'moment';

const App = () => {
  const [account, setAccount] = useState('Connecting to Metamask..');
  const [network, setNetwork] = useState({ id: '0', name: 'none' });
  const [testTokenContract, setTestTokenContract] = useState('');
  const [stakingCreationContract, setStakingCreationContract] = useState('');
  const [tokenStakingContract, setTokenStakingContract] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [createStaking, setCreateStaking] = useState({
    stakeAddress: '',
    poolAddress: '',
    startBlock: '',
    finishBlock: '',
    poolTokenSupply: '',
    hasWhitelisting: false,
  });
  const [allStakedAmount, setAllStakedAmount] = useState(0);
  const [myStake, setMyStake] = useState(0);
  const [allRewardDebt, setAllRewardDebt] = useState(0);
  const [allPaidReward, setAllPaidReward] = useState(0);
  const [accTokensPerShare, setAccTokensPerShare] = useState(0);
  const [participants, setParticipants] = useState(0);
  const [pendingReward, setPendingReward] = useState(0);
  const [lastRewardTime, setLastRewardTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [finishTime, setFinishTime] = useState(0);
  const [rewardPerSec, setRewardPerSec] = useState(0);

  const [appStatus, setAppStatus] = useState(true);
  const [loader, setLoader] = useState(false);
  const [userBalance, setUserBalance] = useState('0');
  const [currentStakingContractAddress, setCurrentStakingContract] = useState('');

  const tokenContractAddress = '0x9f11c83606fe28542f0278797c78cb66488d7eef';
  const stakingContractAddress = '0x5564F5c9f63B8C69d0D1D188306c96F1CD9E3fFD';

  useEffect(() => {
    //connecting to ethereum blockchain
    const ethEnabled = async () => {
      fetchDataFromBlockchain();
    };

    ethEnabled();
  }, []);

  const fetchDataFromBlockchain = async () => {
    console.log('currentStakingContractAddress');
    console.log(currentStakingContractAddress);
    if (window.ethereum) {
      // await window.ethereum.send('eth_requestAccounts');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.web3 = new Web3(window.ethereum);

      //connecting to metamask
      let web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      //loading users network ID and name
      const networkId = await web3.eth.net.getId();
      const networkType = await web3.eth.net.getNetworkType();
      setNetwork({ ...network, id: networkId, name: networkType });

      //loading TestTokenAbi contract data
      if (networkId === 97) {
        let web3 = window.web3;
        const testToken = new web3.eth.Contract(
          TestTokenAbi,
          tokenContractAddress
        );
        setTestTokenContract(testToken);

        //  fetching balance of Testtoken and storing in state
        let testTokenBalance = await testToken.methods
          .balanceOf(accounts[0])
          .call();
        let convertedBalance = window.web3.utils.fromWei(
          testTokenBalance.toString(),
          'Ether'
        );
        setUserBalance(convertedBalance);

      } else {
        setAppStatus(false);
        window.alert(
          'TestToken contract is not deployed on this network, please change to testnet'
        );
      }

      if (networkId === 97) {
        let web3 = window.web3;
        const stakingCreationC = new web3.eth.Contract(
          TokenStakingAbi,
          stakingContractAddress,
        );
        setStakingCreationContract(stakingCreationC);

        if (currentStakingContractAddress) {
          const stakingContract = new web3.eth.Contract(
              StakingAbi,
              currentStakingContractAddress,
          );
          console.log(currentStakingContractAddress);
          setTokenStakingContract(stakingContract);

          let [
            myStake,
            allRewardDebt,
            allPaidReward,
            accTokensPerShare,
            participants,
            pendingReward,
            lastRewardTime,
            rewardPerSec,
            startTime,
            finishTime,
            allStakedAmount,
          ] = await Promise.all([
            stakingContract.methods.getUserInfo(accounts[0]).call(),
            stakingContract.methods.allRewardDebt().call(),
            stakingContract.methods.allPaidReward().call(),
            stakingContract.methods.accTokensPerShare().call(),
            stakingContract.methods.participants().call(),
            stakingContract.methods.pendingReward(accounts[0]).call(),
            stakingContract.methods.lastRewardTime().call(),
            stakingContract.methods.rewardPerSec().call(),
            stakingContract.methods.startTime().call(),
            stakingContract.methods.finishTime().call(),
            stakingContract.methods.allStakedAmount().call(),
          ])

          myStake = window.web3.utils.fromWei(myStake[0].toString(), 'Ether');
          allRewardDebt = window.web3.utils.fromWei(allRewardDebt.toString(), 'Ether');
          allPaidReward = window.web3.utils.fromWei(allPaidReward.toString(), 'Ether');
          accTokensPerShare = window.web3.utils.fromWei(accTokensPerShare.toString(), 'Ether');
          pendingReward = window.web3.utils.fromWei(pendingReward.toString(), 'Ether');
          rewardPerSec = window.web3.utils.fromWei(rewardPerSec.toString(), 'Ether');
          allStakedAmount = allStakedAmount ? window.web3.utils.fromWei(allStakedAmount.toString(), 'Ether') : 0;
          startTime = moment.unix(startTime).format("YYYY-MM-DD HH:mm");
          finishTime =  moment.unix(finishTime).format("YYYY-MM-DD HH:mm");
          lastRewardTime =  moment.unix(lastRewardTime).format("YYYY-MM-DD HH:mm");

          setMyStake(myStake);
          setAllRewardDebt(allRewardDebt);
          setAllPaidReward(allPaidReward);
          setAccTokensPerShare(accTokensPerShare);
          setPendingReward(pendingReward);
          setRewardPerSec(rewardPerSec);
          setAllStakedAmount(allStakedAmount);
          setStartTime(startTime);
          setFinishTime(finishTime);
          setLastRewardTime(lastRewardTime);
          setParticipants(participants);
        } else {
          console.log('exited');
        }

      } else {
        setAppStatus(false);
        window.alert(
          'Staking contract is not deployed on this network, please change to testnet'
        );
      }

      //removing loader
      setLoader(false);
    } else if (!window.web3) {
      setAppStatus(false);
      setAccount('Metamask is not detected');
      setLoader(false);
    }
  };

  const inputHandler = (received) => {
    setInputValue(received);
  };

  const createStakingHandler = (received) => {
    setCreateStaking(received);
  };

  const stakingContractHandler = (contract) => {
    setCurrentStakingContract(contract);
    console.log(contract);
    fetchDataFromBlockchain();
  };

  const stakeHandler = () => {
    if (!appStatus) {
    } else {
      if (!inputValue || inputValue === '0' || inputValue < 0) {
        setInputValue('');
      } else {
        setLoader(true);
        let convertToWei = window.web3.utils.toWei(inputValue, 'Ether');

        //aproving tokens for spending
        testTokenContract.methods
          .approve(currentStakingContractAddress, convertToWei)
          .send({ from: account })
          .on('transactionHash', (hash) => {
            tokenStakingContract.methods
              .stakeTokens(convertToWei)
              .send({ from: account })
              .on('transactionHash', (hash) => {
                setLoader(false);
                fetchDataFromBlockchain();
              })
              .on('receipt', (receipt) => {
                setLoader(false);
                fetchDataFromBlockchain();
              })
              .on('confirmation', (confirmationNumber, receipt) => {
                setLoader(false);
                fetchDataFromBlockchain();
              });
          })
          .on('error', function(error) {
            setLoader(false);
            console.log('Error Code:', error.code);
            console.log(error.message);
          });
        setInputValue('');
      }
    }
  };

  const unStakeHandler = () => {
    if (!appStatus) {
    } else {
      if (!inputValue || inputValue === '0' || inputValue < 0) {
        setInputValue('');
      } else {
        setLoader(true);
        let convertToWei = window.web3.utils.toWei(inputValue, 'Ether')
        tokenStakingContract.methods
          .withdrawStake(convertToWei)
          .send({ from: account })
          .on('transactionHash', (hash) => {
            setLoader(false);
            fetchDataFromBlockchain();
          })
          .on('receipt', (receipt) => {
            setLoader(false);
            fetchDataFromBlockchain();
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            setLoader(false);
            fetchDataFromBlockchain();
          })
          .on('error', function(error) {
            console.log('Error Code:', error.code);
            console.log(error.message);
            setLoader(false);
          });
      }
      setInputValue('');
    }
  };

  const claimRewardsHandler = () => {
    if (!appStatus) {
    } else {
      if (!inputValue || inputValue === '0' || inputValue < 0) {
        setInputValue('');
      } else {
        setLoader(true);
        let convertToWei = window.web3.utils.toWei(inputValue, 'Ether')
        tokenStakingContract.methods
          .withdrawStake(convertToWei)
          .send({ from: account })
          .on('transactionHash', (hash) => {
            setLoader(false);
            fetchDataFromBlockchain();
          })
          .on('receipt', (receipt) => {
            setLoader(false);
            fetchDataFromBlockchain();
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            setLoader(false);
            fetchDataFromBlockchain();
          })
          .on('error', function(error) {
            console.log('Error Code:', error.code);
            console.log(error.message);
            setLoader(false);
          });
      }
      setInputValue('');
    }
  };

  const reinvestRewardsHandler = () => {
    if (!appStatus) {
    } else {
      setLoader(true);

      // let convertToWei = window.web3.utils.toWei(inputValue, 'Ether')
      tokenStakingContract.methods
          .reinvestTokens()
          .send({ from: account })
          .on('transactionHash', (hash) => {
            setLoader(false);
            fetchDataFromBlockchain();
          })
          .on('receipt', (receipt) => {
            setLoader(false);
            fetchDataFromBlockchain();
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            setLoader(false);
            fetchDataFromBlockchain();
          })
          .on('error', function(error) {
            console.log('Error Code:', error.code);
            console.log(error.message);
            setLoader(false);
          });

      setInputValue('');
    }
  };

  const createStakingPoolHandler = (stakingObject) => {
    if (!appStatus) {
    } else {
      setLoader(true);
      let convertedToWei = window.web3.utils.toWei(stakingObject.poolTokenSupply, 'Ether');

      //aproving tokens for spending
      testTokenContract.methods
        .approve(stakingContractAddress, convertedToWei)
        .send({ from: account })
        .on('transactionHash', (hash) => {
          stakingCreationContract.methods.createStakingPool(
                stakingObject.stakeAddress,
                stakingObject.poolAddress,
                stakingObject.startBlock,
                stakingObject.finishBlock,
                convertedToWei,
                stakingObject.hasWhitelisting,
              )
              .send({ from: account })
              .on('transactionHash', (hash) => {
                setLoader(false);
                fetchDataFromBlockchain();
              })
              .on('receipt', (receipt) => {
                setLoader(false);
                fetchDataFromBlockchain();
              })
              .on('confirmation', (confirmationNumber, receipt) => {
                setLoader(false);
                fetchDataFromBlockchain();
              });
        })
        .on('error', function(error) {
          setLoader(false);
          console.log('Error Code:', error.code);
          console.log(error.message);
        });
      setInputValue('');
    }
  };

  return (
    <div className={classes.Grid}>
      {loader ? <div className={classes.curtain}></div> : null}
      <div className={classes.Child1}>
        <div>
          <CreateStaking
            createStakingHandler={createStakingHandler}
            createStakingPoolHandler={createStakingPoolHandler}
          />
        </div>
      </div>
      <div className={classes.Child2}>
        <div className={classes.childHeight}>
          <Staking
              account={account}
              userBalance={userBalance}
              unStakeHandler={unStakeHandler}
              stakeHandler={stakeHandler}
              inputHandler={inputHandler}
              stakingContractHandler={stakingContractHandler}
              claimRewardsHandler={claimRewardsHandler}
              reinvestRewardsHandler={reinvestRewardsHandler}
          />
        </div>
      </div>
      <div className={classes.Child3}>
        <div>
          <Info
              account={account}

              myStake={myStake}
              allRewardDebt={allRewardDebt}
              allPaidReward={allPaidReward}
              accTokensPerShare={accTokensPerShare}
              participants={participants}
              pendingReward={pendingReward}
              lastRewardTime={lastRewardTime}
              startTime={startTime}
              finishTime={finishTime}
              rewardPerSec={rewardPerSec}
              allStakedAmount={allStakedAmount}
              userBalance={userBalance}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
