import React, { PureComponent} from 'react';
import loadingLogo from '../images/intendi-loading.gif';

class LoadingScreen extends PureComponent {

	render() {
		return (
		<div width="100%" style={{textAlign:"center"}}>
            <img width="50%" height="50%" style={{marginLeft:"auto",marginRight:"auto"}} src={loadingLogo} alt="loading..." />
		</div>
		);
	}
}

export default LoadingScreen;