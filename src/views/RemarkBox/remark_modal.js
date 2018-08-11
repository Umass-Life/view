import React from 'react';
import _ from 'lodash'
import {Row, Col, Button, Modal, ModalHeader, ModalBody,
ModalFooter, Card, CardHeader, CardBlock} from "reactstrap";
const sformat = require('string-format');

const RemarkModal = ({modal, toggle, className, remark}) =>
{
return (
    <div>
    <Modal isOpen={modal} toggle={toggle} className={className}>
      <ModalHeader toggle={toggle}>Remark</ModalHeader>
      <ModalBody>
        {remark}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>OK</Button>
      </ModalFooter>
      </Modal>
    </div>
)
}
export default RemarkModal;
