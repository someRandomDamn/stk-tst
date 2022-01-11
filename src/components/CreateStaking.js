import React, { useState } from 'react';
import classes from './Staking.module.css';
import stakeIcon from '../assets/stake.png';

const CreateStaking = (props) => {
    const emptyStaking = {
        stakeAddress: '',
        poolAddress: '',
        startBlock: '',
        finishBlock: '',
        poolTokenSupply: '',
        hasWhitelisting: false,
    };
    const [inputValue, setInputValue] = useState(emptyStaking);


  const inputChangeHandler = (event) => {
    event.preventDefault();
    setInputValue({
        ...inputValue,
        [event.target.name]: event.target.value,
    });
  };

  return (
    <div className={classes.Staking}>
      <h1> Create Staking</h1>

      <div className={classes.inputDiv}>
          <div>
              Staking Token<br/>
              <input className={classes.input} onChange={inputChangeHandler} value={inputValue.stakeAddress} autoComplete="off" name="stakeAddress" placeholder="Address of Token to be staked" required="" type="text"/><br/>

              Pool Token<br/>
              <input className={classes.input} onChange={inputChangeHandler} value={inputValue.poolAddress} autoComplete="off" name="poolAddress" placeholder="Address of reward Token" required="" type="text"/><br/>

              Start Time Stamp<br/>
              <input className={classes.input} onChange={inputChangeHandler} value={inputValue.startBlock} name="startBlock" placeholder="Start Time Stamp" required="" type="number"/><br/>

              Finish Time Stamp<br/>
              <input className={classes.input} onChange={inputChangeHandler} value={inputValue.finishBlock} name="finishBlock" placeholder="Finish Time Stamp" required="" type="number"/><br/>

              Pool Token Supply<br/>
              <input className={classes.input} onChange={inputChangeHandler} value={inputValue.poolTokenSupply} name="poolTokenSupply" placeholder="Pool Token Supply" required="" type="number"/><br/>

          </div>
          <button
              className={classes.stakeButton}
              onClick={() => {
                  props.createStakingPoolHandler(inputValue);
              }}
          >
              <img src={stakeIcon} alt="stake icon" className={classes.stakeIcon} />
              <p>Create staking</p>
          </button>
      </div>
    </div>
  );
};

export default CreateStaking;
