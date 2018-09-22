import React, {Component} from 'react'
import data from './data.json'
import './App.css';

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            location: '-118.281786,34.137457',// '-118.282909,34.140804',//' -118.285746,34.142844', // "-82.487054,27.342554", // "-97.69326,30.28760",
            hole: 1
        }
    }

    componentWillMount = () => {
        navigator.geolocation.getCurrentPosition(
            position => this.setState({location: `${position.coords.longitude},${position.coords.latitude}`})
        )
        navigator.geolocation.watchPosition(
            position => this.setState({location: `${position.coords.longitude},${position.coords.latitude}`}),
            error => {
            },
            {enableHighAccuracy: true}
        )
    }

    switchHole = (hole) => this.setState({hole})

    distance = (pt1, pt2) => {
        const [lon1, lat1] = pt1.split(",")
        const [lon2, lat2] = pt2.split(",")

        const radlat1 = Math.PI * lat1 / 180
        const radlat2 = Math.PI * lat2 / 180
        const theta = lon1 - lon2
        const radtheta = Math.PI * theta / 180
        let dist = (
            Math.sin(radlat1) * Math.sin(radlat2) +
            Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
        )
        dist = Math.acos(dist)
        dist = dist * 180 / Math.PI
        dist = dist * 60 * 1.1515
        return dist * 5280 / 3 // yards
    }

    render = () => {
        const location = this.state.location

        const course = 'harding';//'bobby-jones';//"morris-williams";
        const points = data[course][this.state.hole].poi.map(p => ({
            ...p,
            dist: Math.round(this.distance(p.gps, this.state.location || p.gps)),
        }))
        const filename = `images/${course}-hole${this.state.hole}.png`;
        const image = <img src={filename} alt={filename}/>;

        const holeSelect = (
            <form noValidate className={'my-3'}>
                <div className={'form-group'}>
                    <label htmlFor={'currentHold'}>

                        current hole
                    </label>
                    <select
                        id={'currentHole'}
                        name={'currentHole'}
                        className={'form-control-sm'} onChange={evt => this.switchHole(evt.target.value)}>
                        {
                            Object.keys(data[course]).map((i, idx) =>
                                <option value={idx + 1}>{`Hole ${idx + 1}`}</option>)
                        }
                    </select>
                </div>
            </form>
        )

        const container = (
            <div className={'body'}

            >

                <section className={'container-fluid bg-light'}>
                    <h1 className={'text-capitalize'}>
                        {course}
                    </h1>
                    {holeSelect}

                    <div
                        style={{position: 'relative'}}>
                        {image}
                        {
                            points.map(p => {
                                const radius = 10
                                return [(
                                    <div
                                        className={'badge badge-info'}
                                        style={{
                                            zIndex: 2,
                                            position: 'absolute',
                                            left: p.pixel.split(",")[0],
                                            top: p.pixel.split(",")[1],
                                        }}
                                    >{p.dist}</div>
                                ), (
                                    <svg
                                        viewBox="0 0 10 10"
                                        style={{
                                            zIndex: 1,
                                            position: 'absolute',
                                            left: p.pixel.split(",")[0] - 5,
                                            top: p.pixel.split(",")[1] - 5,
                                            width: 10,
                                            height: 10,
                                        }}
                                    >
                                        <circle cx={5} cy={5} r={5}
                                                fill="green"
                                                className={'bg-success'}
                                        />
                                    </svg>
                                )]
                            })
                        }
                    </div>

                    <p>
                        <strong>
                            Location:
                        </strong>
                        {location}
                    </p>
                </section>

                <section className={'bg-white container-fluid'}>
                    <h2>Scorecard</h2>
                    <img src={'images/harding-scorecard.png'}/>
                </section>

            </div>
        )

        return container
    }
}

export default App
