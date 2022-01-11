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
        <br/><br/>

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
        <p>Unstake (auto-harvest)</p>
      </button>
        &nbsp; &nbsp;
        <button className={classes.unstakeButton} onClick={props.reinvestRewardsHandler}>
            <img
                src={unstakeIcon}
                alt="unstake icon"
                className={classes.stakeIcon}
            />
            <p>Reinvest</p>
        </button>

    </div>
  );
};

export default Staking;
