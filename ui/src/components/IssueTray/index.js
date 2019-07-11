import React, { Component } from 'react';
import Tray from '@instructure/ui-overlays/lib/Tray'
import { CloseButton } from '@instructure/ui-buttons';
import IssueForm from 'components/IssueForm';
import PropTypes from 'prop-types';

class IssueTray extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    close: PropTypes.func,
    issue: PropTypes.object,
    submit: PropTypes.func,
  };

  render() {
    const { close, isOpen, issue, submit } = this.props;
    return (
      <Tray
        label="Tray Example"
        open={isOpen}
        onDismiss={close}
        placement="end"
        size="regular"
      >
        <CloseButton
          placement="end"
          offset="small"
          variant="icon"
          onClick={close}
        >
          Close
        </CloseButton>
        <IssueForm
          issue={issue}
          submit={submit}
          dismiss={close}
        />
      </Tray>
    );
  }
}

export default IssueTray;
