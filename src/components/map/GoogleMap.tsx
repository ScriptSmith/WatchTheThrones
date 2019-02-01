import React, {Component} from 'react';
import GoogleMapReact, {Coords} from 'google-map-react';
import Style from './style.json';

interface IMap {
    center: Coords,
    zoom: number
}

class GoogleMap extends Component<IMap> {
    private static getKey(): string {
        const key = process.env.REACT_APP_MAPS_KEY ? process.env.REACT_APP_MAPS_KEY : "NoKeyFound";
        console.log(process.env);
        return key;
    }

    render() {
        return (
            // Important! Always set the container height explicitly
            <div style={{height: '100vh', width: '100%'}}>
                <GoogleMapReact
                    bootstrapURLKeys={{key: GoogleMap.getKey()}}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    options={{
                        disableDefaultUI: true,
                        styles: Style
                    }}
                >
                </GoogleMapReact>
            </div>
        );
    }
}

export default GoogleMap;
