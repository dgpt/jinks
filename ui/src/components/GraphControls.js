import React, { Component } from 'react';
import { Flex, FlexItem } from '@instructure/ui-layout'
import TextInput from '@instructure/ui-forms/lib/components/TextInput'
import Button from '@instructure/ui-buttons/lib/components/Button'
import PropTypes from 'prop-types';

class GraphControls extends Component {
  static propTypes = {
    children: PropTypes.node,
    onSubmit: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Flex
        justifyItems="space-between"
        padding="large xx-small large xx-small"
      >
        <FlexItem shrink grow>
          <TextInput label="" />
        </FlexItem>
        <FlexItem padding="none none none large">
          <Button onClick={() => this.props.onSubmit()}>
            Load Epic
          </Button>
        </FlexItem>
      </Flex>
    );
  }
}

export default GraphControls;
