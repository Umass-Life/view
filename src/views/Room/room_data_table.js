import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import sematable, {makeSelectors,  SortableHeader,
  SelectAllHeader, SelectRow, TableRow} from 'sematable'
import {Table, Button, Row, Col,
Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
ListGroupItem} from 'reactstrap'
import {NavLink, Link, withRouter} from 'react-router-dom';
import _ from 'lodash'
const sformat = require('string-format');
import {RoomActionService} from '../../actions/room_action'
import RemarkModal from '../RemarkBox/remark_modal';
const COMPONENT_URL = "/rooms"
const selectors = makeSelectors("RoomDataTable");

// class _ActionButtonContainer extends React.Component{
//     constructor(props){
//         super(props);
//         this.onRemove = this.onRemove.bind(this);
//         this.state = {
//             dropdown: false
//         }
//         this.toggle = this.toggle.bind(this);
//     }
//     onRemove(){
//         alert("remove room id " + this.props.row.id);
//     }
//     toggle(){
//         this.setState({dropdown: !this.state.dropdown});
//     }
//     render(){
//         let style = {
//             'width':'70px',
//             'margin-left': '10px'
//         }
//         const row = this.props.row;
//         const hasContract = row.hasContract;
//         const contractId = row.contractId;
//         const balanceId = row.balanceId;
//         const contractOwnerName = row.contractOwnerName;
//         const profileId = row.profileId;
//         return(
//             <Row>
//                 <Col sm='2' >
//                     <Button color="primary"
//                             size="sm"
//                             style={style}
//                             onClick={this.props.row.toggle}
//                             hidden={!this.props.row.remark || this.props.row.remark.length < 1}>
//                         Remark
//                     </Button>
//                 </Col>
//                 <Col sm='2'>
//                     <Link to={sformat("{0}/{1}/view",COMPONENT_URL, this.props.row.id)}>
//                         <Button color="primary" size="sm" style={style}>View</Button>
//                     </Link>
//                 </Col>
//                 <Col sm='2'>
//                     <Link to={sformat("{0}/{1}/update", COMPONENT_URL,  this.props.row.id)}>
//                         <Button size="sm" color="warning" style={style}>Update</Button>
//                     </Link>
//                 </Col>
//                 <Col sm='2' >
//                     <Button color="danger" size="sm" style={style} onClick={this.onRemove}>Remove</Button>
//                 </Col>
//                 <Col sm='2'>
//                     <Dropdown isOpen={this.state.dropdown} toggle={this.toggle}>
//                         <DropdownToggle
//                             className={sformat("nav-link dropdown-toggle {0}", hasContract ? "btn-primary" : 'btn-secondary')}
//                             style={{'width':'120px', 'text-overflow': 'ellipsis', 'white-space': 'nowrap', 'overflow':'hidden'}}
//                             disabled={!hasContract}> {hasContract ? "Contract" : "No Contract"}
//                         </DropdownToggle>
//                         <DropdownMenu className={this.state.dropdown ? 'show' : ''}>
//                             <Link to={sformat("/customerProfileManagement/customerProfiles/{0}/view", profileId)}>
//                                 <DropdownItem >
//                                     <div style={{'width':'120px','text-overflow': 'ellipsis', 'white-space': 'nowrap', 'overflow':'hidden'}}>
//                                     {hasContract ? contractOwnerName : "No Contract"} </div>
//                                 </DropdownItem>
//                             </Link>
//                             <Link to={sformat("/contracts/{0}/view", contractId)}>
//                                 <DropdownItem> Contract </DropdownItem>
//                             </Link>
//                             <Link to={sformat("/balances/{0}/view", balanceId)}>
//                                 <DropdownItem> Balance </DropdownItem>
//                             </Link>
//                             <Link to={sformat("/transactions/create?balanceId={0}", balanceId)}>
//                                 <DropdownItem> Make Payment </DropdownItem>
//                             </Link>
//                         </DropdownMenu>
//                     </Dropdown>
//                 </Col>
//
//             </Row>
//         )
//     }
// }
//
// let ActionButtonContainer = withRouter(connect(null)(_ActionButtonContainer));
//
const columns = [
    {key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true, className:"my-data-table-td"},
    {key: 'roomNumber', header: 'Room Number', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'roomType', header: 'Room Type', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'price', header: 'Price', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'isVacant', header: 'Vacant', sortable: true, searchable: true, className:"my-data-table-td"},
    // {key: 'actions', header: "Actions", Component: ActionButtonContainer}
]

