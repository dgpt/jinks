import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextInput, TextArea } from '@instructure/ui-forms';
import { View } from '@instructure/ui-layout'
import { colors } from 'shared/constants';

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
        <h2>{issue.label}</h2>
        <label>
          Summary
          <p className="summary">{issue.summary}</p>
        </label>
        <label>
          Description
          <p className="description">{issue.description}</p>
        </label>
      </View>
    );
  }
};

export default IssueForm;
