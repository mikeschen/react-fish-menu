import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends React.Component {
	constructor() {
		super();
		this.addFish = this.addFish.bind(this);
		this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
		//get initial state
		this.state = {
			fishes: {},
			order: {}
		};
	}

	componentWillMount() {
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`
			, {
				context: this,
				state: 'fishes'
		});
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

		if(localStorageRef){
			this.setState({
				order: JSON.parse(localStorageRef)
			});	
		}
	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order))
	}

	addFish(fish) {
		const fishes = {...this.state.fishes};
		const timestamp = Date.now();
		console.log("fishes[before]", fishes[`fish-${timestamp}`]);
		fishes[`fish-${timestamp}`] = fish;
		console.log("fishes[after]", fishes[`fish-${timestamp}`]);
		this.setState({ fishes });
	}

	loadSamples() {
		this.setState({
			fishes: sampleFishes
		});
	}

	addToOrder(key) {
		const order = {...this.state.order};
		order[key] = order[key] + 1 || 1;
		this.setState({ order });
	}

	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market"/>
					<ul className="list-of-fishes">
						{
							Object
								.keys(this.state.fishes)
								.map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
						}
					</ul>
				</div>
					<Order 
					fishes={this.state.fishes}
					order={this.state.order} 
					params={this.props.params}
					/>
					<Inventory addFish={this.addFish} loadSamples={this.loadSamples}/>
			</div>
		)
	}
}

export default App;
