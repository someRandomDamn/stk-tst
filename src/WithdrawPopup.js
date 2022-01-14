import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.js';
import {Button, Modal} from "react-bootstrap";



class WithdrawPopup extends Component {

  constructor(props) {
    super(props)
    this.state = {
      withdrawAmount: '0',
      show: false,
    }
  }

  handleClose = (event) => {
    this.setState({ show: false })
  }

  render() {

    return (
      <>
        <Button className="btn btn-lg center-block claimAndWithdrawBtn" onClick={(event) => {
          event.preventDefault()
          this.setState({ show: true })
        }}>
          Withdraw
        </Button>

        <Modal show={this.state.show}>
          <Modal.Header>
            <h4 style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>Withdrawal</h4>
            <br/>
            <span >Enter amount to complete your withdrawal</span>
          </Modal.Header>
          <Modal.Body>

            <div>
              <span id="emailHelp" className="form-text text-muted">
                Amount
              </span>
              <div className="form-group" style={{ marginTop: 0 }}>
                <input type="number" min='0' className="form-control" aria-describedby="emailHelp" onChange={(event) => {
                  const withdrawAmount = this.input.value.toString()
                  this.setState({ withdrawAmount: withdrawAmount })
                }}
                       ref={(input) => { this.input = input }} placeholder={this.state.withdrawAmount.toString()}
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

              if (this.props.StakingContractData) {
                this.props.withdraw(this.props.StakingContractData, window.web3.utils.toWei(this.state.withdrawAmount, 'Ether'));
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

export default WithdrawPopup;
