import React  from 'react';
import classes from './Staking.module.css';

const Info = (props) => {

  return (
    <div className={classes.Staking}>
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
            <h5 className={classes.goMax}>My balance: {props.userBalance}</h5>
            <h5 className={classes.goMax}> Contract balance: {props.contractBalance}</h5>
          </div>
    </div>
  );
};

export default Info;
