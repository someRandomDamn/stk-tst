import React, {Component} from 'react'
import Identicon from 'identicon.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar} from "react-bootstrap";
import {MutatingDots, ThreeDots} from "react-loader-spinner";

class NavbarLocal extends Component {

	render() {
		return (

			<Navbar bg="light" variant="light">

				<Nav className="container-fluid">
					<Nav.Item>
						{/*<Navbar.Brand as={Link} to="/">Staking</Navbar.Brand>*/}
						<Navbar.Brand href="/">Staking</Navbar.Brand>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link href="/">Create Staking</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link href="/staking-list">Staking List</Nav.Link>
					</Nav.Item>
					<Nav.Item className="ml-auto">
						<Nav.Link>
							{this.props.loading ? <ThreeDots arialLabel="loading-indicator" height={30}/> : null}
						</Nav.Link>
					</Nav.Item>
					<Nav.Item className="ml-auto">
						<Nav.Link>
							<small className='text-secondary'>
								<small id="account"> {this.props.account} </small>
							</small>
							{this.props.account
								? <img
									className="ml-2"
									width='30'
									height='30'
									src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
									alt=""
								/>
								: <span></span>
							}
						</Nav.Link>
					</Nav.Item>
				</Nav>
			</Navbar>
		);
	}
}

export default NavbarLocal;
