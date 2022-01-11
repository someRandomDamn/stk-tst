import React, { useState } from 'react';
import classes from './Staking.module.css';
import stakeIcon from '../assets/stake.png';
import unstakeIcon from '../assets/unstake.png';
import icon from '../assets/icon.png';

const Staking = (props) => {
  const [inputValue, setInputValue] = useState('');
  const [currentStakingContract, setCurrentStakingContract] = useState('');

  const inputChangeHandler = (event) => {
    event.preventDefault();
    setInputValue(event.target.value);
    props.inputHandler(event.target.value);
  };

    const setCurrentContractHandler = (event) => {
        event.preventDefault();
        setCurrentStakingContract(event.target.value);
        setCurrentStakingContract(event.target.value);
    };

  const goMax = () => {
    setInputValue(props.userBalance);
    props.inputHandler(props.userBalance);
  };

  return (
    <div className={classes.Staking}>
      <img src={icon} alt="logo" className={classes.icon} />
      <p>{props.account}</p>

        <div className={classes.inputDiv}>
            <input
                className={classes.input}
                onChange={setCurrentContractHandler}
                value={currentStakingContract}
                placeholder="Enter created staking contract to see details"
            ></input>
            <button
                className={classes.stakeButton}
                onClick={() => {props.stakingContractHandler(currentStakingContract)}}
            >        <p>Choose staking contract</p>
            </button>
        </div>

      <div className={classes.inputDiv}>
        <input
          className={classes.input}
          type="number"
          min="0"
          step="1"
          onChange={inputChangeHandler}
          value={inputValue}
        ></input>
      </div>
      <button
        className={classes.stakeButton}
        onClick={() => {
          props.stakeHandler();
          setInputValue('');
        }}
      >
        <img src={stakeIcon} alt="stake icon" className={classes.stakeIcon} />
        <p>Stake</p>
      </button>
      &nbsp; &nbsp;
      <button className={classes.unstakeButton} onClick={props.unStakeHandler}>
        <img
          src={unstakeIcon}
          alt="unstake icon"
          className={classes.stakeIcon}
        />
        <p>Unstake All</p>
      </button>
        <button className={classes.unstakeButton} onClick={props.claimRewardsHandler}>
            <img
                src={unstakeIcon}
                alt="unstake icon"
                className={classes.stakeIcon}
            />
            <p>Claim Rewards</p>
        </button>
        &nbsp; &nbsp;
        <button className={classes.unstakeButton} onClick={props.createStakingPoolHandler}>
            <img
                src={unstakeIcon}
                alt="unstake icon"
                className={classes.stakeIcon}
            />
            <p>Create Pool</p>
        </button>



        {/*allRewardDebt*/}
        {/*allPaidReward*/}
        {/*accTokensPerShare*/}
        {/*participants*/}
        {/*pendingReward*/}
        {/*lastRewardTime*/}
        {/*startTime*/}
        {/*finishTime*/}

        <div className={classes.totals}>Total Staked (by all users): {props.totalStaked}
        {/*<div>&nbsp;</div>*/}
        <h5>All staked amount: {props.allStakedAmount} </h5>
        <h5>All rewards debt: {props.allRewardDebt} </h5>
        <h5>All paid rewards: {props.allPaidReward} </h5>
        <h5>Acc tokens per share: {props.accTokensPerShare} </h5>
        <h5>Participants: {props.participants} </h5>
        <h5>Pending reward: {props.pendingReward} </h5>
        <h5>My stake:{props.myStake}</h5>
        <h5>Reward per sec:{' '} {props.rewardPerSec}</h5>
        <h5>Staking start:{' '} {props.startTime}</h5>
        <h5>Staking end:{' '} {props.finishTime}</h5>
        <h5>Last reward time:{' '} {props.lastRewardTime}</h5>
        <h5 onClick={goMax} className={classes.goMax}>My balance: {props.userBalance}</h5>
        <h5 className={classes.goMax}> Contract balance: {props.contractBalance}</h5>
      </div>
    </div>
  );
};

export default Staking;
