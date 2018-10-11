import React from 'react';
import issueFetchable from '../requests/issueFetchable';
import Graph from '../components/Graph';
import GraphControls from '../components/GraphControls';
import IssueTray from '../components/IssueTray';
import {
  Flex, FlexItem,
  DrawerLayout, DrawerContent, DrawerTray
} from '@instructure/ui-layout'

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trayOpen: false,
      selectedIssue: {}
    };
  }

  render() {
    const { data } = this.props;
    return (
      <Flex direction="column" justifyItems="start" height="100%">
        <FlexItem>
          <GraphControls onSubmit={this.fetchData} />
        </FlexItem>
        <FlexItem height="100%" width="100%" shrink grow>
          {data && (
            <Graph
              elements={data}
              onSelectNode={this.openTray}
              onUnselectNode={this.closeTray}
            />
          )}
          <IssueTray
            isOpen={this.state.trayOpen}
            close={this.closeTray}
            issue={this.state.selectedIssue}
            submit={this.updateIssue}
          />
        </FlexItem>
      </Flex>
    );
  }

  openTray = (issue) => {
    this.setState({
      trayOpen: true,
      selectedIssue: issue
    });
  }

  closeTray = () => {
    this.setState({
      trayOpen: false
    });
  }

  updateIssue = (data) => {
    console.log('submitting', data);
  }

  fetchData = ({ epic }) => {
    return this.props.fetch({ epic, type: 'dependent' });
  }
}

export default issueFetchable(IndexPage);
