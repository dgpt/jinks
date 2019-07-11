import React from 'react';
import issueFetchable from 'requests/issueFetchable';
import Graph from 'components/Graph';
import GraphControls from 'components/GraphControls';
import Actions from 'components/Actions';
import IssueTray from 'components/IssueTray';
import Layout from 'components/Layout';
import { DrawerLayout, DrawerContent, DrawerTray } from '@instructure/ui-layout';
import './index.css'

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trayOpen: false,
      selectedIssue: {},
      selectedEdge: null
    };
  }

  render() {
    const { data, fetchIssues } = this.props;

    return (
      <Layout>
        <main>
          <section className="controls">
            <GraphControls onSubmit={fetchIssues} />
          </section>
          <section className="graph">
            {data && (
              <Graph
                elements={data}
                onSelectNode={this.openTray}
                onUnselectNode={this.closeTray}
                onSelectEdge={this.selectedEdge}
                onUnselectEdge={this.unselectEdge}
                onNewEdge={this.createLink}
              />
            )}
            <IssueTray
              isOpen={this.state.trayOpen}
              close={this.closeTray}
              issue={this.state.selectedIssue}
              submit={()=>{}/*this.updateIssue*/}
            />
          </section>
          <section className="actions">
            <Actions
              selectedEdge={this.state.selectedEdge}
              onDeleteEdge={this.deleteSelectedEdge}
            />
          </section>
        </main>
      </Layout>
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

  selectedEdge = (edge) => {
    this.setState({
      selectedEdge: edge
    });
  }

  unselectEdge = () => {
    this.setState({
      selectedEdge: null
    });
  }

  deleteSelectedEdge = () => {
    const { selectedEdge } = this.state;
    this.unselectEdge();
    return this.props.deleteLink(selectedEdge);
  }

  createLink = (source, target) => {
    return this.props.createLink({
      source, target
    });
  }
}

export default issueFetchable(IndexPage);
