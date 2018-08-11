import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle,
    CardBody, CardBlock, CardSubtitle, Button,
    Form, FormGroup, Label, Input, FormText, Alert, Badge
} from 'reactstrap'
import {RoomActionService, DAILY_TWIN, DAILY_SINGLE, MONTHLY, ROOM_TYPES} from '../../actions/room_action';
import {Link, withRouter} from 'react-router-dom';
import _ from "lodash"
import Select from "react-select";
const sformat = require('string-format');

const MODE_UPDATE = "MODE_UPDATE"
const MODE_VIEW = "MODE_VIEW"
const MODE_CREATE = "MODE_CREATE"

const COMPONENT_URL = "/rooms"

class RoomView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            roomId: this.props.match.params.id,
            mode: MODE_CREATE,
            localRoom: {
                roomNumber: "",
                roomType: "",
                price: "",
                description: "",
                isVacant: true
            },
            localInput: {
                roomNumberInput: null,
                roomTypeInput: null,
                priceInput: null,
                descriptionInput: null,
                isVacantInput: null,
            },
            _buttonStyle:{'width':'80px'}
        }
        this.onChangedInput = this.onChangedInput.bind(this);
        this.modifiableField_C_U = this.modifiableField_C_U.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.getSelectOptions = this.getSelectOptions.bind(this);
    }
    // View Configuration - Method that triggers form to render based on mode //
    configureViewType(){
        /* BUG FIX FOR REACT-ROUTER-DOM NOT UPDATING MATCH
            if location pathname doesn't match with params in match,
            re-redirect to self.
        */
        if(this.props.match.url != this.props.history.location.pathname){
            this.props.history.push(this.props.history.location.pathname);
        }

        if (this.props.match && this.props.match.params){
            const method = this.props.match.params.method;
            if (typeof(method) == 'string'){
                const x  = method.toLowerCase();
                switch(x){
                    case 'update': this.setState({mode: MODE_UPDATE}); break;
                    default: this.setState({mode: MODE_VIEW});
                }
            }
        }
    }

    //
    modifiableField_C_U(createBool, updateBool){
        switch(this.state.mode){
            case(MODE_UPDATE): return !updateBool;
            case(MODE_CREATE): return !createBool;
            default: return true;
        }
    }

    // onChangedInput(key, value){
    //     this.setState({
    //         localRoom: _.mapValues(this.state.localRoom, (v,k) => k == key ? value : v)
    //     })
    // }


    onChangedInput(key, value){
        const newObj = this.state.localRoom;
        newObj[key]=value;
        this.setState({
            localRoom: newObj
        })
    }

    getSelectOptions(In, extract){ // extract -> [value, label]
        return _.map(In, x => { let tuple = extract(x); let a = tuple[0]; let b = tuple[1]; return {value: a, label: b} });
    }

    jsonFromForm(){
        return this.state.localRoom;
    }

    create(){
        const {dispatch} = this.props;
        dispatch(RoomActionService.create(this.jsonFromForm(), () => {
            console.log(this.props.history);
            this.props.history.replace(COMPONENT_URL);
        }, () => {
            console.log("FAILED");
        }));
    }

    update(){
        const {dispatch} = this.props;
        const json = this.jsonFromForm();
        dispatch(RoomActionService.update(this.state.roomId, json, ()=>{
            this.props.history.push(sformat("{0}/{1}/view", COMPONENT_URL, this.state.roomId));
        }, (error) => {
            console.log("UPDATE FAILED");
            console.log(error);
        }))
    }


    remove(){
        const {dispatch} = this.props;
        console.log("REMOVE");
        dispatch(RoomActionService.remove(this.state.roomid, (response)=>{
            console.log("-> REMOVED !");
            console.log(response);
            this.props.history.replace(COMPONENT_URL);
        }, (error)=>{
            console.log("-> FAIL REMOVAL");
            console.log(error);
        }));
    }
    // Render Methods ===========
    getButtons(){
        /*
        <Col sm="1"><Button outline color="primary" style={this._buttonStyle}>Create</Button></Col>
        <Col sm="1"><Button color="warning" style={this._buttonStyle}>Update</Button></Col>
        <Col sm="1"><Button color="danger" style={this._buttonStyle}>Delete</Button></Col>
        */
        const mode = this.state.mode;
        switch(mode){
            case MODE_VIEW:
                return (
                    <Row>
                    <Col sm="1">
                        <Link to={sformat("{0}/{1}/update", COMPONENT_URL, this.state.roomId)}>
                            <Button color="warning" style={this._buttonStyle}>Edit</Button>
                        </Link>
                    </Col>
                    </Row>
                );
            case MODE_UPDATE:
                return (<Row>
                    <Col sm="1"><Button color="warning" style={this._buttonStyle} onClick={this.update}>Update</Button></Col>
                    <Col sm="1"><Button color="danger" style={this._buttonStyle} onClick={this.remove}>Remove</Button></Col>
                    </Row>
                )
            default: // MODE_CREATE
                return (<Col sm="1"><Button outline color="primary" style={this._buttonStyle} onClick={this.create}>Create</Button></Col>)
        }
    }
    getTitle(){
        switch(this.state.mode){
            case MODE_CREATE:
                return (<div>Room Creation</div>)
            default:
                return (<div>
                    Room - {this.state.localRoom.roomNumber} {
                        (() => {
                            if (true) return (<Badge color="success">Is Active</Badge>)
                            else return <Badge color="danger">Deactivated</Badge>
                        })()
                    } </div>
                )
        }
    }

    // Component Cycle...=========
    componentDidMount(){
        console.log("MOUNT COMPONENT");
        const { dispatch } = this.props;
        console.log(this.props.match);
        console.log("====");
        if (this.props.match && this.props.match.params){

            const roomId = this.props.match.params.id;
            console.log("ROOM ID " + roomId);
            if (roomId && !isNaN(parseInt(roomId))){
                console.log("DISPATCH " + roomId);
                dispatch(RoomActionService.fetchRoomById(roomId, (response)=>{
                }, (error)=>{
                }));
            }
        }
        this.configureViewType();
    }
    componentWillReceiveProps(nextProps){
        console.log("ON NEW PROPS");
        if (nextProps.room){
            console.log("NEW ROOM ");
            console.log(nextProps.room);
            const newLocalRoom = {
                roomNumber: nextProps.room.roomNumber,
                roomType: nextProps.room.roomType,
                price: nextProps.room.price,
                description: nextProps.room.description,
                isVacant: true
            }
            this.setState({
                localRoom: newLocalRoom,
                localInput:{
                    ...this.state.localInput,
                    roomTypeInput: this.getSelectOptions([nextProps.room.roomType], x => [x,x])[0]
                }
            });
        }
        this.configureViewType();
    }

    render(){
        console.log(this.state);
        const size = 5;
        return (
            <Card>
                <CardBlock>
                    <CardTitle>{this.getTitle()}</CardTitle>
                    <hr/>
                    <Form>
                        <FormGroup row>
                            <Label for="roomNumber" sm={2}>Room Number</Label>
                            <Col sm={size}>
                                <Input type="text" name="roomNumber" id="roomNumber"
                                onChange={e => this.onChangedInput("roomNumber", e.target.value)}
                                value={this.state.localRoom.roomNumber}
                                readOnly={this.modifiableField_C_U(true, true)}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="roomType" sm={2}>Room Type</Label>
                            <Col sm={size}>
                                <Select
                                    name="roomType"
                                    options={this.getSelectOptions(ROOM_TYPES, x => [x, x])}
                                    onChange={e => {
                                        this.onChangedInput("roomType", e.value);
                                    }}
                                    value={this.state.localRoom.roomType}
                                    disabled={this.modifiableField_C_U(true, true)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="price" sm={2}>Price</Label>
                            <Col sm={size}>
                                <Input type="number" name="price" id="price"
                                onChange={e => this.onChangedInput("price", parseFloat(e.target.value))}
                                value={this.state.localRoom.price}
                                readOnly={this.modifiableField_C_U(true, true)}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="description" sm={2}>Description</Label>
                            <Col sm={size}>
                                <Input type="textarea" size="md" name="description" id="description" style={{'height': '150px'}}
                                onChange={e => this.onChangedInput("description", e.target.value)}
                                value={this.state.localRoom.description}
                                readOnly={this.modifiableField_C_U(true, true)}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            {this.getButtons()}
                        </FormGroup>
                    </Form>

                </CardBlock>
            </Card>
        )
    }
}

const mapStateToProps = state => {
    console.log("NEW STATE ");
    console.log(state);
    return {
        room: state.roomComponent.room,
    }
}
export default withRouter(connect(mapStateToProps)(RoomView));
