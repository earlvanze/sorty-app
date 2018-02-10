import React from 'react'
import { ActivityIndicator, Modal, StatusBar, StyleSheet, Text, View, Image } from 'react-native'
import firebase from 'firebase'
import { Col, Row, Grid } from "react-native-easy-grid";
import ResponsiveImage from 'react-native-responsive-image';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCIhiWwuvXA7Nc-Iz7meHjDewWsAQ_j8dA",
    authDomain: "pennapps-c33bb.firebaseapp.com",
    databaseURL: "https://pennapps-c33bb.firebaseio.com",
    storageBucket: "pennapps-c33bb.appspot.com"
};

//

export default class App extends React.Component {
    constructor(){
	super();
	this.state = {
	    paper: 0,
	    plastic: 0,
	    metal: 0,
	    ee: 0,
	    modal_visible: false,
	    modal_text: null,
	    modal_is_loading: false
	}
    }

    setup(){
	console.disableYellowBox = true;
	if(firebase.apps.length === 0){
	    const firebaseApp = firebase.initializeApp(firebaseConfig);
	    this.paper = firebaseApp.database().ref('/paper')
	    this.plastic = firebaseApp.database().ref('/plastic')
	    this.metal = firebaseApp.database().ref('/metal')
	    this.ee = firebaseApp.database().ref('/ee')
	    this.status = firebaseApp.database().ref('/status')
	    this.start_listening();	    
	}else{
	    const firebaseApp = firebase.apps[0];
	}
    }
    
    render(){
	this.setup();
	return (
	    <View style={styles.container}>
		<StatusBar hidden={true} />
		<Grid>
		    <Row style={{justifyContent: 'center', alignItems: 'center'}} size={1}>
			<Col style={styles.col}>
			<Text style={styles.large}>
			    Sorty McSortface
			</Text>
			</Col>
		    </Row>
		    <Row size={2}>
		    <Col style={styles.col}>
			<ResponsiveImage initWidth="150" initHeight="150" source={require("./img/plastic.png")} />
			<Text style={styles.large}>{this.state.plastic}</Text>
		    </Col>
		    <Col style={styles.col}>
			<ResponsiveImage initWidth="150" initHeight="150" style={styles.image} source={require("./img/paper.png")} />
	    		<Text style={styles.large}>{this.state.paper}</Text>
		    </Col>
		    <Col style={styles.col}>
			<ResponsiveImage initWidth="150" initHeight="150" style={styles.image} source={require("./img/metal.png")} />
			<Text style={styles.large}>{this.state.metal}</Text>
		    </Col>
		    <Col style={styles.col}>
			<ResponsiveImage initWidth="150" initHeight="150" style={styles.image} source={require("./img/trash.png")} />
	    		<Text style={styles.large}>{this.state.ee}</Text>
		    </Col>
		    </Row>
		</Grid>

		<Modal
		    animationType='slide'
		    transparent={true}
		    onRequestClose={() => null}
		    visible={this.state.modal_visible}>
		    <View style={styles.modal}>
			{this.state.modal_is_loading && <ActivityIndicator size={350}/>}
			{this.state.modal_text != null && <Text style={{
			    fontSize: 40,
			    color: 'white',
			    textAlign: 'center',
			    marginTop: 93,
			    padding: 50,
			    backgroundColor: 'rgba(60, 186, 84, 0.9)'
			}}>Got {this.state.modal_text}!</Text>}
		    </View>
		</Modal>
	    </View>
	);
    }

    listen(category, cat_name){
	category.on('value', (snapshot) => {
	    switch(cat_name){
		case "paper":
		    this.setState({paper: snapshot.val()});
		    break;
		case "plastic":
		    this.setState({plastic: snapshot.val()});
		    break;
		case "metal":
		    this.setState({metal: snapshot.val()});
		    break;
		case "everything else":
		    this.setState({ee: snapshot.val()});
		    break;
	    }
	});
    }

    start_listening(){
	this.listen(this.paper, 'paper');
	this.listen(this.plastic, 'plastic');
	this.listen(this.metal, 'metal');
	this.listen(this.ee, 'everything else');
	
	this.status.on('value', (snapshot) => {
	    switch(snapshot.val()){
		case 'waiting':
		    this.setState({modal_visible: false,
				   modal_is_loading: false,
				   modal_text: null});
		    break;
		case 'processing':
		    this.setState({modal_is_loading: true,
				   modal_text: null,
				   modal_visible: true});
		    break;
		default:
		    // assume any other status is type of recycling put in
		    this.setState({modal_text: snapshot.val(),
				   modal_is_loading: false,
				   modal_visible: true});
		    break;
	    }
	});
    }
}

const styles = StyleSheet.create({
    container: {
	flex: 1,
	flexDirection: 'row',
	backgroundColor: '#fff',
	alignItems: 'center',
	justifyContent: 'center'
    },
    modal: {
    },
    large: {
	fontSize: 40
    },
    col: {
	alignItems: 'center'
    }
});
