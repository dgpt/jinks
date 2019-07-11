import React, { Component } from 'react';
import { Flex, FlexItem } from '@instructure/ui-layout'
import TextInput from '@instructure/ui-forms/lib/TextInput'
import Button from '@instructure/ui-buttons/lib/Button'
import PropTypes from 'prop-types';
import { colors } from 'shared/constants';

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
          <TextInput
            label=""
            theme={{
              background: colors.background,
              borderColor: colors.text,
              color: colors.text,
            }}
            inputRef={input => (this.input = input)}
          />
        </FlexItem>
        <FlexItem padding="none none none large">
          <Button
            variant="primary"
            theme={{
              primaryBackground: colors.primary,
              primaryBorderColor: colors.primary,
              primaryColor: colors.text,
            }}
            onClick={this.submitEpic}>
            Load Epic
          </Button>
        </FlexItem>
      </Flex>
    );
  }

  submitEpic = () => {
    if (!this.input && !this.input.value) {
      return;
    }

    this.props.onSubmit({
      epic: this.input.value
    });
  }
}

export default GraphControls;
