import React from 'react';
import issueFetchable from '../requests/issueFetchable';
import Graph from '../components/graph';
import { Flex, FlexItem } from '@instructure/ui-layout';
import { Button } from '@instructure/ui-buttons';
import { TextInput } from '@instructure/ui-forms';

class IndexPage extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <Flex direction="column" justifyItems="start" height="100%">
        <FlexItem>
          <Flex
            justifyItems="space-between"
            padding="large xx-small large xx-small"
          >
            <FlexItem shrink grow>
              <TextInput label="" />
            </FlexItem>
            <FlexItem padding="none none none large">
              <Button onClick={() => this.fetchData()}>Load Epic</Button>
            </FlexItem>
          </Flex>
        </FlexItem>
        <FlexItem height="100%" shrink grow>
          {data && <Graph elements={data} />}
        </FlexItem>
      </Flex>
    );
  }

  fetchData = () => {
    return this.props.fetch({ epic: 'BR-23116', type: 'dependent' });
  };
}

export default issueFetchable(IndexPage);
