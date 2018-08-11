import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle, CardBody, CardBlock, CardSubtitle, Button} from 'reactstrap'
import { TCPDataTable, mapPolicyToData } from './tcp_data_table';
import { TCPActionService } from '../../actions/tcp_action';
import { makeSelectors } from 'sematable';
import {Link} from 'react-router-dom';
const util = require('../../utilities')
import _ from "lodash"
const {dformat} = util;
const sformat = require('string-format')
const COMPONENT_URL = "/policies"

class TCPComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            policies: []
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            policies: nextProps.policies
        })
    }

    componentDidMount(){
        const { dispatch } = this.props;
        dispatch(TCPActionService.fetchAll(response => {},
        error => {
            console.log(JSON.stringify(error));
        }));
    }

    render(){
        return(
            <Card>
                <CardBlock>
                    <CardTitle>Transaction Creation Policy</CardTitle>
                    <hr/>
                    <CardSubtitle>
                        <Link to={sformat("{0}/create", COMPONENT_URL)}><Button outline color="primary">Create</Button></Link>
                    </CardSubtitle>
                    <TCPDataTable data={mapPolicyToData(this.state.policies)}/>
                </CardBlock>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        policies: state.TCPComponent.policies
    };
}

export default connect(mapStateToProps)(TCPComponent)
