import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle, CardBody, CardBlock, CardSubtitle, Button} from 'reactstrap'
import RoleDataTable from './role_data_table';
import {RoleActionService} from '../../actions/role_action';
import { makeSelectors } from 'sematable';
import {Link} from 'react-router-dom';
import _ from "lodash"
const sformat = require('string-format')
const tableSelector = makeSelectors("RoleDataTable");

const COMPONENT_URL = "/roleManagement/roles"
class RoleComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            roles: [],
        }
        this.roleToData = this.roleToData.bind(this);
        console.log("RoleComponent");
        console.log(this.props);
    }
    componentDidMount(){
        this.props.dispatch(RoleActionService.fetchRoles(
            response => {
                console.log("FETCHED ROLES");
                console.log(response);
            },
            error => {
                console.log("FETCHED ROLES ERR");
                console.log(error);
            }
        ));
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.roles){
            this.setState({roles: nextProps.roles})
        }
    }

    roleToData(roles){
        console.log("roleToData");
        console.log(roles);
        if(!roles) return [];
        var renderedRoles = _.map(roles, (authority => {
            return {
                id: String(authority.id),
                name: String(authority.role),
                username: String(authority.user.username),
                enabled: String(authority.enabled)
            }
        }));
        return renderedRoles;
    }
    render(){
        return (
            <Card>
                <CardBlock>
                    <CardTitle>Role Management</CardTitle>
                    <hr/>
                    <CardSubtitle>
                        <Link to={sformat("{0}/create", COMPONENT_URL)}><Button outline color="primary">Create Role</Button></Link>
                    </CardSubtitle>
                    <RoleDataTable data={this.roleToData(this.props.roles)}/>
                </CardBlock>
            </Card>
        )
    }
}

const mapStateToProps = state => {
    return {
        roles: state.roleComponent.roles,
    }
}

export default connect(mapStateToProps)(RoleComponent);
