import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle, CardBody, CardBlock, CardSubtitle, Button,
    FormGroup} from 'reactstrap'
import DatePicker from 'react-date-picker';
import RoomDataTable from './room_data_table';
import {RoomActionService} from '../../actions/room_action';
// import {SleepActionService} from '../../actions/sleep_action';
import { makeSelectors } from 'sematable';
import {Link} from 'react-router-dom';
import _ from "lodash"
const sformat = require('string-format')
const tableSelector = makeSelectors("RoomDataTable");
const COMPONENT_URL = "/rooms"

const FILTERED_CONTRACTS_ID = "filteredContracts"; // unique id for store.

class RoomComponent extends React.Component {
//     constructor(props){
//         super(props);
//         const _date = new Date();
//         const _date2= new Date();
//         _date2.setDate(_date.getDate()+1);
//         this.roomsToData = this.roomsToData.bind(this);
//         this.state = {
//             rooms: [],
//             contractWrappers: [],
//             from: _date,
//             to: _date2
//         }
//         this.search = this.search.bind(this);
//     }
//     roomsToData(rooms){
//         console.log('roomToData');
//         console.log(this.state);
//         return _.map(rooms, room => {
//             const contractWrappers = this.state.contractWrappers;
//             const contractWrapper = _.find(contractWrappers, _contractWrapper => {
//                 if (_contractWrapper && _contractWrapper.contract && _contractWrapper.contract.bookedRoom.id) {
//                     return _contractWrapper.contract.bookedRoom.id == room.id ;
//                 }
//                 return false;
//             });
//             const exists = contractWrapper != null;
//             const balance = exists ? contractWrapper.balance : null;
//             const contract = exists ? contractWrapper.contract : null;
//             const profile = exists && contract.customerProfile ? contract.customerProfile : null;
//             return {
//                 id: String(room.id),
//                 roomNumber: String(room.roomNumber),
//                 roomType: String(room.roomType),
//                 price: Number(parseFloat(room.price)).toFixed(2),
//                 isVacant: exists ? "NO" : "YES",
//                 remark: room.description,
//                 hasDescription: String(room.description && room.description.length > 0),
//                 hasContract: exists,
//                 contractOwnerName: exists && profile!=null? profile.firstname : null,
//                 contractId: exists && contract!=null ? contract.id : null,
//                 balanceId: exists && balance!=null ? balance.id : null,
//                 profileId: exists && profile!=null && profile.id ? profile.id : null
//             }
//         });
//     }
//
//     componentWillReceiveProps(nextProps){
//         this.setState({
//             rooms: nextProps.rooms,
//             contractWrappers: nextProps.contractActionId == FILTERED_CONTRACTS_ID ? nextProps.contractWrappers : this.state.contractWrappers
//         });
//     }
//
//     search(){
//         const from = this.state.from.getTime();
//         const to = this.state.to.getTime();
//         console.log(this.state);
//         const {dispatch} = this.props;
//         /* old method quries entire availab room negation of second impl serac hset.
//         dispatch(RoomActionService.listAvailableRooms(from, to, res=>{
//             dispatch(RoomActionService.fetchRooms(res=>{}, err=>{}));
//         }, err=>{}));
//         */
//
//         // find contracts that has rooms mentioned, with from and to.
//         dispatch(ContractActionService.searchByRooms(from, to, [], res=>{
//             dispatch(RoomActionService.fetchRooms(res=>{}, err=>{}));
//         }, err=>{}, {id: FILTERED_CONTRACTS_ID}));
//     }
//
//     componentDidMount(){
//         const {dispatch} = this.props;
//         this.search();
//     }
//     render(){
//         console.log(this.state);
//         const filterStyle = {'margin-top':'5px', 'margin-right':'5px'}
//         return (
//             <Card>
//                 <CardBlock>
//                     <CardTitle>Room Management</CardTitle>
//                     <hr/>
//                     <CardSubtitle>
//                         <Row>
//                             <Col sm={2}>
//                                 <Link to={sformat("{0}/create", COMPONENT_URL)}><Button outline color="primary">Create</Button></Link>
//                             </Col>
//                             <Col sm={3}>
//                                 <FormGroup row><span style={filterStyle}>From</span>
//                                     <DatePicker
//                                         calendarClassName={"my-calendar-in-view"}
//                                         onChange={e => this.setState({from: new Date(e.getTime())})}
//                                         value={this.state.from}
//                                     />
//                                 </FormGroup>
//                             </Col>
//                             <Col sm={3}>
//                                 <FormGroup row>
//                                 <span style={filterStyle}>To</span>
//                                 <DatePicker
//                                     calendarClassName={"my-calendar-in-view"}
//                                     onChange={e => this.setState({to: new Date(e.getTime())})}
//                                     value={this.state.to}
//                                 />
//                                 </FormGroup>
//                             </Col>
//                             <Col sm={4}>
//                                 <Button onClick={this.search}> Filter Dates </Button>
//                             </Col>
//                         </Row>
//                     </CardSubtitle>
//                     <RoomDataTable data={this.roomsToData(this.state.rooms)}/>
//                 </CardBlock>
//             </Card>
//         )
//     }
// }
//
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        rooms: state.roomComponent.rooms,
        contractWrappers: state.contractComponent.contractWrappers,
        contractActionId: state.contractComponent.id,
    }
}

export default connect(mapStateToProps)(RoomComponent);
