import React, { useState } from 'react';
import classes from './Staking.module.css';
import stakeIcon from '../assets/stake.png';
import unstakeIcon from '../assets/unstake.png';
import icon from '../assets/icon.png';

const Staking = (props) => {
  const [inputValue, setInputValue] = useState('');

  const inputChangeHandler = (event) => {
    event.preventDefault();
    setInputValue(event.target.value);
    props.inputHandler(event.target.value);
  };

  const goMax = () => {
    setInputValue(props.userBalance);
    props.inputHandler(props.userBalance);
  };

  return (
    <div className={classes.Staking}>
      <img src={icon} alt="logo" className={classes.icon} />
      <h1> Yield Farming / Token Staking dApp</h1>
      <p>{props.account}</p>
      <h3>
        {props.apy}% (APY) - {props.apy / 365}% Daily Earnings
      </h3>
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
      <div className={classes.totals}>
        <h4>
          Total Staked (by all users): {props.totalStaked} QTest
        </h4>
        <div>&nbsp;</div>
        <h5>My Stake: {props.myStake} QTest </h5>
        <h5>
          My Reward:{' '}
          {props.myReward} QTest
        </h5>
        <h5 onClick={goMax} className={classes.goMax}>
          My balance: {props.userBalance} QTest
        </h5>
        <h5 className={classes.goMax}>
          Contract balance: {props.contractBalance} QTest
        </h5>
      </div>
    </div>
  );
};

export default Staking;
