import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle, CardBody, CardBlock, CardSubtitle, Button} from 'reactstrap'
import CustomerProfileDataTable from './customer_profile_data_table';
import {CustomerProfileActionService} from '../../actions/customer_profile_action';
import { makeSelectors } from 'sematable';
import {Link} from 'react-router-dom';
import _ from "lodash"
const sformat = require('string-format')
const tableSelector = makeSelectors("CustomerProfileDataTable");

const COMPONENT_URL = "/customerProfileManagement/customerProfiles"
class CustomerProfileComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            customerProfiles: [],
        }
        this.customerProfilesToData = this.customerProfilesToData.bind(this);
        console.log("CustomerProfileComponent");
        console.log(this.props);
    }
    componentDidMount(){
        this.props.dispatch(CustomerProfileActionService.fetchCustomerProfiles(
            response => {
                console.log("FETCHED CPROFILE");
                console.log(response);
            },
            error => {
                console.log("FETCHED CPROFILE ERR");
                console.log(error);
            }
        ));
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.customerProfiles){
            this.setState({customerProfiles: nextProps.customerProfiles})
        }
    }

    customerProfilesToData(customerProfiles){
        if(!customerProfiles) return [];
        var renderedList = _.map(customerProfiles, (customerProfile => {
            return {
                id: String(customerProfile.id),
                name: String(customerProfile.firstname + " " + customerProfile.lastname),
                phoneNumber: String(customerProfile.phoneNumber),
                citizenId: String(customerProfile.citizenId),
                enabled: String(customerProfile.enabled),
                remark: customerProfile.remark
            }
        }));
        return renderedList;
    }
    render(){
        return (
            <Card>
                <CardBlock>
                    <CardTitle>Customer Profile Management</CardTitle>
                    <hr/>
                    <CardSubtitle>
                        <Link to={sformat("{0}/create", COMPONENT_URL)}><Button outline color="primary">Create</Button></Link>
                    </CardSubtitle>
                    <CustomerProfileDataTable data={this.customerProfilesToData(this.state.customerProfiles)}/>
                </CardBlock>
            </Card>
        )
    }
}

const mapStateToProps = state => {
    return {
        customerProfiles: state.customerProfileComponent.customerProfiles,
    }
}

export default connect(mapStateToProps)(CustomerProfileComponent);
