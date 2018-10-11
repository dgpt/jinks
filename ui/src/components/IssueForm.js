import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextInput, TextArea } from '@instructure/ui-forms';
import { View } from '@instructure/ui-layout'

class IssueForm extends PureComponent {
  static propTypes = {
    issue: PropTypes.object,
    submit: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { submit, issue } = this.props;

    return (
      <View
        as="div"
        padding="small"
      >
        <h2>{issue.summary}</h2>
        <TextArea value={issue.description}></TextArea>
      </View>
    );
  }
};

export default IssueForm;
