#json.issues @issues, partial: 'issues/issue', as: :issue
#json.links @link_map if @link_map
json.nodes @nodes do |node|
  json.id node.neo_id
  json.label node.key
end

json.edges @edges do |edge|
  json.source edge.start_node_id
  json.target edge.end_node_id
  json.id edge.id
end
