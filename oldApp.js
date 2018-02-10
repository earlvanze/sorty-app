import React from 'react'
import { Modal, StyleSheet, Text, View, Image } from 'react-native'
import firebase from 'firebase'

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
	    modal_visible: false,
	    modal_text: null,
	    modal_is_loading: false
	}
    }

    setup(){
	if(firebase.apps.length === 0){
	    const firebaseApp = firebase.initializeApp(firebaseConfig);
	    this.paper = firebaseApp.database().ref('/paper')
	    this.plastic = firebaseApp.database().ref('/plastic')
	    this.metal = firebaseApp.database().ref('/metal')
	    this.status = firebaseApp.database().ref('/status')
	    this.start_listening();
	    
	}else{
	    const firebaseApp = firebase.apps[0];
	}
    }
    
    render(){
	
	
	this.setup();
		<Image source={require("./img/paper.png")} />

/*	
		<Image uri={require("./img/paper.png")} />
	    	<Text style={styles.large}>{this.state.paper}</Text>
		<Image uri={require("./img/plastic.png")} />
		<Text style={styles.large}>{this.state.plastic}</Text>
*/	
	return (

	    <View style={styles.container}>
		<Text style={styles.large}>{this.state.metal}</Text>
		<Text style={styles.large}> metals </Text>
		<Image source = {require("./img/paper.png")} />

		<Image style={{width: 100,
			       height: 100}}
		       source={{uri: 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU4LjA2NCA1OC4wNjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU4LjA2NCA1OC4wNjQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4Ij4KPHBvbHlnb24gc3R5bGU9ImZpbGw6IzczODNCRjsiIHBvaW50cz0iMTcuMDY0LDMxLjAzMiA1OC4wNjQsMTAuMDMyIDI0LjA2NCwzNS4wMzIgNDQuMDY0LDQ4LjAzMiA1OC4wNjQsMTAuMDMyIDAsMjIuMDMyICIvPgo8cG9seWdvbiBzdHlsZT0iZmlsbDojNTU2MDgwOyIgcG9pbnRzPSIyNC4wNjQsMzUuMDMyIDIwLjEyNyw0OC4wMzIgMTcuMDY0LDMxLjAzMiA1OC4wNjQsMTAuMDMyICIvPgo8cG9seWdvbiBzdHlsZT0iZmlsbDojNDY0RjY2OyIgcG9pbnRzPSIyNC4wNjQsMzUuMDMyIDIwLjA2NCw0OC4wMzIgMzEuOTEyLDQwLjEzMyAiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg=='}} />

	    <Modal
	    animationType='slide'
	    transparent={true}
	    onRequestClose={() => null}
	    visible={this.state.modal_visible}>
	    <View style={styles.modal}>
	    {this.state.modal_is_loading && <Text>Loading</Text>}
	    {this.state.modal_text != null && <Text style={{
		fontSize: 40,
		textAlign: 'center'
	    }}>{this.state.modal_text}</Text>}
	    </View>
	    	<Image source={require("./img/paper.png")} />
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
	    }
	});
    }

    start_listening(){
	this.listen(this.paper, 'paper');
	this.listen(this.plastic, 'plastic');
	this.listen(this.metal, 'metal');

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
	justifyContent: 'center',
    },
    modal: {
	marginTop: 50,
	backgroundColor: 'red',
	borderWidth: 3,
	borderColor: 'red'
    },
    large: {
	fontSize: 40,
	width: '33%',
	textAlign: 'center'
    }
});
