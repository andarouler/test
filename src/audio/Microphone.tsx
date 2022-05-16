import React, {Component} from 'react';

import AudioAnalyser from './AudioAnalyser';

class Microphone extends Component<any, any> {
    constructor(props: any) {
        super(props);

        //'some' is not defined until getMicrophone is called. This fixes the Warning: 'Cant call setState on 
        // a component that is not yet mountet.
        this.state = {
            initial: 'state',
            some: ''
        }
        this.getMicrophone = this.getMicrophone.bind(this)
    }

    async getMicrophone() {
        const audio = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        });
        this.setState({audio});
    }

    render() {
        return (
            <div className='Audio'>
                {this.state.audio ? <AudioAnalyser audio={this.state.audio} width={540} height={30}/> : ''}
            </div>
        );
    }
}

export default Microphone;