import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.js';
import {Button, Modal} from "react-bootstrap";

class StakePopup extends Component {

  constructor(props) {
    super(props)
    this.state = {
      stakeAmount: '0',
      show: false,
    }
  }

  handleClose = (event) => {
    this.setState({ show: false })
  }

  render() {

    return (
      <>
        <Button className="btn btn-warning btn-sm" onClick={(event) => {
          event.preventDefault()
          this.setState({ show: true })
        }}>
          Stake
        </Button>

        <Modal show={this.state.show}>
          <Modal.Header>
            <h4 style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>Stake</h4>
            <br/>
            <span >Enter amount to complete your staking</span>
          </Modal.Header>
          <Modal.Body>

            <div>
              <span id="emailHelp" className="form-text text-muted">
                Amount
              </span>
              <div className="form-group" style={{ marginTop: 0 }}>
                <input type="number" min='0' className="form-control" aria-describedby="emailHelp" onChange={(event) => {
                  const stakeAmount = this.input.value.toString()
                  this.setState({ stakeAmount: stakeAmount })
                }}
                       ref={(input) => { this.input = input }} placeholder={this.state.stakeAmount.toString()}
                />

              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="claimAndWithdrawBtn" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button variant="primary" className="claimAndWithdrawBtn" onClick={(event) => {
              event.preventDefault()
              if (this.props.stakingcontractdata === true) {
                this.props.stake(window.web3.utils.toWei(this.state.stakeAmount, 'Ether'));
                this.handleClose(event);
              }
            }}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default StakePopup;