const propTypes = {
    headers: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    primaryKey: PropTypes.string.isRequired
}

class _Table extends React.Component {

  render() {

    const {
      selectable,
      data,
      headers,
      columns,
      filter,
      primaryKey,
      CheckboxComponent,
      NoDataComponent,
    } = this.props;

    const className = this.props.className || 'table-sm table-striped table-hover';
    const visibleColumns = columns.filter((c) => !c.hidden);
    const visibleColumnsLength = visibleColumns.length;
    const TableNoData = () => (
      <div className="text-center">
        There is no data available
      </div>
    );
    const NoDataContent = NoDataComponent || TableNoData;

    return (
      <Table size="sm" hover>
        <thead>
          <tr>
            {selectable &&
              <SelectAllHeader
                {...headers.select}
                CheckboxComponent={CheckboxComponent}
              />
            }
            {visibleColumns.map((col) => {
              if (col.sortable && !col.hidden) {
                return (
                  <SortableHeader
                    key={col.key}
                    title={col.title}
                    {...headers[col.key]}
                  />);
              }
              return (
                <th
                  data-key={col.key}
                  key={col.key}
                  title={col.title}
                  data-toggle={col.title ? 'tooltip' : ''}
                >
                  {col.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <TableRow key={_.get(row, primaryKey)} {...this.props} row={row} />
          ))}
          {!data.length &&
            <tr>
              <td colSpan={selectable ? visibleColumnsLength + 1 : visibleColumnsLength}>
                <NoDataContent filter={filter} />
              </td>
            </tr>
          }
        </tbody>
      </Table>
    );
  }
}

const tablePropTypes = {
  data: PropTypes.array.isRequired,
  headers: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  filter: PropTypes.array.isRequired,
  primaryKey: PropTypes.string.isRequired,
  selectable: PropTypes.bool,
  selectEnabled: PropTypes.func,
  className: PropTypes.string,
  styleName: PropTypes.string,
  CheckboxComponent: PropTypes.func,
  NoDataComponent: PropTypes.func,
};

_Table.propTypes = tablePropTypes;

class RoomDataTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modal: false,
            remark: ""
        }
        this.toggle = this.toggle.bind(this);
    }
    toggle(){
        this.setState({modal: !this.state.modal});
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.data.length > 0) {
            _.forEach(nextProps.data, x => {
                x.toggle = () => this.setState({remark: x.remark, modal: !this.state.modal}) ;
            })
        }
        // this.setState({users: nextProps.users});
        if (nextProps.filter.length > this.props.filter.length){
            // SEARCH NEXT FILTER TOKEN
            // send request for the data[length-1] and union with initialData
            nextProps.onNewData([...nextProps.table.initialData]);
        }

        if (nextProps.tablePageInfo.page > this.props.tablePageInfo.page){
            // SEARCH NEXT PAGE RANGE -> [page*pageSize, (page+1)*pageSize]
        }

        if(nextProps.tablePageInfo.pageSize > this.props.tablePageInfo.pageSize){
            // SEARCH REMAINING INCREASE PAGEZE DIFFERENCE -> [page*pageSize, (page*newPageSize - page*pageSize)]
        }

    }
    render(){
        return(
            <div>
            <_Table {...this.props}
            columns={columns}/>
            <RemarkModal className="RoomRemark" toggle={this.toggle} modal={this.state.modal} remark={this.state.remark}/>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        tableFilter: selectors.getFilter(state),
        tablePageInfo: selectors.getPageInfo(state),
        table: state.sematable.UserDataTable
    }
}

RoomDataTable.propTypes = propTypes;
export default connect(mapStateToProps)(sematable('RoomDataTable', RoomDataTable, columns, {defaultPageSize: 10}));
