import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.js';
import {Button } from "react-bootstrap";
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

    let button;
    if (!this.props.isStakeTokenApproved) {
      button =
        <div>
          <Button type="submit" className="stakenow-btn btn-lg" onClick={(event) => {
            event.preventDefault()
            if (this.props.stakingcontractdata === true) {
              this.props.approve()
            }
          }}> Approve </Button>
        </div>
    } else {
      button = <div>
        <Button type="submit" className="btn btn-lg center-block claimAndWithdrawBtn" onClick={(event) => {
          event.preventDefault()

          if (this.props.stakingcontractdata === true) {
            this.props.claim()
          }
        }}> Claim </Button>

        <Button type="submit" className="btn btn-lg center-block claimAndWithdrawBtn" onClick={(event) => {
          event.preventDefault()

          if (this.props.stakingcontractdata === true) {
            this.props.reinvest()
          }
        }}> Reinvest </Button>

        <WithdrawPopup
          stakingcontractdata = {this.props.stakingcontractdata}
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
                <td> <h3> Token Name</h3></td>
                <td className='token-heading-btn'>
                  <StakePopup
                    stakingcontractdata = {this.props.stakingcontractdata}
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
              <td className='token-declaration-text'> Total Staked </td>
              <td className='infoTableValue'> {this.props.allStakedAmount} STK </td>
            </tr>
            <tr>
              <td className='token-declaration-text'> APR </td>
              {/*TODO: change to correct APR*/}
              <td className='infoTableValue'> 10% </td>
            </tr>
            <tr>
              <td className='token-declaration-text'> My Wallet </td>
              <td className='infoTableValue'> {this.props.stakeTokenBalance} STK </td>
            </tr>
            <tr>
              <td className='token-declaration-text'> My Stake </td>
              <td className='infoTableValue'> {this.props.myStake} STK </td>
            </tr>
            <tr>
              <td className='token-declaration-text'> My Rewards </td>
              <td className='infoTableValue'> {this.props.pendingReward} STK </td>
            </tr>
            <tr>
              <td className='token-declaration-text'> Weekly Estimate </td>
              {/*TODO: change to correct Estimate*/}
              <td className='infoTableValue'> {this.props.weeklyEstimate} STK </td>
            </tr>
            <tr>
              <td className='token-declaration-text'> Pool End Date (UTC) </td>
              <td className='infoTableValue'> { this.props.finishTime } </td>
            </tr>
          </tbody>
        </table>

        { button }

      </div>

    );
  }
}

export default Stake;
