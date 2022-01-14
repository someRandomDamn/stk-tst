import './App.css';
import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from "./Staking.module.css";
import {Button} from "react-bootstrap";

class CreateStaking extends Component {

	emptyStaking = {
		stakeAddress: '',
		poolAddress: '',
		startBlock: '',
		finishBlock: '',
		poolTokenSupply: '',
		hasWhitelisting: false,
	}

	constructor(props) {
		super(props)
		this.state = {
			createStaking: this.emptyStaking
		}
	}

	inputChangeHandler = (event) => {
		event.preventDefault();
		this.setState({ createStaking: {
			...this.state.createStaking,
			[event.target.name]: event.target.value,
			}
		})
	};

	handleCreate = (event) => {
		event.preventDefault();
		this.props.createStakingPool(this.state.createStaking);
	}

	render() {

		return (
			<div className=' card border border-dark rounded-lg shadow-lg p-3 mb-5 bg-white rounded create-stk-card-props'>
				<div className='card-header text-center'>
					<h3> Create Staking</h3>
				</div>
				<div className='card-body'>
					<div className={classes.Staking}>
							Staking Token<br/>
							<input className="form-control" onChange={this.inputChangeHandler}
										 autoComplete="off" name="stakeAddress" required=""
										 ref={(input) => { this.input = input }} placeholder={this.state.createStaking.stakeAddress}
										 type="text"/><br/>

							Pool Token<br/>
							<input className="form-control" onChange={this.inputChangeHandler}
										 autoComplete="off" name="poolAddress" required=""
										 ref={(input) => { this.input = input }} placeholder={this.state.createStaking.poolAddress}
										 type="text"/><br/>

							Start Time Stamp<br/>
							<input className="form-control" onChange={this.inputChangeHandler}
										 autoComplete="off" name="startBlock" required=""
										 ref={(input) => { this.input = input }} placeholder={this.state.createStaking.startBlock}
										 type="text"/><br/>

							Finish Time Stamp<br/>
							<input className="form-control" onChange={this.inputChangeHandler}
										 autoComplete="off" name="finishBlock" required=""
										 ref={(input) => { this.input = input }} placeholder={this.state.createStaking.finishBlock}
										 type="text"/><br/>

							Pool Token Supply<br/>
							<input className="form-control" onChange={this.inputChangeHandler}
										 autoComplete="off" name="poolTokenSupply" required=""
										 ref={(input) => { this.input = input }} placeholder={this.state.createStaking.poolTokenSupply}
										 type="text"/><br/>

						<Button variant="secondary" className="claimAndWithdrawBtn" onClick={this.handleCreate}>
							Create Staking
						</Button>

					</div>
				</div>
			</div>
		);
	}
}

export default CreateStaking;
